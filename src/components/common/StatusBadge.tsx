import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { RequestStatus } from '@/types'

const map: Record<RequestStatus, { label: string; variant: BadgeProps['variant'] }> = {
  draft: { label: 'Draft', variant: 'neutral' },
  pending_hod: { label: 'Pending HOD', variant: 'warning' },
  pending_ceo: { label: 'Pending CEO', variant: 'info' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = map[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
