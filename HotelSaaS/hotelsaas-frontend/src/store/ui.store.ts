import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'

type Theme = 'light' | 'dark' | 'system'

interface UiState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  theme: Theme
  globalLoading: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarMobileOpen: (open: boolean) => void
  setTheme: (theme: Theme) => void
  setGlobalLoading: (loading: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'system',
      globalLoading: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  root.classList.toggle('dark', isDark)
}
