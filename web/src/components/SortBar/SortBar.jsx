const SORT_OPTIONS = [
  { value: '',           label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc',   label: 'Name: A–Z' },
]

export default function SortBar({ sort, onSort, total, showing }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border mb-6">
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-primary">{showing}</span> of{' '}
        <span className="font-medium text-primary">{total}</span> products
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm text-muted whitespace-nowrap">Sort by</label>
        <select
          id="sort-select"
          value={sort}
          onChange={e => onSort(e.target.value)}
          className="input-base py-1.5 text-sm w-auto"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
