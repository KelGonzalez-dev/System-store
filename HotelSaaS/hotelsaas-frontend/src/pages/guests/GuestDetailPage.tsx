import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { guestsService } from '@/services/guests.service'

export function GuestDetailPage() {
  const { id } = useParams<{ id: string }>()

  const guestQuery = useQuery({
    queryKey: ['guests', id],
    queryFn: () => guestsService.getById(id!),
    enabled: !!id,
  })

  const historyQuery = useQuery({
    queryKey: ['guests', id, 'history'],
    queryFn: () => guestsService.getHistory(id!),
    enabled: !!id,
  })

  if (guestQuery.isLoading) return <LoadingOverlay visible />
  if (guestQuery.isError || !guestQuery.data) {
    return <ErrorState message="Failed to load guest" onRetry={guestQuery.refetch} />
  }

  const guest = guestQuery.data

  return (
    <div>
      <PageHeader
        title={`${guest.firstName} ${guest.lastName}`}
        description={guest.email}
        actions={
          <Button variant="outline" asChild>
            <Link to={`/guests/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <Card className="glass mb-6 max-w-2xl rounded-2xl border-0">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{guest.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nationality</p>
              <p className="font-medium">{guest.nationality ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document</p>
              <p className="font-medium">
                {guest.documentNumber
                  ? `${guest.documentType ?? ''} ${guest.documentNumber}`
                  : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass rounded-2xl border-0">
        <CardHeader>
          <CardTitle>Reservation history</CardTitle>
        </CardHeader>
        <CardContent>
          {historyQuery.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Stay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyQuery.data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        to={`/reservations/${r.id}`}
                        className="text-primary hover:underline"
                      >
                        {r.code}
                      </Link>
                    </TableCell>
                    <TableCell>{r.hotelName}</TableCell>
                    <TableCell>
                      {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(r.totalAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No reservation history</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
