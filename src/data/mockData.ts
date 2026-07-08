import type {
  AlternateItem,
  Comparison,
  Item,
  NewMaterialRequest,
  Quotation,
  RateRevision,
  RFQ,
  User,
  Vendor,
} from '@/types'

const SAMPLE_DOC = 'data:text/plain,Quotation%20Document%20(sample)'

/**
 * Mock data modelled on Saifee Hospital's procurement forms
 * (New Material Approval, Rate Revision, Item Comparison). No backend — this
 * data seeds the stores and pages.
 */

export const HOSPITAL_NAME = 'Saifee Hospital'

export const users: User[] = [
  {
    id: 'u-1',
    name: 'Kamruddin Shaikh',
    email: 'nirav.mehta@millicent.in',
    role: 'purchaser',
    department: 'Purchase Department',
    avatarInitials: 'KS',
  },
  {
    id: 'u-2',
    name: 'Rashida Kagalwala',
    email: 'hod@saifeehospital.in',
    role: 'hod',
    department: 'Materials Management',
    avatarInitials: 'RK',
  },
  {
    id: 'u-3',
    name: 'Dr. Huzaifa Shehabi',
    email: 'ceo@saifeehospital.in',
    role: 'ceo',
    department: 'Executive',
    avatarInitials: 'HS',
  },
]

export const stores = ['General Store', 'Kitchen', 'Pharmacy', 'Histopathology', 'Operation Theatre'] as const

export const vendors: Vendor[] = [
  { id: 'v-1', code: 'S000458', name: 'AIM Safety', rating: 4.5, location: 'Mumbai', leadTimeDays: 4 },
  { id: 'v-2', code: 'S000512', name: 'B. M Enterprises', rating: 4.2, location: 'Mumbai', leadTimeDays: 6 },
  { id: 'v-3', code: 'S002308', name: 'Taheri Enterprises', rating: 4.3, location: 'Mumbai', leadTimeDays: 5 },
  { id: 'v-4', code: 'K000390', name: 'Manoj Enterprises', rating: 4.6, location: 'Lower Parel', leadTimeDays: 2 },
  { id: 'v-5', code: 'K000484', name: 'A-1 Enterprise', rating: 4.1, location: 'Mumbai', leadTimeDays: 3 },
  { id: 'v-6', code: 'S002315', name: 'Adhira Medvice Pvt Ltd', rating: 4.4, location: 'Santacruz (W)', leadTimeDays: 2 },
  { id: 'v-7', code: 'D001077', name: 'OSB Agencies Pvt Ltd', rating: 4.7, location: 'Delhi', leadTimeDays: 7 },
]

export function vendorByCode(code: string) {
  return vendors.find((v) => v.code === code)
}

