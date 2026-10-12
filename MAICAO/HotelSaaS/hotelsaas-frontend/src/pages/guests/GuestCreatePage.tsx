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
import { guestsService } from '@/services/guests.service'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  nationality: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function GuestCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      nationality: '',
    },
  })

  const mutation = useMutation({
    mutationFn: guestsService.create,
    onSuccess: (guest) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      toast.success('Guest created')
      navigate(`/guests/${guest.id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Create failed'),
  })

  return (
    <div>
      <PageHeader title="Create guest" description="Add a new guest profile" />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First name" error={errors.firstName?.message} required>
                <Input {...register('firstName')} />
              </FormField>
              <FormField label="Last name" error={errors.lastName?.message} required>
                <Input {...register('lastName')} />
              </FormField>
            </div>
            <FormField label="Email" error={errors.email?.message} required>
              <Input type="email" {...register('email')} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input {...register('phone')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Document type" error={errors.documentType?.message}>
                <Input placeholder="Passport, ID" {...register('documentType')} />
              </FormField>
              <FormField label="Document number" error={errors.documentNumber?.message}>
                <Input {...register('documentNumber')} />
              </FormField>
            </div>
            <FormField label="Nationality" error={errors.nationality?.message}>
              <Input {...register('nationality')} />
            </FormField>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create guest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
