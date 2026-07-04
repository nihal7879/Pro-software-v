import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NewMaterialFormView } from '@/features/approvals/forms/NewMaterialFormView'
import { RemarksTimeline } from '@/features/approvals/RemarksTimeline'
import { useProcurementStore } from '@/store/procurementStore'

export function NewMaterialViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const doc = useProcurementStore((s) => s.newMaterials.find((n) => n.id === id))

  if (!doc) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'New Material', to: '/new-material' }, { label: 'Not found' }]} />
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Form not found.
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/new-material')}>Back to List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'New Material', to: '/new-material' }, { label: doc.formNo }]} />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/new-material')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">New Material Approval Form · {doc.formNo}</h1>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <Card>
        <CardContent className="p-5">
          <NewMaterialFormView doc={doc} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Approval Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <RemarksTimeline remarks={doc.remarks} />
        </CardContent>
      </Card>
    </div>
  )
}