export const items: Item[] = [
  { id: 'i-1', code: 'GENEITM205', name: 'Air Freshner', category: 'Consumables', store: 'General Store', unit: 'pc', packSize: 1, brand: 'AIR-FRAME', stockQty: 320, reorderLevel: 200, lastPurchasePrice: 55, mrp: 180, gst: 18, preferredVendorId: 'v-5' },
  { id: 'i-2', code: 'GENSAF110', name: 'Safety Helmet Yellow - Karam Make', category: 'Safety', store: 'General Store', unit: 'pc', packSize: 1, brand: 'Karam', stockQty: 42, reorderLevel: 60, lastPurchasePrice: 225, mrp: 300, gst: 18, preferredVendorId: 'v-1' },
  { id: 'i-3', code: 'KITCCPG012', name: 'Ghee Pure Amul Pouch 1 Ltr', category: 'Kitchen', store: 'Kitchen', unit: 'pouch', packSize: 1, brand: 'Amul', stockQty: 96, reorderLevel: 120, lastPurchasePrice: 572.95, mrp: 635, gst: 5, preferredVendorId: 'v-4' },
  { id: 'i-4', code: 'OTKNF952', name: 'Opthal Knife 2.2mm Code 952222', category: 'Surgical', store: 'Operation Theatre', unit: 'pc', packSize: 10, brand: 'Primeline', stockQty: 18, reorderLevel: 25, lastPurchasePrice: 85.71, mrp: 112.5, gst: 5, preferredVendorId: 'v-6' },
  { id: 'i-5', code: 'HISCD68', name: 'CD68 KP 1 - 1ml Cat No 168M-97', category: 'Lab Reagent', store: 'Histopathology', unit: 'vial', packSize: 1, brand: 'Cell Marque', stockQty: 4, reorderLevel: 6, lastPurchasePrice: 19800, mrp: 0, gst: 5, preferredVendorId: 'v-7' },
  { id: 'i-6', code: 'HISGFAP', name: 'GFAP EP672Y 1ml Cat No 258R-17', category: 'Lab Reagent', store: 'Histopathology', unit: 'vial', packSize: 1, brand: 'Cell Marque', stockQty: 3, reorderLevel: 5, lastPurchasePrice: 23040, mrp: 0, gst: 5, preferredVendorId: 'v-7' },
  { id: 'i-7', code: 'HISVIM', name: 'Vimentin V9 1ml Cat No 347M-17', category: 'Lab Reagent', store: 'Histopathology', unit: 'vial', packSize: 1, brand: 'Cell Marque', stockQty: 5, reorderLevel: 5, lastPurchasePrice: 19800, mrp: 0, gst: 5, preferredVendorId: 'v-7' },
  { id: 'i-8', code: 'GENGLV340', name: 'Nitrile Examination Gloves (M)', category: 'Consumables', store: 'General Store', unit: 'box', packSize: 100, brand: 'Nulife', stockQty: 210, reorderLevel: 150, lastPurchasePrice: 385, mrp: 450, gst: 12, preferredVendorId: 'v-2' },
  { id: 'i-9', code: 'KITSUG018', name: 'Sugar Refined 1 Kg', category: 'Kitchen', store: 'Kitchen', unit: 'kg', packSize: 1, brand: 'Madhur', stockQty: 140, reorderLevel: 100, lastPurchasePrice: 46, mrp: 55, gst: 5, preferredVendorId: 'v-4' },
  { id: 'i-10', code: 'GENMSK220', name: '3-Ply Surgical Mask', category: 'Consumables', store: 'General Store', unit: 'box', packSize: 50, brand: 'Medisafe', stockQty: 80, reorderLevel: 120, lastPurchasePrice: 92, mrp: 120, gst: 12, preferredVendorId: 'v-3' },
]

export const rfqs: RFQ[] = [
  {
    id: 'r-1',
    rfqNo: 'SH-26-CP-GEN-2026',
    itemId: 'i-2',
    quantity: 50,
    requiredBy: '2026-05-20',
    createdAt: '2026-05-08',
    status: 'quoted',
    quotations: [
      { vendorId: 'v-1', unitPrice: 225, leadTimeDays: 4, moq: 10, notes: 'Karam make, ISI marked' },
      { vendorId: 'v-2', unitPrice: 240, leadTimeDays: 6, moq: 10, notes: 'Includes freight' },
      { vendorId: 'v-3', unitPrice: 235, leadTimeDays: 5, moq: 5, notes: 'Ex-works' },
    ],
  },
  {
    id: 'r-2',
    rfqNo: 'SH-31-CP-KIT-2026',
    itemId: 'i-3',
    quantity: 100,
    requiredBy: '2026-05-25',
    createdAt: '2026-05-10',
    status: 'quoted',
    quotations: [
      { vendorId: 'v-4', unitPrice: 590.86, leadTimeDays: 2, moq: 24, notes: 'Amul authorised' },
      { vendorId: 'v-5', unitPrice: 598, leadTimeDays: 3, moq: 12, notes: 'Includes delivery' },
    ],
  },
  {
    id: 'r-3',
    rfqNo: 'SH-34-CP-GEN-2026',
    itemId: 'i-10',
    quantity: 200,
    requiredBy: '2026-06-01',
    createdAt: '2026-05-22',
    status: 'sent',
    quotations: [],
  },
]

export const alternateItems: AlternateItem[] = [
  {
    id: 'a-1', serialNo: 1, entryDate: '2026-06-18',
    itemCode: 'GENMSK220', itemName: '3-Ply Surgical Mask', brandName: 'Medisafe', rate: 92, mrp: 120, annualConsumption: 4200,
    altItemCode: 'GENMSK221', altItemName: '3-Ply Surgical Mask (Bulk 100s)', altBrandName: 'Medisafe', altRate: 85, altMrp: 118,
    status: 'proposed',
  },
  {
    id: 'a-2', serialNo: 2, entryDate: '2026-06-15',
    itemCode: 'GENGLV340', itemName: 'Nitrile Examination Gloves (M)', brandName: 'Nulife', rate: 385, mrp: 450, annualConsumption: 1800,
    altItemCode: 'GENGLV341', altItemName: 'Nitrile Gloves (M) - Skymed', altBrandName: 'Skymed', altRate: 360, altMrp: 440,
    status: 'accepted',
  },
  {
    id: 'a-3', serialNo: 3, entryDate: '2026-06-10',
    itemCode: 'OTKNF952', itemName: 'Opthal Knife 2.2mm Code 952222', brandName: 'Primeline', rate: 85.71, mrp: 112.5, annualConsumption: 600,
    altItemCode: 'OTKNF953', altItemName: 'Opthal Knife 2.2mm (Alt Brand)', altBrandName: 'Surgi', altRate: 82, altMrp: 110,
    status: 'proposed',
  },
]

