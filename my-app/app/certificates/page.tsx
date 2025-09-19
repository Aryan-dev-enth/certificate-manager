import { CertificateViewer } from "@/components/certificates/certificate-viewer"
import { ProtectedLayout } from "@/components/layout/protected-layout"

export default function CertificatesPage() {
  return (
    <ProtectedLayout>
      <div className="container mx-auto py-8 px-4">
        <CertificateViewer />
      </div>
    </ProtectedLayout>
  )
}
