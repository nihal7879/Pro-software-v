import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { FileUpload } from '@/components/common/FileUpload'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuotationStore } from '@/store/quotationStore'
import { vendors, vendorByCode } from '@/data/mockData'
import type { FileRef, SupplierQuote } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Row {
  supplierCode: string
  supplierName: string
  rate: number
  quoteDoc: FileRef | null
  negotiatedRate: number
  negotiatedDocument: FileRef | null
  isNew: boolean
}

export function QuotationNegotiatePage() {
  const { id, itemIndex } = useParams<{ id: string; itemIndex: string }>()
  const idx = Number(itemIndex)
  const navigate = useNavigate()
  const quotation = useQuotationStore((s) => (id ? s.getById(id) : undefined))
  const updateItemSuppliers = useQuotationStore((s) => s.updateItemSuppliers)
  const item = quotation?.items[idx]

  const supplierOptions: ComboOption[] = useMemo(
    () => vendors.map((v) => ({ value: v.code, label: v.name, hint: v.code })),
    [],
  )

  const [rows, setRows] = useState<Row[]>(() =>
    (item?.suppliers ?? []).map((sp) => ({
      supplierCode: sp.supplierCode,
      supplierName: sp.supplierName,
      rate: sp.rate,
      quoteDoc: sp.document,
      negotiatedRate: sp.negotiatedRate || sp.rate,
      negotiatedDocument: sp.negotiatedDocument,
      isNew: false,
    })),
  )

  if (!quotation || !item) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Quotation', to: '/rfq' }, { label: 'Negotiate' }]} />
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Quotation item not found.
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/rfq')}>Back to List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx2) => (idx2 === i ? { ...r, ...patch } : r)))
  const addRow = () =>
    setRows((prev) => [...prev, { supplierCode: '', supplierName: '', rate: 0, quoteDoc: null, negotiatedRate: 0, negotiatedDocument: null, isNew: true }])
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx2) => idx2 !== i))

  const save = () => {
    const suppliers: SupplierQuote[] = rows
      .filter((r) => r.supplierCode)
      .map((r) => {
        const vendor = vendorByCode(r.supplierCode)
        return {
          supplierId: vendor?.id ?? '',
          supplierCode: r.supplierCode,
          supplierName: vendor?.name ?? r.supplierName ?? r.supplierCode,
          rate: r.rate,
          negotiatedRate: r.negotiatedRate || 0,
          document: r.quoteDoc,
          negotiatedDocument: r.negotiatedDocument,
        }
      })
    updateItemSuppliers(quotation.id, idx, suppliers)
    navigate('/rfq')
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Quotation', to: '/rfq' }, { label: quotation.quoNo }, { label: 'Negotiate' }]} />

      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rfq')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Negotiate · {item.itemName}</h1>
          <p className="text-sm text-muted-foreground">
            {quotation.quoNo} · <span className="font-mono">{item.itemCode}</span> · {quotation.store} · {formatDate(quotation.quotDate)}
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Supplier Quotes for this Item</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter a negotiated rate and attach a negotiated document per supplier. Use “Add Supplier” to bring in another vendor.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4" /> Add Supplier
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quoted Rate</TableHead>
                  <TableHead>Quote Doc</TableHead>
                  <TableHead>Negotiated Rate</TableHead>
                  <TableHead>Negotiated Doc</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} className={r.isNew ? 'whitespace-nowrap bg-accent/30' : 'whitespace-nowrap'}>
                    <TableCell className="min-w-[200px]">
                      {r.isNew ? (
                        <Combobox options={supplierOptions} value={r.supplierCode} onChange={(c) => setRow(i, { supplierCode: c })} placeholder="Select supplier" allowCustom />
                      ) : (
                        <>
                          <span className="font-medium">{r.supplierName}</span>
                          <span className="ml-1 font-mono text-[11px] text-muted-foreground">{r.supplierCode}</span>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.isNew ? (
                        <Input type="number" step="0.01" className="h-8 w-24" value={r.rate || ''} onChange={(e) => setRow(i, { rate: Number(e.target.value) })} />
                      ) : (
                        formatCurrency(r.rate)
                      )}
                    </TableCell>
                    <TableCell>
                      {r.isNew ? (
                        <FileUpload value={r.quoteDoc} onChange={(f) => setRow(i, { quoteDoc: f })} />
                      ) : r.quoteDoc ? (
                        <a href={r.quoteDoc.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="h-8 w-28" value={r.negotiatedRate || ''} onChange={(e) => setRow(i, { negotiatedRate: Number(e.target.value) })} />
                    </TableCell>
                    <TableCell>
                      <FileUpload value={r.negotiatedDocument} onChange={(f) => setRow(i, { negotiatedDocument: f })} />
                    </TableCell>
                    <TableCell>
                      {r.isNew && (
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeRow(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/rfq')}>Cancel</Button>
        <Button onClick={save}><Save className="h-4 w-4" /> Save Negotiation</Button>
      </div>
    </div>
  )
}
