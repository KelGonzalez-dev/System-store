import { useQuery } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/tables/DataTable'
import { TableActions } from '@/components/tables/TableActions'
import { Badge } from '@/components/ui/badge'
import { usePagination } from '@/hooks/usePagination'
import { formatCurrency, formatDate } from '@/lib/utils'
import { paymentsService } from '@/services/payments.service'
import type { Payment } from '@/types/entities'

export function PaymentsListPage() {
  const { page, setPage, search, setSearch, params } = usePagination()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsService.getAll(params),
  })

  const columns: Column<Payment>[] = [
    {
      key: 'reservation',
      header: 'Reservation',
      cell: (row) => (
        <Link to={`/payments/${row.id}`} className="font-medium text-primary hover:underline">
          {row.reservationCode}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (row) => formatCurrency(row.amount),
    },
    { key: 'method', header: 'Method', cell: (row) => row.method },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <Badge variant="secondary">{row.status}</Badge>,
    },
    {
      key: 'processed',
      header: 'Processed',
      cell: (row) => (row.processedAt ? formatDate(row.processedAt) : '—'),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => <TableActions viewHref={`/payments/${row.id}`} />,
    },
  ]

  return (
    <div>
      <PageHeader title="Payments" description="View and manage payment transactions" />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        search={search}
        onSearchChange={setSearch}
        page={page}
        onPageChange={setPage}
        emptyIcon={CreditCard}
        emptyTitle="No payments found"
        emptyDescription="Payments will appear here when processed"
        onRetry={refetch}
      />
    </div>
  )
}
