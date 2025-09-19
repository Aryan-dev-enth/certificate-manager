import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { DatabaseService } from "@/lib/services/database"

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const stats = await DatabaseService.getDashboardStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
})
