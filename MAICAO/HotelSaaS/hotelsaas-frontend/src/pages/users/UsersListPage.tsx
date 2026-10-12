import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Users } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'
import { usersService } from '@/services/users.service'
import type { User } from '@/types/entities'

export function UsersListPage() {
  const queryClient = useQueryClient()
  const { page, setPage, search, setSearch, params } = usePagination()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
  })

  const deleteMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted')
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message || 'Delete failed'),
  })

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <Link to={`/users/${row.id}`} className="font-medium text-primary hover:underline">
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: 'email', header: 'Email', cell: (row) => row.email },
    {
      key: 'roles',
      header: 'Roles',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
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
      key: 'created',
      header: 'Created',
      cell: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <TableActions
          viewHref={`/users/${row.id}`}
          editHref={`/users/${row.id}/edit`}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage system users and roles"
        actions={
          <Button asChild>
            <Link to="/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Add user
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
        emptyIcon={Users}
        emptyTitle="No users found"
        emptyDescription="Create your first user to get started"
        onRetry={refetch}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete user"
        description="This action cannot be undone. The user will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
