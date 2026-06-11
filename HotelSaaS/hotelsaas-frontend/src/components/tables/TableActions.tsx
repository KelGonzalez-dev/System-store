import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TableActionsProps {
  viewHref?: string
  editHref?: string
  onDelete?: () => void
  extraActions?: Array<{ label: string; onClick: () => void }>
}

export function TableActions({
  viewHref,
  editHref,
  onDelete,
  extraActions,
}: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link to={viewHref} className="flex cursor-pointer items-center gap-2">
              <Eye className="h-4 w-4" /> View
            </Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link to={editHref} className="flex cursor-pointer items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
        )}
        {extraActions?.map((action) => (
          <DropdownMenuItem key={action.label} onClick={action.onClick}>
            {action.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
