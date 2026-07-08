export type Role = 'purchaser' | 'hod' | 'ceo'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: string
  avatarInitials: string
}

export type ItemCategory =
  | 'Consumables'
  | 'Surgical'
  | 'Lab Reagent'
  | 'Kitchen'
  | 'Safety'
  | 'Pharmacy'
  | 'General'

export interface Item {
  id: string
  code: string
  name: string
  category: ItemCategory
  store: string
  unit: string
  packSize: number
  brand: string
  stockQty: number
  reorderLevel: number
  lastPurchasePrice: number
  mrp: number
  gst: number
  preferredVendorId: string
}

export interface Vendor {
  id: string
  code: string
  name: string
  rating: number
  location: string
  leadTimeDays: number
}

/** A reference to an attached document (session-only object URL; no backend). */
export interface FileRef {
  name: string
  url: string
}

/** One supplier's quote for an item, with its supporting documents. */
export interface SupplierQuote {
  supplierId: string
  supplierCode: string
  supplierName: string
  rate: number
  negotiatedRate: number
  document: FileRef | null
  negotiatedDocument: FileRef | null
}

/** An item within a quotation, owning the quotes from one or more suppliers. */
export interface QuotationItem {
  itemCode: string
  itemName: string
  /** Optional alternate/substitute item (from the item list) offered in place of the requested one. */
  alternateItem?: string
  suppliers: SupplierQuote[]
}

export interface Quotation {
  id: string
  quoNo: string
  quotDate: string
  store: string
  remark: string
  items: QuotationItem[]
  quoteFile: FileRef | null
  createdAt: string
}

export interface QuotationLine {
  vendorId: string
  unitPrice: number
  leadTimeDays: number
  moq: number
  notes: string
}

export interface RFQ {
  id: string
  rfqNo: string
  itemId: string
  quantity: number
  requiredBy: string
  createdAt: string
  status: 'draft' | 'sent' | 'quoted'
  quotations: QuotationLine[]
}

export interface AlternateItem {
  id: string
  serialNo: number
  entryDate: string
  // Existing item
  itemCode: string
  itemName: string
  brandName: string
  rate: number
  mrp: number
  annualConsumption: number
  // Proposed alternate
  altItemCode: string
  altItemName: string
  altBrandName: string
  altRate: number
  altMrp: number
  status: 'proposed' | 'accepted' | 'rejected'
}

export interface NewMaterialLine {
  itemName: string
  /** Optional alternate/substitute item (from the item list) offered in place of the requested one. */
  alternateItem?: string
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

export interface NewMaterialRequest {
  id: string
  formNo: string
  supplierName: string
  supplierAddress: string
  department: string
  requestedBy: string
  leadTime: string
  chargeFlag: 'Chargeable' | 'Non Chargeable' | 'Charges in Package'
  remark: string
  /** Purchaser's own e-signature captured on the create form ("My Signature"). */
  preparedSignature: string
  createdAt: string
  lines: NewMaterialLine[]
  status: RequestStatus
  remarks: ApprovalRemark[]
}

export interface RateRevisionLine {
  itemCode: string
  itemName: string
  existingRate: number
  quotedRate: number
  negotiatedRate: number
  gst: number
  revisedCostPrice: number
  existingMrp: number
  revisedMrp: number
  lastRevisedOn: string
  annualConsumption: number
  alternateProducts: string
}

export interface RateRevision {
  id: string
  formNo: string
  supplierName: string
  brandName: string
  userDepartment: string
  store: string
  chargeFlag: 'Chargeable' | 'Non Chargeable'
  reason: string
  remark: string
  preparedBy: string
  /** Purchaser's own e-signature captured on the create form ("My Signature"). */
  preparedSignature: string
  createdAt: string
  lines: RateRevisionLine[]
  status: RequestStatus
  remarks: ApprovalRemark[]
}

// ── Item Comparison (rebuilt from the .NET Excel-upload flow) ────────────────
export interface ComparisonCell {
  supplierId: string
  rate: number
  mrp: number
  remark: string
}

export interface ComparisonRow {
  itemName: string
  /** Optional alternate/substitute item (from the item list) offered in place of the requested one. */
  alternateItem?: string
  cells: ComparisonCell[]
}

export interface Comparison {
  id: string
  compNo: string
  compDate: string
  store: string
  remark: string
  supplierIds: string[]
  rows: ComparisonRow[]
  status: RequestStatus
  /** Vendor chosen by HOD / CEO during approval. */
  selectedSupplierId: string
  remarks: ApprovalRemark[]
}

export type RequestStatus =
  | 'draft'
  | 'pending_hod'
  | 'pending_ceo'
  | 'approved'
  | 'rejected'

export interface ApprovalRemark {
  role: Role
  author: string
  decision: 'approved' | 'rejected'
  remark: string
  /** Base64 data-URL of the drawn e-signature captured at approval time. */
  signature: string
  timestamp: string
}

