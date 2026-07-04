import { useMemo, useState } from 'react'
import { Plus, Save, X, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination, TablePagination } from '@/components/common/TablePagination'
import { alternateItems as seed, items } from '@/data/mockData'
import type { AlternateItem } from '@/types'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

const pct = (from: number, diff: number) => (from > 0 ? (diff / from) * 100 : 0)
const num = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n)

export function AlternateItemsPage() {
  const [alternates, setAlternates] = useState<AlternateItem[]>(seed)
  const pg = usePagination(alternates, 10)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // ── form state ──
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
      setItemCode(it.code); setItemName(it.name); setBrandName(it.brand)
      setRate(it.lastPurchasePrice); setMrp(it.mrp)
    } else {
      setItemCode(code)
    }
  }

  const resetForm = () => {
    setItemCode(''); setItemName(''); setBrandName(''); setRate(0); setMrp(0); setAnnualConsumption(0)
    setAltItemName(''); setAltBrandName(''); setAltRate(0); setAltMrp(0); setError(''); setEditingId(null)
  }

  const startEdit = (a: AlternateItem) => {
    setEditingId(a.id)
    setItemCode(a.itemCode); setItemName(a.itemName); setBrandName(a.brandName)
    setRate(a.rate); setMrp(a.mrp); setAnnualConsumption(a.annualConsumption)
    setAltItemName(a.altItemName); setAltBrandName(a.altBrandName); setAltRate(a.altRate); setAltMrp(a.altMrp)
    setError('')
    setShowForm(true)
  }

  const remove = (id: string) => setAlternates((prev) => prev.filter((a) => a.id !== id))

  const save = () => {
    if (!itemName) return setError('Select the existing item.')
    if (!altItemName.trim()) return setError('Enter the alternate item name.')
    if (rate <= 0 || altRate <= 0) return setError('Enter both existing and alternate rates.')
    setError('')
    if (editingId) {
      setAlternates((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, itemCode, itemName, brandName, rate, mrp, annualConsumption, altItemName: altItemName.trim(), altBrandName, altRate, altMrp }
            : a,
        ),
      )
    } else {
      const entry: AlternateItem = {
        id: `a-${Date.now()}`,
        serialNo: alternates.length + 1,
        entryDate: '2026-07-04',
        itemCode, itemName, brandName, rate, mrp, annualConsumption,
        altItemCode: `${itemCode}-ALT`, altItemName: altItemName.trim(), altBrandName, altRate, altMrp,
        status: 'accepted',
      }
      setAlternates((prev) => [entry, ...prev])
    }
    resetForm()
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        title="Items List"
        description="Items with their alternates — rate/MRP differences and annual savings computed automatically."
        actions={
          <Button onClick={() => (showForm ? (resetForm(), setShowForm(false)) : setShowForm(true))}>
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close' : 'Create New'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Alternate Item Entry' : 'Add Alternate Item Entry'}</CardTitle>
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
              <Button onClick={save}><Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Save'}</Button>
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pg.pageData.map((a) => {
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
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(a.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!alternates.length && (
                  <TableRow>
                    <TableCell colSpan={19} className="h-24 text-center text-sm text-muted-foreground">
                      No items yet. Click “Create New” to add one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {alternates.length > 0 && <TablePagination api={pg} />}
        </CardContent>
      </Card>
    </div>
  )
}
