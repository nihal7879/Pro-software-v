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
import type { NewMaterialLine, NewMaterialRequest } from '@/types'

const chargeFlags = ['Chargeable', 'Non Chargeable', 'Charges in Package'] as const

interface DraftLine {
  itemName: string
  unit: string
  packSize: number
  brand: string
  qty: number
  consumption: string
  quoteRate: number
  negotiatedRate: number
  mrp: number
  gst: number
}

const emptyLine: DraftLine = {
  itemName: '', unit: 'pc', packSize: 1, brand: '', qty: 1, consumption: '',
  quoteRate: 0, negotiatedRate: 0, mrp: 0, gst: 5,
}

let formCounter = 35

export function NewMaterialCreatePage() {
  const navigate = useNavigate()
  const createNewMaterial = useProcurementStore((s) => s.createNewMaterial)
  const requestedByDefault = useAuthStore((s) => s.currentUser.name)

  const [date, setDate] = useState('2026-07-04')
  const [supplierName, setSupplierName] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')
  const [department, setDepartment] = useState('')
  const [requestedBy, setRequestedBy] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [chargeFlag, setChargeFlag] = useState<(typeof chargeFlags)[number]>('Chargeable')
  const [remark, setRemark] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [lines, setLines] = useState<DraftLine[]>([{ ...emptyLine }])
  const [error, setError] = useState('')

  const supplierOptions: ComboOption[] = useMemo(
    () => vendors.map((v) => ({ value: v.name, label: v.name, hint: v.location })),
    [],
  )
  const itemOptions: ComboOption[] = useMemo(
    () => items.map((i) => ({ value: i.name, label: i.name, hint: i.code })),
    [],
  )
  const deptOptions: ComboOption[] = useMemo(() => stores.map((s) => ({ value: s, label: s })), [])
  const chargeOptions: ComboOption[] = chargeFlags.map((c) => ({ value: c, label: c }))

  const setLine = (i: number, patch: Partial<DraftLine>) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

  const pickItem = (i: number, name: string) => {
    const it = items.find((x) => x.name === name)
    if (it) {
      setLine(i, {
        itemName: it.name, unit: it.unit, packSize: it.packSize, brand: it.brand,
        quoteRate: it.lastPurchasePrice, negotiatedRate: it.lastPurchasePrice, mrp: it.mrp, gst: it.gst,
      })
      if (!supplierName) {
        const vendor = vendors.find((v) => v.id === it.preferredVendorId)
        if (vendor) setSupplierName(vendor.name)
      }
    } else {
      setLine(i, { itemName: name })
    }
  }

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }])
  const removeLine = (i: number) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))

  const submit = () => {
    if (!supplierName) return setError('Select a supplier.')
    if (supplierAddress.trim().length < 5) return setError('Enter the supplier address.')
    if (!department) return setError('Select a department.')
    if (requestedBy.trim().length < 2) return setError('Enter who requested this.')
    const validLines = lines.filter((l) => l.itemName && l.qty > 0 && l.negotiatedRate > 0)
    if (!validLines.length) return setError('Add at least one item with quantity and negotiated rate.')
    if (!signature) return setError('Please add your signature ("My Signature") to submit.')
    setError('')

    const outLines: NewMaterialLine[] = validLines.map((l) => ({
      itemName: l.itemName, unit: l.unit, packSize: l.packSize, brand: l.brand, qty: l.qty,
      consumption: l.consumption, quoteRate: l.quoteRate, negotiatedRate: l.negotiatedRate, mrp: l.mrp, gst: l.gst,
    }))

    const req: NewMaterialRequest = {
      id: `nm-${Date.now()}`,
      formNo: `SH-${formCounter++}-CP-GEN-2026`,
      supplierName, supplierAddress, department, requestedBy, leadTime, chargeFlag, remark,
      preparedSignature: signature, createdAt: date, status: 'pending_hod', lines: outLines, remarks: [],
    }
    createNewMaterial(req)
    navigate('/new-material')
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'New Material', to: '/new-material' }, { label: 'Create New' }]} />
      <PageHeader
        title="Create New Material Form"
        description="Add one or more items, sign, and submit for HOD → CEO e-signature approval (SH/PUR/NM)."
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>New Material Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Supplier Name</Label>
              <Combobox options={supplierOptions} value={supplierName} onChange={setSupplierName} placeholder="Select supplier" allowCustom />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Combobox options={deptOptions} value={department} onChange={setDepartment} placeholder="Select department" allowCustom />
            </div>
            <div className="space-y-1.5 lg:col-span-2">
              <Label>Supplier Address</Label>
              <Input value={supplierAddress} onChange={(e) => setSupplierAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Request By</Label>
              <Input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="e.g. Dr Ashvini Natu" />
            </div>
            <div className="space-y-1.5">
              <Label>Lead Time</Label>
              <Input value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="e.g. 5-7 working days" />
            </div>
            <div className="space-y-1.5">
              <Label>Charge / Non Charge</Label>
              <Combobox options={chargeOptions} value={chargeFlag} onChange={(v) => setChargeFlag(v as (typeof chargeFlags)[number])} />
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
                    <TableHead className="min-w-[200px]">Item Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Consumption</TableHead>
                    <TableHead>Quote Rate</TableHead>
                    <TableHead>Negotiated Rate</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Combobox options={itemOptions} value={l.itemName} onChange={(name) => pickItem(i, name)} placeholder="Search or add item" allowCustom />
                      </TableCell>
                      <TableCell><Input className="h-8 w-16" value={l.unit} onChange={(e) => setLine(i, { unit: e.target.value })} /></TableCell>
                      <TableCell><Num value={l.packSize} onChange={(v) => setLine(i, { packSize: v })} w="w-16" /></TableCell>
                      <TableCell><Input className="h-8 w-28" value={l.brand} onChange={(e) => setLine(i, { brand: e.target.value })} /></TableCell>
                      <TableCell><Num value={l.qty} onChange={(v) => setLine(i, { qty: v })} w="w-16" /></TableCell>
                      <TableCell><Input className="h-8 w-24" value={l.consumption} onChange={(e) => setLine(i, { consumption: e.target.value })} /></TableCell>
                      <TableCell><Num value={l.quoteRate} onChange={(v) => setLine(i, { quoteRate: v })} /></TableCell>
                      <TableCell><Num value={l.negotiatedRate} onChange={(v) => setLine(i, { negotiatedRate: v })} /></TableCell>
                      <TableCell><Num value={l.mrp} onChange={(v) => setLine(i, { mrp: v })} w="w-20" /></TableCell>
                      <TableCell><Num value={l.gst} onChange={(v) => setLine(i, { gst: v })} w="w-16" /></TableCell>
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

          <div className="space-y-1.5">
            <Label>Remark</Label>
            <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>

          <div className="max-w-sm space-y-1.5">
            <Label>My Signature</Label>
            <SignaturePad onChange={setSignature} />
            <p className="text-[11px] text-muted-foreground">Signing as <span className="font-medium text-foreground">{requestedBy || requestedByDefault}</span>. Required to submit.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/new-material')}>Cancel</Button>
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
