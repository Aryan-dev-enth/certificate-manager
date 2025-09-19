import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { DatabaseService } from "@/lib/services/database"
import { CONFIG } from "@/lib/config"

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { rows, fileName, eventCode, description } = await request.json()

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No data to upload" }, { status: 400 })
    }

    // Create upload batch
    const uploadBatch = await DatabaseService.createUpload({
      fileName: `processed_${fileName}`,
      originalName: fileName,
      uploadedBy: user.email,
      uploadedAt: new Date(),
      totalRecords: rows.length,
      processedRecords: rows.length,
      status: "completed",
      isDeleted: false,
      eventCode,
      description,
    })

    const batchId = uploadBatch.insertedId

    // Prepare certificates
    const certificates = rows.map((row: any) => ({
      batchId,
      certificateNo: row.ID || row.CertificateNo,
      name: row.name || row.Name,
      email: row.email,
      uploadedBy: user.email,
      uploadedAt: new Date(),
    }))

    // Insert certificates
    await DatabaseService.createCertificates(certificates)

    // Log audit
    await DatabaseService.createAuditLog({
      action: CONFIG.AUDIT_ACTIONS.UPLOAD,
      userId: user.email,
      userEmail: user.email,
      details: { batchId: batchId.toString(), fileName, recordCount: rows.length, eventCode, description },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ success: true, batchId: batchId.toString(), recordsProcessed: rows.length })
  } catch (error) {
    console.error("Upload confirmation error:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
})
