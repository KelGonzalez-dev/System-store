import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  roles?: string[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, hasRole, isTokenExpired, logout } = useAuthStore()

  if (!isAuthenticated || isTokenExpired()) {
    if (isTokenExpired()) logout()
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
