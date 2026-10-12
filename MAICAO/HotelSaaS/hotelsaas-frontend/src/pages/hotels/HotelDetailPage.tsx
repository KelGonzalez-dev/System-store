import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { hotelsService } from '@/services/hotels.service'

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: hotel, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotels', id],
    queryFn: () => hotelsService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingOverlay visible />
  if (isError || !hotel) {
    return <ErrorState message="Failed to load hotel" onRetry={refetch} />
  }

  return (
    <div>
      <PageHeader
        title={hotel.name}
        description={`${hotel.city}, ${hotel.country}`}
        actions={
          <Button variant="outline" asChild>
            <Link to={`/hotels/${id}/edit`}>
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
              <CardTitle>Details</CardTitle>
              <Badge variant={hotel.isActive ? 'default' : 'destructive'}>
                {hotel.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotel.description && (
              <p className="text-muted-foreground">{hotel.description}</p>
            )}
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{hotel.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Postal code</p>
                <p className="font-medium">{hotel.postalCode ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{hotel.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{hotel.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">{hotel.checkInTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium">{hotel.checkOutTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(hotel.createdAt)}</p>
              </div>
            </div>
            {hotel.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((a) => (
                      <Badge key={a} variant="secondary">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {hotel.images.length > 0 && (
          <Card className="glass rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {hotel.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
