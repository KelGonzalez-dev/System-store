import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { reservationsService } from '@/services/reservations.service'
import type { Reservation, ReservationStatus } from '@/types/entities'

interface ReservationActionsProps {
  reservation: Reservation
}

export function ReservationActions({ reservation }: ReservationActionsProps) {
  const queryClient = useQueryClient()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reservations'] })
    queryClient.invalidateQueries({ queryKey: ['reservations', reservation.id] })
  }

  const confirmMutation = useMutation({
    mutationFn: () => reservationsService.confirm(reservation.id),
    onSuccess: () => {
      toast.success('Reservation confirmed')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const cancelMutation = useMutation({
    mutationFn: () => reservationsService.cancel(reservation.id, cancelReason || undefined),
    onSuccess: () => {
      toast.success('Reservation cancelled')
      setCancelOpen(false)
      setCancelReason('')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const checkInMutation = useMutation({
    mutationFn: () => reservationsService.checkIn(reservation.id),
    onSuccess: () => {
      toast.success('Guest checked in')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const checkOutMutation = useMutation({
    mutationFn: () => reservationsService.checkOut(reservation.id),
    onSuccess: () => {
      toast.success('Guest checked out')
      invalidate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const status = reservation.status as ReservationStatus

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status === 'Pending' && (
          <Button
            size="sm"
            onClick={() => confirmMutation.mutate()}
            disabled={confirmMutation.isPending}
          >
            Confirm
          </Button>
        )}
        {(status === 'Pending' || status === 'Confirmed') && (
          <Button size="sm" variant="destructive" onClick={() => setCancelOpen(true)}>
            Cancel
          </Button>
        )}
        {status === 'Confirmed' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => checkInMutation.mutate()}
            disabled={checkInMutation.isPending}
          >
            Check in
          </Button>
        )}
        {status === 'CheckedIn' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => checkOutMutation.mutate()}
            disabled={checkOutMutation.isPending}
          >
            Check out
          </Button>
        )}
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel reservation</DialogTitle>
            <DialogDescription>
              This will cancel reservation {reservation.code}. Optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Reason (optional)</Label>
            <Input
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Cancellation reason"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep reservation
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              Cancel reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
