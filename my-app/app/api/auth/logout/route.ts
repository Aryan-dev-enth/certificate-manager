import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database"
import { CONFIG } from "@/lib/config"
import { cookies } from "next/headers"
import { getAuthUser } from "@/lib/middleware/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)

    if (user) {
      // Log audit
      await DatabaseService.createAuditLog({
        action: CONFIG.AUDIT_ACTIONS.LOGOUT,
        userId: user.email,
        userEmail: user.email,
        details: { logoutTime: new Date() },
        timestamp: new Date(),
        ipAddress: request.ip,
        userAgent: request.headers.get("user-agent") || undefined,
      })
    }

    // Clear cookie
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
