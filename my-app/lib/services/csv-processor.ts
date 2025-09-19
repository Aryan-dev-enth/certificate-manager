import Papa from "papaparse"

export interface CSVRow {
  name: string
  email: string
  ID: string
}

export interface ProcessedCSVData {
  headers: string[]
  rows: CSVRow[]
  totalRows: number
  errors: string[]
}

export class CSVProcessor {
  // Parse CSV from string (Node.js compatible)
  static async parseCSVFromString(csvString: string): Promise<ProcessedCSVData> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        complete: (results) => {
          resolve({
            headers: results.meta.fields?.map((h) => h.trim()) || [],
            rows: results.data as CSVRow[],
            totalRows: (results.data as CSVRow[]).length,
            errors: results.errors.map((e) => e.message),
          })
        },
        error: (error) => reject(error),
      })
    })
  }
}
