import { ImagePlus, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  value?: File[]
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  previews?: string[]
}

export function FileUpload({
  value = [],
  onChange,
  accept = 'image/*',
  multiple = true,
  maxFiles = 5,
  previews = [],
}: FileUploadProps) {
  const [localPreviews, setLocalPreviews] = useState<string[]>([])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const newFiles = Array.from(files).slice(0, maxFiles - value.length)
      onChange([...value, ...newFiles])
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setLocalPreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
    [maxFiles, onChange, value],
  )

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    setLocalPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const allPreviews = [...previews, ...localPreviews]

  return (
    <div className="space-y-4">
      <label
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-muted/50',
        )}
      >
        <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
        <span className="text-sm font-medium">Click to upload images</span>
        <span className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {allPreviews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {allPreviews.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeFile(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
