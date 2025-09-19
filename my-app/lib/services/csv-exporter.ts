import { CONFIG } from "../config"
import type { Certificate } from "../models/Certificate"

export class CSVExporter {
  static generateCSV(certificates: Certificate[]): string {
    // Use fixed columns from config
    const headers = CONFIG.EXPORT_FIELDS
    const csvHeaders = headers.join(",")

    // Generate CSV rows
    const csvRows = certificates.map((cert) => {
      const row = headers.map((field) => {
        let value = ""

        switch (field) {
          case "CertificateNo":
            value = cert.certificateNo || ""
            break
          case "Name":
            value = cert.name || ""
            break
          case "RollNo":
            value = cert.rollNo || ""
            break
          case "Event":
            value = cert.event || ""
            break
          case "Date":
            value = cert.date || ""
            break
          case "UploadedBy":
            value = cert.uploadedBy || ""
            break
          default:
            value = ""
        }

        // Escape commas and quotes in CSV
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          value = `"${value.replace(/"/g, '""')}"`
        }

        return value
      })

      return row.join(",")
    })

    return [csvHeaders, ...csvRows].join("\n")
  }

  static createDownloadResponse(csvContent: string, filename: string): Response {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv;charset=utf-8;",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    })
  }

  static generateFilename(filters?: Record<string, string>): string {
    const timestamp = new Date().toISOString().split("T")[0]
    const hasFilters = filters && Object.values(filters).some((value) => value.trim() !== "")

    if (hasFilters) {
      return `certificates_filtered_${timestamp}.csv`
    }

    return `certificates_all_${timestamp}.csv`
  }
}
