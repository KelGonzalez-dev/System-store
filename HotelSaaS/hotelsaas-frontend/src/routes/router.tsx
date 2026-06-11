import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Skeleton } from '@/components/ui/skeleton'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { useAuthStore } from '@/store/auth.store'

function lazyNamed<T extends Record<string, ComponentType<object>>>(
  factory: () => Promise<T>,
  name: keyof T,
) {
  return lazy(() => factory().then((m) => ({ default: m[name] as ComponentType<object> })))
}

const LoginPage = lazyNamed(() => import('@/pages/auth/LoginPage'), 'LoginPage')
const RegisterPage = lazyNamed(() => import('@/pages/auth/RegisterPage'), 'RegisterPage')
const ForgotPasswordPage = lazyNamed(
  () => import('@/pages/auth/ForgotPasswordPage'),
  'ForgotPasswordPage',
)
const ResetPasswordPage = lazyNamed(
  () => import('@/pages/auth/ResetPasswordPage'),
  'ResetPasswordPage',
)

const DashboardPage = lazyNamed(() => import('@/pages/dashboard/DashboardPage'), 'DashboardPage')

const UsersListPage = lazyNamed(() => import('@/pages/users/UsersListPage'), 'UsersListPage')
const UserCreatePage = lazyNamed(() => import('@/pages/users/UserCreatePage'), 'UserCreatePage')
const UserDetailPage = lazyNamed(() => import('@/pages/users/UserDetailPage'), 'UserDetailPage')
const UserEditPage = lazyNamed(() => import('@/pages/users/UserEditPage'), 'UserEditPage')

const HotelsListPage = lazyNamed(() => import('@/pages/hotels/HotelsListPage'), 'HotelsListPage')
const HotelCreatePage = lazyNamed(() => import('@/pages/hotels/HotelCreatePage'), 'HotelCreatePage')
const HotelDetailPage = lazyNamed(() => import('@/pages/hotels/HotelDetailPage'), 'HotelDetailPage')
const HotelEditPage = lazyNamed(() => import('@/pages/hotels/HotelEditPage'), 'HotelEditPage')

const RoomsListPage = lazyNamed(() => import('@/pages/rooms/RoomsListPage'), 'RoomsListPage')
const RoomCreatePage = lazyNamed(() => import('@/pages/rooms/RoomCreatePage'), 'RoomCreatePage')
const RoomDetailPage = lazyNamed(() => import('@/pages/rooms/RoomDetailPage'), 'RoomDetailPage')
const RoomEditPage = lazyNamed(() => import('@/pages/rooms/RoomEditPage'), 'RoomEditPage')

const ReservationsListPage = lazyNamed(
  () => import('@/pages/reservations/ReservationsListPage'),
  'ReservationsListPage',
)
const ReservationCreatePage = lazyNamed(
  () => import('@/pages/reservations/ReservationCreatePage'),
  'ReservationCreatePage',
)
const ReservationDetailPage = lazyNamed(
  () => import('@/pages/reservations/ReservationDetailPage'),
  'ReservationDetailPage',
)
const ReservationEditPage = lazyNamed(
  () => import('@/pages/reservations/ReservationEditPage'),
  'ReservationEditPage',
)

const GuestsListPage = lazyNamed(() => import('@/pages/guests/GuestsListPage'), 'GuestsListPage')
const GuestCreatePage = lazyNamed(() => import('@/pages/guests/GuestCreatePage'), 'GuestCreatePage')
const GuestDetailPage = lazyNamed(() => import('@/pages/guests/GuestDetailPage'), 'GuestDetailPage')
const GuestEditPage = lazyNamed(() => import('@/pages/guests/GuestEditPage'), 'GuestEditPage')

const PaymentsListPage = lazyNamed(
  () => import('@/pages/payments/PaymentsListPage'),
  'PaymentsListPage',
)
const PaymentDetailPage = lazyNamed(
  () => import('@/pages/payments/PaymentDetailPage'),
  'PaymentDetailPage',
)

