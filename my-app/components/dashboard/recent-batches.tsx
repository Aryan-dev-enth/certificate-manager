"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Eye, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import type { Upload } from "@/lib/models/Upload"

interface RecentBatchesProps {
  batches: Upload[]
  onDeleteBatch?: (batchId: string) => void
}

export function RecentBatches({ batches, onDeleteBatch }: RecentBatchesProps) {
  const { user } = useAuth()

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return format(dateObj, "MMM dd, yyyy HH:mm")
    } catch {
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Upload Batches</CardTitle>
        <CardDescription>Latest certificate upload batches</CardDescription>
      </CardHeader>
      <CardContent>
        {batches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No upload batches found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch._id?.toString()}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{batch.originalName}</div>
                        {batch.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {batch.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {batch.processedRecords} / {batch.totalRecords}
                        </div>
                        {batch.eventCode && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {batch.eventCode}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(batch.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{batch.uploadedBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(batch.uploadedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/certificates?batchId=${batch._id}`, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user?.isSuperAdmin && onDeleteBatch && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteBatch(batch._id?.toString() || "")}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
