import type { ObjectId } from "mongodb"
import type { AuditAction } from "../config"

export interface AuditLog {
  _id?: ObjectId
  action: AuditAction
  userId: string
  userEmail: string
  details: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}
