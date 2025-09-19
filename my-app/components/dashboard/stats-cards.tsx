"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Users, Calendar } from "lucide-react"

interface StatsCardsProps {
  totalCertificates: number
  totalBatches: number
  certificatesPerClub: Array<{ _id: string; count: number }>
  certificatesPerEvent: Array<{ _id: string; count: number }>
}

export function StatsCards({
  totalCertificates,
  totalBatches,
  certificatesPerClub,
  certificatesPerEvent,
}: StatsCardsProps) {
  const topClub = certificatesPerClub[0]
  const topEvent = certificatesPerEvent[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalCertificates.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Active certificate records</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalBatches.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Upload batches</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Club</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{topClub?.count || 0}</div>
          <p className="text-xs text-muted-foreground">{topClub ? `${topClub._id}` : "No data"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Event</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{topEvent?.count || 0}</div>
          <p className="text-xs text-muted-foreground truncate">{topEvent ? topEvent._id : "No data"}</p>
        </CardContent>
      </Card>
    </div>
  )
}
