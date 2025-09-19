// Configuration constants for the certificate management system
export const CONFIG = {
  // Super admin email with delete privileges
  SUPER_ADMIN_EMAIL: "admin@srmuniversity.ac.in",

  // Allowed club accounts (email/password authentication)
  ALLOWED_ACCOUNTS: [
    "admin@srmuniversity.ac.in",
  "webytes@srmuniversity.ac.in",
  "cyberzee@srmuniversity.ac.in",
  "verge@srmuniversity.ac.in",
  "xetech@srmuniversity.ac.in",
  "ecell@srmuniversity.ac.in"
  ],

  // Export CSV column configuration
  EXPORT_FIELDS: ["CertificateNo", "Name", "RollNo", "Event", "Date", "UploadedBy"],

  // Pagination settings
  ROWS_PER_PAGE: 25,

  // Database collections
  COLLECTIONS: {
    CERTIFICATES: "certificates",
    UPLOADS: "uploads",
    AUDIT_LOGS: "auditLogs",
  },

  // Audit log actions
  AUDIT_ACTIONS: {
    UPLOAD: "UPLOAD",
    EXPORT: "EXPORT",
    DELETE: "DELETE",
    RESTORE: "RESTORE",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
  },

  ENV_CREDENTIALS: {
  "admin@srmuniversity.ac.in": "ADMIN_PASSWORD",
  "webytes@srmuniversity.ac.in": "WEBYTES_PASSWORD",
  "cyberzee@srmuniversity.ac.in": "CYBERZEE_PASSWORD",
  "verge@srmuniversity.ac.in": "VERGE_PASSWORD",
  "xetech@srmuniversity.ac.in": "XETECH_PASSWORD",
  "ecell@srmuniversity.ac.in": "ECELL_PASSWORD"
},
} as const

export type AuditAction = (typeof CONFIG.AUDIT_ACTIONS)[keyof typeof CONFIG.AUDIT_ACTIONS]
