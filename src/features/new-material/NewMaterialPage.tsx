import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NewMaterialFormView } from '@/features/approvals/forms/NewMaterialFormView'
import { RemarksTimeline } from '@/features/approvals/RemarksTimeline'
import { useProcurementStore } from '@/store/procurementStore'
import { formatDate } from '@/lib/utils'

export function NewMaterialPage() {
  const navigate = useNavigate()
  const newMaterials = useProcurementStore((s) => s.newMaterials)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const preview = newMaterials.find((n) => n.id === previewId) ?? null

  return (
    <div>
      <PageHeader
        title="New Material Approval Form"
        description="New-material requests (SH/PUR/NM) submitted for HOD → CEO e-signature approval."
        actions={
          <Button onClick={() => navigate('/new-material/new')}>
            <Plus className="h-4 w-4" /> Create New
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Submitted Forms</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form No</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newMaterials.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-xs">{n.formNo}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-sm font-medium">
                    {n.lines.map((l) => l.itemName).join(', ')}
                  </TableCell>
                  <TableCell className="text-sm">{n.supplierName}</TableCell>
                  <TableCell className="text-sm">{n.department}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={n.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewId(n.id)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!newMaterials.length && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                    No forms submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!previewId} onOpenChange={(o) => !o && setPreviewId(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Material Approval Form</DialogTitle>
          </DialogHeader>
          {preview && (
            <>
              <NewMaterialFormView doc={preview} />
              <div className="mt-2 space-y-2 border-t border-border pt-3">
                <p className="text-xs font-semibold">Approval Progress</p>
                <RemarksTimeline remarks={preview.remarks} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
