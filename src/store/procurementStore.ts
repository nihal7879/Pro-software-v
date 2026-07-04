import { create } from 'zustand'
import type {
  ApprovalRemark,
  NewMaterialRequest,
  RateRevision,
  RequestStatus,
  Role,
} from '@/types'
import {
  newMaterialRequests as nmSeed,
  rateRevisions as rrSeed,
} from '@/data/mockData'

export type ApprovalKind = 'newMaterial' | 'rateRevision' | 'comparison'

/**
 * Given the current status, the acting role and their decision, compute the
 * next workflow status. Workflow: Purchaser -> pending_hod -> pending_ceo -> approved.
 */
export function nextStatus(
  current: RequestStatus,
  role: Role,
  decision: 'approved' | 'rejected',
): RequestStatus {
  if (decision === 'rejected') return 'rejected'
  if (role === 'hod' && current === 'pending_hod') return 'pending_ceo'
  if (role === 'ceo' && current === 'pending_ceo') return 'approved'
  return current
}

interface ProcurementState {
  newMaterials: NewMaterialRequest[]
  rateRevisions: RateRevision[]
  createNewMaterial: (req: NewMaterialRequest) => void
  createRateRevision: (req: RateRevision) => void
  decide: (kind: ApprovalKind, id: string, remark: ApprovalRemark) => void
}

export const useProcurementStore = create<ProcurementState>((set) => ({
  newMaterials: nmSeed,
  rateRevisions: rrSeed,

  createNewMaterial: (req) => set((state) => ({ newMaterials: [req, ...state.newMaterials] })),
  createRateRevision: (req) => set((state) => ({ rateRevisions: [req, ...state.rateRevisions] })),

  decide: (kind, id, remark) =>
    set((state) => {
      const apply = <T extends { id: string; status: RequestStatus; remarks: ApprovalRemark[] }>(
        list: T[],
      ): T[] =>
        list.map((r) =>
          r.id === id
            ? {
                ...r,
                status: nextStatus(r.status, remark.role, remark.decision),
                remarks: [...r.remarks, remark],
              }
            : r,
        )

      if (kind === 'newMaterial') return { newMaterials: apply(state.newMaterials) }
      if (kind === 'rateRevision') return { rateRevisions: apply(state.rateRevisions) }
      return {} // 'comparison' is handled by the comparison store
    }),
}))
