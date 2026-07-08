import type { Comparison } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { vendorName } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * Read-only vendor rate matrix (items × vendors). Highlights the column of the
 * vendor selected by the HOD / CEO — not an automatic "lowest price" choice.
 */
export function ComparisonMatrix({ comp }: { comp: Comparison }) {
  const rateFor = (row: Comparison['rows'][number], supplierId: string) =>
    row.cells.find((c) => c.supplierId === supplierId)?.rate ?? null

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Item Name</TableHead>
            <TableHead className="min-w-[160px]">Alternate Item</TableHead>
            {comp.supplierIds.map((sid) => (
              <TableHead
                key={sid}
                className={cn('whitespace-nowrap', sid === comp.selectedSupplierId && 'text-primary')}
              >
                {vendorName(sid)}
                {sid === comp.selectedSupplierId && ' ✓'}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {comp.rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{row.itemName}</TableCell>
              <TableCell className="text-muted-foreground">{row.alternateItem || '—'}</TableCell>
              {comp.supplierIds.map((sid) => {
                const rate = rateFor(row, sid)
                const isSelected = sid === comp.selectedSupplierId
                return (
                  <TableCell key={sid} className={cn(isSelected && 'bg-accent font-semibold text-accent-foreground')}>
                    {rate !== null ? formatCurrency(rate) : '—'}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
