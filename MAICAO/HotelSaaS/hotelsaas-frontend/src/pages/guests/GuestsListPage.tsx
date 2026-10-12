import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/tables/DataTable'
import { TableActions } from '@/components/tables/TableActions'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { guestsService } from '@/services/guests.service'
import type { Guest } from '@/types/entities'

export function GuestsListPage() {
  const queryClient = useQueryClient()
  const { page, setPage, search, setSearch, params } = usePagination()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['guests', params],
    queryFn: () => guestsService.getAll(params),
  })

  const deleteMutation = useMutation({
    mutationFn: guestsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      toast.success('Guest deleted')
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message || 'Delete failed'),
  })

  const columns: Column<Guest>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <Link to={`/guests/${row.id}`} className="font-medium text-primary hover:underline">
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: 'email', header: 'Email', cell: (row) => row.email },
    { key: 'phone', header: 'Phone', cell: (row) => row.phone ?? '—' },
    {
      key: 'document',
      header: 'Document',
      cell: (row) =>
        row.documentNumber ? `${row.documentType ?? ''} ${row.documentNumber}` : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <TableActions
          viewHref={`/guests/${row.id}`}
          editHref={`/guests/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Guests"
        description="Manage guest profiles"
        actions={
          <Button asChild>
            <Link to="/guests/new">
              <Plus className="mr-2 h-4 w-4" />
              Add guest
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
        emptyIcon={UserCircle}
        emptyTitle="No guests found"
        emptyDescription="Add your first guest profile"
        onRetry={refetch}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete guest"
        description="This will permanently delete the guest profile."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
