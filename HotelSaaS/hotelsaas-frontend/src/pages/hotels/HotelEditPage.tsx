import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { FileUpload } from '@/components/forms/FileUpload'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function HotelEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const hotelQuery = useQuery({
    queryKey: ['hotels', id],
    queryFn: () => hotelsService.getById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (hotelQuery.data) {
      const h = hotelQuery.data
      reset({
        name: h.name,
        description: h.description ?? '',
        address: h.address,
        city: h.city,
        country: h.country,
        postalCode: h.postalCode ?? '',
        phone: h.phone ?? '',
        email: h.email ?? '',
        checkInTime: h.checkInTime,
        checkOutTime: h.checkOutTime,
        amenities: h.amenities.join(', '),
        isActive: h.isActive,
      })
    }
  }, [hotelQuery.data, reset])

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const hotel = await hotelsService.update(id!, {
        name: values.name,
        description: values.description,
        address: values.address,
        city: values.city,
        country: values.country,
        postalCode: values.postalCode,
        phone: values.phone,
        email: values.email || undefined,
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
        amenities: values.amenities
          ? values.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : undefined,
        isActive: values.isActive,
      })
      if (imageFiles.length > 0) {
        await hotelsService.uploadImages(id!, imageFiles)
      }
      return hotel
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel updated')
      navigate(`/hotels/${id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  })

  if (hotelQuery.isLoading) return <LoadingOverlay visible />
  if (hotelQuery.isError) {
    return <ErrorState message="Failed to load hotel" onRetry={hotelQuery.refetch} />
  }

  return (
    <div>
      <PageHeader title="Edit hotel" description="Update hotel property" />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
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
              <Input {...register('amenities')} />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch
                checked={watch('isActive')}
                onCheckedChange={(v) => setValue('isActive', v)}
              />
              <span className="text-sm font-medium">Active</span>
            </div>
            <FormField label="Upload images">
              <FileUpload
                value={imageFiles}
                onChange={setImageFiles}
                previews={hotelQuery.data?.images ?? []}
              />
            </FormField>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
