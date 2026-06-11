import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { setupInterceptors } from '@/api/interceptors'
import { applyTheme, useUiStore } from '@/store/ui.store'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

let interceptorsInitialized = false

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    if (!interceptorsInitialized) {
      setupInterceptors()
      interceptorsInitialized = true
    }
    applyTheme(theme)
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
