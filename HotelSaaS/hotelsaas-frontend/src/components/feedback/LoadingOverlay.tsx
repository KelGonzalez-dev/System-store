import { Loader2 } from 'lucide-react'
import { useUiStore } from '@/store/ui.store'

interface LoadingOverlayProps {
  /** When true, shows overlay regardless of global loading state */
  visible?: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps = {}) {
  const globalLoading = useUiStore((s) => s.globalLoading)
  if (!visible && !globalLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="glass flex items-center gap-3 rounded-2xl px-6 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  )
}
