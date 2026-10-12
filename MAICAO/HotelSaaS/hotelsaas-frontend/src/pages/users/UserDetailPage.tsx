import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate, getInitials } from '@/lib/utils'
import { usersService } from '@/services/users.service'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingOverlay visible />
  if (isError || !user) {
    return <ErrorState message="Failed to load user" onRetry={refetch} />
  }

  return (
    <div>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description={user.email}
        actions={
          <Button variant="outline" asChild>
            <Link to={`/users/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {user.emailVerified && <Badge variant="secondary">Verified</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Roles</p>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
