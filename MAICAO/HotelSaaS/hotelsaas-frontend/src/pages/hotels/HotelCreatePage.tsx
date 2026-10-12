import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { hotelsService } from '@/services/hotels.service'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function HotelCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
      email: '',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      amenities: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      hotelsService.create({
        ...values,
        email: values.email || undefined,
        amenities: values.amenities
          ? values.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : undefined,
      }),
    onSuccess: (hotel) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel created')
      navigate(`/hotels/${hotel.id}/edit`)
    },
    onError: (err: Error) => toast.error(err.message || 'Create failed'),
  })

  return (
    <div>
      <PageHeader title="Create hotel" description="Add a new hotel property" />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <FormField label="Name" error={errors.name?.message} required>
              <Input {...register('name')} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Textarea {...register('description')} rows={3} />
            </FormField>
            <FormField label="Address" error={errors.address?.message} required>
              <Input {...register('address')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="City" error={errors.city?.message} required>
                <Input {...register('city')} />
              </FormField>
              <FormField label="Country" error={errors.country?.message} required>
                <Input {...register('country')} />
              </FormField>
            </div>
            <FormField label="Postal code" error={errors.postalCode?.message}>
              <Input {...register('postalCode')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone" error={errors.phone?.message}>
                <Input {...register('phone')} />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register('email')} />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Check-in time" error={errors.checkInTime?.message}>
                <Input type="time" {...register('checkInTime')} />
              </FormField>
              <FormField label="Check-out time" error={errors.checkOutTime?.message}>
                <Input type="time" {...register('checkOutTime')} />
              </FormField>
            </div>
            <FormField label="Amenities (comma-separated)" error={errors.amenities?.message}>
              <Input placeholder="WiFi, Pool, Parking" {...register('amenities')} />
            </FormField>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create hotel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
