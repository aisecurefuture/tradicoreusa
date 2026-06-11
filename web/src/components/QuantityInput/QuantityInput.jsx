export default function QuantityInput({ value, onChange, min = 1, max = 999 }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className="inline-flex items-center border border-border rounded overflow-hidden">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center text-primary hover:bg-bg-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
        </svg>
      </button>
      <input
        type="number"
        value={value}
        onChange={e => {
          const n = parseInt(e.target.value, 10)
          if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
        }}
        className="w-12 h-9 text-center text-sm font-medium border-x border-border focus:outline-none bg-white"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-primary hover:bg-bg-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
