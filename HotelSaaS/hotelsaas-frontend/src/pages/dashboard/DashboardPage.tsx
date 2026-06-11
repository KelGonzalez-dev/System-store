import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import {
  BedDouble,
  Building2,
  CalendarCheck,
  CreditCard,
  DollarSign,
  LogIn,
  LogOut,
  Percent,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { paymentsService } from '@/services/payments.service'
import { reportsService } from '@/services/reports.service'
import { reservationsService } from '@/services/reservations.service'
import type { Payment, Reservation } from '@/types/entities'

function getReportRange() {
  const to = new Date()
  const from = subDays(to, 30)
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  }
}

export function DashboardPage() {
  const range = getReportRange()

  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => reportsService.getDashboardStats(),
  })

  const revenueQuery = useQuery({
    queryKey: ['reports', 'revenue', range],
    queryFn: () => reportsService.getRevenue(range),
  })

  const occupancyQuery = useQuery({
    queryKey: ['reports', 'occupancy', range],
    queryFn: () => reportsService.getOccupancy(range),
  })

  const reservationsQuery = useQuery({
    queryKey: ['reservations', { page: 1, pageSize: 5 }],
    queryFn: () => reservationsService.getAll({ page: 1, pageSize: 5, sortDescending: true }),
  })

  const paymentsQuery = useQuery({
    queryKey: ['payments', { page: 1, pageSize: 5 }],
    queryFn: () => paymentsService.getAll({ page: 1, pageSize: 5, sortDescending: true }),
  })

  const stats = statsQuery.data
  const isLoading =
    statsQuery.isLoading ||
    revenueQuery.isLoading ||
    occupancyQuery.isLoading

  if (statsQuery.isError) {
    return (
      <ErrorState
        message="Failed to load dashboard"
        onRetry={() => statsQuery.refetch()}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your hotel operations"
      />

      {isLoading && <LoadingOverlay visible />}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Hotels"
          value={stats?.totalHotels ?? 0}
          icon={Building2}
          delay={0}
        />
        <KpiCard
          title="Rooms"
          value={stats?.totalRooms ?? 0}
          icon={BedDouble}
          delay={1}
        />
        <KpiCard
          title="Active reservations"
          value={stats?.activeReservations ?? 0}
          icon={CalendarCheck}
          delay={2}
        />
        <KpiCard
          title="Monthly revenue"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          icon={DollarSign}
          delay={3}
        />
        <KpiCard
          title="Occupancy rate"
          value={`${(stats?.occupancyRate ?? 0).toFixed(1)}%`}
          icon={Percent}
          delay={4}
        />
        <KpiCard
          title="Today check-ins"
          value={stats?.todayCheckIns ?? 0}
          icon={LogIn}
          delay={5}
        />
        <KpiCard
          title="Today check-outs"
          value={stats?.todayCheckOuts ?? 0}
          icon={LogOut}
          delay={6}
        />
        <KpiCard
          title="Pending payments"
          value={stats?.pendingPayments ?? 0}
          icon={CreditCard}
          delay={7}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="glass rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {revenueQuery.data?.dailyBreakdown.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueQuery.data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => format(new Date(v), 'MMM d')}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No revenue data
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">Occupancy (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {occupancyQuery.data?.dailyBreakdown.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyQuery.data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => format(new Date(v), 'MMM d')}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" unit="%" />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancyRate"
                    fill="hsl(var(--primary) / 0.2)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No occupancy data
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass rounded-2xl border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent reservations</CardTitle>
            <Link to="/reservations" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationsQuery.data?.items.map((r: Reservation) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        to={`/reservations/${r.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {r.code}
                      </Link>
                    </TableCell>
                    <TableCell>{r.guestName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent payments</CardTitle>
            <Link to="/payments" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reservation</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsQuery.data?.items.map((p: Payment) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        to={`/payments/${p.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {p.reservationCode}
                      </Link>
                    </TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
