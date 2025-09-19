import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { DatabaseService } from "@/lib/services/database"
import { CONFIG } from "@/lib/config"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await AuthService.authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    // Log audit
    await DatabaseService.createAuditLog({
      action: CONFIG.AUDIT_ACTIONS.LOGIN,
      userId: user.email,
      userEmail: user.email,
      details: { loginTime: new Date() },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })
    
    return NextResponse.json({
  success: true,
  user: {
    email: user.email,
    role: user.role,
    isSuperAdmin: user.isSuperAdmin,
  },
  redirectTo: "/dashboard",
})

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
