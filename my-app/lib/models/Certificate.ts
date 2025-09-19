import type { ObjectId } from "mongodb"

export interface Certificate {
  _id?: ObjectId
  batchId: ObjectId
  certificateNo: string
  name: string
  rollNo: string
  event: string
  date: string
  uploadedBy: string
  uploadedAt: Date
  // Flexible JSON data - can contain additional fields from CSV
  additionalData?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface CertificateFilter {
  name?: string
  rollNo?: string
  event?: string
  date?: string
  uploadedBy?: string
  certificateNo?: string
  batchId?: ObjectId
}
