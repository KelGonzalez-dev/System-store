import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay'
import { FormField } from '@/components/forms/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { paymentsService } from '@/services/payments.service'

const refundSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  reason: z.string().optional(),
})

type RefundFormValues = z.infer<typeof refundSchema>

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [refundOpen, setRefundOpen] = useState(false)

  const { data: payment, isLoading, isError, refetch } = useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsService.getById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: { amount: undefined, reason: '' },
  })

  const refundMutation = useMutation({
    mutationFn: (values: RefundFormValues) =>
      paymentsService.refund(id!, {
        amount: values.amount,
        reason: values.reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Refund processed')
      setRefundOpen(false)
      reset()
      refetch()
    },
    onError: (err: Error) => toast.error(err.message || 'Refund failed'),
  })

  if (isLoading) return <LoadingOverlay visible />
  if (isError || !payment) {
    return <ErrorState message="Failed to load payment" onRetry={refetch} />
  }

  const canRefund = payment.status === 'Completed' || payment.status === 'PartiallyRefunded'

  return (
    <div>
      <PageHeader
        title={`Payment ${payment.reservationCode}`}
        description={formatCurrency(payment.amount)}
        actions={
          canRefund && (
            <Button variant="destructive" onClick={() => setRefundOpen(true)}>
              Issue refund
            </Button>
          )
        }
      />

      <Card className="glass max-w-2xl rounded-2xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment details</CardTitle>
            <Badge variant="secondary">{payment.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Reservation</p>
              <p className="font-medium">
                <Link
                  to={`/reservations/${payment.reservationId}`}
                  className="text-primary hover:underline"
                >
                  {payment.reservationCode}
                </Link>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Method</p>
              <p className="font-medium">{payment.method}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refund amount</p>
              <p className="font-medium">{formatCurrency(payment.refundAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-medium">{payment.transactionId ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processed at</p>
              <p className="font-medium">
                {payment.processedAt ? formatDateTime(payment.processedAt) : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(payment.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue refund</DialogTitle>
            <DialogDescription>
              Refund payment for reservation {payment.reservationCode}. Leave amount empty
              for full refund.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((v) => refundMutation.mutate(v))}
            className="space-y-4"
          >
            <FormField label="Amount (optional)" error={errors.amount?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder={String(payment.amount)}
                {...register('amount')}
              />
            </FormField>
            <FormField label="Reason" error={errors.reason?.message}>
              <Textarea {...register('reason')} rows={3} />
            </FormField>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRefundOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={refundMutation.isPending}>
                {refundMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Process refund
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
