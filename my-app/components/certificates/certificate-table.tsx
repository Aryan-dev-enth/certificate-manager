"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { format } from "date-fns"
import type { Certificate } from "@/lib/models/Certificate"

interface CertificateTableProps {
  certificates: Certificate[]
  currentPage: number
  totalPages: number
  totalRecords: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function CertificateTable({
  certificates,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  isLoading = false,
}: CertificateTableProps) {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString
      return format(date, "MMM dd, yyyy")
    } catch {
      return dateString.toString()
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No certificates found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((certificate) => (
                  <TableRow key={certificate._id?.toString()}>
                    <TableCell className="font-mono text-sm">{certificate.certificateNo}</TableCell>
                    <TableCell className="font-medium">{certificate.name}</TableCell>
                    <TableCell>{certificate.rollNo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{certificate.event}</Badge>
                    </TableCell>
                    <TableCell>{certificate.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{certificate.uploadedBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(certificate.uploadedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 25 + 1} to {Math.min(currentPage * 25, totalRecords)} of {totalRecords}{" "}
            certificates
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:flex"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
