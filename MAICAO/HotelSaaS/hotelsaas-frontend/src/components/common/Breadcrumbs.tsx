import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  hotels: 'Hotels',
  rooms: 'Rooms',
  reservations: 'Reservations',
  guests: 'Guests',
  payments: 'Payments',
  reports: 'Reports',
  settings: 'Settings',
  profile: 'Profile',
  create: 'Create',
  edit: 'Edit',
  revenue: 'Revenue',
  occupancy: 'Occupancy',
}

export function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-accent hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const label =
          routeLabels[segment] ??
          (/^[0-9a-f-]{36}$/i.test(segment) ? 'Details' : segment)

        return (
          <div key={path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className={cn('px-2 py-1 font-medium text-foreground')}>{label}</span>
            ) : (
              <Link
                to={path}
                className="rounded-lg px-2 py-1 transition-colors hover:bg-accent hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
