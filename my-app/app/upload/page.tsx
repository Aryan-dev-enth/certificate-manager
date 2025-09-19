import { CSVUploadWizard } from "@/components/upload/csv-upload-wizard"
import { ProtectedLayout } from "@/components/layout/protected-layout"

export default function UploadPage() {
  return (
    <ProtectedLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Upload Certificates</h1>
          <p className="text-muted-foreground mt-2">
            Upload CSV files containing certificate data with multi-step validation and preview.
          </p>
        </div>
        <CSVUploadWizard />
      </div>
    </ProtectedLayout>
  )
}
