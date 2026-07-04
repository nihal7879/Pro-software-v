import { useMemo } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  PackagePlus,
  TrendingUp,
  GitCompareArrows,
  AlertTriangle,
  FileStack,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuthStore } from '@/store/authStore'
import { useProcurementStore } from '@/store/procurementStore'
import { useComparisonStore } from '@/store/comparisonStore'
import type { RequestStatus } from '@/types'
import { formatDate } from '@/lib/utils'

interface DocRow {
  docNo: string
  title: string
  typeLabel: string
  createdAt: string
  status: RequestStatus
}

export function DashboardPage() {
  const role = useAuthStore((s) => s.currentUser.role)
  const name = useAuthStore((s) => s.currentUser.name)
  const { newMaterials, rateRevisions } = useProcurementStore()
  const comparisons = useComparisonStore((s) => s.comparisons)

  const docs = useMemo<DocRow[]>(() => {
    const nm: DocRow[] = newMaterials.map((r) => ({
      docNo: r.formNo,
      title: r.lines[0]?.itemName ?? 'New Material',
      typeLabel: 'New Material',
      createdAt: r.createdAt,
      status: r.status,
    }))
    const rr: DocRow[] = rateRevisions.map((r) => ({
      docNo: r.formNo,
      title: r.lines[0]?.itemName ?? 'Rate Revision',
      typeLabel: 'Rate Revision',
      createdAt: r.createdAt,
      status: r.status,
    }))
    const cmp: DocRow[] = comparisons.map((c) => ({
      docNo: c.compNo,
      title: `${c.rows.length} item(s) · ${c.store}`,
      typeLabel: 'Comparison',
      createdAt: c.compDate,
      status: c.status,
    }))
    return [...nm, ...rr, ...cmp].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [newMaterials, rateRevisions, comparisons])

  const stats = useMemo(() => {
    const by = (s: RequestStatus) => docs.filter((d) => d.status === s).length
    return {
      total: docs.length,
      pendingHod: by('pending_hod'),
      pendingCeo: by('pending_ceo'),
      approved: by('approved'),
      rejected: by('rejected'),
    }
  }, [docs])

  const recent = docs.slice(0, 8)

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name.split(' ')[0]}`}
        description="Overview of procurement documents and approval status."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {role === 'purchaser' && (
          <>
            <StatCard label="Total Documents" value={stats.total} icon={FileStack} accent="blue" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="green" />
            <StatCard label="In Approval" value={stats.pendingHod + stats.pendingCeo} icon={Clock} accent="amber" />
            <StatCard label="Rejected" value={stats.rejected} icon={AlertTriangle} accent="red" />
          </>
        )}
        {role === 'hod' && (
          <>
            <StatCard label="Pending My Approval" value={stats.pendingHod} icon={Clock} accent="amber" hint="Awaiting HOD review" />
            <StatCard label="Forwarded to CEO" value={stats.pendingCeo} icon={ClipboardList} accent="blue" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="green" />
            <StatCard label="Total Documents" value={stats.total} icon={FileStack} accent="blue" />
          </>
        )}
        {role === 'ceo' && (
          <>
            <StatCard label="Pending Final Approval" value={stats.pendingCeo} icon={Clock} accent="amber" hint="Awaiting CEO sign-off" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="green" />
            <StatCard label="Rejected" value={stats.rejected} icon={AlertTriangle} accent="red" />
            <StatCard label="Total Documents" value={stats.total} icon={FileStack} accent="blue" />
          </>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="h-4 w-4 text-muted-foreground" /> Recent Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recent.map((d) => (
              <div key={d.docNo} className="flex items-center justify-between px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <TypeIcon label={d.typeLabel} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.docNo} · {d.typeLabel} · {formatDate(d.createdAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TypeIcon({ label }: { label: string }) {
  const Icon =
    label === 'New Material' ? PackagePlus : label === 'Rate Revision' ? TrendingUp : GitCompareArrows
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
      <Icon className="h-4 w-4" />
    </span>
  )
}
