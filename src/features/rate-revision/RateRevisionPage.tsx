import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/common/StatusBadge'
import { usePagination, TablePagination } from '@/components/common/TablePagination'
import { useProcurementStore } from '@/store/procurementStore'
import { formatDate } from '@/lib/utils'

export function RateRevisionPage() {
  const navigate = useNavigate()
  const rateRevisions = useProcurementStore((s) => s.rateRevisions)
  const pg = usePagination(rateRevisions, 10)

  return (
    <div>
      <PageHeader
        title="Rate Revision Form"
        description="Supplier rate-revisions (SH-RR) submitted for HOD → CEO approval."
        actions={
          <Button onClick={() => navigate('/rate-revision/new')}>
            <Plus className="h-4 w-4" /> Create New
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Submitted Revisions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form No</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pg.pageData.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.formNo}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-sm font-medium">
                    {r.lines.map((l) => l.itemName).join(', ')}
                  </TableCell>
                  <TableCell className="text-sm">{r.supplierName}</TableCell>
                  <TableCell className="text-sm">{r.store || r.userDepartment}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/rate-revision/${r.id}`)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rateRevisions.length && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                    No revisions submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {rateRevisions.length > 0 && <TablePagination api={pg} />}
        </CardContent>
      </Card>
    </div>
  )
}
