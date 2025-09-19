"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "./stats-cards"
import { ChartsSection } from "./charts-section"
import { RecentBatches } from "./recent-batches"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertCircle } from "lucide-react"
import type { Upload } from "@/lib/models/Upload"

interface DashboardStats {
  totalCertificates: number
  totalBatches: number
  certificatesPerClub: Array<{ _id: string; count: number }>
  certificatesPerEvent: Array<{ _id: string; count: number }>
  latestBatches: Upload[]
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/dashboard/stats")
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      } else {
        setError(result.error || "Failed to fetch dashboard statistics")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return

    try {
      const response = await fetch(`/api/batches/${batchId}`, { method: "DELETE" })
      if (response.ok) fetchStats()
      else {
        const result = await response.json()
        alert(result.error || "Failed to delete batch")
      }
    } catch {
      alert("Network error. Please try again.")
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return <div className="text-center py-8 text-muted-foreground">No data available</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of certificate management system</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <StatsCards
        totalCertificates={stats.totalCertificates}
        totalBatches={stats.totalBatches}
        certificatesPerClub={stats.certificatesPerClub ?? []}
        certificatesPerEvent={stats.certificatesPerEvent ?? []}
      />

      {/* <ChartsSection
        certificatesPerClub={stats.certificatesPerClub ?? []}
        certificatesPerEvent={stats.certificatesPerEvent ?? []}
      /> */}

      <RecentBatches batches={stats.latestBatches ?? []} onDeleteBatch={handleDeleteBatch} />
    </div>
  )
}
