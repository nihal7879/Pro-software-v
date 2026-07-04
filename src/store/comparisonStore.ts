import { create } from 'zustand'
import type { ApprovalRemark, Comparison } from '@/types'
import { comparisons as seed } from '@/data/mockData'
import { nextStatus } from './procurementStore'

interface ComparisonState {
  comparisons: Comparison[]
  create: (comp: Omit<Comparison, 'id' | 'compNo' | 'status' | 'selectedSupplierId' | 'remarks'>) => Comparison
  decide: (id: string, remark: ApprovalRemark, selectedSupplierId: string) => void
  getById: (id: string) => Comparison | undefined
}

let counter = 52

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  comparisons: seed,
  create: (comp) => {
    const storeCode = comp.store.toLowerCase().includes('kitchen')
      ? 'KIT'
      : comp.store.toLowerCase().includes('engineer')
        ? 'ENG'
        : 'GEN'
    const created: Comparison = {
      ...comp,
      id: `cmp-${Date.now()}`,
      compNo: `SH-${counter++}-CP-${storeCode}-2026`,
      status: 'pending_hod',
      selectedSupplierId: '',
      remarks: [],
    }
    set((state) => ({ comparisons: [created, ...state.comparisons] }))
    return created
  },
  decide: (id, remark, selectedSupplierId) =>
    set((state) => ({
      comparisons: state.comparisons.map((c) =>
        c.id === id
          ? {
              ...c,
              status: nextStatus(c.status, remark.role, remark.decision),
              // Keep the winning vendor once chosen; later approvers can confirm or change it.
              selectedSupplierId:
                remark.decision === 'approved' && selectedSupplierId
                  ? selectedSupplierId
                  : c.selectedSupplierId,
              remarks: [...c.remarks, remark],
            }
          : c,
      ),
    })),
  getById: (id) => get().comparisons.find((c) => c.id === id),
}))
