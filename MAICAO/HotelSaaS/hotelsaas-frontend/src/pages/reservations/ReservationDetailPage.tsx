import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { ReservationActions } from '@/pages/reservations/ReservationActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { reservationsService } from '@/services/reservations.service'

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: reservation, isLoading, isError, refetch } = useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationsService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingOverlay visible />
  if (isError || !reservation) {
    return <ErrorState message="Failed to load reservation" onRetry={refetch} />
  }

  return (
    <div>
      <PageHeader
        title={reservation.code}
        description={`${reservation.guestName} · ${reservation.hotelName}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ReservationActions reservation={reservation} />
            <Button variant="outline" asChild>
              <Link to={`/reservations/${id}/edit`}>Manage</Link>
            </Button>
          </div>
        }
      />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reservation details</CardTitle>
            <Badge variant="secondary">{reservation.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Guest</p>
              <p className="font-medium">
                <Link to={`/guests/${reservation.guestId}`} className="text-primary hover:underline">
                  {reservation.guestName}
                </Link>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hotel</p>
              <p className="font-medium">{reservation.hotelName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">{reservation.roomNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(reservation.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{formatDate(reservation.checkIn)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{formatDate(reservation.checkOut)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adults</p>
              <p className="font-medium">{reservation.adults}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Children</p>
              <p className="font-medium">{reservation.children}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(reservation.createdAt)}</p>
            </div>
          </div>
          {reservation.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="mt-1">{reservation.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
