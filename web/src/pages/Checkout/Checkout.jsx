import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Spinner from '../../components/Spinner/Spinner'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { processPayment } from '../../api/orders'
import { formatPriceShort } from '../../utils/formatPrice'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

const PAYMENT_METHODS = [
  { id: 'ach',    label: 'ACH Bank Transfer',  icon: '🏦' },
  { id: 'card',   label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal',              icon: '🅿️' },
]

function Field({ label, id, required, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="label-base">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-muted mt-1">{hint}</p>}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  )
}

function AchPanel({ isLargeOrder }) {
  return (
    <div className="space-y-4">
      {isLargeOrder && (
        <div className="flex items-start gap-3 bg-success/8 border border-success/30 rounded-lg p-4">
          <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-success font-medium">
            ACH recommended for this order — no processing fees for you, and ideal for orders over $500.
          </p>
        </div>
      )}

      {/* Bank linking stub */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-bg-warm">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 6l9-3 9 3M3 14h18M3 18h18" />
          </svg>
        </div>
        <p className="font-semibold text-primary mb-1">Link Your Bank Account</p>
        <p className="text-sm text-muted mb-4">
          Powered by Stripe Financial Connections. Securely connect your bank in seconds — no manual routing numbers needed.
        </p>
        <button
          type="button"
          className="btn-primary mx-auto"
          onClick={() => alert('Stripe Financial Connections will open here when Stripe is integrated.')}
        >
          Connect Bank Account
        </button>
        <p className="text-xs text-muted mt-3">256-bit encryption · NACHA compliant · No login stored</p>
      </div>

      {/* Settlement notice */}
      <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-0.5">Settlement: 3–5 business days</p>
          <p className="text-blue-700">Your order will be confirmed immediately. Funds typically settle within 3–5 business days via ACH.</p>
        </div>
      </div>

      {/* ACH mandate */}
      <div className="bg-gray-50 border border-border rounded-lg p-4 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-primary mb-1">ACH Debit Authorization</p>
        By confirming your order, you authorize TradiCore Lumber and Products to initiate an ACH debit entry to the bank account you linked above for the amount of this order. This authorization is for a one-time debit unless you establish a recurring purchase agreement. You have the right to revoke this authorization by contacting us at{' '}
        <a href="mailto:tradicoreusa@gmail.com" className="text-accent hover:underline">tradicoreusa@gmail.com</a>{' '}
        prior to the settlement date. TradiCore Lumber and Products will not share your bank account information with any third party except as required to process this transaction.
      </div>
    </div>
  )
}

function CardPanel() {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-bg-warm">
        <div className="flex justify-center gap-3 mb-4">
          {['VISA', 'MC', 'AMEX'].map(card => (
            <div key={card} className="bg-white border border-border rounded px-3 py-1.5 text-xs font-bold text-primary shadow-sm">{card}</div>
          ))}
        </div>
        <p className="font-semibold text-primary mb-1">Enter Card Details</p>
        <p className="text-sm text-muted mb-4">Stripe Payment Element will render here when Stripe is integrated.</p>
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div>
            <label className="label-base text-xs">Card Number</label>
            <input type="text" placeholder="•••• •••• •••• ••••" className="input-base" disabled />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base text-xs">Expiry</label>
              <input type="text" placeholder="MM / YY" className="input-base" disabled />
            </div>
            <div>
              <label className="label-base text-xs">CVC</label>
              <input type="text" placeholder="•••" className="input-base" disabled />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted mt-4">2.9% + $0.30 processing fee applies to card payments.</p>
      </div>
    </div>
  )
}

function PayPalPanel() {
  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-bg-warm">
      <div className="w-16 h-10 bg-[#003087] rounded mx-auto mb-4 flex items-center justify-center">
        <span className="text-white font-bold text-lg tracking-tight">Pay<span className="text-[#009CDE]">Pal</span></span>
      </div>
      <p className="font-semibold text-primary mb-1">Pay with PayPal</p>
      <p className="text-sm text-muted mb-4">
        You'll be redirected to PayPal to complete your purchase securely. PayPal SDK will be integrated here.
      </p>
      <p className="text-xs text-muted">Recommended for smaller or first-time orders.</p>
    </div>
  )
}

function validate(form) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = 'Required'
  if (!form.lastName.trim())  errors.lastName  = 'Required'
  if (!form.address.trim())   errors.address   = 'Required'
  if (!form.city.trim())      errors.city      = 'Required'
  if (!form.state)            errors.state     = 'Required'
  if (!/^\d{5}(-\d{4})?$/.test(form.zip)) errors.zip = 'Enter a valid ZIP code'
  if (!form.phone.trim())     errors.phone     = 'Required'
  return errors
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('ach')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const isLargeOrder = cartTotal >= 1000

  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', poNumber: '',
    address: '', city: '', state: '', zip: '', phone: '',
    needsInvoice: false,
  })

  useEffect(() => {
    document.title = 'Checkout | TradiCore Lumber and Products'
    // Auto-recommend ACH for large orders
    if (cartTotal >= 1000) setPaymentMethod('ach')
  }, [cartTotal])

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (paymentMethod === 'paypal') {
      toast.info('Redirecting to PayPal… (stub)')
    }

    setSubmitting(true)
    const orderData = { form, cartItems, cartTotal, paymentMethod }
    const res = await processPayment(paymentMethod, orderData)
    setSubmitting(false)

    if (res.success) {
      clearCart()
      toast.success(`Order ${res.data.orderId} confirmed! ${paymentMethod === 'ach' ? 'Funds will settle in 3–5 business days.' : 'Payment processed.'}`)
      navigate('/')
    } else {
      toast.error('Payment failed. Please try again or contact us directly.')
    }
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container-site py-24 text-center">
          <h1 className="font-heading text-2xl text-primary mb-4">Your cart is empty</h1>
          <Link to="/collections/moulding-trim" className="btn-primary">Start Shopping</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container-site py-8">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]} />

        <h1 className="font-heading text-3xl font-bold text-primary mt-2 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: forms ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Shipping */}
              <div className="card p-6">
                <h2 className="font-heading font-semibold text-primary text-xl mb-6 pb-4 border-b border-border">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="First Name" id="firstName" required error={errors.firstName}>
                    <input id="firstName" type="text" value={form.firstName} onChange={set('firstName')}
                      className={`input-base ${errors.firstName ? 'border-error' : ''}`} />
                  </Field>
                  <Field label="Last Name" id="lastName" required error={errors.lastName}>
                    <input id="lastName" type="text" value={form.lastName} onChange={set('lastName')}
                      className={`input-base ${errors.lastName ? 'border-error' : ''}`} />
                  </Field>
                  <Field label="Company Name" id="company" hint="For contractor / business orders">
                    <input id="company" type="text" value={form.company} onChange={set('company')} className="input-base" />
                  </Field>
                  <Field label="PO Number" id="poNumber" hint="Optional — for your bookkeeping">
                    <input id="poNumber" type="text" value={form.poNumber} onChange={set('poNumber')} className="input-base" placeholder="e.g. PO-2026-0042" />
                  </Field>
                  <Field label="Street Address" id="address" required error={errors.address} className="sm:col-span-2">
                    <input id="address" type="text" value={form.address} onChange={set('address')}
                      className={`input-base ${errors.address ? 'border-error' : ''}`} />
                  </Field>
                  <Field label="City" id="city" required error={errors.city}>
                    <input id="city" type="text" value={form.city} onChange={set('city')}
                      className={`input-base ${errors.city ? 'border-error' : ''}`} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="State" id="state" required error={errors.state}>
                      <select id="state" value={form.state} onChange={set('state')}
                        className={`input-base ${errors.state ? 'border-error' : ''}`}>
                        <option value="">Select…</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="ZIP Code" id="zip" required error={errors.zip}>
                      <input id="zip" type="text" value={form.zip} onChange={set('zip')} maxLength={10}
                        className={`input-base ${errors.zip ? 'border-error' : ''}`} placeholder="60096" />
                    </Field>
                  </div>
                  <Field label="Phone" id="phone" required error={errors.phone}>
                    <input id="phone" type="tel" value={form.phone} onChange={set('phone')}
                      className={`input-base ${errors.phone ? 'border-error' : ''}`} placeholder="(224) 000-0000" />
                  </Field>
                </div>

                {/* Business record checkbox */}
                <label className="flex items-start gap-3 mt-5 cursor-pointer group">
                  <input type="checkbox" checked={form.needsInvoice} onChange={set('needsInvoice')}
                    className="mt-0.5 w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                  <span className="text-sm text-primary group-hover:text-accent transition-colors">
                    I need a detailed invoice/receipt for business records
                    <span className="block text-xs text-muted font-normal mt-0.5">
                      We'll email an itemized receipt with company details and PO number included.
                    </span>
                  </span>
                </label>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-heading font-semibold text-primary text-xl mb-2 pb-4 border-b border-border">
                  Payment Method
                </h2>

                {/* Method tabs */}
                <div className="flex flex-col sm:flex-row gap-3 my-5">
                  {PAYMENT_METHODS.map(m => {
                    const recommended = m.id === 'ach' && isLargeOrder
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-4 rounded-xl border-2 transition-all ${
                          paymentMethod === m.id
                            ? 'border-accent bg-accent/8 shadow-sm'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className={`text-sm font-semibold ${paymentMethod === m.id ? 'text-primary' : 'text-primary/70'}`}>
                          {m.label}
                        </span>
                        {recommended && (
                          <span className="text-[10px] font-bold bg-success text-white px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Panel */}
                <div className="mt-2">
                  {paymentMethod === 'ach'    && <AchPanel isLargeOrder={isLargeOrder} />}
                  {paymentMethod === 'card'   && <CardPanel />}
                  {paymentMethod === 'paypal' && <PayPalPanel />}
                </div>
              </div>
            </div>

            {/* ── Right: sticky summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Summary */}
                <div className="card p-6">
                  <h3 className="font-heading font-semibold text-primary text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        <img src={item.imageUrl} alt="" className="w-8 h-8 object-cover rounded border border-border flex-shrink-0" />
                        <span className="flex-1 truncate text-primary">{item.name}</span>
                        <span className="text-muted flex-shrink-0">×{item.qty}</span>
                        <span className="font-medium text-primary flex-shrink-0">{formatPriceShort((item.price || 0) * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 text-sm border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium">{formatPriceShort(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Shipping</span>
                      <span className="text-muted italic">TBD</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-bold text-primary">Total</span>
                      <span className="font-bold text-primary text-base">{formatPriceShort(cartTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Processing…
                    </span>
                  ) : paymentMethod === 'ach' ? 'Confirm & Authorize ACH Debit'
                    : paymentMethod === 'paypal' ? 'Continue to PayPal'
                    : 'Place Order'}
                </button>

                <p className="text-xs text-muted text-center">
                  Questions?{' '}
                  <a href="tel:+12247156452" className="text-accent hover:underline">Call Alan (224) 715-6452</a>
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </Layout>
  )
}
