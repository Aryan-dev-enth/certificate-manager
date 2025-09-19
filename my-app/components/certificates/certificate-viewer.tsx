"use client"

import { useState, useEffect, useCallback } from "react"
import { CertificateFilters, type FilterValues } from "./certificate-filters"
import { CertificateTable } from "./certificate-table"
import { ExportDialog } from "../export/export-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import type { Certificate } from "@/lib/models/Certificate"

interface CertificateData {
  certificates: Certificate[]
  total: number
  page: number
  totalPages: number
}

export function CertificateViewer() {
  const [data, setData] = useState<CertificateData>({
    certificates: [],
    total: 0,
    page: 1,
    totalPages: 1,
  })
  const [filters, setFilters] = useState<FilterValues>({
    name: "",
    rollNo: "",
    event: "",
    date: "",
    uploadedBy: "",
    certificateNo: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const fetchCertificates = useCallback(
    async (page = 1, searchFilters = filters) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          ...Object.fromEntries(Object.entries(searchFilters).filter(([_, value]) => value.trim() !== "")),
        })

        const response = await fetch(`/api/certificates?${params}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setCurrentPage(page)
        } else {
          console.error("Failed to fetch certificates:", result.error)
        }
      } catch (error) {
        console.error("Error fetching certificates:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [filters],
  )

  useEffect(() => {
    fetchCertificates(1, filters)
  }, [])

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    fetchCertificates(1, filters)
  }

  const handlePageChange = (page: number) => {
    fetchCertificates(page, filters)
  }

  const handleRefresh = () => {
    fetchCertificates(currentPage, filters)
  }

  const handleExport = async (exportFilters: Record<string, string>) => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams(exportFilters)
      const response = await fetch(`/api/certificates/export?${params}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `certificates_${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const result = await response.json()
        alert(result.error || "Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Certificate Viewer</h1>
          <p className="text-muted-foreground mt-2">View and search all certificate records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <ExportDialog onExport={handleExport} isExporting={isExporting} totalRecords={data.total} />
        </div>
      </div>

      <CertificateFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Certificates</span>
            <span className="text-sm font-normal text-muted-foreground">{data.total} total records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertificateTable
            certificates={data.certificates}
            currentPage={currentPage}
            totalPages={data.totalPages}
            totalRecords={data.total}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
