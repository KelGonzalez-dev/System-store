import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { guestsService } from '@/services/guests.service'
import { hotelsService } from '@/services/hotels.service'
import { reservationsService } from '@/services/reservations.service'
import { roomsService } from '@/services/rooms.service'

const schema = z
  .object({
    hotelId: z.string().min(1, 'Hotel is required'),
    guestId: z.string().min(1, 'Guest is required'),
    roomId: z.string().min(1, 'Room is required'),
    checkIn: z.string().min(1, 'Check-in is required'),
    checkOut: z.string().min(1, 'Check-out is required'),
    adults: z.coerce.number().int().min(1).optional(),
    children: z.coerce.number().int().min(0).optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  })

type FormValues = z.infer<typeof schema>

export function ReservationCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const hotelsQuery = useQuery({
    queryKey: ['hotels', { page: 1, pageSize: 100 }],
    queryFn: () => hotelsService.getAll({ page: 1, pageSize: 100 }),
  })

  const guestsQuery = useQuery({
    queryKey: ['guests', { page: 1, pageSize: 100 }],
    queryFn: () => guestsService.getAll({ page: 1, pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      hotelId: '',
      guestId: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      adults: 1,
      children: 0,
      notes: '',
    },
  })

  const hotelId = watch('hotelId')
  const checkIn = watch('checkIn')
  const checkOut = watch('checkOut')

  const availabilityQuery = useQuery({
    queryKey: ['rooms', 'availability', hotelId, checkIn, checkOut],
    queryFn: () =>
      roomsService.getAvailability({ hotelId, checkIn, checkOut }),
    enabled: !!hotelId && !!checkIn && !!checkOut && checkOut > checkIn,
  })

  const mutation = useMutation({
    mutationFn: reservationsService.create,
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      toast.success('Reservation created')
      navigate(`/reservations/${reservation.id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Create failed'),
  })

  return (
    <div>
      <PageHeader title="New reservation" description="Book a room for a guest" />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <FormField label="Hotel" error={errors.hotelId?.message} required>
              <Controller
                name="hotelId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelsQuery.data?.items.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Guest" error={errors.guestId?.message} required>
              <Controller
                name="guestId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestsQuery.data?.items.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.firstName} {g.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Check-in" error={errors.checkIn?.message} required>
                <Input type="date" {...register('checkIn')} />
              </FormField>
              <FormField label="Check-out" error={errors.checkOut?.message} required>
                <Input type="date" {...register('checkOut')} />
              </FormField>
            </div>
            <FormField label="Room" error={errors.roomId?.message} required>
              <Controller
                name="roomId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!availabilityQuery.data?.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select available room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityQuery.data
                        ?.filter((r) => r.isAvailable)
                        .map((r) => (
                          <SelectItem key={r.roomId} value={r.roomId}>
                            {r.number} — ${r.pricePerNight}/night
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Adults" error={errors.adults?.message}>
                <Input type="number" min={1} {...register('adults')} />
              </FormField>
              <FormField label="Children" error={errors.children?.message}>
                <Input type="number" min={0} {...register('children')} />
              </FormField>
            </div>
            <FormField label="Notes" error={errors.notes?.message}>
              <Textarea {...register('notes')} rows={3} />
            </FormField>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create reservation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
