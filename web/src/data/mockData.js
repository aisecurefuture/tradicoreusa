// Moulding & Trim products (MDF/Engineered)

const img = (name) =>
  `https://placehold.co/600x400/2B4A6B/FAF7F2?text=${encodeURIComponent(name)}`

export const mouldingProducts = [
  // ── CROWN MOULDING ─────────────────────────────────────────────────────────
  {
    id: 'cm-001', name: 'Classic Profile Crown Moulding 3-1/2"', slug: 'classic-crown-moulding-3-5in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-001', price: 1.45, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Traditional ogee profile crown moulding, factory primed and ready for paint. Perfect for standard 8–9 ft ceilings.',
    dimensions: { height: '3.5"', thickness: '0.75"', length: '8 ft / 16 ft' },
    imageUrl: img('Classic Crown 3.5"'),
  },
  {
    id: 'cm-002', name: 'Grand Profile Crown Moulding 5-1/4"', slug: 'grand-crown-moulding-5-25in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-002', price: 2.20, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Large-scale crown for high ceilings and formal rooms. Deeply sculpted profile with clean primed surface.',
    dimensions: { height: '5.25"', thickness: '0.75"', length: '16 ft' },
    imageUrl: img('Grand Crown 5.25"'),
  },
  {
    id: 'cm-003', name: 'Simple Cove Crown Moulding 2-1/4"', slug: 'simple-cove-crown-2-25in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-003', price: 0.98, unit: 'linear ft',
    material: 'MDF', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Clean cove profile for contemporary interiors. Ships raw — prime before painting.',
    dimensions: { height: '2.25"', thickness: '0.625"', length: '8 ft / 16 ft' },
    imageUrl: img('Cove Crown 2.25"'),
  },
  {
    id: 'cm-004', name: 'Colonial Crown Moulding 4"', slug: 'colonial-crown-moulding-4in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-004', price: 1.75, unit: 'linear ft',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Solid Radiata Pine colonial crown with pronounced step profile. Ships raw for stain or paint.',
    dimensions: { height: '4"', thickness: '0.875"', length: '16 ft' },
    imageUrl: img('Colonial Crown 4"'),
  },
  {
    id: 'cm-005', name: 'White Painted Crown Moulding 3-1/2"', slug: 'white-painted-crown-3-5in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-005', price: 1.85, unit: 'linear ft',
    material: 'MDF', finish: 'Painted', inStock: true, comingSoon: false,
    description: 'Ready-to-install white finish crown. No additional painting required for standard white trim packages.',
    dimensions: { height: '3.5"', thickness: '0.75"', length: '16 ft' },
    imageUrl: img('White Crown 3.5"'),
  },
  {
    id: 'cm-006', name: 'Vinyl Wrapped Crown Moulding 3-1/2"', slug: 'vinyl-crown-3-5in',
    categorySlug: 'crown-moulding', sku: 'TCM-CM-006', price: 2.10, unit: 'linear ft',
    material: 'MDF', finish: 'Vinyl Film', inStock: true, comingSoon: false,
    description: 'Moisture-resistant vinyl-wrapped crown ideal for kitchens, bathrooms, and humid spaces.',
    dimensions: { height: '3.5"', thickness: '0.75"', length: '16 ft' },
    imageUrl: img('Vinyl Crown 3.5"'),
  },

  // ── BASEBOARDS / SKIRTING ──────────────────────────────────────────────────
  {
    id: 'bb-001', name: 'Colonial Baseboard 3-1/2"', slug: 'colonial-baseboard-3-5in',
    categorySlug: 'baseboards', sku: 'TCM-BB-001', price: 0.95, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Classic colonial profile baseboard, factory primed. The most popular profile for new residential construction.',
    dimensions: { height: '3.5"', thickness: '0.5"', length: '16 ft' },
    imageUrl: img('Colonial Base 3.5"'),
  },
  {
    id: 'bb-002', name: 'Flat Baseboard 4-1/4"', slug: 'flat-baseboard-4-25in',
    categorySlug: 'baseboards', sku: 'TCM-BB-002', price: 1.10, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Contemporary flat baseboard for modern interiors. Clean lines, no profile detail.',
    dimensions: { height: '4.25"', thickness: '0.5"', length: '16 ft' },
    imageUrl: img('Flat Base 4.25"'),
  },
  {
    id: 'bb-003', name: 'Ogee Baseboard 5-1/4"', slug: 'ogee-baseboard-5-25in',
    categorySlug: 'baseboards', sku: 'TCM-BB-003', price: 1.55, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Traditional ogee-top baseboard for formal rooms and historic renovations.',
    dimensions: { height: '5.25"', thickness: '0.75"', length: '16 ft' },
    imageUrl: img('Ogee Base 5.25"'),
  },
  {
    id: 'bb-004', name: 'Pine Baseboard 3-1/2"', slug: 'pine-baseboard-3-5in',
    categorySlug: 'baseboards', sku: 'TCM-BB-004', price: 0.88, unit: 'linear ft',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Solid Radiata Pine baseboard, ships raw. Stains beautifully or accepts any primer.',
    dimensions: { height: '3.5"', thickness: '0.625"', length: '16 ft' },
    imageUrl: img('Pine Base 3.5"'),
  },

  // ── DOOR CASING ───────────────────────────────────────────────────────────
  {
    id: 'dc-001', name: 'Colonial Door Casing 2-1/2"', slug: 'colonial-door-casing-2-5in',
    categorySlug: 'door-casing', sku: 'TCM-DC-001', price: 0.98, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Standard colonial door casing profile, factory primed. Matches TCM-BB-001 colonial baseboard for a coordinated trim package.',
    dimensions: { height: '2.5"', thickness: '0.5"', length: '7 ft / 16 ft' },
    imageUrl: img('Colonial Casing 2.5"'),
  },
  {
    id: 'dc-002', name: 'Ranch Door Casing 2-1/4"', slug: 'ranch-door-casing-2-25in',
    categorySlug: 'door-casing', sku: 'TCM-DC-002', price: 0.85, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Simple ranch-style flat casing for contemporary and ranch-style homes.',
    dimensions: { height: '2.25"', thickness: '0.5"', length: '7 ft / 16 ft' },
    imageUrl: img('Ranch Casing 2.25"'),
  },
  {
    id: 'dc-003', name: 'Craftsman Door Casing 3-1/2"', slug: 'craftsman-door-casing-3-5in',
    categorySlug: 'door-casing', sku: 'TCM-DC-003', price: 1.20, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Wide craftsman-style door casing with stepped profile. Ideal for bungalows and arts-and-crafts interiors.',
    dimensions: { height: '3.5"', thickness: '0.75"', length: '7 ft / 16 ft' },
    imageUrl: img('Craftsman Casing 3.5"'),
  },
  {
    id: 'dc-004', name: 'Vinyl Wrapped Door Casing 2-1/2"', slug: 'vinyl-door-casing-2-5in',
    categorySlug: 'door-casing', sku: 'TCM-DC-004', price: 1.15, unit: 'linear ft',
    material: 'MDF', finish: 'Vinyl Film', inStock: true, comingSoon: false,
    description: 'Moisture-resistant vinyl-wrapped door casing. Excellent for bathrooms and utility spaces.',
    dimensions: { height: '2.5"', thickness: '0.5"', length: '7 ft / 16 ft' },
    imageUrl: img('Vinyl Casing 2.5"'),
  },

  // ── DOOR FRAMES ───────────────────────────────────────────────────────────
  {
    id: 'df-001', name: 'Standard Door Frame Set 4-9/16"', slug: 'standard-door-frame-4-9-16in',
    categorySlug: 'door-frames', sku: 'TCM-DF-001', price: 42.50, unit: 'set',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Complete door frame set for 4-9/16" wall thickness. Includes two jambs and head jamb, factory primed.',
    dimensions: { width: '4.5625"', length: '7 ft jambs', wallThickness: '4-9/16"' },
    imageUrl: img('Door Frame 4-9/16"'),
  },
  {
    id: 'df-002', name: 'Standard Door Frame Set 6-9/16"', slug: 'standard-door-frame-6-9-16in',
    categorySlug: 'door-frames', sku: 'TCM-DF-002', price: 52.00, unit: 'set',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Door frame set for thicker 6-9/16" exterior walls. Pre-primed for paint.',
    dimensions: { width: '6.5625"', length: '7 ft jambs', wallThickness: '6-9/16"' },
    imageUrl: img('Door Frame 6-9/16"'),
  },
  {
    id: 'df-003', name: 'Flat-Pack Door Frame Pine 4-9/16"', slug: 'flat-pack-door-frame-pine-4-9-16in',
    categorySlug: 'door-frames', sku: 'TCM-DF-003', price: 38.00, unit: 'set',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Raw Radiata Pine door frame set. Ships unfinished for stain or custom paint.',
    dimensions: { width: '4.5625"', length: '7 ft jambs', wallThickness: '4-9/16"' },
    imageUrl: img('Pine Door Frame'),
  },
  {
    id: 'df-004', name: 'Adjustable Door Frame 3-5/8" to 6-5/8"', slug: 'adjustable-door-frame',
    categorySlug: 'door-frames', sku: 'TCM-DF-004', price: 64.00, unit: 'set',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Adjustable-width door frame accommodates variable wall thicknesses from 3-5/8" to 6-5/8". Ideal for remodel projects.',
    dimensions: { width: '3.625"–6.625" adjustable', length: '7 ft jambs' },
    imageUrl: img('Adjustable Door Frame'),
  },

  // ── WALL PANELS ───────────────────────────────────────────────────────────
  {
    id: 'wp-001', name: 'Flat MDF Wall Panel 4×8', slug: 'flat-mdf-wall-panel-4x8',
    categorySlug: 'wall-panels', sku: 'TCM-WP-001', price: 28.50, unit: 'piece',
    material: 'MDF', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Standard 4×8 MDF wall panel for wainscoting and decorative wall treatments. Smooth, paint-ready surface.',
    dimensions: { width: '48"', height: '96"', thickness: '1/4"' },
    imageUrl: img('MDF Wall Panel 4x8'),
  },
  {
    id: 'wp-002', name: 'Beadboard Wall Panel 4×8', slug: 'beadboard-wall-panel-4x8',
    categorySlug: 'wall-panels', sku: 'TCM-WP-002', price: 34.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Classic beadboard-pattern wall panel, factory primed. Popular for mudrooms, laundry rooms, and cottage-style kitchens.',
    dimensions: { width: '48"', height: '96"', thickness: '3/16"', beadSpacing: '1.5"' },
    imageUrl: img('Beadboard Panel 4x8'),
  },
  {
    id: 'wp-003', name: 'Shiplap MDF Panel 4×8', slug: 'shiplap-mdf-panel-4x8',
    categorySlug: 'wall-panels', sku: 'TCM-WP-003', price: 38.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Authentic shiplap-profile MDF panel. Farmhouse and coastal style rooms. Primed for any paint color.',
    dimensions: { width: '48"', height: '96"', thickness: '3/8"', lapWidth: '5.5"' },
    imageUrl: img('Shiplap Panel 4x8'),
  },
  {
    id: 'wp-004', name: 'V-Groove Wall Panel 4×8', slug: 'v-groove-wall-panel-4x8',
    categorySlug: 'wall-panels', sku: 'TCM-WP-004', price: 36.50, unit: 'piece',
    material: 'MDF', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'V-groove paneling for traditional and transitional interiors. Crisp routed lines add visual depth.',
    dimensions: { width: '48"', height: '96"', thickness: '1/4"', grooveSpacing: '4"' },
    imageUrl: img('V-Groove Panel 4x8'),
  },

  // ── STAIR PARTS ───────────────────────────────────────────────────────────
  {
    id: 'sp-001', name: 'Box Newel Post 4×4 — 36"', slug: 'box-newel-post-4x4-36in',
    categorySlug: 'stair-parts', sku: 'TCM-SP-001', price: 68.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Hollow box newel post, factory primed. Classic square-cap profile suitable for traditional and transitional staircases.',
    dimensions: { base: '4"×4"', height: '36"' },
    imageUrl: img('Box Newel 4x4 36"'),
  },
  {
    id: 'sp-002', name: 'Stair Tread Nosing 1-1/4×3-1/2"', slug: 'stair-nosing-1-25x3-5in',
    categorySlug: 'stair-parts', sku: 'TCM-SP-002', price: 1.80, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Bullnose stair nosing for carpet or tile to hardwood transitions. Pre-primed.',
    dimensions: { width: '3.5"', thickness: '1.25"', length: '8 ft' },
    imageUrl: img('Stair Nosing'),
  },
  {
    id: 'sp-003', name: 'Baluster Bracket Rail Cap 2-1/4"', slug: 'baluster-rail-cap-2-25in',
    categorySlug: 'stair-parts', sku: 'TCM-SP-003', price: 1.45, unit: 'linear ft',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Handrail cap moulding for baluster bracket systems. Accepts standard 1-3/8" pin-top balusters.',
    dimensions: { width: '2.25"', thickness: '1"', length: '12 ft' },
    imageUrl: img('Rail Cap 2.25"'),
  },
  {
    id: 'sp-004', name: 'Stair Skirtboard 9-1/4"', slug: 'stair-skirtboard-9-25in',
    categorySlug: 'stair-parts', sku: 'TCM-SP-004', price: 2.65, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Wide stair skirtboard to conceal stringer and finish the stairwell wall. Factory primed.',
    dimensions: { height: '9.25"', thickness: '0.75"', length: '16 ft' },
    imageUrl: img('Stair Skirtboard 9.25"'),
  },

  // ── S3S / S4S BOARDS ──────────────────────────────────────────────────────
  {
    id: 'bd-001', name: 'S4S MDF Board 1×4', slug: 's4s-mdf-board-1x4',
    categorySlug: 'boards', sku: 'TCM-BD-001', price: 0.72, unit: 'linear ft',
    material: 'MDF', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Standard S4S (surfaced four sides) MDF board. Used for built-ins, shelving, and panel frames.',
    dimensions: { nominal: '1×4', actual: '3/4"×3-1/2"', length: '8 ft / 16 ft' },
    imageUrl: img('S4S MDF 1x4'),
  },
  {
    id: 'bd-002', name: 'S4S MDF Board 1×6', slug: 's4s-mdf-board-1x6',
    categorySlug: 'boards', sku: 'TCM-BD-002', price: 0.95, unit: 'linear ft',
    material: 'MDF', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'S4S MDF board 1×6 — popular for painted shelving, cabinet toe kicks, and window stools.',
    dimensions: { nominal: '1×6', actual: '3/4"×5-1/2"', length: '8 ft / 16 ft' },
    imageUrl: img('S4S MDF 1x6'),
  },
  {
    id: 'bd-003', name: 'S4S Pine Board 1×8', slug: 's4s-pine-board-1x8',
    categorySlug: 'boards', sku: 'TCM-BD-003', price: 1.30, unit: 'linear ft',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'S4S Radiata Pine 1×8. A versatile dimensional board for shelving, paneling, and millwork.',
    dimensions: { nominal: '1×8', actual: '3/4"×7-1/4"', length: '8 ft / 16 ft' },
    imageUrl: img('S4S Pine 1x8'),
  },
  {
    id: 'bd-004', name: 'S4S Poplar Board 1×4', slug: 's4s-poplar-board-1x4',
    categorySlug: 'boards', sku: 'TCM-BD-004', price: 1.10, unit: 'linear ft',
    material: 'Poplar', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'S4S Poplar dimensional board. Machines well, takes paint superbly — a contractor favorite for painted casework.',
    dimensions: { nominal: '1×4', actual: '3/4"×3-1/2"', length: '8 ft / 16 ft' },
    imageUrl: img('S4S Poplar 1x4'),
  },

  // ── QUARTER ROUND ─────────────────────────────────────────────────────────
  {
    id: 'qr-001', name: 'Quarter Round 3/4"', slug: 'quarter-round-3-4in',
    categorySlug: 'quarter-round', sku: 'TCM-QR-001', price: 0.42, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Standard 3/4" quarter round for floor-to-wall transitions and inside corner finishing. Factory primed.',
    dimensions: { size: '3/4"×3/4"', length: '8 ft / 16 ft' },
    imageUrl: img('Quarter Round 3/4"'),
  },
  {
    id: 'qr-002', name: 'Quarter Round 1-1/16"', slug: 'quarter-round-1-1-16in',
    categorySlug: 'quarter-round', sku: 'TCM-QR-002', price: 0.55, unit: 'linear ft',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Oversized quarter round for luxury trim packages. Works as base shoe or decorative bead.',
    dimensions: { size: '1-1/16"×1-1/16"', length: '16 ft' },
    imageUrl: img('Quarter Round 1-1/16"'),
  },
  {
    id: 'qr-003', name: 'Quarter Round Pine 3/4"', slug: 'quarter-round-pine-3-4in',
    categorySlug: 'quarter-round', sku: 'TCM-QR-003', price: 0.38, unit: 'linear ft',
    material: 'Radiata Pine', finish: 'Raw', inStock: true, comingSoon: false,
    description: 'Solid pine quarter round, ships raw. Stainable to match hardwood floors.',
    dimensions: { size: '3/4"×3/4"', length: '8 ft / 16 ft' },
    imageUrl: img('Pine Quarter Round'),
  },
  {
    id: 'qr-004', name: 'Vinyl Wrapped Quarter Round 3/4"', slug: 'vinyl-quarter-round-3-4in',
    categorySlug: 'quarter-round', sku: 'TCM-QR-004', price: 0.52, unit: 'linear ft',
    material: 'MDF', finish: 'Vinyl Film', inStock: true, comingSoon: false,
    description: 'Moisture-resistant vinyl-wrapped quarter round. Great for tile and vinyl plank flooring installations.',
    dimensions: { size: '3/4"×3/4"', length: '16 ft' },
    imageUrl: img('Vinyl Quarter Round'),
  },

  // ── SHUTTERS ──────────────────────────────────────────────────────────────
  {
    id: 'sh-001', name: 'Interior Plantation Shutter 14×36"', slug: 'interior-plantation-shutter-14x36',
    categorySlug: 'shutters', sku: 'TCM-SH-001', price: 48.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Interior plantation shutter panel, factory primed. 2.5" louvers. Sold in pairs.',
    dimensions: { width: '14"', height: '36"', louverWidth: '2.5"' },
    imageUrl: img('Plantation Shutter 14x36'),
  },
  {
    id: 'sh-002', name: 'Interior Plantation Shutter 18×48"', slug: 'interior-plantation-shutter-18x48',
    categorySlug: 'shutters', sku: 'TCM-SH-002', price: 62.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Full-height interior plantation shutter panel. Popular for bedroom and living room windows.',
    dimensions: { width: '18"', height: '48"', louverWidth: '3.5"' },
    imageUrl: img('Plantation Shutter 18x48'),
  },
  {
    id: 'sh-003', name: 'Vinyl Plantation Shutter 14×36"', slug: 'vinyl-plantation-shutter-14x36',
    categorySlug: 'shutters', sku: 'TCM-SH-003', price: 58.00, unit: 'piece',
    material: 'MDF', finish: 'Vinyl Film', inStock: true, comingSoon: false,
    description: 'Vinyl-wrapped plantation shutter. Highly moisture-resistant — ideal for bathrooms and laundry rooms.',
    dimensions: { width: '14"', height: '36"', louverWidth: '2.5"' },
    imageUrl: img('Vinyl Shutter 14x36'),
  },
  {
    id: 'sh-004', name: 'Café-Height Plantation Shutter 18×24"', slug: 'cafe-plantation-shutter-18x24',
    categorySlug: 'shutters', sku: 'TCM-SH-004', price: 42.00, unit: 'piece',
    material: 'MDF', finish: 'Primed', inStock: true, comingSoon: false,
    description: 'Café-height (lower half only) plantation shutter for privacy while maintaining natural light.',
    dimensions: { width: '18"', height: '24"', louverWidth: '2.5"' },
    imageUrl: img('Cafe Shutter 18x24'),
  },
]

