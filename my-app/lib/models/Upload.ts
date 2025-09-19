import type { ObjectId } from "mongodb"

export interface Upload {
  _id?: ObjectId
  fileName: string
  originalName: string
  uploadedBy: string
  uploadedAt: Date
  totalRecords: number
  processedRecords: number
  status: "pending" | "processing" | "completed" | "failed"
  // Soft deletion
  isDeleted: boolean
  deletedBy?: string
  deletedAt?: Date
  // Metadata
  eventCode?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
