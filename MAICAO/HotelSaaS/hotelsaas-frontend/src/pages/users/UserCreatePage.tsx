import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLES } from '@/constants'
import { usersService } from '@/services/users.service'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'Select at least one role'),
})

type FormValues = z.infer<typeof schema>

const ROLE_OPTIONS = Object.values(ROLES)

export function UserCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      roleIds: [],
    },
  })

  const mutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created')
      navigate(`/users/${user.id}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Create failed'),
  })

  return (
    <div>
      <PageHeader title="Create user" description="Add a new system user" />

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
            <FormField label="Password" error={errors.password?.message} required>
              <Input type="password" {...register('password')} />
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
                Create user
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
