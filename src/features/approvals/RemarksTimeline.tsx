import { Check, X } from 'lucide-react'
import type { ApprovalRemark } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const roleLabel: Record<string, string> = {
  hod: 'HOD',
  ceo: 'CEO',
  purchaser: 'Purchaser',
}

export function RemarksTimeline({ remarks }: { remarks: ApprovalRemark[] }) {
  if (!remarks.length) {
    return <p className="text-xs text-muted-foreground">No remarks yet.</p>
  }
  return (
    <ol className="space-y-2">
      {remarks.map((r, i) => (
        <li key={i} className="flex gap-2 text-sm">
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white',
              r.decision === 'approved' ? 'bg-emerald-500' : 'bg-red-500',
            )}
          >
            {r.decision === 'approved' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          </span>
          <div>
            <p className="text-xs">
              <span className="font-semibold">{roleLabel[r.role]}</span> · {r.author} ·{' '}
              <span className={r.decision === 'approved' ? 'text-emerald-600' : 'text-red-600'}>
                {r.decision}
              </span>{' '}
              <span className="text-muted-foreground">on {formatDate(r.timestamp)}</span>
            </p>
            {r.remark && <p className="text-xs text-muted-foreground">{r.remark}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
