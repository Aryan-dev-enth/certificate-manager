import { CONFIG } from "./config"

export interface AuthUser {
  email: string
  role: "admin" | "club"
  isSuperAdmin: boolean
}

export class AuthService {
  static async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    // Check if email is in allowed accounts
    if (!CONFIG.ALLOWED_ACCOUNTS.includes(email)) {
      return null
    }

    // Get password from environment variables
    const envKey = CONFIG.ENV_CREDENTIALS[email as keyof typeof CONFIG.ENV_CREDENTIALS]
    const expectedPassword = process.env[envKey]

    if (!expectedPassword || password !== expectedPassword) {
      return null
    }

    // Determine role based on email
    const role = email === CONFIG.SUPER_ADMIN_EMAIL ? "admin" : "club"

    return {
      email,
      role,
      isSuperAdmin: email === CONFIG.SUPER_ADMIN_EMAIL,
    }
  }

  static isSuperAdmin(email: string): boolean {
    return email === CONFIG.SUPER_ADMIN_EMAIL
  }
}
