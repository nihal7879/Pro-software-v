import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ComboOption } from '@/components/ui/combobox'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuthStore } from '@/store/authStore'
import { useProcurementStore, type ApprovalKind } from '@/store/procurementStore'
import { useComparisonStore } from '@/store/comparisonStore'
import { vendors, vendorName } from '@/data/mockData'
import type { ApprovalRemark, RequestStatus } from '@/types'
import { NewMaterialFormView } from './forms/NewMaterialFormView'
import { RateRevisionFormView } from './forms/RateRevisionFormView'
import { ComparisonMatrix } from '@/features/comparison/ComparisonMatrix'
import { RemarksTimeline } from './RemarksTimeline'
import { ApprovalDecisionForm } from './ApprovalDecisionForm'
import { formatDate } from '@/lib/utils'

const typeLabel: Record<ApprovalKind, string> = {
  newMaterial: 'New Material',
  rateRevision: 'Rate Revision',
  comparison: 'Comparison',
}

export function ApprovalDetailPage() {
  const { kind, id } = useParams<{ kind: ApprovalKind; id: string }>()
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.currentUser.role)
  const { newMaterials, rateRevisions, decide } = useProcurementStore()
  const comparisonStore = useComparisonStore()

  const doc =
    kind === 'newMaterial'
      ? newMaterials.find((r) => r.id === id)
      : kind === 'rateRevision'
        ? rateRevisions.find((r) => r.id === id)
        : comparisonStore.comparisons.find((r) => r.id === id)

  const comparison = kind === 'comparison' && doc && 'compNo' in doc ? doc : null

  const vendorOptions = useMemo<ComboOption[]>(
    () =>
      comparison
        ? comparison.supplierIds.map((sid) => ({ value: sid, label: vendorName(sid) }))
        : vendors.map((v) => ({ value: v.id, label: v.name })),
    [comparison],
  )

  if (!kind || !doc) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Approvals', to: '/approvals' }, { label: 'Not found' }]} />
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            This document could not be found.
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/approvals')}>
                Back to Approvals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const docNo = 'compNo' in doc ? doc.compNo : doc.formNo
  const actionableStatus: RequestStatus = role === 'hod' ? 'pending_hod' : 'pending_ceo'
  const canAct = doc.status === actionableStatus

  const handleDecide = (remark: ApprovalRemark, selectedVendorId?: string) => {
    if (kind === 'comparison') {
      comparisonStore.decide(doc.id, remark, selectedVendorId ?? '')
    } else {
      decide(kind, doc.id, remark)
    }
    navigate('/approvals')
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: role === 'ceo' ? 'Final Approvals' : 'Approvals', to: '/approvals' },
          { label: docNo },
        ]}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/approvals')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {typeLabel[kind]} · {docNo}
            </h1>
            <p className="text-sm text-muted-foreground">Review the document and record your decision.</p>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            {kind === 'newMaterial' && 'supplierAddress' in doc && <NewMaterialFormView doc={doc} />}
            {kind === 'rateRevision' && 'brandName' in doc && <RateRevisionFormView doc={doc} />}
            {comparison && (
              <div className="space-y-4">
                <div className="rounded-md border border-border bg-secondary/30 p-3">
                  <p className="text-sm font-semibold">Item Comparison</p>
                  <p className="text-xs text-muted-foreground">
                    {comparison.compNo} · {comparison.store} · {formatDate(comparison.compDate)}
                  </p>
                  {comparison.remark && (
                    <p className="mt-1 text-xs text-muted-foreground">Remark: {comparison.remark}</p>
                  )}
                </div>
                <ComparisonMatrix comp={comparison} />
                {comparison.selectedSupplierId && (
                  <p className="text-sm">
                    Awarded vendor:{' '}
                    <span className="font-semibold text-primary">
                      {vendorName(comparison.selectedSupplierId)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <RemarksTimeline remarks={doc.remarks} />
            </CardContent>
          </Card>

          {canAct ? (
            <ApprovalDecisionForm
              onDecide={handleDecide}
              vendorOptions={comparison ? vendorOptions : undefined}
              defaultVendorId={comparison?.selectedSupplierId || undefined}
            />
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-xs text-muted-foreground">
                This document is not pending your approval.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
