const img = (name) =>
  `https://placehold.co/600x400/1A1A1A/FAF7F2?text=${encodeURIComponent(name)}`

export const doorCategories = [
  {
    id: 'shaker',
    label: 'Shaker Doors',
    description: 'Classic shaker-style doors in multiple panel configurations.',
    products: [
      { id: 'sk-1p', sku: 'TCM-SK-001', name: '1 Panel Shaker', slug: '1-panel-shaker', style: '1 Panel', imageUrl: img('1 Panel Shaker') },
      { id: 'sk-2p', sku: 'TCM-SK-002', name: '2 Panel Shaker', slug: '2-panel-shaker', style: '2 Panel', imageUrl: img('2 Panel Shaker') },
      { id: 'sk-3p', sku: 'TCM-SK-003', name: '3 Panel Shaker', slug: '3-panel-shaker', style: '3 Panel', imageUrl: img('3 Panel Shaker') },
      { id: 'sk-3m', sku: 'TCM-SK-004', name: '3 Mission Shaker', slug: '3-mission-shaker', style: '3 Mission', imageUrl: img('3 Mission Shaker') },
      { id: 'sk-4v', sku: 'TCM-SK-005', name: '4 Vertical Shaker', slug: '4-vertical-shaker', style: '4 Vertical', imageUrl: img('4 Vertical Shaker') },
      { id: 'sk-eq', sku: 'TCM-SK-006', name: 'Equal Shaker', slug: 'equal-shaker', style: 'Equal', imageUrl: img('Equal Shaker') },
    ],
  },
  {
    id: 'smooth-slab',
    label: 'Smooth Slab Doors',
    description: 'Contemporary smooth-face slab doors in a range of profiles.',
    products: [
      { id: 'ss-6ps',    sku: 'TCM-SS-001', name: '6P-S Smooth Slab',    slug: '6p-s-smooth', style: '6P-S',    imageUrl: img('6P-S Smooth') },
      { id: 'ss-4pbt',   sku: 'TCM-SS-002', name: '4Pbt-S Smooth Slab',  slug: '4pbt-s-smooth', style: '4Pbt-S',  imageUrl: img('4Pbt-S Smooth') },
      { id: 'ss-2pst',   sku: 'TCM-SS-003', name: '2Pst-S Smooth Slab',  slug: '2pst-s-smooth', style: '2Pst-S',  imageUrl: img('2Pst-S Smooth') },
      { id: 'ss-t4p',    sku: 'TCM-SS-004', name: 'T4p-S Smooth Slab',   slug: 't4p-s-smooth', style: 'T4p-S',   imageUrl: img('T4p-S Smooth') },
      { id: 'ss-5p',     sku: 'TCM-SS-005', name: '5P-S Smooth Slab',    slug: '5p-s-smooth', style: '5P-S',    imageUrl: img('5P-S Smooth') },
      { id: 'ss-2psk',   sku: 'TCM-SS-006', name: '2PSK-S Smooth Slab',  slug: '2psk-s-smooth', style: '2PSK-S',  imageUrl: img('2PSK-S Smooth') },
      { id: 'ss-fl1',    sku: 'TCM-SS-007', name: 'F-Line-1-S Smooth',   slug: 'f-line-1-s-smooth', style: 'F-Line-1-S', imageUrl: img('F-Line-1-S') },
      { id: 'ss-fl3',    sku: 'TCM-SS-008', name: 'F-Line-3-S Smooth',   slug: 'f-line-3-s-smooth', style: 'F-Line-3-S', imageUrl: img('F-Line-3-S') },
    ],
  },
  {
    id: 'glass',
    label: 'Glass Doors',
    description: 'Interior glass panel doors for natural light and openness.',
    products: [
      { id: 'gl-std', sku: 'TCM-GL-001', name: 'Standard Glass Door',     slug: 'standard-glass-door',  imageUrl: img('Standard Glass Door') },
      { id: 'gl-sq',  sku: 'TCM-GL-002', name: 'Square Top Glass Door',   slug: 'square-top-glass-door', imageUrl: img('Square Top Glass') },
      { id: 'gl-arc', sku: 'TCM-GL-003', name: 'Arch Top Glass Door',     slug: 'arch-top-glass-door',  imageUrl: img('Arch Top Glass') },
      { id: 'gl-fr',  sku: 'TCM-GL-004', name: 'French Glass Door',       slug: 'french-glass-door',    imageUrl: img('French Glass Door') },
    ],
  },
  {
    id: 'oak-slab',
    label: 'Oak Slab Doors',
    description: 'Authentic oak-finish slab doors for premium interiors.',
    products: [
      { id: 'ok-4pbt',   sku: 'TCM-OK-001', name: '4Pbt Oak Slab',      slug: '4pbt-oak-slab',  style: '4Pbt',    imageUrl: img('4Pbt Oak') },
      { id: 'ok-t4p',    sku: 'TCM-OK-002', name: 'T4P Oak Slab',       slug: 't4p-oak-slab',   style: 'T4P',     imageUrl: img('T4P Oak') },
      { id: 'ok-6p',     sku: 'TCM-OK-003', name: '6P Oak Slab',        slug: '6p-oak-slab',    style: '6P',      imageUrl: img('6P Oak') },
      { id: 'ok-cr',     sku: 'TCM-OK-004', name: 'Cr Oak Slab',        slug: 'cr-oak-slab',    style: 'Cr',      imageUrl: img('Cr Oak') },
      { id: 'ok-8p',     sku: 'TCM-OK-005', name: '8P Oak Slab',        slug: '8p-oak-slab',    style: '8P',      imageUrl: img('8P Oak') },
      { id: 'ok-fl',     sku: 'TCM-OK-006', name: 'Flush Oak Slab',     slug: 'flush-oak-slab', style: 'Flush',   imageUrl: img('Flush Oak') },
      { id: 'ok-4pbt-o', sku: 'TCM-OK-007', name: '4Pbt-O Oak Slab',   slug: '4pbt-o-oak-slab', style: '4Pbt-O', imageUrl: img('4Pbt-O Oak') },
      { id: 'ok-2psl',   sku: 'TCM-OK-008', name: '2Psl Oak Slab',      slug: '2psl-oak-slab',  style: '2Psl',    imageUrl: img('2Psl Oak') },
      { id: 'ok-cot',    sku: 'TCM-OK-009', name: 'Cottage Oak Slab',   slug: 'cottage-oak-slab', style: 'Cottage', imageUrl: img('Cottage Oak') },
      { id: 'ok-ncot',   sku: 'TCM-OK-010', name: 'New Cottage Oak Slab', slug: 'new-cottage-oak-slab', style: 'New Cottage', imageUrl: img('New Cottage Oak') },
    ],
  },
]

export const allDoorProducts = doorCategories.flatMap(cat =>
  cat.products.map(p => ({
    ...p,
    categorySlug: 'doors',
    doorCategory: cat.id,
    doorCategoryLabel: cat.label,
    inStock: false,
    comingSoon: true,
    price: null,
    unit: 'piece',
    material: 'MDF',
    finish: 'Primed',
    description: `${p.name} — part of the TradiCore door line. Available soon in standard sizes and custom dimensions.`,
    imageUrl: p.imageUrl,
  }))
)