export const newMaterialRequests: NewMaterialRequest[] = [
  {
    id: 'nm-1',
    formNo: 'SH-33-CP-GEN-2026',
    supplierName: 'Adhira Medvice Pvt Ltd',
    supplierAddress: '1-17, Rizvi Park Co-op Hsg Soc, S.V Rd, Santacruz (West), Mumbai 400054',
    department: 'Operation Theatre',
    requestedBy: 'Dr Shanawaz Kazi',
    leadTime: '1-2 days',
    chargeFlag: 'Chargeable',
    remark: '1 Vendor - Mr Priyank Patel, Mob 9987976412',
    preparedSignature: '',
    createdAt: '2026-05-25',
    status: 'pending_hod',
    lines: [
      { itemName: 'Opthal Knife 2.2mm Code 952222 Primeline', unit: 'pc', packSize: 10, brand: 'Primeline', qty: 5, consumption: '', quoteRate: 85.71, negotiatedRate: 85.71, mrp: 112.5, gst: 5 },
    ],
    remarks: [],
  },
  {
    id: 'nm-2',
    formNo: 'SH-32-CP-GEN-2026',
    supplierName: 'OSB Agencies Pvt Ltd',
    supplierAddress: '14/1 UGF, Geeta Colony, Delhi 110031',
    department: 'Histopathology',
    requestedBy: 'Dr Ashvini Natu',
    leadTime: '5-7 working days',
    chargeFlag: 'Charges in Package',
    remark: '1 Vendor - Mr Mangesh, Mob 98204 63497. These 3 antibodies are rarely used, changed from 7ml to 1ml.',
    preparedSignature: '',
    createdAt: '2026-05-14',
    status: 'approved',
    lines: [
      { itemName: 'CD68 KP 1 - 1ml Cat No 168M-97 Cell Marque', unit: 'vial', packSize: 1, brand: 'Cell Marque', qty: 1, consumption: '', quoteRate: 22000, negotiatedRate: 19800, mrp: 0, gst: 5 },
      { itemName: 'GFAP EP672Y 1ml Cat No 258R-17 Cell Marque', unit: 'vial', packSize: 1, brand: 'Cell Marque', qty: 1, consumption: '', quoteRate: 25600, negotiatedRate: 23040, mrp: 0, gst: 5 },
      { itemName: 'Vimentin V9 1ml Cat No 347M-17 Cell Marque', unit: 'vial', packSize: 1, brand: 'Cell Marque', qty: 1, consumption: '', quoteRate: 22000, negotiatedRate: 19800, mrp: 0, gst: 5 },
    ],
    remarks: [
      { role: 'hod', author: 'Rashida Kagalwala', decision: 'approved', remark: 'Justified for histopathology. Forwarded.', signature: '', timestamp: '2026-05-15T10:00:00' },
      { role: 'ceo', author: 'Dr. Huzaifa Shehabi', decision: 'approved', remark: 'Approved.', signature: '', timestamp: '2026-05-16T09:30:00' },
    ],
  },
]

