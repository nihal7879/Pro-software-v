import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Save, X } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { alternateItems as seed, items, vendorName } from '@/data/mockData'
import type { AlternateItem, Item } from '@/types'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusVariant: Record<AlternateItem['status'], BadgeProps['variant']> = {
  proposed: 'warning',
  accepted: 'success',
  rejected: 'danger',
}

const pct = (from: number, diff: number) => (from > 0 ? (diff / from) * 100 : 0)

const num = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n)

export function AlternateItemsPage() {
  const [alternates, setAlternates] = useState<AlternateItem[]>(seed)
  const [showForm, setShowForm] = useState(false)

  // ── Create New form state ────────────────────────────────────────────────
  const [itemCode, setItemCode] = useState('')
  const [itemName, setItemName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [rate, setRate] = useState(0)
  const [mrp, setMrp] = useState(0)
  const [annualConsumption, setAnnualConsumption] = useState(0)
  const [altItemName, setAltItemName] = useState('')
  const [altBrandName, setAltBrandName] = useState('')
  const [altRate, setAltRate] = useState(0)
  const [altMrp, setAltMrp] = useState(0)
  const [error, setError] = useState('')

  const itemOptions: ComboOption[] = useMemo(
    () => items.map((i) => ({ value: i.code, label: i.name, hint: i.code })),
    [],
  )

  const pickItem = (code: string) => {
    const it = items.find((i) => i.code === code)
    if (it) {
      setItemCode(it.code)
      setItemName(it.name)
      setBrandName(it.brand)
      setRate(it.lastPurchasePrice)
      setMrp(it.mrp)
    } else {
      setItemCode(code)
    }
  }

  const resetForm = () => {
    setItemCode(''); setItemName(''); setBrandName(''); setRate(0); setMrp(0); setAnnualConsumption(0)
    setAltItemName(''); setAltBrandName(''); setAltRate(0); setAltMrp(0); setError('')
  }

  const save = () => {
    if (!itemName) return setError('Select the existing item.')
    if (!altItemName.trim()) return setError('Enter the alternate item name.')
    if (rate <= 0 || altRate <= 0) return setError('Enter both existing and alternate rates.')
    setError('')
    const entry: AlternateItem = {
      id: `a-${Date.now()}`,
      serialNo: alternates.length + 1,
      entryDate: '2026-07-04',
      itemCode, itemName, brandName, rate, mrp, annualConsumption,
      altItemCode: `${itemCode}-ALT`, altItemName: altItemName.trim(), altBrandName, altRate, altMrp,
      status: 'proposed',
    }
    setAlternates((prev) => [entry, ...prev])
    resetForm()
    setShowForm(false)
  }

  const update = (id: string, status: AlternateItem['status']) =>
    setAlternates((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))

  // ── Catalogue columns ────────────────────────────────────────────────────
  const catColumns = useMemo<ColumnDef<Item, unknown>[]>(
    () => [
      { accessorKey: 'code', header: 'Code', cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.code}</span> },
      { accessorKey: 'name', header: 'Item Name', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: 'store', header: 'Store', cell: ({ row }) => <Badge variant="neutral">{row.original.store}</Badge> },
      { accessorKey: 'brand', header: 'Brand' },
      { accessorKey: 'unit', header: 'Unit' },
      {
        accessorKey: 'stockQty', header: 'Stock',
        cell: ({ row }) => {
          const { stockQty, reorderLevel, unit } = row.original
          const low = stockQty <= reorderLevel
          return (
            <div className="flex items-center gap-2">
              <span className={low ? 'font-semibold text-red-600' : ''}>{formatNumber(stockQty)} {unit}</span>
              {low && <Badge variant="danger">Low</Badge>}
            </div>
          )
        },
      },
      { accessorKey: 'lastPurchasePrice', header: 'Rate', cell: ({ row }) => formatCurrency(row.original.lastPurchasePrice) },
      { accessorKey: 'mrp', header: 'MRP', cell: ({ row }) => formatCurrency(row.original.mrp) },
      { id: 'vendor', header: 'Preferred Vendor', cell: ({ row }) => <span className="text-sm">{vendorName(row.original.preferredVendorId)}</span> },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Items List"
        description="Items with their proposed alternates — rate/MRP differences and annual savings computed automatically."
      />

      <Tabs defaultValue="alternates">
        <TabsList>
          <TabsTrigger value="alternates">Alternate Items List</TabsTrigger>
          <TabsTrigger value="catalogue">Item Catalogue</TabsTrigger>
        </TabsList>

        {/* ── Alternate Items List ── */}
        <TabsContent value="alternates">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setShowForm((v) => !v)}>
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Close' : 'Create New'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Create Alternate Item Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Existing Item</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="space-y-1.5 lg:col-span-2">
                      <Label>Item</Label>
                      <Combobox options={itemOptions} value={itemCode} onChange={pickItem} placeholder="Search item" allowCustom />
                    </div>
                    <div className="space-y-1.5"><Label>Brand</Label><Input value={brandName} onChange={(e) => setBrandName(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Rate</Label><Input type="number" step="0.01" value={rate || ''} onChange={(e) => setRate(Number(e.target.value))} /></div>
                    <div className="space-y-1.5"><Label>MRP</Label><Input type="number" step="0.01" value={mrp || ''} onChange={(e) => setMrp(Number(e.target.value))} /></div>
                    <div className="space-y-1.5"><Label>Annual Cons.</Label><Input type="number" value={annualConsumption || ''} onChange={(e) => setAnnualConsumption(Number(e.target.value))} /></div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alternate Item</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="space-y-1.5 lg:col-span-2"><Label>Alternate Name</Label><Input value={altItemName} onChange={(e) => setAltItemName(e.target.value)} placeholder="Alternate item name" /></div>
                    <div className="space-y-1.5"><Label>Alt Brand</Label><Input value={altBrandName} onChange={(e) => setAltBrandName(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label>Alt Rate</Label><Input type="number" step="0.01" value={altRate || ''} onChange={(e) => setAltRate(Number(e.target.value))} /></div>
                    <div className="space-y-1.5"><Label>Alt MRP</Label><Input type="number" step="0.01" value={altMrp || ''} onChange={(e) => setAltMrp(Number(e.target.value))} /></div>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { resetForm(); setShowForm(false) }}>Cancel</Button>
                  <Button onClick={save}><Save className="h-4 w-4" /> Save</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Entry Date</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>MRP</TableHead>
                      <TableHead>Annual Cons.</TableHead>
                      <TableHead>Alt Item Name</TableHead>
                      <TableHead>Alt Brand</TableHead>
                      <TableHead>Alt Rate</TableHead>
                      <TableHead>Alt MRP</TableHead>
                      <TableHead>Rate Diff</TableHead>
                      <TableHead>Rate % Diff</TableHead>
                      <TableHead>MRP Diff</TableHead>
                      <TableHead>MRP % Diff</TableHead>
                      <TableHead>Annual Save (Rate)</TableHead>
                      <TableHead>Annual Earn (MRP)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alternates.map((a) => {
                      const rateDiff = a.rate - a.altRate
                      const mrpDiff = a.mrp - a.altMrp
                      const annualSave = rateDiff * a.annualConsumption
                      const annualEarn = mrpDiff * a.annualConsumption
                      const pos = (n: number) => (n > 0 ? 'text-emerald-600' : n < 0 ? 'text-red-600' : '')
                      return (
                        <TableRow key={a.id} className="whitespace-nowrap">
                          <TableCell>{a.serialNo}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDate(a.entryDate)}</TableCell>
                          <TableCell className="font-mono text-xs">{a.itemCode}</TableCell>
                          <TableCell className="font-medium">{a.itemName}</TableCell>
                          <TableCell>{a.brandName}</TableCell>
                          <TableCell>{num(a.rate)}</TableCell>
                          <TableCell>{num(a.mrp)}</TableCell>
                          <TableCell>{formatNumber(a.annualConsumption)}</TableCell>
                          <TableCell className="font-medium">{a.altItemName}</TableCell>
                          <TableCell>{a.altBrandName}</TableCell>
                          <TableCell>{num(a.altRate)}</TableCell>
                          <TableCell>{num(a.altMrp)}</TableCell>
                          <TableCell className={cn('font-medium', pos(rateDiff))}>{num(rateDiff)}</TableCell>
                          <TableCell className={pos(rateDiff)}>{pct(a.rate, rateDiff).toFixed(2)}%</TableCell>
                          <TableCell className={cn('font-medium', pos(mrpDiff))}>{num(mrpDiff)}</TableCell>
                          <TableCell className={pos(mrpDiff)}>{pct(a.mrp, mrpDiff).toFixed(2)}%</TableCell>
                          <TableCell className={cn('font-semibold', pos(annualSave))}>{formatCurrency(annualSave)}</TableCell>
                          <TableCell className={cn('font-semibold', pos(annualEarn))}>{formatCurrency(annualEarn)}</TableCell>
                          <TableCell><Badge variant={statusVariant[a.status]}>{a.status}</Badge></TableCell>
                          <TableCell>
                            {a.status === 'proposed' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => update(a.id, 'accepted')}>Accept</Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => update(a.id, 'rejected')}>Reject</Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Item Catalogue ── */}
        <TabsContent value="catalogue">
          <DataTable columns={catColumns} data={items} searchPlaceholder="Search items, codes, brands, stores..." pageSize={10} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
