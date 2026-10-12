import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { ReservationActions } from '@/pages/reservations/ReservationActions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate } from '@/lib/utils'
import { reservationsService } from '@/services/reservations.service'

export function ReservationEditPage() {
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
        title={`Manage ${reservation.code}`}
        description="View reservation details and perform actions"
        actions={<ReservationActions reservation={reservation} />}
      />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reservation (read-only)</CardTitle>
            <Badge variant="secondary">{reservation.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Reservations cannot be edited via API. Use actions below to update status.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Guest</Label>
              <Input value={reservation.guestName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Hotel</Label>
              <Input value={reservation.hotelName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Input value={reservation.roomNumber} disabled />
            </div>
            <div className="space-y-2">
              <Label>Total amount</Label>
              <Input value={formatCurrency(reservation.totalAmount)} disabled />
            </div>
            <div className="space-y-2">
              <Label>Check-in</Label>
              <Input value={formatDate(reservation.checkIn)} disabled />
            </div>
            <div className="space-y-2">
              <Label>Check-out</Label>
              <Input value={formatDate(reservation.checkOut)} disabled />
            </div>
            <div className="space-y-2">
              <Label>Adults</Label>
              <Input value={String(reservation.adults)} disabled />
            </div>
            <div className="space-y-2">
              <Label>Children</Label>
              <Input value={String(reservation.children)} disabled />
            </div>
          </div>
          {reservation.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={reservation.notes} disabled rows={3} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
