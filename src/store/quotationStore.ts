import { create } from 'zustand'
import type { Quotation, SupplierQuote } from '@/types'
import { quotations as seed } from '@/data/mockData'

type EditablePatch = Partial<Pick<Quotation, 'quotDate' | 'store' | 'remark' | 'items' | 'quoteFile'>>

interface QuotationState {
  quotations: Quotation[]
  create: (q: Omit<Quotation, 'id' | 'quoNo' | 'createdAt'>) => Quotation
  /** Edit an existing quotation's header/items. */
  update: (id: string, patch: EditablePatch) => void
  /** Replace the supplier quotes of one item within a quotation (negotiation + added suppliers). */
  updateItemSuppliers: (quotationId: string, itemIndex: number, suppliers: SupplierQuote[]) => void
  getById: (id: string) => Quotation | undefined
}

let counter = 23

export const useQuotationStore = create<QuotationState>((set, get) => ({
  quotations: seed,
  create: (q) => {
    const storeCode = q.store.toLowerCase().includes('kitchen')
      ? 'KIT'
      : q.store.toLowerCase().includes('engineer')
        ? 'ENG'
        : 'GEN'
    const created: Quotation = {
      ...q,
      id: `q-${Date.now()}`,
      quoNo: `SH-${counter++}-QP-${storeCode}-2026`,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    set((state) => ({ quotations: [created, ...state.quotations] }))
    return created
  },
  update: (id, patch) =>
    set((state) => ({
      quotations: state.quotations.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    })),
  updateItemSuppliers: (quotationId, itemIndex, suppliers) =>
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === quotationId
          ? {
              ...q,
              items: q.items.map((it, idx) => (idx === itemIndex ? { ...it, suppliers } : it)),
            }
          : q,
      ),
    })),
  getById: (id) => get().quotations.find((q) => q.id === id),
}))
