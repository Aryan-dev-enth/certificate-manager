import { CSVProcessor } from "@/lib/services/csv-processor"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    const csvText = await file.text()
    const parsedData = await CSVProcessor.parseCSVFromString(csvText)

    return NextResponse.json({
      success: true,
      data: {
        headers: parsedData.headers,
        rows: parsedData.rows,
        totalRows: parsedData.totalRows,
        errors: parsedData.errors,
      },
    })
  } catch (err) {
    console.error("CSV parsing error:", err)
    return NextResponse.json({ error: "Failed to parse CSV file" }, { status: 500 })
  }
}
