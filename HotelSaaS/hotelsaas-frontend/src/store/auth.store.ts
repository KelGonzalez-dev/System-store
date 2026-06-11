import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'
import type { AuthResponse, AuthUser } from '@/types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (response: AuthResponse) => void
  logout: () => void
  hasRole: (...roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  isTokenExpired: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (response) => {
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            userId: response.userId,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles,
            permissions: response.permissions,
            expiresAt: response.expiresAt,
          },
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      hasRole: (...roles) => {
        const userRoles = get().user?.roles ?? []
        return roles.some((role) => userRoles.includes(role))
      },

      hasPermission: (permission) => {
        const permissions = get().user?.permissions ?? []
        return permissions.includes(permission)
      },

      isTokenExpired: () => {
        const expiresAt = get().user?.expiresAt
        if (!expiresAt) return true
        return new Date(expiresAt) <= new Date()
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
