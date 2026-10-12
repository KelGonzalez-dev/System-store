export const ENDPOINTS = {
  auth: {
    login: '/Auth/login',
    register: '/Auth/register',
    refresh: '/Auth/refresh-token',
    logout: '/Auth/logout',
    forgotPassword: '/Auth/forgot-password',
    resetPassword: '/Auth/reset-password',
    changePassword: '/Auth/change-password',
    profile: '/Users/profile',
  },
  users: {
    base: '/Users',
    byId: (id: string) => `/Users/${id}`,
    activate: (id: string) => `/Users/${id}/activate`,
    deactivate: (id: string) => `/Users/${id}/deactivate`,
    profile: '/Users/profile',
    avatar: '/Users/profile/avatar',
  },
  hotels: {
    base: '/Hotels',
    byId: (id: string) => `/Hotels/${id}`,
    images: (id: string) => `/Hotels/${id}/images`,
  },
  rooms: {
    base: '/Rooms',
    byId: (id: string) => `/Rooms/${id}`,
    availability: '/Rooms/availability',
    images: (id: string) => `/Rooms/${id}/images`,
  },
  roomTypes: {
    base: '/RoomTypes',
    byId: (id: string) => `/RoomTypes/${id}`,
  },
  reservations: {
    base: '/Reservations',
    byId: (id: string) => `/Reservations/${id}`,
    confirm: (id: string) => `/Reservations/${id}/confirm`,
    cancel: (id: string) => `/Reservations/${id}/cancel`,
    checkIn: (id: string) => `/Reservations/${id}/check-in`,
    checkOut: (id: string) => `/Reservations/${id}/check-out`,
  },
  guests: {
    base: '/Guests',
    byId: (id: string) => `/Guests/${id}`,
    history: (id: string) => `/Guests/${id}/history`,
  },
  payments: {
    base: '/Payments',
    byId: (id: string) => `/Payments/${id}`,
    refund: (id: string) => `/Payments/${id}/refund`,
    stripe: '/Payments/stripe',
  },
  reports: {
    revenue: '/Reports/revenue',
    occupancy: '/Reports/occupancy',
    revenueExcel: '/Reports/revenue/excel',
    revenuePdf: '/Reports/revenue/pdf',
  },
  dashboard: {
    stats: '/Dashboard/stats',
  },
  upload: {
    image: '/Upload/image',
    images: '/Upload/images',
  },
} as const
