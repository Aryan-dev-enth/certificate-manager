"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface FilterValues {
  name: string
  rollNo: string
  event: string
  date: string
  uploadedBy: string
  certificateNo: string
}

interface CertificateFiltersProps {
  filters: FilterValues
  onFiltersChange: (filters: FilterValues) => void
  onSearch: () => void
  isLoading?: boolean
}

export function CertificateFilters({ filters, onFiltersChange, onSearch, isLoading = false }: CertificateFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    onFiltersChange(localFilters)
    onSearch()
  }

  const handleClear = () => {
    const emptyFilters: FilterValues = {
      name: "",
      rollNo: "",
      event: "",
      date: "",
      uploadedBy: "",
      certificateNo: "",
    }
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    onSearch()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const activeFiltersCount = Object.values(localFilters).filter((value) => value.trim() !== "").length

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Certificates
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                {isOpen ? "Hide filters" : "Show filters"}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Search by name..."
                  value={localFilters.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  placeholder="Search by roll number..."
                  value={localFilters.rollNo}
                  onChange={(e) => handleInputChange("rollNo", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Input
                  id="event"
                  placeholder="Search by event..."
                  value={localFilters.event}
                  onChange={(e) => handleInputChange("event", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="Search by date..."
                  value={localFilters.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uploadedBy">Uploaded By</Label>
                <Input
                  id="uploadedBy"
                  placeholder="Search by uploader..."
                  value={localFilters.uploadedBy}
                  onChange={(e) => handleInputChange("uploadedBy", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateNo">Certificate Number</Label>
                <Input
                  id="certificateNo"
                  placeholder="Search by certificate number..."
                  value={localFilters.certificateNo}
                  onChange={(e) => handleInputChange("certificateNo", e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} disabled={isLoading} className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
