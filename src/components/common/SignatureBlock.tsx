import type { ApprovalRemark } from '@/types'
import { formatDate } from '@/lib/utils'

const roleTitles: Record<string, string> = {
  hod: 'Head of Department',
  ceo: 'Chief Executive Officer',
  purchaser: 'Purchase Department',
}

/**
 * Renders the captured e-signatures on an approval document, mirroring the
 * HOD / CEO signature panel on the hospital's printed forms.
 */
export function SignatureBlock({ remarks }: { remarks: ApprovalRemark[] }) {
  const signed = remarks.filter((r) => r.decision === 'approved')
  if (!signed.length) return null

  return (
    <div className="flex flex-wrap gap-8 pt-2">
      {signed.map((r, i) => (
        <div key={i} className="min-w-[180px]">
          <div className="flex h-16 items-end border-b border-foreground/40 pb-1">
            {r.signature ? (
              <img src={r.signature} alt={`${r.author} signature`} className="max-h-14 object-contain" />
            ) : (
              <span className="pb-1 font-[cursive] text-lg italic text-foreground/70">{r.author}</span>
            )}
          </div>
          <p className="mt-1 text-xs font-semibold">{r.author}</p>
          <p className="text-[11px] text-muted-foreground">{roleTitles[r.role]}</p>
          <p className="text-[11px] text-muted-foreground">Signed {formatDate(r.timestamp)}</p>
        </div>
      ))}
    </div>
  )
}
