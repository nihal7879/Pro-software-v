import { useRef } from 'react'
import { Paperclip, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FileRef } from '@/types'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  value: FileRef | null
  onChange: (file: FileRef | null) => void
  accept?: string
  className?: string
}

/**
 * Attach a document (PDF/Excel/etc). Frontend-only: the file is kept as an
 * in-memory object URL so it can be viewed this session. Wire to real storage
 * (upload → returned URL) when the backend exists.
 */
export function FileUpload({ value, onChange, accept = '.pdf,.xls,.xlsx,.doc,.docx,.png,.jpg', className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange({ name: file.name, url: URL.createObjectURL(file) })
    e.target.value = ''
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onPick} />
      {value ? (
        <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-1 text-xs">
          <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
          <a href={value.url} target="_blank" rel="noreferrer" className="max-w-[140px] truncate hover:underline">
            {value.name}
          </a>
          {/* Replace with a different file */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-muted-foreground hover:text-primary"
            title="Replace file"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onChange(null)} className="text-muted-foreground hover:text-destructive" title="Remove file">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Paperclip className="h-3.5 w-3.5" /> Choose File
        </Button>
      )}
    </div>
  )
}
