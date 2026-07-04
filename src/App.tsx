import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/types'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { QuotationListPage } from '@/features/quotation/QuotationListPage'
import { QuotationCreatePage } from '@/features/quotation/QuotationCreatePage'
import { QuotationNegotiatePage } from '@/features/quotation/QuotationNegotiatePage'
import { ComparisonListPage } from '@/features/comparison/ComparisonListPage'
import { ComparisonCreatePage } from '@/features/comparison/ComparisonCreatePage'
import { ComparisonViewPage } from '@/features/comparison/ComparisonViewPage'
import { AlternateItemsPage } from '@/features/alternates/AlternateItemsPage'
import { NewMaterialPage } from '@/features/new-material/NewMaterialPage'
import { NewMaterialCreatePage } from '@/features/new-material/NewMaterialCreatePage'
import { NewMaterialViewPage } from '@/features/new-material/NewMaterialViewPage'
import { RateRevisionPage } from '@/features/rate-revision/RateRevisionPage'
import { RateRevisionCreatePage } from '@/features/rate-revision/RateRevisionCreatePage'
import { RateRevisionViewPage } from '@/features/rate-revision/RateRevisionViewPage'
import { ApprovalsPage } from '@/features/approvals/ApprovalsPage'
import { ApprovalDetailPage } from '@/features/approvals/ApprovalDetailPage'

function RoleRoute({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const role = useAuthStore((s) => s.currentUser.role)
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const PURCHASER: Role[] = ['purchaser']
const APPROVERS: Role[] = ['hod', 'ceo']

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/rfq" element={<RoleRoute allow={PURCHASER}><QuotationListPage /></RoleRoute>} />
        <Route path="/rfq/new" element={<RoleRoute allow={PURCHASER}><QuotationCreatePage /></RoleRoute>} />
        <Route path="/rfq/:id/edit" element={<RoleRoute allow={PURCHASER}><QuotationCreatePage /></RoleRoute>} />
        <Route path="/rfq/:id/negotiate/:itemIndex" element={<RoleRoute allow={PURCHASER}><QuotationNegotiatePage /></RoleRoute>} />
        <Route path="/comparison" element={<RoleRoute allow={PURCHASER}><ComparisonListPage /></RoleRoute>} />
        <Route path="/comparison/new" element={<RoleRoute allow={PURCHASER}><ComparisonCreatePage /></RoleRoute>} />
        <Route path="/comparison/:id" element={<RoleRoute allow={PURCHASER}><ComparisonViewPage /></RoleRoute>} />
        <Route path="/alternates" element={<RoleRoute allow={PURCHASER}><AlternateItemsPage /></RoleRoute>} />
        <Route path="/new-material" element={<RoleRoute allow={PURCHASER}><NewMaterialPage /></RoleRoute>} />
        <Route path="/new-material/new" element={<RoleRoute allow={PURCHASER}><NewMaterialCreatePage /></RoleRoute>} />
        <Route path="/new-material/:id" element={<RoleRoute allow={PURCHASER}><NewMaterialViewPage /></RoleRoute>} />
        <Route path="/rate-revision" element={<RoleRoute allow={PURCHASER}><RateRevisionPage /></RoleRoute>} />
        <Route path="/rate-revision/new" element={<RoleRoute allow={PURCHASER}><RateRevisionCreatePage /></RoleRoute>} />
        <Route path="/rate-revision/:id" element={<RoleRoute allow={PURCHASER}><RateRevisionViewPage /></RoleRoute>} />

        <Route path="/approvals" element={<RoleRoute allow={APPROVERS}><ApprovalsPage /></RoleRoute>} />
        <Route path="/approvals/:kind/:id" element={<RoleRoute allow={APPROVERS}><ApprovalDetailPage /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
