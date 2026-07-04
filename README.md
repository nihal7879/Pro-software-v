# Procurement Management System

Internal enterprise **Procurement Management System** for Saifee Hospital's purchase workflow, built with React 19 + TypeScript + Vite. Frontend-only with realistic mock data (no backend) and a backend-ready architecture.

## Tech Stack

React 19 · TypeScript (strict) · Vite 6 · Tailwind CSS · shadcn/ui (Radix) · React Router · TanStack Table · TanStack Query · React Hook Form · Zod · Zustand · Recharts · Lucide · Axios (API-ready).

## Getting Started

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build
npm run lint       # tsc --noEmit
```

## Roles & Workflow

Navigation adapts automatically to the logged-in role. Use the avatar menu (top-right) to switch role for the demo.

**Purchaser → HOD → CEO**

| Role | Modules |
| --- | --- |
| **Purchaser** | Dashboard, Item List, Quotation (RFQ), Comparison, Alternate Items, New Material, Rate Revision, Submit for Approval |
| **HOD** | Dashboard, Pending Approvals (review / approve+sign / reject) |
| **CEO** | Dashboard, Pending Final Approvals (final approve+sign / reject) |

## Approval documents

Three document types flow through the same Purchaser → HOD → CEO pipeline:

- **Procurement Requests** (Submit for Approval)
- **New Material Approval Forms** (`SH/PUR/NM`)
- **Rate Revision Forms** (`SH-RR`)

### E-Signature

Approvers **draw an e-signature** on a canvas pad when approving. The captured
signature (PNG data-URL) is stored on the approval record and rendered in the
HOD / CEO signature panel of the printable form view — mirroring the hospital's
paper forms. A signature is mandatory to approve; a remark is mandatory to reject.

## Project Structure

```
src/
  components/
    ui/            # shadcn/ui primitives
    layout/        # Topbar, Sidebar, AppLayout
    common/        # DataTable, StatCard, SignaturePad, SignatureBlock, ...
  config/          # role-based navigation
  data/            # mock data (Saifee Hospital forms)
  features/        # dashboard, items, rfq, comparison, alternates,
                   # new-material, rate-revision, submit, approvals
  lib/             # utils + api (Axios client, API-ready)
  store/           # Zustand stores (auth, procurement)
  types/           # shared TypeScript types
```

## Backend-ready

`src/lib/api/client.ts` is a pre-configured Axios instance (base URL, auth
interceptor). Swap the mock store reads for API calls and set
`VITE_API_BASE_URL` to connect a real backend.
