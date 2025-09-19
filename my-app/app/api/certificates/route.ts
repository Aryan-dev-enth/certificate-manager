import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { DatabaseService } from "@/lib/services/database"
import { CONFIG } from "@/lib/config"
import type { CertificateFilter } from "@/lib/models/Certificate"

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || CONFIG.ROWS_PER_PAGE.toString())

    // Build filter object
    const filter: CertificateFilter = {}
    if (searchParams.get("name")) filter.name = searchParams.get("name")!
    if (searchParams.get("rollNo")) filter.rollNo = searchParams.get("rollNo")!
    if (searchParams.get("event")) filter.event = searchParams.get("event")!
    if (searchParams.get("date")) filter.date = searchParams.get("date")!
    if (searchParams.get("uploadedBy")) filter.uploadedBy = searchParams.get("uploadedBy")!
    if (searchParams.get("certificateNo")) filter.certificateNo = searchParams.get("certificateNo")!

    // Get certificates
    const result = await DatabaseService.getCertificates(filter, page, limit)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get certificates error:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
})
