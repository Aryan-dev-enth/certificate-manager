import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ProtectedLayout } from "@/components/layout/protected-layout"

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="container mx-auto py-8 px-4">
        <DashboardContent />
      </div>
    </ProtectedLayout>
  )
}
