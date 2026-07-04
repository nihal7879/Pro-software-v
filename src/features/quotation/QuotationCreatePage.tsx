import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Save, Package } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { FileUpload } from '@/components/common/FileUpload'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuotationStore } from '@/store/quotationStore'
import { items, stores, vendors, vendorByCode } from '@/data/mockData'
import type { FileRef, QuotationItem, SupplierQuote } from '@/types'

interface DraftSupplier {
  supplierCode: string
  rate: number
  document: FileRef | null
}
interface DraftItem {
  itemCode: string
  itemName: string
  suppliers: DraftSupplier[]
}

const emptySupplier = (): DraftSupplier => ({ supplierCode: '', rate: 0, document: null })
const emptyItem = (): DraftItem => ({ itemCode: '', itemName: '', suppliers: [emptySupplier()] })

export function QuotationCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const create = useQuotationStore((s) => s.create)
  const update = useQuotationStore((s) => s.update)
  const existing = useQuotationStore((s) => (id ? s.getById(id) : undefined))
  const isEdit = Boolean(id && existing)

  const [quotDate, setQuotDate] = useState(existing?.quotDate ?? '')
  const [store, setStore] = useState(existing?.store ?? '')
  const [remark, setRemark] = useState(existing?.remark ?? '')
  const [quoteFile, setQuoteFile] = useState<FileRef | null>(existing?.quoteFile ?? null)
  const [draftItems, setDraftItems] = useState<DraftItem[]>(
    existing
      ? existing.items.map((it) => ({
          itemCode: it.itemCode,
          itemName: it.itemName,
          suppliers: it.suppliers.map((sp) => ({ supplierCode: sp.supplierCode, rate: sp.rate, document: sp.document })),
        }))
      : [emptyItem()],
  )
  const [error, setError] = useState('')

  const itemOptions: ComboOption[] = useMemo(
    () => items.map((i) => ({ value: i.code, label: i.name, hint: i.code })),
    [],
  )
  const supplierOptions: ComboOption[] = useMemo(
    () => vendors.map((v) => ({ value: v.code, label: v.name, hint: v.code })),
    [],
  )
  const storeOptions: ComboOption[] = useMemo(() => stores.map((s) => ({ value: s, label: s })), [])

  const setItem = (i: number, patch: Partial<DraftItem>) =>
    setDraftItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))

  const pickItem = (i: number, code: string) => {
    const found = items.find((x) => x.code === code)
    if (found) setItem(i, { itemCode: found.code, itemName: found.name })
    else setItem(i, { itemCode: code, itemName: code })
  }

  const setSupplier = (i: number, s: number, patch: Partial<DraftSupplier>) =>
    setDraftItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, suppliers: it.suppliers.map((sp, sIdx) => (sIdx === s ? { ...sp, ...patch } : sp)) } : it,
      ),
    )
  const addSupplier = (i: number) =>
    setDraftItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, suppliers: [...it.suppliers, emptySupplier()] } : it)))
  const removeSupplier = (i: number, s: number) =>
    setDraftItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, suppliers: it.suppliers.length > 1 ? it.suppliers.filter((_, sIdx) => sIdx !== s) : it.suppliers } : it,
      ),
    )

  const addItem = () => setDraftItems((prev) => [...prev, emptyItem()])
  const removeItem = (i: number) =>
    setDraftItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))

  const save = () => {
    if (!quotDate) return setError('Select the quotation date.')
    if (!store) return setError('Select a store.')
    const outItems: QuotationItem[] = []
    for (const it of draftItems) {
      if (!it.itemName) continue
      const suppliers: SupplierQuote[] = it.suppliers
        .filter((sp) => sp.supplierCode)
        .map((sp) => {
          const vendor = vendorByCode(sp.supplierCode)
          // Preserve negotiation data on edit (match by item code + supplier code).
          const prior = existing?.items
            .find((pi) => pi.itemCode === it.itemCode)
            ?.suppliers.find((ps) => ps.supplierCode === sp.supplierCode)
          return {
            supplierId: vendor?.id ?? '',
            supplierCode: sp.supplierCode,
            supplierName: vendor?.name ?? sp.supplierCode,
            rate: sp.rate,
            negotiatedRate: prior?.negotiatedRate ?? 0,
            document: sp.document,
            negotiatedDocument: prior?.negotiatedDocument ?? null,
          }
        })
      if (suppliers.length) outItems.push({ itemCode: it.itemCode, itemName: it.itemName, suppliers })
    }
    if (!outItems.length) return setError('Add at least one item with a supplier.')
    setError('')
    if (isEdit && id) {
      update(id, { quotDate, store, remark, items: outItems, quoteFile })
    } else {
      create({ quotDate, store, remark, items: outItems, quoteFile })
    }
    navigate('/rfq')
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Quotation', to: '/rfq' }, { label: isEdit ? existing!.quoNo : 'Create New' }]} />
      <PageHeader
        title={isEdit ? `Edit Quotation · ${existing!.quoNo}` : 'Create Quotation'}
        description="Add an item, then add every supplier who quoted it with their rate and supporting document."
      />

      <div className="space-y-4">
        {draftItems.map((it, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Package className="h-4 w-4" />
                </span>
                <div className="w-full max-w-md">
                  <Label>Item {i + 1}</Label>
                  <Combobox options={itemOptions} value={it.itemCode} onChange={(c) => pickItem(i, c)} placeholder="Search or add item" allowCustom />
                </div>
              </div>
              {draftItems.length > 1 && (
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Supplier</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Supporting Document</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {it.suppliers.map((sp, s) => (
                      <TableRow key={s}>
                        <TableCell>
                          <Combobox options={supplierOptions} value={sp.supplierCode} onChange={(c) => setSupplier(i, s, { supplierCode: c })} placeholder="Search supplier" allowCustom />
                          {sp.supplierCode && <p className="mt-1 font-mono text-[11px] text-muted-foreground">{sp.supplierCode}</p>}
                        </TableCell>
                        <TableCell>
                          <Input type="number" step="0.01" className="h-8 w-24" value={sp.rate || ''} onChange={(e) => setSupplier(i, s, { rate: Number(e.target.value) })} />
                        </TableCell>
                        <TableCell>
                          <FileUpload value={sp.document} onChange={(f) => setSupplier(i, s, { document: f })} />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeSupplier(i, s)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3">
                <Button type="button" variant="outline" size="sm" onClick={() => addSupplier(i)}>
                  <Plus className="h-4 w-4" /> Add Supplier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="secondary" onClick={addItem}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <Card className="my-4">
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Quot Date</Label>
            <Input type="date" value={quotDate} onChange={(e) => setQuotDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Store</Label>
            <Combobox options={storeOptions} value={store} onChange={setStore} placeholder="Select store" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remark</Label>
            <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Quote Upload (overall document)</Label>
            <FileUpload value={quoteFile} onChange={setQuoteFile} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/rfq')}>Cancel</Button>
        <Button onClick={save}><Save className="h-4 w-4" /> {isEdit ? 'Save Changes' : 'Create Quotation'}</Button>
      </div>
    </div>
  )
}
