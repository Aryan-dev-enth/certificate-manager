import { type NextRequest, NextResponse } from "next/server"
import { requireSuperAdmin } from "@/lib/middleware/auth"
import { DatabaseService } from "@/lib/services/database"
import { CONFIG } from "@/lib/config"
import { ObjectId } from "mongodb"

export const DELETE = requireSuperAdmin(async (request: NextRequest, user) => {
  try {
    const { pathname } = new URL(request.url)
    const batchId = pathname.split("/").pop()

    if (!batchId || !ObjectId.isValid(batchId)) {
      return NextResponse.json({ error: "Invalid batch ID" }, { status: 400 })
    }

    const objectId = new ObjectId(batchId)

    // Soft delete the batch
    const result = await DatabaseService.softDeleteUpload(objectId, user.email)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 })
    }

    // Log audit
    await DatabaseService.createAuditLog({
      action: CONFIG.AUDIT_ACTIONS.DELETE,
      userId: user.email,
      userEmail: user.email,
      details: {
        batchId: batchId,
        deletedBy: user.email,
      },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Batch deleted successfully",
    })
  } catch (error) {
    console.error("Delete batch error:", error)
    return NextResponse.json({ error: "Failed to delete batch" }, { status: 500 })
  }
})

export const POST = requireSuperAdmin(async (request: NextRequest, user) => {
  try {
    const { pathname } = new URL(request.url)
    const batchId = pathname.split("/").pop()

    if (!batchId || !ObjectId.isValid(batchId)) {
      return NextResponse.json({ error: "Invalid batch ID" }, { status: 400 })
    }

    const objectId = new ObjectId(batchId)

    // Restore the batch
    const result = await DatabaseService.restoreUpload(objectId)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 })
    }

    // Log audit
    await DatabaseService.createAuditLog({
      action: CONFIG.AUDIT_ACTIONS.RESTORE,
      userId: user.email,
      userEmail: user.email,
      details: {
        batchId: batchId,
        restoredBy: user.email,
      },
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Batch restored successfully",
    })
  } catch (error) {
    console.error("Restore batch error:", error)
    return NextResponse.json({ error: "Failed to restore batch" }, { status: 500 })
  }
})
