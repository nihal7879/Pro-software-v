import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, X, Save } from 'lucide-react'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useComparisonStore } from '@/store/comparisonStore'
import { items, stores, vendors, vendorName } from '@/data/mockData'
import type { ComparisonRow } from '@/types'

interface DraftRow {
  itemName: string
  mrp: number
  remark: string
  rates: Record<string, number>
}

export function ComparisonCreatePage() {
  const navigate = useNavigate()
  const create = useComparisonStore((s) => s.create)

  const [store, setStore] = useState('')
  const [compDate, setCompDate] = useState('')
  const [remark, setRemark] = useState('')
  const [supplierIds, setSupplierIds] = useState<string[]>([])
  const [supplierPick, setSupplierPick] = useState('')
  const [rows, setRows] = useState<DraftRow[]>([])
  const [itemPick, setItemPick] = useState('')
  const [error, setError] = useState('')

  const storeOptions: ComboOption[] = useMemo(() => stores.map((s) => ({ value: s, label: s })), [])
  const vendorOptions: ComboOption[] = useMemo(
    () => vendors.filter((v) => !supplierIds.includes(v.id)).map((v) => ({ value: v.id, label: v.name, hint: v.location })),
    [supplierIds],
  )
  const itemOptions: ComboOption[] = useMemo(
    () => items.map((i) => ({ value: i.name, label: i.name, hint: i.code })),
    [],
  )

  const addSupplier = (id: string) => {
    if (id && !supplierIds.includes(id)) setSupplierIds((prev) => [...prev, id])
    setSupplierPick('')
  }
  const removeSupplier = (id: string) => {
    setSupplierIds((prev) => prev.filter((s) => s !== id))
    setRows((prev) =>
      prev.map((r) => {
        const rest = Object.fromEntries(Object.entries(r.rates).filter(([k]) => k !== id))
        return { ...r, rates: rest }
      }),
    )
  }

  const addItem = (name: string) => {
    if (name && !rows.some((r) => r.itemName === name)) {
      setRows((prev) => [...prev, { itemName: name, mrp: 0, remark: '', rates: {} }])
    }
    setItemPick('')
  }
  const removeItem = (name: string) => setRows((prev) => prev.filter((r) => r.itemName !== name))

  const setRate = (itemName: string, supplierId: string, value: number) =>
    setRows((prev) =>
      prev.map((r) => (r.itemName === itemName ? { ...r, rates: { ...r.rates, [supplierId]: value } } : r)),
    )
  const setRowField = (itemName: string, patch: Partial<DraftRow>) =>
    setRows((prev) => prev.map((r) => (r.itemName === itemName ? { ...r, ...patch } : r)))

  const save = () => {
    if (!store) return setError('Select a store.')
    if (!compDate) return setError('Select a comparison date.')
    if (supplierIds.length < 2) return setError('Add at least two suppliers.')
    if (!rows.length) return setError('Add at least one item.')
    setError('')

    const compRows: ComparisonRow[] = rows.map((r) => ({
      itemName: r.itemName,
      cells: supplierIds.map((sid) => ({
        supplierId: sid,
        rate: r.rates[sid] ?? 0,
        mrp: r.mrp,
        remark: r.remark,
      })),
    }))

    const created = create({ compDate, store, remark, supplierIds, rows: compRows })
    navigate(`/comparison/${created.id}`)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Comparison', to: '/comparison' }, { label: 'Create New' }]} />
      <PageHeader
        title="Create Item Comparison"
        description="Select store, suppliers and items from dropdowns, then enter rates directly. No Excel needed."
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Comparison Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Store</Label>
            <Combobox options={storeOptions} value={store} onChange={setStore} placeholder="Select store" />
          </div>
          <div className="space-y-1.5">
            <Label>Comp Date</Label>
            <Input type="date" value={compDate} onChange={(e) => setCompDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-3">
            <Label>Remark</Label>
            <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-w-sm">
            <Combobox
              options={vendorOptions}
              value={supplierPick}
              onChange={addSupplier}
              placeholder="Add supplier"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {supplierIds.length === 0 && (
              <p className="text-xs text-muted-foreground">No suppliers added yet.</p>
            )}
            {supplierIds.map((id) => (
              <Badge key={id} variant="info" className="gap-1.5 py-1 pl-2.5 pr-1">
                {vendorName(id)}
                <button
                  type="button"
                  onClick={() => removeSupplier(id)}
                  className="rounded-sm hover:bg-blue-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Items &amp; Rates</CardTitle>
          <div className="w-56">
            <Combobox
              options={itemOptions}
              value={itemPick}
              onChange={addItem}
              placeholder="Add item"
              allowCustom
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length && supplierIds.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Item Name</TableHead>
                  {supplierIds.map((sid) => (
                    <TableHead key={sid} className="whitespace-nowrap">{vendorName(sid)} (Rate)</TableHead>
                  ))}
                  <TableHead>MRP</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.itemName}>
                    <TableCell className="font-medium">{r.itemName}</TableCell>
                    {supplierIds.map((sid) => (
                      <TableCell key={sid}>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-8 w-24"
                          value={r.rates[sid] ?? ''}
                          onChange={(e) => setRate(r.itemName, sid, Number(e.target.value))}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        className="h-8 w-20"
                        value={r.mrp || ''}
                        onChange={(e) => setRowField(r.itemName, { mrp: Number(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 w-32"
                        value={r.remark}
                        onChange={(e) => setRowField(r.itemName, { remark: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(r.itemName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <Plus className="h-6 w-6" />
              Add suppliers and items to build the comparison grid.
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/comparison')}>Cancel</Button>
        <Button onClick={save}>
          <Save className="h-4 w-4" /> Save Comparison
        </Button>
      </div>
    </div>
  )
}
