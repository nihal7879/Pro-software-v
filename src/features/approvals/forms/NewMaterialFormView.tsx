import type { NewMaterialRequest } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SignatureBlock } from '@/components/common/SignatureBlock'
import { FormField } from './FormField'
import { formatDate } from '@/lib/utils'

export function NewMaterialFormView({ doc }: { doc: NewMaterialRequest }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-secondary/30 p-3">
        <p className="text-xs font-semibold text-primary">Purchase Department · SH/PUR/NM/2020-21</p>
        <p className="text-sm font-semibold">New Material Approval Form</p>
        <p className="text-xs text-muted-foreground">
          {doc.formNo} · {formatDate(doc.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Supplier Name" value={doc.supplierName} />
        <FormField label="Department" value={doc.department} />
        <FormField label="Supplier Address" value={doc.supplierAddress} />
        <FormField label="Request By" value={doc.requestedBy} />
        <FormField label="Lead Time" value={doc.leadTime} />
        <FormField label="Charge / Non Charge" value={doc.chargeFlag} />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold">Item Details</p>
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Negotiated</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>GST%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.lines.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="max-w-[220px] font-medium">{l.itemName}</TableCell>
                  <TableCell>{l.unit}</TableCell>
                  <TableCell>{l.packSize}</TableCell>
                  <TableCell>{l.brand}</TableCell>
                  <TableCell>{l.qty}</TableCell>
                  <TableCell>{l.quoteRate.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{l.negotiatedRate.toFixed(2)}</TableCell>
                  <TableCell>{l.mrp.toFixed(2)}</TableCell>
                  <TableCell>{l.gst.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <FormField label="Remark" value={doc.remark} />

      <div className="flex flex-wrap items-end gap-8 pt-2">
        {doc.preparedSignature && (
          <div className="min-w-[180px]">
            <div className="flex h-16 items-end border-b border-foreground/40 pb-1">
              <img src={doc.preparedSignature} alt="Prepared signature" className="max-h-14 object-contain" />
            </div>
            <p className="mt-1 text-xs font-semibold">{doc.requestedBy}</p>
            <p className="text-[11px] text-muted-foreground">Requested By · Purchase Department</p>
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
