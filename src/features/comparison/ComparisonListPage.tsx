import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useComparisonStore } from '@/store/comparisonStore'
import { vendorName } from '@/data/mockData'
import { formatDate } from '@/lib/utils'

export function ComparisonListPage() {
  const navigate = useNavigate()
  const comparisons = useComparisonStore((s) => s.comparisons)

  return (
    <div>
      <PageHeader
        title="Comparison List"
        description="Vendor price comparisons built in-app from dropdown selection — no Excel upload."
        actions={
          <Button onClick={() => navigate('/comparison/new')}>
            <Plus className="h-4 w-4" /> Create New
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Comp No</TableHead>
                <TableHead>Comp Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Awarded Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.store}</TableCell>
                  <TableCell className="font-mono text-xs">{c.compNo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(c.compDate)}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">{c.rows.length}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {c.selectedSupplierId ? vendorName(c.selectedSupplierId) : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/comparison/${c.id}`)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