export const rateRevisions: RateRevision[] = [
  {
    id: 'rr-1',
    formNo: 'SH-29-RR-KIT-2026',
    supplierName: 'Manoj Enterprises (Lower Parel)',
    brandName: 'Amul',
    userDepartment: 'Kitchen',
    store: 'Kitchen',
    chargeFlag: 'Non Chargeable',
    reason: 'Due to geopolitical scenario the rates are increased',
    remark: '',
    preparedBy: 'Kamruddin',
    preparedSignature: '',
    createdAt: '2026-05-25',
    status: 'approved',
    lines: [
      { itemCode: 'KITCCPG012', itemName: 'Ghee Pure Amul Pouch 1 Ltr', existingRate: 572.95, quotedRate: 590.86, negotiatedRate: 590.86, gst: 5, revisedCostPrice: 590.86, existingMrp: 635, revisedMrp: 660, lastRevisedOn: '2026-05-16', annualConsumption: 244, alternateProducts: '' },
    ],
    remarks: [
      { role: 'hod', author: 'Rashida Kagalwala', decision: 'approved', remark: '', signature: '', timestamp: '2026-05-26T11:00:00' },
      { role: 'ceo', author: 'Dr. Huzaifa Shehabi', decision: 'approved', remark: '', signature: '', timestamp: '2026-05-27T10:00:00' },
    ],
  },
  {
    id: 'rr-2',
    formNo: 'SH-68-RR-GEN-2026',
    supplierName: 'A-1 Enterprise',
    brandName: 'AIR-FRAME',
    userDepartment: 'All Department and Wards',
    store: 'General Store',
    chargeFlag: 'Non Chargeable',
    reason: 'Due to geopolitical scenario the rates are increased',
    remark: '',
    preparedBy: 'Tejal',
    preparedSignature: '',
    createdAt: '2026-05-13',
    status: 'pending_ceo',
    lines: [
      { itemCode: 'GENEITM205', itemName: 'Air Freshner', existingRate: 55, quotedRate: 60, negotiatedRate: 60, gst: 18, revisedCostPrice: 60, existingMrp: 180, revisedMrp: 196, lastRevisedOn: '2023-02-16', annualConsumption: 1386, alternateProducts: '' },
    ],
    remarks: [
      { role: 'hod', author: 'Rashida Kagalwala', decision: 'approved', remark: 'Increase reasonable, forwarding to CEO.', signature: '', timestamp: '2026-05-14T12:00:00' },
    ],
  },
  {
    id: 'rr-3',
    formNo: 'SH-71-RR-GEN-2026',
    supplierName: 'B. M Enterprises',
    brandName: 'Medisafe',
    userDepartment: 'General Store',
    store: 'General Store',
    chargeFlag: 'Chargeable',
    reason: 'Raw material cost escalation from principal',
    remark: 'Third revision this year',
    preparedBy: 'Kamruddin',
    preparedSignature: '',
    createdAt: '2026-06-02',
    status: 'pending_hod',
    lines: [
      { itemCode: 'GENMSK220', itemName: '3-Ply Surgical Mask', existingRate: 92, quotedRate: 101, negotiatedRate: 101, gst: 12, revisedCostPrice: 101, existingMrp: 120, revisedMrp: 132, lastRevisedOn: '2025-11-10', annualConsumption: 4200, alternateProducts: '' },
    ],
    remarks: [],
  },
]

export const comparisons: Comparison[] = [
  {
    id: 'cmp-1',
    compNo: 'SH-51-CP-GEN-2026',
    compDate: '2026-06-22',
    store: 'General Store',
    remark: '',
    status: 'pending_hod',
    selectedSupplierId: '',
    remarks: [],
    supplierIds: ['v-1', 'v-2', 'v-3'],
    rows: [
      { itemName: 'Ball Pen', cells: [
        { supplierId: 'v-1', rate: 2.4, mrp: 5, remark: '' },
        { supplierId: 'v-2', rate: 3, mrp: 5, remark: '' },
        { supplierId: 'v-3', rate: 2.5, mrp: 5, remark: '' },
      ] },
      { itemName: 'Fullscape Paper', cells: [
        { supplierId: 'v-1', rate: 130, mrp: 160, remark: '' },
        { supplierId: 'v-2', rate: 110, mrp: 160, remark: '' },
        { supplierId: 'v-3', rate: 110, mrp: 160, remark: '' },
      ] },
      { itemName: 'CD Cover Plastic', cells: [
        { supplierId: 'v-1', rate: 2, mrp: 6, remark: '' },
        { supplierId: 'v-2', rate: 1.2, mrp: 6, remark: '' },
        { supplierId: 'v-3', rate: 2.5, mrp: 6, remark: '' },
      ] },
    ],
  },
  {
    id: 'cmp-2',
    compNo: 'SH-6-CP-KIT-2026',
    compDate: '2026-06-20',
    store: 'Kitchen',
    remark: 'New manual requirement',
    status: 'approved',
    selectedSupplierId: 'v-4',
    remarks: [
      { role: 'hod', author: 'Rashida Kagalwala', decision: 'approved', remark: 'A M Motiwala selected — best overall.', signature: '', timestamp: '2026-06-21T10:00:00' },
      { role: 'ceo', author: 'Dr. Huzaifa Shehabi', decision: 'approved', remark: 'Agreed.', signature: '', timestamp: '2026-06-22T09:00:00' },
    ],
    supplierIds: ['v-4', 'v-5', 'v-6'],
    rows: [
      { itemName: '160 ML Milton Flask', cells: [
        { supplierId: 'v-4', rate: 373, mrp: 407, remark: '' },
        { supplierId: 'v-5', rate: 384.4, mrp: 407, remark: '' },
        { supplierId: 'v-6', rate: 401, mrp: 407, remark: '' },
      ] },
      { itemName: '300 ML Milton Flask', cells: [
        { supplierId: 'v-4', rate: 424, mrp: 462, remark: '' },
        { supplierId: 'v-5', rate: 439.22, mrp: 462, remark: '' },
        { supplierId: 'v-6', rate: 458, mrp: 462, remark: '' },
      ] },
    ],
  },
]

