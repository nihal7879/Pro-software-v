import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  FileText,
  GitCompareArrows,
  Repeat2,
  PackagePlus,
  TrendingUp,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

const purchaserNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Quotation (RFQ)', to: '/rfq', icon: FileText },
  { label: 'Comparison', to: '/comparison', icon: GitCompareArrows },
  { label: 'Items List', to: '/alternates', icon: Repeat2 },
  { label: 'New Material', to: '/new-material', icon: PackagePlus },
  { label: 'Rate Revision', to: '/rate-revision', icon: TrendingUp },
]

const hodNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Pending Approvals', to: '/approvals', icon: ClipboardCheck },
]

const ceoNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Final Approvals', to: '/approvals', icon: ShieldCheck },
]

export const navByRole: Record<Role, NavItem[]> = {
  purchaser: purchaserNav,
  hod: hodNav,
  ceo: ceoNav,
}
