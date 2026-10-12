import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, Plus } from 'lucide-react'
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
import { hotelsService } from '@/services/hotels.service'
import type { Hotel } from '@/types/entities'

export function HotelsListPage() {
  const queryClient = useQueryClient()
  const { page, setPage, search, setSearch, params } = usePagination()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotels', params],
    queryFn: () => hotelsService.getAll(params),
  })

  const deleteMutation = useMutation({
    mutationFn: hotelsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel deleted')
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message || 'Delete failed'),
  })

  const columns: Column<Hotel>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <Link to={`/hotels/${row.id}`} className="font-medium text-primary hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      cell: (row) => `${row.city}, ${row.country}`,
    },
    { key: 'phone', header: 'Phone', cell: (row) => row.phone ?? '—' },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'default' : 'destructive'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <TableActions
          viewHref={`/hotels/${row.id}`}
          editHref={`/hotels/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Hotels"
        description="Manage hotel properties"
        actions={
          <Button asChild>
            <Link to="/hotels/new">
              <Plus className="mr-2 h-4 w-4" />
              Add hotel
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
        emptyIcon={Building2}
        emptyTitle="No hotels found"
        emptyDescription="Create your first hotel property"
        onRetry={refetch}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete hotel"
        description="This will permanently delete the hotel and related data."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
