import { Link } from 'react-router-dom'
import { formatPriceShort } from '../../utils/formatPrice'

export default function OrderSummary({ cartItems, cartTotal, showCheckoutButton = false, loading = false }) {
  const isLargeOrder = cartTotal >= 1000

  return (
    <div className="card p-6 flex flex-col gap-4">
      <h3 className="font-heading font-semibold text-primary text-lg">Order Summary</h3>

      {/* Line item preview */}
      {cartItems.length > 0 && (
        <div className="space-y-2 border-b border-border pb-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 object-cover rounded border border-border bg-bg-warm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary truncate">{item.name}</p>
                <p className="text-xs text-muted">Qty: {item.qty}</p>
              </div>
              <span className="text-xs font-semibold text-primary flex-shrink-0">
                {formatPriceShort((item.price || 0) * item.qty)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-primary">{formatPriceShort(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span className="text-muted italic">Calculated at checkout</span>
        </div>
        {isLargeOrder && (
          <div className="flex items-start gap-2 bg-success/8 border border-success/20 rounded-lg p-3 mt-2">
            <svg className="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-success font-medium">
              ACH Bank Transfer recommended for orders over $1,000 — no processing fees for you.
            </p>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-3 mt-1">
          <span className="font-bold text-primary">Total</span>
          <span className="font-bold text-primary text-lg">{formatPriceShort(cartTotal)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className={`btn-primary justify-center py-3 text-base ${cartItems.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {loading ? 'Loading…' : 'Proceed to Checkout →'}
        </Link>
      )}
    </div>
  )
}
