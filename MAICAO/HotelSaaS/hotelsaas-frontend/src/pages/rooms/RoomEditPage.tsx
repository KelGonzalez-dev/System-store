import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { roomsService } from '@/services/rooms.service'
import type { RoomStatus } from '@/types/entities'

const ROOM_STATUS_MAP: Record<RoomStatus, number> = {
  Available: 0,
  Occupied: 1,
  Cleaning: 2,
  Maintenance: 3,
}

const STATUS_OPTIONS = Object.keys(ROOM_STATUS_MAP) as RoomStatus[]

const schema = z.object({
  roomTypeId: z.string().min(1, 'Room type is required'),
  number: z.string().min(1, 'Room number is required'),
  floor: z.coerce.number().int().min(0),
  status: z.coerce.number(),
  pricePerNight: z.coerce.number().positive(),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function RoomEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const roomQuery = useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomsService.getById(id!),
    enabled: !!id,
  })

  const roomTypesQuery = useQuery({
    queryKey: ['roomTypes', roomQuery.data?.hotelId],
    queryFn: () => roomsService.getRoomTypes(roomQuery.data!.hotelId),
    enabled: !!roomQuery.data?.hotelId,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (roomQuery.data) {
      const r = roomQuery.data
      reset({
        roomTypeId: r.roomTypeId,
        number: r.number,
        floor: r.floor,
        status: ROOM_STATUS_MAP[r.status] ?? 0,
        pricePerNight: r.pricePerNight,
        description: r.description ?? '',
        isActive: r.isActive,
      })
    }
  }, [roomQuery.data, reset])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => roomsService.update(id!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room updated')
      navigate(`/rooms/${id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  })

  if (roomQuery.isLoading) return <LoadingOverlay visible />
  if (roomQuery.isError) {
    return <ErrorState message="Failed to load room" onRetry={roomQuery.refetch} />
  }

  return (
    <div>
      <PageHeader title="Edit room" description={`Room ${roomQuery.data?.number}`} />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <FormField label="Room type" error={errors.roomTypeId?.message} required>
              <Controller
                name="roomTypeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypesQuery.data?.map((rt) => (
                        <SelectItem key={rt.id} value={rt.id}>
                          {rt.name}
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
            <FormField label="Status" error={errors.status?.message} required>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={String(ROOM_STATUS_MAP[s])}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Price per night" error={errors.pricePerNight?.message} required>
              <Input type="number" step="0.01" {...register('pricePerNight')} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Textarea {...register('description')} rows={3} />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch
                checked={watch('isActive')}
                onCheckedChange={(v) => setValue('isActive', v)}
              />
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
