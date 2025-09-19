"use client"

import type React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { MainLayout } from "./main-layout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedLayoutProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export function ProtectedLayout({ children, requireSuperAdmin = false }: ProtectedLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (requireSuperAdmin && !user.isSuperAdmin) {
        router.push("/dashboard")
      }
    }
  }, [isLoading, user, requireSuperAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (requireSuperAdmin && !user.isSuperAdmin)) {
    return null
  }

  return <MainLayout>{children}</MainLayout>
}
