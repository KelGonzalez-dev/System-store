import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const store = useAuthStore()
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    setAuth: store.setAuth,
    logout: store.logout,
    hasRole: store.hasRole,
    hasPermission: store.hasPermission,
  }
}
