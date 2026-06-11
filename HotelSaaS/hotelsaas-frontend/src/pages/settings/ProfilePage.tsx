import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { FormField } from '@/components/forms/FormField'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'
import { usersService } from '@/services/users.service'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ProfilePage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersService.getProfile(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  })

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        firstName: profileQuery.data.firstName,
        lastName: profileQuery.data.lastName,
        phone: profileQuery.data.phone ?? '',
      })
    }
  }, [profileQuery.data, reset])

  const updateMutation = useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated')
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  })

  const avatarMutation = useMutation({
    mutationFn: usersService.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Avatar updated')
    },
    onError: (err: Error) => toast.error(err.message || 'Upload failed'),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) avatarMutation.mutate(file)
  }

  if (profileQuery.isLoading) return <LoadingOverlay visible />
  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState message="Failed to load profile" onRetry={profileQuery.refetch} />
  }

  const profile = profileQuery.data

  return (
    <div>
      <PageHeader title="Profile" description="Manage your account information" />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardContent className="pt-6">
          <div className="mb-8 flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xl">
                {getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                variant="outline"
                disabled={avatarMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change avatar
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((v) => updateMutation.mutate(v))}
            className="space-y-4"
          >
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
            <div className="flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold"
                >
                  {role}
                </span>
              ))}
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
