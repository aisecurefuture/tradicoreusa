import { Link } from 'react-router-dom'
import QuantityInput from '../QuantityInput/QuantityInput'
import { formatPrice, formatPriceShort } from '../../utils/formatPrice'

export default function CartItem({ item, onQtyChange, onRemove }) {
  const lineTotal = (item.price || 0) * item.qty

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-0">
      {/* Image */}
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg border border-border bg-bg-warm"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          to={`/products/${item.slug}`}
          className="font-semibold text-primary text-sm hover:text-accent transition-colors leading-snug line-clamp-2"
        >
          {item.name}
        </Link>
        <p className="text-xs text-muted">SKU: {item.sku}</p>
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          <span className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-full">{item.material}</span>
          <span className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-full">{item.finish}</span>
          <span className="text-[10px] text-muted">/ {item.unit}</span>
        </div>

        {/* Mobile: price + controls inline */}
        <div className="flex items-center justify-between gap-3 mt-2 sm:hidden">
          <QuantityInput value={item.qty} onChange={qty => onQtyChange(item.id, qty)} />
          <div className="text-right">
            <p className="font-bold text-primary text-sm">{formatPriceShort(lineTotal)}</p>
            <p className="text-xs text-muted">{formatPrice(item.price)} ea.</p>
          </div>
        </div>
      </div>

      {/* Desktop: qty + price column */}
      <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted hover:text-error transition-colors p-0.5"
          aria-label="Remove item"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <QuantityInput value={item.qty} onChange={qty => onQtyChange(item.id, qty)} />
        <div className="text-right">
          <p className="font-bold text-primary">{formatPriceShort(lineTotal)}</p>
          <p className="text-xs text-muted">{formatPrice(item.price)} ea.</p>
        </div>
      </div>

      {/* Mobile remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="sm:hidden self-start text-muted hover:text-error transition-colors p-0.5"
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
