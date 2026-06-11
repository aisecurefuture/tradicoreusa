import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import CartItem from '../../components/CartItem/CartItem'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-bg-warm rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      </div>
      <h2 className="font-heading text-2xl font-bold text-primary mb-2">Your cart is empty</h2>
      <p className="text-muted mb-8">Add some products to get started.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/collections/moulding-trim" className="btn-primary">Shop Moulding & Trim</Link>
        <Link to="/collections/tropical-hardwood" className="btn-secondary">Browse Hardwood Species</Link>
      </div>
    </div>
  )
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    document.title = `Cart (${cartCount}) | TradiCore USA`
  }, [cartCount])

  const handleRemove = (id) => {
    const item = cartItems.find(i => i.id === id)
    removeFromCart(id)
    if (item) toast.info(`${item.name} removed from cart`)
  }

  return (
    <Layout>
      <div className="container-site py-8">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Cart' },
        ]} />
        <div className="flex items-center justify-between mt-2 mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary">
            Your Cart {cartCount > 0 && <span className="text-muted text-2xl font-normal">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>}
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => { clearCart(); toast.info('Cart cleared') }}
              className="text-sm text-muted hover:text-error transition-colors"
            >
              Clear cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Line items */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQtyChange={updateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link to="/collections/moulding-trim" className="text-sm text-accent hover:underline flex items-center gap-1">
                  ← Continue Shopping
                </Link>
                <Link to="/collections/tropical-hardwood" className="text-sm text-accent hover:underline">
                  Browse Hardwood Species →
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  showCheckoutButton
                />
                <p className="text-xs text-muted text-center mt-3">
                  Taxes and shipping calculated at checkout.{' '}
                  <Link to="/faq" className="text-accent hover:underline">Have questions?</Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
