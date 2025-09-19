import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { DatabaseService } from "@/lib/services/database"
import { CSVExporter } from "@/lib/services/csv-exporter"
import { CONFIG } from "@/lib/config"
import type { CertificateFilter } from "@/lib/models/Certificate"

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)

    // Build filter object from query parameters
    const filter: CertificateFilter = {}
    const filterParams: Record<string, string> = {}

    if (searchParams.get("name")) {
      filter.name = searchParams.get("name")!
      filterParams.name = filter.name
    }
    if (searchParams.get("rollNo")) {
      filter.rollNo = searchParams.get("rollNo")!
      filterParams.rollNo = filter.rollNo
    }
    if (searchParams.get("event")) {
      filter.event = searchParams.get("event")!
      filterParams.event = filter.event
    }
    if (searchParams.get("date")) {
      filter.date = searchParams.get("date")!
      filterParams.date = filter.date
    }
    if (searchParams.get("uploadedBy")) {
      filter.uploadedBy = searchParams.get("uploadedBy")!
      filterParams.uploadedBy = filter.uploadedBy
    }
    if (searchParams.get("certificateNo")) {
      filter.certificateNo = searchParams.get("certificateNo")!
      filterParams.certificateNo = filter.certificateNo
    }

    // Get all matching certificates (no pagination for export)
    const result = await DatabaseService.getCertificates(filter, 1, 10000) // Large limit for export

    if (result.certificates.length === 0) {
      return NextResponse.json({ error: "No certificates found to export" }, { status: 404 })
    }

    // Generate CSV content
    const csvContent = CSVExporter.generateCSV(result.certificates)
    const filename = CSVExporter.generateFilename(filterParams)

    // Log audit
    await DatabaseService.createAuditLog({
      action: CONFIG.AUDIT_ACTIONS.EXPORT,
      userId: user.email,
      userEmail: user.email,
      details: {
        recordCount: result.certificates.length,
        filters: filterParams,
        filename,
      },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Return CSV file
    return CSVExporter.createDownloadResponse(csvContent, filename)
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export certificates" }, { status: 500 })
  }
})