export const mouldingCategories = [
  { slug: 'crown-moulding',  label: 'Crown Moulding',       description: 'Traditional and contemporary crown profiles for ceilings and wall-ceiling transitions.' },
  { slug: 'baseboards',      label: 'Baseboards & Skirting', description: 'Colonial, flat, ogee, and custom baseboard profiles in MDF and pine.' },
  { slug: 'door-casing',     label: 'Door Casing',           description: 'Matching door casing for every baseboard profile — colonial, ranch, craftsman.' },
  { slug: 'door-frames',     label: 'Door Frames',           description: 'Complete door jamb sets for standard and non-standard wall thicknesses.' },
  { slug: 'wall-panels',     label: 'Wall Panels',           description: 'MDF beadboard, shiplap, V-groove, and flat panels for wainscoting and accent walls.' },
  { slug: 'stair-parts',     label: 'Stair Parts',           description: 'Newel posts, rail caps, nosing, and skirtboards to complete your staircase.' },
  { slug: 'boards',          label: 'S3S / S4S Boards',      description: 'Dimensioned and surfaced boards in MDF, pine, and poplar for built-ins and millwork.' },
  { slug: 'quarter-round',   label: 'Quarter Round',         description: 'Floor trim and inside-corner profiles in every finish.' },
  { slug: 'shutters',        label: 'Shutters',               description: 'Interior plantation shutters in standard sizes — primed, painted, and vinyl-wrapped.' },
]

export function getProductsByCategory(categorySlug) {
  return mouldingProducts.filter(p => p.categorySlug === categorySlug)
}

export function getProductBySlug(slug) {
  return mouldingProducts.find(p => p.slug === slug) || null
}

export function getRelatedProducts(product, count = 3) {
  return mouldingProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, count)
}
