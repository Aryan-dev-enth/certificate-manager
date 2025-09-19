"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, CheckCircle, AlertCircle, Filter } from "lucide-react"
import { CSVPreviewTable } from "./csv-preview-table"
import type { CSVRow } from "@/lib/services/csv-processor"

interface ParsedCSVData {
  headers: string[]
  rows: CSVRow[]
  totalRows: number
  errors: string[]
  fileName: string
}

type WizardStep = "upload" | "preview" | "confirm" | "success"

export function CSVUploadWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [eventCodeFilter, setEventCodeFilter] = useState("")
  const [description, setDescription] = useState("")
  const [filteredRows, setFilteredRows] = useState<CSVRow[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload/parse", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setParsedData(result.data)
        setFilteredRows(result.data.rows)
        setCurrentStep("preview")
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (filterValue: string) => {
    setEventCodeFilter(filterValue)
    if (parsedData) {
      if (filterValue.trim() === "") {
        setFilteredRows(parsedData.rows)
      } else {
        const filtered = parsedData.rows.filter(
          (row) => row.Event && row.Event.toLowerCase().includes(filterValue.toLowerCase()),
        )
        setFilteredRows(filtered)
      }
    }
  }

  const handleConfirm = async () => {
    if (!parsedData || filteredRows.length === 0) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: filteredRows,
          fileName: parsedData.fileName,
          eventCode: eventCodeFilter,
          description,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setCurrentStep("success")
      } else {
        setError(result.error || "Upload confirmation failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetWizard = () => {
    setCurrentStep("upload")
    setFile(null)
    setParsedData(null)
    setError("")
    setEventCodeFilter("")
    setDescription("")
    setFilteredRows([])
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: "upload", label: "Upload", icon: Upload },
      { key: "preview", label: "Preview", icon: FileText },
      { key: "confirm", label: "Confirm", icon: CheckCircle },
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.key
          const isCompleted = steps.findIndex((s) => s.key === currentStep) > index

          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground bg-background text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && <div className="w-8 h-px bg-border mx-4" />}
            </div>
          )
        })}
      </div>
    )
  }

  if (currentStep === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Upload Successful!</CardTitle>
          <CardDescription>Your certificates have been processed and saved successfully.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            {filteredRows.length} certificate records have been added to the database.
          </p>
          <Button onClick={resetWizard} className="mr-4">
            Upload Another File
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {renderStepIndicator()}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Select a CSV file containing certificate data. Required columns: CertificateNo, Name, RollNo, Event, Date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">CSV File</Label>
              <Input id="file" type="file" accept=".csv" onChange={handleFileSelect} disabled={isLoading} />
            </div>

            {file && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Selected file:</strong> {file.name}
                </p>
                <p className="text-sm text-muted-foreground">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!file || isLoading} className="w-full">
              {isLoading ? "Processing..." : "Parse CSV"}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === "preview" && parsedData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview Data</CardTitle>
              <CardDescription>Review the parsed data and apply filters if needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{parsedData.totalRows} total rows</Badge>
                  <Badge variant="outline">{filteredRows.length} filtered rows</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Input
                    placeholder="Filter by event..."
                    value={eventCodeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              {parsedData.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Validation Errors:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {parsedData.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                      {parsedData.errors.length > 5 && (
                        <li className="text-sm">...and {parsedData.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <CSVPreviewTable headers={parsedData.headers} rows={filteredRows.slice(0, 10)} />

              {filteredRows.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 10 rows of {filteredRows.length} total rows
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this upload batch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("confirm")}
                  disabled={filteredRows.length === 0 || parsedData.errors.length > 0}
                >
                  Continue to Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === "confirm" && parsedData && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Upload</CardTitle>
            <CardDescription>Please review the details before confirming the upload</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <p className="text-sm text-muted-foreground">{parsedData.fileName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Records to Upload</Label>
                <p className="text-sm text-muted-foreground">{filteredRows.length}</p>
              </div>
              {eventCodeFilter && (
                <div>
                  <Label className="text-sm font-medium">Event Filter</Label>
                  <p className="text-sm text-muted-foreground">{eventCodeFilter}</p>
                </div>
              )}
              {description && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Once confirmed, the original CSV file will be discarded and the data will be permanently saved to the
                database.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep("preview")}>
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Upload"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
