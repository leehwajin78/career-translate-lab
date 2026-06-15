import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

type RequiredRole = 'guest' | 'member' | 'admin'

const ROLE_LEVEL: Record<RequiredRole, number> = {
  guest: 0,
  member: 1,
  admin: 2,
}

interface ProtectedRouteProps {
  role: RequiredRole
  children: React.ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { currentMember } = useAuthStore()
  const location = useLocation()

  if (!currentMember) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const userRole = (currentMember as { role?: RequiredRole }).role ?? 'member'
  if (ROLE_LEVEL[userRole] < ROLE_LEVEL[role]) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
