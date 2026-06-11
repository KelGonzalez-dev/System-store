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
import { hotelsService } from '@/services/hotels.service'
import { roomsService } from '@/services/rooms.service'

const schema = z.object({
  hotelId: z.string().min(1, 'Hotel is required'),
  roomTypeId: z.string().min(1, 'Room type is required'),
  number: z.string().min(1, 'Room number is required'),
  floor: z.coerce.number().int().min(0),
  pricePerNight: z.coerce.number().positive('Price must be positive'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RoomCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const hotelsQuery = useQuery({
    queryKey: ['hotels', { page: 1, pageSize: 100 }],
    queryFn: () => hotelsService.getAll({ page: 1, pageSize: 100 }),
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
      roomTypeId: '',
      number: '',
      floor: 1,
      pricePerNight: 0,
      description: '',
    },
  })

  const hotelId = watch('hotelId')

  const roomTypesQuery = useQuery({
    queryKey: ['roomTypes', hotelId],
    queryFn: () => roomsService.getRoomTypes(hotelId),
    enabled: !!hotelId,
  })

  const mutation = useMutation({
    mutationFn: roomsService.create,
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room created')
      navigate(`/rooms/${room.id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Create failed'),
  })

  return (
    <div>
      <PageHeader title="Create room" description="Add a new room to a hotel" />

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
            <FormField label="Room type" error={errors.roomTypeId?.message} required>
              <Controller
                name="roomTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!hotelId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypesQuery.data?.map((rt) => (
                        <SelectItem key={rt.id} value={rt.id}>
                          {rt.name} (cap. {rt.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Room number" error={errors.number?.message} required>
                <Input {...register('number')} />
              </FormField>
              <FormField label="Floor" error={errors.floor?.message} required>
                <Input type="number" {...register('floor')} />
              </FormField>
            </div>
            <FormField label="Price per night" error={errors.pricePerNight?.message} required>
              <Input type="number" step="0.01" {...register('pricePerNight')} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Textarea {...register('description')} rows={3} />
            </FormField>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create room
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
