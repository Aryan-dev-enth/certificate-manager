import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  passwordHash: string
  role: "admin" | "club"
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
