import { ProtectedRoute } from '@/components/ProtectedRoute'
import AdminLayout from '@/screens/admin/AdminLayout'

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute role="admin">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
