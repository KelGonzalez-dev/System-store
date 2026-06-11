import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatDate } from '@/lib/utils'
import { reportsService } from '@/services/reports.service'

export function RevenueReportPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const monthAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  const [from, setFrom] = useState(monthAgo)
  const [to, setTo] = useState(today)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reports', 'revenue', { from, to }],
    queryFn: () => reportsService.getRevenue({ from, to }),
    enabled: !!from && !!to,
  })

  return (
    <div>
      <PageHeader
        title="Revenue report"
        description="Daily revenue breakdown"
      />

      <Card className="glass mb-6 rounded-2xl border-0">
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {isLoading && <LoadingOverlay visible />}
      {isError && <ErrorState message="Failed to load report" onRetry={refetch} />}

      {data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glass rounded-2xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</p>
              </CardContent>
            </Card>
            <Card className="glass rounded-2xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(data.netRevenue)}</p>
              </CardContent>
            </Card>
            <Card className="glass rounded-2xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Refunds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRefunds)}</p>
              </CardContent>
            </Card>
            <Card className="glass rounded-2xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totalPayments}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass rounded-2xl border-0">
            <CardHeader>
              <CardTitle>Daily breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {data.dailyBreakdown.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dailyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => format(new Date(v), 'MMM d')}
                    />
                    <YAxis />
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
                <p className="flex h-full items-center justify-center text-muted-foreground">
                  No data for selected period
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
