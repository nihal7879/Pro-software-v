import type { RateRevision } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SignatureBlock } from '@/components/common/SignatureBlock'
import { FormField } from './FormField'
import { formatDate } from '@/lib/utils'

function diffPct(from: number, to: number): number {
  if (!from) return 0
  return ((to - from) / from) * 100
}

export function RateRevisionFormView({ doc }: { doc: RateRevision }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-secondary/30 p-3">
        <p className="text-sm font-semibold">Rate Revision Form</p>
        <p className="text-xs text-muted-foreground">
          {doc.formNo} · {formatDate(doc.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FormField label="Supplier" value={doc.supplierName} />
        <FormField label="Brand Name" value={doc.brandName} />
        <FormField label="User Department" value={doc.userDepartment} />
        <FormField label="Store" value={doc.store} />
        <FormField label="Chargeable Flag" value={doc.chargeFlag} />
        <FormField label="Prepared By" value={doc.preparedBy} />
        <FormField label="Prepared Department" value="Purchase Department" />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold">Item Details</p>
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Existing Rate</TableHead>
                <TableHead>Quoted Rate</TableHead>
                <TableHead>Revised Cost Price</TableHead>
                <TableHead>Difference Rate(%)</TableHead>
                <TableHead>Existing MRP</TableHead>
                <TableHead>Revised MRP</TableHead>
                <TableHead>Difference MRP(%)</TableHead>
                <TableHead>Last Rate Revised on</TableHead>
                <TableHead>Annual Consumption</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.lines.map((l, i) => {
                const dRate = diffPct(l.existingRate, l.revisedCostPrice)
                const dMrp = diffPct(l.existingMrp, l.revisedMrp)
                return (
                  <TableRow key={i} className="whitespace-nowrap">
                    <TableCell className="font-mono text-xs">{l.itemCode}</TableCell>
                    <TableCell className="max-w-[180px] font-medium">{l.itemName}</TableCell>
                    <TableCell>{l.existingRate.toFixed(2)}</TableCell>
                    <TableCell>{l.quotedRate.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">{l.revisedCostPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={dRate > 0 ? 'warning' : 'success'}>{dRate.toFixed(2)}%</Badge>
                    </TableCell>
                    <TableCell>{l.existingMrp.toFixed(2)}</TableCell>
                    <TableCell>{l.revisedMrp.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={dMrp > 0 ? 'warning' : 'success'}>{dMrp.toFixed(2)}%</Badge>
                    </TableCell>
                    <TableCell>{l.lastRevisedOn ? formatDate(l.lastRevisedOn) : '—'}</TableCell>
                    <TableCell>{l.annualConsumption}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <FormField label="Reason" value={doc.reason} />
      <FormField label="Remark" value={doc.remark} />
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">HOD Remark</p>
          <p>{doc.remarks.find((r) => r.role === 'hod')?.remark || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">CEO Remark</p>
          <p>{doc.remarks.find((r) => r.role === 'ceo')?.remark || '—'}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-8 pt-2">
        {doc.preparedSignature && (
          <div className="min-w-[180px]">
            <div className="flex h-16 items-end border-b border-foreground/40 pb-1">
              <img src={doc.preparedSignature} alt="Prepared signature" className="max-h-14 object-contain" />
            </div>
            <p className="mt-1 text-xs font-semibold">{doc.preparedBy}</p>
            <p className="text-[11px] text-muted-foreground">Prepared By · Purchase Department</p>
          </div>
        )}
        <SignatureBlock remarks={doc.remarks} />
      </div>

      <div className="pt-1">
        {doc.status === 'approved' ? (
          <Badge variant="success">Approved</Badge>
        ) : doc.status === 'rejected' ? (
          <Badge variant="danger">Not Approved</Badge>
        ) : (
          <Badge variant="warning">Pending Approval</Badge>
        )}
      </div>
    </div>
  )
}
