const variants = {
  'coming-soon': 'bg-amber-100 text-amber-800',
  'in-stock':    'bg-green-100 text-green-800',
  'new':         'bg-blue-100 text-blue-800',
  'trade':       'bg-primary/10 text-primary',
  'species':     'bg-accent/20 text-primary',
  'primed':      'bg-gray-100 text-gray-700',
  'raw':         'bg-orange-100 text-orange-700',
  'painted':     'bg-sky-100 text-sky-700',
  'vinyl':       'bg-purple-100 text-purple-700',
}

export default function Badge({ variant = 'new', children, className = '' }) {
  return (
    <span className={`badge ${variants[variant] ?? variants.new} ${className}`}>
      {children}
    </span>
  )
}
