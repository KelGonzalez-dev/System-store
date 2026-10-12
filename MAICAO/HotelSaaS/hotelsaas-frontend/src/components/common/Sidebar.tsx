import { motion } from 'framer-motion'
import {
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  LayoutDashboard,
  Settings,
  UserCircle,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui.store'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  CalendarDays,
  UserCircle,
  CreditCard,
  BarChart3,
  Settings,
}

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Users', href: '/users', icon: 'Users' },
  { title: 'Hotels', href: '/hotels', icon: 'Building2' },
  { title: 'Rooms', href: '/rooms', icon: 'BedDouble' },
  { title: 'Reservations', href: '/reservations', icon: 'CalendarDays' },
  { title: 'Guests', href: '/guests', icon: 'UserCircle' },
  { title: 'Payments', href: '/payments', icon: 'CreditCard' },
  { title: 'Reports', href: '/reports', icon: 'BarChart3' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="glass-sidebar hidden h-screen shrink-0 flex-col lg:flex"
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!sidebarCollapsed && (
          <span className="text-lg font-bold tracking-tight text-foreground">HotelSaaS</span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.title}</span>}
              </NavLink>
            )
          })}
        </nav>
      </ScrollArea>
    </motion.aside>
  )
}
