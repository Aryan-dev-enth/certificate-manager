import { getDatabase } from "../mongodb"
import { CONFIG } from "../config"
import type { Certificate, CertificateFilter } from "../models/Certificate"
import type { Upload } from "../models/Upload"
import type { AuditLog } from "../models/AuditLog"
import type { ObjectId } from "mongodb"

export class DatabaseService {
  private static async getDb() {
    return await getDatabase()
  }

  // ================= Certificate operations =================
  static async createCertificates(
    certificates: Omit<Certificate, "_id" | "createdAt" | "updatedAt">[],
  ) {
    try {
      if (!certificates || certificates.length === 0) return null
      const db = await this.getDb()
      const now = new Date()
      const certificatesWithTimestamps = certificates.map((cert) => ({
        ...cert,
        createdAt: now,
        updatedAt: now,
      }))
      return await db.collection(CONFIG.COLLECTIONS.CERTIFICATES).insertMany(certificatesWithTimestamps)
    } catch (error) {
      console.error("createCertificates error:", error)
      throw error
    }
  }

  static async getCertificates(
    filter: CertificateFilter = {},
    page = 1,
    limit = CONFIG.ROWS_PER_PAGE,
  ) {
    try {
      const db = await this.getDb()
      const skip = (page - 1) * limit
      const mongoFilter: any = {}

      if (filter.name) mongoFilter.name = { $regex: filter.name, $options: "i" }
      if (filter.rollNo) mongoFilter.rollNo = { $regex: filter.rollNo, $options: "i" }
      if (filter.event) mongoFilter.event = { $regex: filter.event, $options: "i" }
      if (filter.date) mongoFilter.date = { $regex: filter.date, $options: "i" }
      if (filter.uploadedBy) mongoFilter.uploadedBy = { $regex: filter.uploadedBy, $options: "i" }
      if (filter.certificateNo) mongoFilter.certificateNo = { $regex: filter.certificateNo, $options: "i" }
      if (filter.batchId) mongoFilter.batchId = filter.batchId

      const pipeline = [
        {
          $lookup: {
            from: CONFIG.COLLECTIONS.UPLOADS,
            localField: "batchId",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: { path: "$batch", preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            "batch.isDeleted": { $ne: true },
            ...mongoFilter,
          },
        },
        { $sort: { uploadedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]

      const certificates = await db.collection(CONFIG.COLLECTIONS.CERTIFICATES).aggregate(pipeline).toArray()
      const totalResult = await db
        .collection(CONFIG.COLLECTIONS.CERTIFICATES)
        .aggregate([...pipeline.slice(0, 3), { $count: "total" }])
        .toArray()

      const total = totalResult[0]?.total ?? 0
      return { certificates, total, page, totalPages: Math.ceil(total / limit) }
    } catch (error) {
      console.error("getCertificates error:", error)
      return { certificates: [], total: 0, page: 1, totalPages: 0 }
    }
  }

  // ================= Upload operations =================
  static async createUpload(upload: Omit<Upload, "_id" | "createdAt" | "updatedAt">) {
    try {
      const db = await this.getDb()
      const now = new Date()
      return await db.collection(CONFIG.COLLECTIONS.UPLOADS).insertOne({
        ...upload,
        createdAt: now,
        updatedAt: now,
      })
    } catch (error) {
      console.error("createUpload error:", error)
      throw error
    }
  }

  static async getUploads(includeDeleted = false) {
    try {
      const db = await this.getDb()
      const filter = includeDeleted ? {} : { isDeleted: { $ne: true } }
      return await db.collection(CONFIG.COLLECTIONS.UPLOADS).find(filter).sort({ uploadedAt: -1 }).toArray()
    } catch (error) {
      console.error("getUploads error:", error)
      return []
    }
  }

  static async softDeleteUpload(uploadId: ObjectId, deletedBy: string) {
    try {
      const db = await this.getDb()
      const now = new Date()
      return await db.collection(CONFIG.COLLECTIONS.UPLOADS).updateOne(
        { _id: uploadId },
        { $set: { isDeleted: true, deletedBy, deletedAt: now, updatedAt: now } },
      )
    } catch (error) {
      console.error("softDeleteUpload error:", error)
      throw error
    }
  }

  static async restoreUpload(uploadId: ObjectId) {
    try {
      const db = await this.getDb()
      const now = new Date()
      return await db.collection(CONFIG.COLLECTIONS.UPLOADS).updateOne(
        { _id: uploadId },
        {
          $unset: { isDeleted: "", deletedBy: "", deletedAt: "" },
          $set: { updatedAt: now },
        },
      )
    } catch (error) {
      console.error("restoreUpload error:", error)
      throw error
    }
  }

  // ================= Audit log operations =================
  static async createAuditLog(auditLog: Omit<AuditLog, "_id">) {
    try {
      const db = await this.getDb()
      return await db.collection(CONFIG.COLLECTIONS.AUDIT_LOGS).insertOne(auditLog)
    } catch (error) {
      console.error("createAuditLog error:", error)
      throw error
    }
  }

  static async getAuditLogs(limit = 100) {
    try {
      const db = await this.getDb()
      return await db.collection(CONFIG.COLLECTIONS.AUDIT_LOGS).find({}).sort({ timestamp: -1 }).limit(limit).toArray()
    } catch (error) {
      console.error("getAuditLogs error:", error)
      return []
    }
  }

  // ================= Dashboard stats =================
  static async getDashboardStats() {
    try {
      const db = await this.getDb()

      // Total certificates
      const totalCertificatesRes = await db
        .collection(CONFIG.COLLECTIONS.CERTIFICATES)
        .aggregate([
          {
            $lookup: {
              from: CONFIG.COLLECTIONS.UPLOADS,
              localField: "batchId",
              foreignField: "_id",
              as: "batch",
            },
          },
          { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },
          { $match: { "batch.isDeleted": { $ne: true } } },
          { $count: "total" },
        ])
        .toArray()

      const totalCertificates = totalCertificatesRes[0]?.total ?? 0

      // Total batches
      const totalBatches = await db.collection(CONFIG.COLLECTIONS.UPLOADS).countDocuments({ isDeleted: { $ne: true } })

      // Certificates per club
      const certificatesPerClub = await db
        .collection(CONFIG.COLLECTIONS.CERTIFICATES)
        .aggregate([
          {
            $lookup: {
              from: CONFIG.COLLECTIONS.UPLOADS,
              localField: "batchId",
              foreignField: "_id",
              as: "batch",
            },
          },
          { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },
          { $match: { "batch.isDeleted": { $ne: true } } },
          { $group: { _id: "$uploadedBy", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray()

      // Certificates per event
      const certificatesPerEvent = await db
        .collection(CONFIG.COLLECTIONS.CERTIFICATES)
        .aggregate([
          {
            $lookup: {
              from: CONFIG.COLLECTIONS.UPLOADS,
              localField: "batchId",
              foreignField: "_id",
              as: "batch",
            },
          },
          { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },
          { $match: { "batch.isDeleted": { $ne: true } } },
          { $group: { _id: "$event", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray()

      // Latest batches
      const latestBatches = await db
        .collection(CONFIG.COLLECTIONS.UPLOADS)
        .find({ isDeleted: { $ne: true } })
        .sort({ uploadedAt: -1 })
        .limit(5)
        .toArray()

      return { totalCertificates, totalBatches, certificatesPerClub, certificatesPerEvent, latestBatches }
    } catch (error) {
      console.error("getDashboardStats error:", error)
      return { totalCertificates: 0, totalBatches: 0, certificatesPerClub: [], certificatesPerEvent: [], latestBatches: [] }
    }
  }
}
