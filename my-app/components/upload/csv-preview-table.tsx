"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { CSVRow } from "@/lib/services/csv-processor"

interface CSVPreviewTableProps {
  headers: string[]
  rows: CSVRow[]
}

export function CSVPreviewTable({ headers, rows }: CSVPreviewTableProps) {
  const requiredColumns = ["CertificateNo", "Name", "RollNo", "Event", "Date"]

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {header}
                    {requiredColumns.includes(header) && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center text-muted-foreground py-8">
                  No data to display
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header} className="whitespace-nowrap">
                      {row[header] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
