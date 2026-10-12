import { BarChart3, LineChart, Percent } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const REPORT_LINKS = [
  {
    title: 'Revenue report',
    description: 'Daily revenue breakdown and totals',
    href: '/reports/revenue',
    icon: LineChart,
  },
  {
    title: 'Occupancy report',
    description: 'Room occupancy rates over time',
    href: '/reports/occupancy',
    icon: Percent,
  },
] as const

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analytics and business intelligence"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {REPORT_LINKS.map((report) => (
          <Link key={report.href} to={report.href}>
            <Card className="glass rounded-2xl border-0 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <report.icon className="h-5 w-5" />
                </div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">View report →</span>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Card className="glass rounded-2xl border-0 opacity-60">
          <CardHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <CardTitle>More reports</CardTitle>
            <CardDescription>Additional reports coming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
