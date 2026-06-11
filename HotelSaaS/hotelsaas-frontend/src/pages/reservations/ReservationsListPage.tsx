import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/tables/DataTable'
import { TableActions } from '@/components/tables/TableActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { formatCurrency, formatDate } from '@/lib/utils'
import { reservationsService } from '@/services/reservations.service'
import type { Reservation } from '@/types/entities'

export function ReservationsListPage() {
  const { page, setPage, search, setSearch, params } = usePagination()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reservations', params],
    queryFn: () => reservationsService.getAll(params),
  })

  const columns: Column<Reservation>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (row) => (
        <Link
          to={`/reservations/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.code}
        </Link>
      ),
    },
    { key: 'guest', header: 'Guest', cell: (row) => row.guestName },
    { key: 'hotel', header: 'Hotel', cell: (row) => row.hotelName },
    { key: 'room', header: 'Room', cell: (row) => row.roomNumber },
    {
      key: 'dates',
      header: 'Stay',
      cell: (row) => `${formatDate(row.checkIn)} – ${formatDate(row.checkOut)}`,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <Badge variant="secondary">{row.status}</Badge>,
    },
    {
      key: 'total',
      header: 'Total',
      cell: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <TableActions
          viewHref={`/reservations/${row.id}`}
          editHref={`/reservations/${row.id}/edit`}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Reservations"
        description="Manage bookings and stays"
        actions={
          <Button asChild>
            <Link to="/reservations/new">
              <Plus className="mr-2 h-4 w-4" />
              New reservation
            </Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        search={search}
        onSearchChange={setSearch}
        page={page}
        onPageChange={setPage}
        emptyIcon={CalendarDays}
        emptyTitle="No reservations found"
        emptyDescription="Create a new reservation to get started"
        onRetry={refetch}
      />
    </div>
  )
}
