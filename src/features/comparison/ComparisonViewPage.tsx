import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ComparisonMatrix } from './ComparisonMatrix'
import { RemarksTimeline } from '@/features/approvals/RemarksTimeline'
import { useComparisonStore } from '@/store/comparisonStore'
import { vendorName } from '@/data/mockData'
import { formatDate } from '@/lib/utils'

export function ComparisonViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const comp = useComparisonStore((s) => (id ? s.getById(id) : undefined))

  if (!comp) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Comparison', to: '/comparison' }, { label: 'Not found' }]} />
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Comparison not found.
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/comparison')}>Back to List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Comparison', to: '/comparison' }, { label: comp.compNo }]} />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/comparison')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">Item Comparison · {comp.compNo}</h1>
        </div>
        <StatusBadge status={comp.status} />
      </div>

      <Card className="mb-4">
        <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          <Meta label="Comp No" value={comp.compNo} />
          <Meta label="Comp Date" value={formatDate(comp.compDate)} />
          <Meta label="Store Name" value={comp.store} />
          <Meta
            label="Awarded Vendor"
            value={comp.selectedSupplierId ? vendorName(comp.selectedSupplierId) : 'To be decided'}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Rate Comparison Matrix</CardTitle>
          <p className="text-xs text-muted-foreground">
            Vendor rates are shown as entered. The vendor is selected by the HOD and CEO during approval.
          </p>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <ComparisonMatrix comp={comp} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval History</CardTitle>
        </CardHeader>
        <CardContent>
          <RemarksTimeline remarks={comp.remarks} />
        </CardContent>
      </Card>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}