export const quotations: Quotation[] = [
  {
    id: 'q-1',
    quoNo: 'SH-7-QP-GEN-2026',
    quotDate: '2026-06-08',
    store: 'General Store',
    remark: 'Rate valid for 30 days',
    items: [
      {
        itemCode: 'GENMSK220',
        itemName: '3-Ply Surgical Mask',
        suppliers: [
          { supplierId: 'v-3', supplierCode: 'S002308', supplierName: 'Taheri Enterprises', rate: 92, negotiatedRate: 0, document: { name: 'taheri_mask_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
          { supplierId: 'v-2', supplierCode: 'S000512', supplierName: 'B. M Enterprises', rate: 95, negotiatedRate: 0, document: { name: 'bm_mask_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
          { supplierId: 'v-1', supplierCode: 'S000458', supplierName: 'AIM Safety', rate: 90, negotiatedRate: 0, document: { name: 'aim_mask_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
        ],
      },
      {
        itemCode: 'GENGLV340',
        itemName: 'Nitrile Examination Gloves (M)',
        suppliers: [
          { supplierId: 'v-2', supplierCode: 'S000512', supplierName: 'B. M Enterprises', rate: 385, negotiatedRate: 0, document: { name: 'bm_gloves_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
          { supplierId: 'v-3', supplierCode: 'S002308', supplierName: 'Taheri Enterprises', rate: 372, negotiatedRate: 0, document: { name: 'taheri_gloves_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
        ],
      },
    ],
    quoteFile: { name: 'general_store_quote.pdf', url: SAMPLE_DOC },
    createdAt: '2026-06-08',
  },
  {
    id: 'q-2',
    quoNo: 'SH-6-QP-KIT-2026',
    quotDate: '2026-06-05',
    store: 'Kitchen',
    remark: '',
    items: [
      {
        itemCode: 'KITCCPG012',
        itemName: 'Ghee Pure Amul Pouch 1 Ltr',
        suppliers: [
          { supplierId: 'v-4', supplierCode: 'K000390', supplierName: 'Manoj Enterprises', rate: 590.86, negotiatedRate: 578, document: { name: 'manoj_ghee_quote.xlsx', url: SAMPLE_DOC }, negotiatedDocument: { name: 'manoj_ghee_negotiated.pdf', url: SAMPLE_DOC } },
          { supplierId: 'v-5', supplierCode: 'K000484', supplierName: 'A-1 Enterprise', rate: 598, negotiatedRate: 0, document: { name: 'a1_ghee_quote.pdf', url: SAMPLE_DOC }, negotiatedDocument: null },
        ],
      },
    ],
    quoteFile: { name: 'kitchen_quote.xlsx', url: SAMPLE_DOC },
    createdAt: '2026-06-05',
  },
  {
    id: 'q-3',
    quoNo: 'SH-20-QP-GEN-2026',
    quotDate: '2026-05-19',
    store: 'General Store',
    remark: 'Awaiting negotiation',
    items: [
      {
        itemCode: 'GENSAF110',
        itemName: 'Safety Helmet Yellow - Karam Make',
        suppliers: [
          { supplierId: 'v-1', supplierCode: 'S000458', supplierName: 'AIM Safety', rate: 225, negotiatedRate: 0, document: null, negotiatedDocument: null },
        ],
      },
    ],
    quoteFile: null,
    createdAt: '2026-05-19',
  },
]

export function vendorName(id: string): string {
  return vendors.find((v) => v.id === id)?.name ?? 'Unknown Vendor'
}

export function itemById(id: string): Item | undefined {
  return items.find((i) => i.id === id)
}


















