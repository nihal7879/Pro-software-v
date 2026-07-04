import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SignaturePad } from '@/components/common/SignaturePad'
import { useProcurementStore } from '@/store/procurementStore'
import { useAuthStore } from '@/store/authStore'
import { items, stores, vendors } from '@/data/mockData'
import type { RateRevision, RateRevisionLine } from '@/types'

const chargeFlags = ['Chargeable', 'Non Chargeable'] as const

interface DraftLine {
  itemCode: string
  itemName: string
  existingRate: number
  quotedRate: number
  negotiatedRate: number
  gst: number
  existingMrp: number
  revisedMrp: number
  lastRevisedOn: string
  annualConsumption: number
  alternateProducts: string
}

const emptyLine: DraftLine = {
  itemCode: '', itemName: '', existingRate: 0, quotedRate: 0, negotiatedRate: 0, gst: 0,
  existingMrp: 0, revisedMrp: 0, lastRevisedOn: '2026-07-04', annualConsumption: 0, alternateProducts: '',
}

const pct = (from: number, to: number) => (from > 0 ? ((to - from) / from) * 100 : 0)

let formCounter = 72

export function RateRevisionCreatePage() {
  const navigate = useNavigate()
  const createRateRevision = useProcurementStore((s) => s.createRateRevision)
  const preparedByDefault = useAuthStore((s) => s.currentUser.name)

  const [date, setDate] = useState('2026-07-04')
  const [supplierName, setSupplierName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [department, setDepartment] = useState('')
  const [chargeFlag, setChargeFlag] = useState<(typeof chargeFlags)[number]>('Non Chargeable')
  const [store, setStore] = useState('')
  const [reason, setReason] = useState('')
  const [remark, setRemark] = useState('')
  const [preparedBy, setPreparedBy] = useState(preparedByDefault)
  const [signature, setSignature] = useState<string | null>(null)
  const [lines, setLines] = useState<DraftLine[]>([{ ...emptyLine }])
  const [error, setError] = useState('')

  const supplierOptions: ComboOption[] = useMemo(
    () => vendors.map((v) => ({ value: v.name, label: v.name, hint: v.location })),
    [],
  )
  const itemOptions: ComboOption[] = useMemo(
    () => items.map((i) => ({ value: i.code, label: i.name, hint: i.code })),
    [],
  )
  const deptOptions: ComboOption[] = useMemo(() => stores.map((s) => ({ value: s, label: s })), [])
  const storeOptions: ComboOption[] = deptOptions
  const chargeOptions: ComboOption[] = chargeFlags.map((c) => ({ value: c, label: c }))

  const setLine = (i: number, patch: Partial<DraftLine>) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

  const pickItem = (i: number, code: string) => {
    const it = items.find((x) => x.code === code)
    if (it) {
      setLine(i, { itemCode: it.code, itemName: it.name, existingRate: it.lastPurchasePrice, existingMrp: it.mrp, gst: it.gst })
      if (!brandName) setBrandName(it.brand)
    } else {
      setLine(i, { itemCode: code })
    }
  }

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }])
  const removeLine = (i: number) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))

  const submit = () => {
    if (!supplierName) return setError('Select a supplier.')
    if (!department) return setError('Select a department.')
    if (reason.trim().length < 5) return setError('Enter a reason.')
    const validLines = lines.filter((l) => l.itemName && l.existingRate > 0 && l.negotiatedRate > 0)
    if (!validLines.length) return setError('Add at least one item with existing and negotiated rates.')
    if (!signature) return setError('Please add your signature ("My Signature") to submit.')
    setError('')

    const outLines: RateRevisionLine[] = validLines.map((l) => ({
      itemCode: l.itemCode, itemName: l.itemName, existingRate: l.existingRate, quotedRate: l.quotedRate || l.negotiatedRate,
      negotiatedRate: l.negotiatedRate, gst: l.gst, revisedCostPrice: l.negotiatedRate, existingMrp: l.existingMrp,
      revisedMrp: l.revisedMrp, lastRevisedOn: l.lastRevisedOn, annualConsumption: l.annualConsumption,
      alternateProducts: l.alternateProducts,
    }))

    const req: RateRevision = {
      id: `rr-${Date.now()}`,
      formNo: `SH-${formCounter++}-RR-GEN-2026`,
      supplierName, brandName, userDepartment: department, store, chargeFlag, reason,
      remark, preparedBy, preparedSignature: signature, createdAt: date,
      status: 'pending_hod', lines: outLines, remarks: [],
    }
    createRateRevision(req)
    navigate('/rate-revision')
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Rate Revision', to: '/rate-revision' }, { label: 'Create New' }]} />
      <PageHeader
        title="Create Rate Revision"
        description="Add one or more items, enter revised rates, sign, and submit for HOD → CEO approval."
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Rate Revision Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Supplier</Label>
              <Combobox options={supplierOptions} value={supplierName} onChange={setSupplierName} placeholder="Select vendor" allowCustom />
            </div>
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item Details</p>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>
            <div className="overflow-x-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[190px]">Item</TableHead>
                    <TableHead>Existing Rate</TableHead>
                    <TableHead>Quoted Rate</TableHead>
                    <TableHead>Negotiated Rate</TableHead>
                    <TableHead>GST%</TableHead>
                    <TableHead>Diff Rate%</TableHead>
                    <TableHead>Existing MRP</TableHead>
                    <TableHead>Revised MRP</TableHead>
                    <TableHead>Diff MRP%</TableHead>
                    <TableHead>Annual Cons.</TableHead>
                    <TableHead>Alternate Products</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Combobox options={itemOptions} value={l.itemCode} onChange={(code) => pickItem(i, code)} placeholder="Search item" allowCustom />
                        {l.itemName && <p className="mt-1 max-w-[190px] truncate text-[11px] text-muted-foreground">{l.itemName}</p>}
                      </TableCell>
                      <TableCell><Num value={l.existingRate} onChange={(v) => setLine(i, { existingRate: v })} /></TableCell>
                      <TableCell><Num value={l.quotedRate} onChange={(v) => setLine(i, { quotedRate: v })} /></TableCell>
                      <TableCell><Num value={l.negotiatedRate} onChange={(v) => setLine(i, { negotiatedRate: v })} /></TableCell>
                      <TableCell><Num value={l.gst} onChange={(v) => setLine(i, { gst: v })} w="w-16" /></TableCell>
                      <TableCell className="text-xs font-medium">{pct(l.existingRate, l.negotiatedRate).toFixed(2)}%</TableCell>
                      <TableCell><Num value={l.existingMrp} onChange={(v) => setLine(i, { existingMrp: v })} /></TableCell>
                      <TableCell><Num value={l.revisedMrp} onChange={(v) => setLine(i, { revisedMrp: v })} /></TableCell>
                      <TableCell className="text-xs font-medium">{pct(l.existingMrp, l.revisedMrp).toFixed(2)}%</TableCell>
                      <TableCell><Num value={l.annualConsumption} onChange={(v) => setLine(i, { annualConsumption: v })} /></TableCell>
                      <TableCell>
                        <Input className="h-8 w-32" value={l.alternateProducts} onChange={(e) => setLine(i, { alternateProducts: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeLine(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Brand Name</Label>
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Combobox options={deptOptions} value={department} onChange={setDepartment} placeholder="Select department" allowCustom />
            </div>
            <div className="space-y-1.5">
              <Label>Chargeable Type</Label>
              <Combobox options={chargeOptions} value={chargeFlag} onChange={(v) => setChargeFlag(v as (typeof chargeFlags)[number])} />
            </div>
            <div className="space-y-1.5">
              <Label>Store</Label>
              <Combobox options={storeOptions} value={store} onChange={setStore} placeholder="Select store" allowCustom />
            </div>
            <div className="space-y-1.5">
              <Label>Prepared By</Label>
              <Input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <Label>Remark</Label>
              <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>
          </div>

          <div className="max-w-sm space-y-1.5">
            <Label>My Signature</Label>
            <SignaturePad onChange={setSignature} />
            <p className="text-[11px] text-muted-foreground">Signing as <span className="font-medium text-foreground">{preparedBy}</span>. Required to submit.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/rate-revision')}>Cancel</Button>
        <Button onClick={submit}>Submit for Approval</Button>
      </div>
    </div>
  )
}

function Num({ value, onChange, w = 'w-24' }: { value: number; onChange: (v: number) => void; w?: string }) {
  return (
    <Input type="number" step="0.01" className={`h-8 ${w}`} value={value || ''} onChange={(e) => onChange(Number(e.target.value))} />
  )
}
