const MATERIALS = ['MDF', 'Radiata Pine', 'South American Pine', 'Falcata', 'Poplar']
const FINISHES  = ['Raw', 'Primed', 'Painted', 'Vinyl Film']

function FilterGroup({ title, options, selected, onChange }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onChange(opt)}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function FilterSidebar({ filters, onChange, onClear }) {
  const toggle = (key, value) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const hasActive = (filters.material?.length || 0) + (filters.finish?.length || 0) > 0

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-primary">Filters</h3>
        {hasActive && (
          <button onClick={onClear} className="text-xs text-accent hover:underline">
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        title="Material"
        options={MATERIALS}
        selected={filters.material || []}
        onChange={v => toggle('material', v)}
      />
      <FilterGroup
        title="Finish"
        options={FINISHES}
        selected={filters.finish || []}
        onChange={v => toggle('finish', v)}
      />
    </aside>
  )
}
