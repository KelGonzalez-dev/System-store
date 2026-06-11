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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLES } from '@/constants'
import { usersService } from '@/services/users.service'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'Select at least one role'),
})

type FormValues = z.infer<typeof schema>

const ROLE_OPTIONS = Object.values(ROLES)

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', phone: '', roleIds: [] },
  })

  useEffect(() => {
    if (userQuery.data) {
      reset({
        firstName: userQuery.data.firstName,
        lastName: userQuery.data.lastName,
        phone: userQuery.data.phone ?? '',
        roleIds: userQuery.data.roles,
      })
    }
  }, [userQuery.data, reset])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => usersService.update(id!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated')
      navigate(`/users/${id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  })

  if (userQuery.isLoading) return <LoadingOverlay visible />
  if (userQuery.isError) {
    return <ErrorState message="Failed to load user" onRetry={userQuery.refetch} />
  }

  return (
    <div>
      <PageHeader title="Edit user" description="Update user information" />

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
            <FormField label="Phone" error={errors.phone?.message}>
              <Input {...register('phone')} />
            </FormField>
            <FormField label="Roles" error={errors.roleIds?.message} required>
              <Controller
                name="roleIds"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((role) => (
                      <div key={role} className="flex items-center gap-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={field.value.includes(role)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, role]
                                : field.value.filter((r) => r !== role),
                            )
                          }}
                        />
                        <Label htmlFor={`role-${role}`} className="font-normal">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </FormField>
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
