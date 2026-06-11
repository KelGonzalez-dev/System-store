import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BedDouble, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/tables/DataTable'
import { TableActions } from '@/components/tables/TableActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { formatCurrency } from '@/lib/utils'
import { roomsService } from '@/services/rooms.service'
import type { Room } from '@/types/entities'

export function RoomsListPage() {
  const queryClient = useQueryClient()
  const { page, setPage, search, setSearch, params } = usePagination()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomsService.getAll(params),
  })

  const deleteMutation = useMutation({
    mutationFn: roomsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room deleted')
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message || 'Delete failed'),
  })

  const columns: Column<Room>[] = [
    {
      key: 'number',
      header: 'Room',
      cell: (row) => (
        <Link to={`/rooms/${row.id}`} className="font-medium text-primary hover:underline">
          {row.number}
        </Link>
      ),
    },
    { key: 'hotel', header: 'Hotel', cell: (row) => row.hotelName },
    { key: 'type', header: 'Type', cell: (row) => row.roomTypeName },
    { key: 'floor', header: 'Floor', cell: (row) => row.floor },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <Badge variant="secondary">{row.status}</Badge>,
    },
    {
      key: 'price',
      header: 'Price/night',
      cell: (row) => formatCurrency(row.pricePerNight),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <TableActions
          viewHref={`/rooms/${row.id}`}
          editHref={`/rooms/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Rooms"
        description="Manage hotel rooms"
        actions={
          <Button asChild>
            <Link to="/rooms/new">
              <Plus className="mr-2 h-4 w-4" />
              Add room
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
        emptyIcon={BedDouble}
        emptyTitle="No rooms found"
        emptyDescription="Create your first room"
        onRetry={refetch}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete room"
        description="This will permanently delete the room."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
