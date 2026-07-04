import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PackagePlus, TrendingUp, GitCompareArrows, Inbox } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/authStore'
import { useProcurementStore, type ApprovalKind } from '@/store/procurementStore'
import { useComparisonStore } from '@/store/comparisonStore'
import { vendorName } from '@/data/mockData'
import type { RequestStatus } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

interface QueueItem {
  kind: ApprovalKind
  id: string
  docNo: string
  title: string
  department: string
  createdAt: string
  status: RequestStatus
  value: number | null
  typeLabel: string
}

const kindIcon = {
  newMaterial: PackagePlus,
  rateRevision: TrendingUp,
  comparison: GitCompareArrows,
} as const

export function ApprovalsPage() {
  const role = useAuthStore((s) => s.currentUser.role)
  const navigate = useNavigate()
  const { newMaterials, rateRevisions } = useProcurementStore()
  const comparisons = useComparisonStore((s) => s.comparisons)

  const queue = useMemo<QueueItem[]>(() => {
    const fromNm: QueueItem[] = newMaterials.map((r) => ({
      kind: 'newMaterial',
      id: r.id,
      docNo: r.formNo,
      title: r.lines[0]?.itemName ?? 'New Material',
      department: r.department,
      createdAt: r.createdAt,
      status: r.status,
      value: r.lines.reduce((s, l) => s + l.qty * l.negotiatedRate, 0),
      typeLabel: 'New Material',
    }))
    const fromRr: QueueItem[] = rateRevisions.map((r) => ({
      kind: 'rateRevision',
      id: r.id,
      docNo: r.formNo,
      title: r.lines[0]?.itemName ?? 'Rate Revision',
      department: r.userDepartment,
      createdAt: r.createdAt,
      status: r.status,
      value: null,
      typeLabel: 'Rate Revision',
    }))
    const fromCmp: QueueItem[] = comparisons.map((c) => ({
      kind: 'comparison',
      id: c.id,
      docNo: c.compNo,
      title: c.selectedSupplierId
        ? `${c.rows.length} item(s) · Selected: ${vendorName(c.selectedSupplierId)}`
        : `${c.rows.length} item(s) · ${c.supplierIds.length} vendors`,
      department: c.store,
      createdAt: c.compDate,
      status: c.status,
      value: null,
      typeLabel: 'Comparison',
    }))
    return [...fromNm, ...fromRr, ...fromCmp].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
  }, [newMaterials, rateRevisions, comparisons])

  const actionableStatus: RequestStatus = role === 'hod' ? 'pending_hod' : 'pending_ceo'
  const pending = queue.filter((q) => q.status === actionableStatus)
  const history = queue.filter((q) => q.status !== actionableStatus)

  const title = role === 'ceo' ? 'Pending Final Approvals' : 'Pending Approvals'
  const description =
    role === 'ceo'
      ? 'Review and provide final sign-off on requests forwarded by the HOD.'
      : 'Review purchaser requests, sign to approve, or reject with remarks.'

  const renderList = (list: QueueItem[]) =>
    list.length ? (
      <div className="space-y-2">
        {list.map((q) => {
          const Icon = kindIcon[q.kind]
          return (
            <Card key={q.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.docNo} · {q.typeLabel} · {q.department} · {formatDate(q.createdAt)}
                    {q.value !== null && ` · ${formatCurrency(q.value)}`}
                  </p>
                </div>
                <StatusBadge status={q.status} />
                <Button size="sm" onClick={() => navigate(`/approvals/${q.kind}/${q.id}`)}>
                  {q.status === actionableStatus ? 'Review & Sign' : 'View'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
        <Inbox className="h-8 w-8" />
        <p className="text-sm">Nothing here right now.</p>
      </div>
    )

  return (
    <div>
      <PageHeader title={title} description={description} />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge variant="danger" className="ml-2">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderList(pending)}</TabsContent>
        <TabsContent value="history">{renderList(history)}</TabsContent>
      </Tabs>
    </div>
  )
}
