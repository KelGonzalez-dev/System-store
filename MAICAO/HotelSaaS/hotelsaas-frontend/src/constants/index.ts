export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5093/api'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hotelsaas_access_token',
  REFRESH_TOKEN: 'hotelsaas_refresh_token',
  USER: 'hotelsaas_user',
  THEME: 'hotelsaas_theme',
} as const

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  GUEST: 'Guest',
} as const

export const DEFAULT_PAGE_SIZE = 10

export const NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Users', href: '/users', icon: 'Users' },
  { title: 'Hotels', href: '/hotels', icon: 'Building2' },
  { title: 'Rooms', href: '/rooms', icon: 'BedDouble' },
  { title: 'Reservations', href: '/reservations', icon: 'CalendarDays' },
  { title: 'Guests', href: '/guests', icon: 'UserCircle' },
  { title: 'Payments', href: '/payments', icon: 'CreditCard' },
  { title: 'Reports', href: '/reports', icon: 'BarChart3' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
] as const
