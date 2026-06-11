import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PagedResponse } from '@/types'
import type { LucideIcon } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data?: PagedResponse<T>
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  search?: string
  onSearchChange?: (value: string) => void
  page?: number
  onPageChange?: (page: number) => void
  filters?: ReactNode
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription: string
  onRetry?: () => void
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  errorMessage,
  search,
  onSearchChange,
  page = 1,
  onPageChange,
  filters,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onRetry,
}: DataTableProps<T>) {
  if (isError) {
    return <ErrorState message={errorMessage ?? 'Failed to load data'} onRetry={onRetry} />
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        {onSearchChange && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {filters && <div className="flex flex-wrap gap-2">{filters}</div>}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.items.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && data?.items.length === 0 && (
        <div className="p-6">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        </div>
      )}

      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages} ({data.totalCount} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasPrevious}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasNext}
              onClick={() => onPageChange?.(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