const ReportsPage = lazyNamed(() => import('@/pages/reports/ReportsPage'), 'ReportsPage')
const RevenueReportPage = lazyNamed(
  () => import('@/pages/reports/RevenueReportPage'),
  'RevenueReportPage',
)
const OccupancyReportPage = lazyNamed(
  () => import('@/pages/reports/OccupancyReportPage'),
  'OccupancyReportPage',
)

const SettingsPage = lazyNamed(() => import('@/pages/settings/SettingsPage'), 'SettingsPage')
const ProfilePage = lazyNamed(() => import('@/pages/settings/ProfilePage'), 'ProfilePage')

function PageLoader() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LazyPage><LoginPage /></LazyPage> },
          { path: 'register', element: <LazyPage><RegisterPage /></LazyPage> },
          { path: 'forgot-password', element: <LazyPage><ForgotPasswordPage /></LazyPage> },
          { path: 'reset-password', element: <LazyPage><ResetPasswordPage /></LazyPage> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <ErrorBoundary>
            <DashboardLayout />
          </ErrorBoundary>
        ),
        children: [
          { path: 'dashboard', element: <LazyPage><DashboardPage /></LazyPage> },
          { path: 'users', element: <LazyPage><UsersListPage /></LazyPage> },
          { path: 'users/create', element: <LazyPage><UserCreatePage /></LazyPage> },
          { path: 'users/:id', element: <LazyPage><UserDetailPage /></LazyPage> },
          { path: 'users/:id/edit', element: <LazyPage><UserEditPage /></LazyPage> },
          { path: 'hotels', element: <LazyPage><HotelsListPage /></LazyPage> },
          { path: 'hotels/create', element: <LazyPage><HotelCreatePage /></LazyPage> },
          { path: 'hotels/:id', element: <LazyPage><HotelDetailPage /></LazyPage> },
          { path: 'hotels/:id/edit', element: <LazyPage><HotelEditPage /></LazyPage> },
          { path: 'rooms', element: <LazyPage><RoomsListPage /></LazyPage> },
          { path: 'rooms/create', element: <LazyPage><RoomCreatePage /></LazyPage> },
          { path: 'rooms/:id', element: <LazyPage><RoomDetailPage /></LazyPage> },
          { path: 'rooms/:id/edit', element: <LazyPage><RoomEditPage /></LazyPage> },
          { path: 'reservations', element: <LazyPage><ReservationsListPage /></LazyPage> },
          { path: 'reservations/create', element: <LazyPage><ReservationCreatePage /></LazyPage> },
          { path: 'reservations/:id', element: <LazyPage><ReservationDetailPage /></LazyPage> },
          { path: 'reservations/:id/edit', element: <LazyPage><ReservationEditPage /></LazyPage> },
          { path: 'guests', element: <LazyPage><GuestsListPage /></LazyPage> },
          { path: 'guests/create', element: <LazyPage><GuestCreatePage /></LazyPage> },
          { path: 'guests/:id', element: <LazyPage><GuestDetailPage /></LazyPage> },
          { path: 'guests/:id/edit', element: <LazyPage><GuestEditPage /></LazyPage> },
          { path: 'payments', element: <LazyPage><PaymentsListPage /></LazyPage> },
          { path: 'payments/:id', element: <LazyPage><PaymentDetailPage /></LazyPage> },
          { path: 'reports', element: <LazyPage><ReportsPage /></LazyPage> },
          { path: 'reports/revenue', element: <LazyPage><RevenueReportPage /></LazyPage> },
          { path: 'reports/occupancy', element: <LazyPage><OccupancyReportPage /></LazyPage> },
          { path: 'settings', element: <LazyPage><SettingsPage /></LazyPage> },
          { path: 'profile', element: <LazyPage><ProfilePage /></LazyPage> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
