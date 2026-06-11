import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { roomsService } from '@/services/rooms.service'

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: room, isLoading, isError, refetch } = useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomsService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingOverlay visible />
  if (isError || !room) {
    return <ErrorState message="Failed to load room" onRetry={refetch} />
  }

  return (
    <div>
      <PageHeader
        title={`Room ${room.number}`}
        description={`${room.hotelName} · ${room.roomTypeName}`}
        actions={
          <Button variant="outline" asChild>
            <Link to={`/rooms/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass rounded-2xl border-0 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Room details</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{room.status}</Badge>
                <Badge variant={room.isActive ? 'default' : 'destructive'}>
                  {room.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Hotel</p>
                <p className="font-medium">{room.hotelName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Room type</p>
                <p className="font-medium">{room.roomTypeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price per night</p>
                <p className="font-medium">{formatCurrency(room.pricePerNight)}</p>
              </div>
            </div>
            {room.description && (
              <p className="mt-4 text-muted-foreground">{room.description}</p>
            )}
          </CardContent>
        </Card>

        {room.images.length > 0 && (
          <Card className="glass rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {room.images.map((src, i) => (
                <img key={i} src={src} alt="" className="rounded-xl object-cover" />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
