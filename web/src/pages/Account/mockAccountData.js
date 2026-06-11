// Mock data for account dashboard — replace with real API calls

export const mockOrders = [
  {
    id: 'TC-20250401-1842',
    date: '2025-04-01',
    status: 'delivered',
    total: 1248.00,
    items: [
      { name: 'Crown Moulding 4-1/4"', sku: 'TCM-CM-002', qty: 200, unit: 'lf', price: 1.98 },
      { name: 'Base Moulding 3-1/2"', sku: 'TCM-BB-001', qty: 350, unit: 'lf', price: 0.88 },
    ],
    shipping: { name: 'Patrick Kelly', address: '742 N Milwaukee Ave', city: 'Chicago', state: 'IL', zip: '60642' },
    payment: { method: 'ACH', last4: null },
  },
  {
    id: 'TC-20250318-0991',
    date: '2025-03-18',
    status: 'delivered',
    total: 3420.00,
    items: [
      { name: 'Basralocus Decking', sku: 'TCH-BAS-D', qty: 380, unit: 'bf', price: 9.00 },
    ],
    shipping: { name: 'Patrick Kelly', address: '742 N Milwaukee Ave', city: 'Chicago', state: 'IL', zip: '60642' },
    payment: { method: 'ACH', last4: null },
  },
  {
    id: 'TC-20250210-0554',
    date: '2025-02-10',
    status: 'delivered',
    total: 895.50,
    items: [
      { name: 'Door Casing Victorian', sku: 'TCM-DC-001', qty: 15, unit: 'set', price: 59.70 },
    ],
    shipping: { name: 'Patrick Kelly', address: '742 N Milwaukee Ave', city: 'Chicago', state: 'IL', zip: '60642' },
    payment: { method: 'Card', last4: '4242' },
  },
]

export const mockAddresses = [
  {
    id: 'addr_001',
    label: 'Office / Warehouse',
    default: true,
    name: 'Patrick Kelly',
    company: 'TradiCore Lumber and Products',
    address: '742 N Milwaukee Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60642',
    phone: '224-715-6452',
  },
  {
    id: 'addr_002',
    label: 'Job Site — Lincoln Park',
    default: false,
    name: 'Patrick Kelly',
    company: '',
    address: '2150 N Lincoln Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60614',
    phone: '224-715-6452',
  },
]

export const mockHardwoodQuotes = [
  {
    id: 'QH-20250405',
    date: '2025-04-05',
    status: 'quoted',
    species: 'Basralocus (BAS)',
    application: 'Exterior Decking',
    volume: '500 bf',
    notes: 'Need kiln-dried, clear grade. Job start June 1.',
    respondedAt: '2025-04-07',
    quoteAmount: 4875.00,
  },
  {
    id: 'QH-20250220',
    date: '2025-02-20',
    status: 'fulfilled',
    species: 'Bruinhart (BRH)',
    application: 'Flooring',
    volume: '300 bf',
    notes: 'Residential living room, 4" face width preferred.',
    respondedAt: '2025-02-22',
    quoteAmount: 3600.00,
  },
  {
    id: 'QH-20250601',
    date: '2025-06-01',
    status: 'pending',
    species: 'Groenhart (GRH)',
    application: 'Structural Beams',
    volume: '1,200 bf',
    notes: 'Commercial project, need FSC cert if possible.',
    respondedAt: null,
    quoteAmount: null,
  },
]

export const STATUS_COLORS = {
  delivered:  'bg-green-100 text-green-700',
  shipped:    'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  pending:    'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-600',
  quoted:     'bg-accent/10 text-accent',
  fulfilled:  'bg-green-100 text-green-700',
}
