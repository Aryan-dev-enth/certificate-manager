"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileText, Info } from "lucide-react"
import { CONFIG } from "@/lib/config"

interface ExportDialogProps {
  onExport: (filters: Record<string, string>) => Promise<void>
  isExporting?: boolean
  totalRecords?: number
}

export function ExportDialog({ onExport, isExporting = false, totalRecords = 0 }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    rollNo: "",
    event: "",
    date: "",
    uploadedBy: "",
    certificateNo: "",
  })
  const [includeAllData, setIncludeAllData] = useState(false)

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleExport = async () => {
    const exportFilters = includeAllData
      ? {}
      : Object.fromEntries(Object.entries(filters).filter(([_, value]) => value.trim() !== ""))

    await onExport(exportFilters)
    setIsOpen(false)
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value.trim() !== "").length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={totalRecords === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Certificates
          </DialogTitle>
          <DialogDescription>
            Export certificate data to CSV format. You can apply filters to export specific records or export all data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Export Format:</strong> The CSV will include the following columns:{" "}
              {CONFIG.EXPORT_FIELDS.join(", ")}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAll"
                checked={includeAllData}
                onCheckedChange={(checked) => setIncludeAllData(checked as boolean)}
              />
              <Label htmlFor="includeAll" className="text-sm font-medium">
                Export all data (ignore filters below)
              </Label>
            </div>

            {!includeAllData && (
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-name">Name</Label>
                    <Input
                      id="export-name"
                      placeholder="Filter by name..."
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-rollNo">Roll Number</Label>
                    <Input
                      id="export-rollNo"
                      placeholder="Filter by roll number..."
                      value={filters.rollNo}
                      onChange={(e) => handleFilterChange("rollNo", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-event">Event</Label>
                    <Input
                      id="export-event"
                      placeholder="Filter by event..."
                      value={filters.event}
                      onChange={(e) => handleFilterChange("event", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-date">Date</Label>
                    <Input
                      id="export-date"
                      placeholder="Filter by date..."
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-uploadedBy">Uploaded By</Label>
                    <Input
                      id="export-uploadedBy"
                      placeholder="Filter by uploader..."
                      value={filters.uploadedBy}
                      onChange={(e) => handleFilterChange("uploadedBy", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-certificateNo">Certificate Number</Label>
                    <Input
                      id="export-certificateNo"
                      placeholder="Filter by certificate number..."
                      value={filters.certificateNo}
                      onChange={(e) => handleFilterChange("certificateNo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {includeAllData
              ? `This will export all ${totalRecords} certificate records.`
              : activeFiltersCount > 0
                ? "This will export records matching the applied filters."
                : `This will export all ${totalRecords} certificate records (no filters applied).`}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
