import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui.store'
import {
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  UserCircle,
  Users,
} from 'lucide-react'

const mobileNav = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Users', href: '/users', icon: Users },
  { title: 'Hotels', href: '/hotels', icon: Building2 },
  { title: 'Rooms', href: '/rooms', icon: BedDouble },
  { title: 'Reservations', href: '/reservations', icon: CalendarDays },
  { title: 'Guests', href: '/guests', icon: UserCircle },
  { title: 'Payments', href: '/payments', icon: CreditCard },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout() {
  const location = useLocation()
  const { sidebarMobileOpen, setSidebarMobileOpen } = useUiStore()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <LoadingOverlay />

      <Sheet open={sidebarMobileOpen} onOpenChange={setSidebarMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="font-bold">HotelSaaS</span>
            <Button variant="ghost" size="icon" onClick={() => setSidebarMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)] p-4">
            <nav className="space-y-1">
              {mobileNav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Breadcrumbs />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
