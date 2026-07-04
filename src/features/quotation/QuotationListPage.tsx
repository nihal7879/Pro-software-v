import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Handshake, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination, TablePagination } from '@/components/common/TablePagination'
import { useQuotationStore } from '@/store/quotationStore'
import type { Quotation, QuotationItem, SupplierQuote } from '@/types'
import { formatDate } from '@/lib/utils'

interface FlatRow {
  q: Quotation
  item: QuotationItem
  itemIndex: number
  supplier: SupplierQuote
  firstOfQuotation: boolean
  firstOfItem: boolean
}

export function QuotationListPage() {
  const navigate = useNavigate()
  const quotations = useQuotationStore((s) => s.quotations)
  const [search, setSearch] = useState('')

  const rows = useMemo<FlatRow[]>(() => {
    const flat: FlatRow[] = []
    for (const q of quotations) {
      let firstOfQuotation = true
      q.items.forEach((item, itemIndex) => {
        item.suppliers.forEach((supplier, sIdx) => {
          flat.push({
            q, item, itemIndex, supplier,
            firstOfQuotation,
            firstOfItem: sIdx === 0,
          })
          firstOfQuotation = false
        })
      })
    }
    const s = search.trim().toLowerCase()
    if (!s) return flat
    return flat.filter(
      (r) =>
        r.q.quoNo.toLowerCase().includes(s) ||
        r.q.store.toLowerCase().includes(s) ||
        r.item.itemName.toLowerCase().includes(s) ||
        r.item.itemCode.toLowerCase().includes(s) ||
        r.supplier.supplierName.toLowerCase().includes(s),
    )
  }, [quotations, search])

  const pg = usePagination(rows, 10)

  return (
    <div>
      <PageHeader
        title="Quotation List"
        description="Each item can hold multiple supplier quotes with their own documents. Negotiate per item."
        actions={
          <Button onClick={() => navigate('/rfq/new')}>
            <Plus className="h-4 w-4" /> Create New
          </Button>
        }
      />

      <div className="mb-3 relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotations..." className="pl-8" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Quo No</TableHead>
                  <TableHead>Quot Date</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Negotiated</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Negotiated File</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pg.pageData.map((r, idx) => (
                  <TableRow key={`${r.q.id}-${r.itemIndex}-${idx}`} className="whitespace-nowrap">
                    <TableCell>{r.firstOfQuotation ? r.q.store : ''}</TableCell>
                    <TableCell className="font-mono text-xs">{r.firstOfQuotation ? r.q.quoNo : ''}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.firstOfQuotation ? formatDate(r.q.quotDate) : ''}</TableCell>
                    <TableCell className="font-mono text-xs">{r.firstOfItem ? r.item.itemCode : ''}</TableCell>
                    <TableCell className="font-medium">{r.firstOfItem ? r.item.itemName : ''}</TableCell>
                    <TableCell className="font-mono text-xs">{r.supplier.supplierCode}</TableCell>
                    <TableCell>{r.supplier.supplierName}</TableCell>
                    <TableCell>{r.supplier.rate ? r.supplier.rate.toFixed(2) : '—'}</TableCell>
                    <TableCell className={r.supplier.negotiatedRate ? 'font-semibold text-emerald-600' : ''}>
                      {r.supplier.negotiatedRate ? r.supplier.negotiatedRate.toFixed(2) : '—'}
                    </TableCell>
                    <TableCell>
                      {r.supplier.document ? (
                        <a href={r.supplier.document.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          <FileText className="h-3.5 w-3.5" /> View
                        </a>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {r.supplier.negotiatedDocument ? (
                        <a href={r.supplier.negotiatedDocument.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          <FileText className="h-3.5 w-3.5" /> View
                        </a>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {r.firstOfQuotation && (
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/rfq/${r.q.id}/edit`)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        )}
                        {r.firstOfItem && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/rfq/${r.q.id}/negotiate/${r.itemIndex}`)}>
                            <Handshake className="h-4 w-4" /> Negotiate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-sm text-muted-foreground">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {rows.length > 0 && <TablePagination api={pg} />}
        </CardContent>
      </Card>
    </div>
  )
}
