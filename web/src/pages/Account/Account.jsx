import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { updateProfile } from '../../api/auth'
import { mockOrders, mockAddresses, mockHardwoodQuotes, STATUS_COLORS } from './mockAccountData'

const TABS = [
  { id: 'profile',   label: 'Profile',         icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'orders',    label: 'Order History',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'addresses', label: 'Addresses',        icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { id: 'quotes',    label: 'Hardwood Quotes',  icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
]

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ user, token, updateUser }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
    company:   user?.company   || '',
  })
  const [saving, setSaving] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    try {
      const res = await updateProfile(token, form)
      if (res.success) {
        updateUser(form)
        toast.success('Profile updated.')
      } else {
        toast.error(res.error || 'Update failed.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-heading text-xl font-bold text-primary mb-6">Profile Information</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">First name</label>
            <input type="text" value={form.firstName} onChange={set('firstName')} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Last name</label>
            <input type="text" value={form.lastName} onChange={set('lastName')} className="input-base" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Email address</label>
          <input type="email" value={form.email} onChange={set('email')} className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className="input-base" placeholder="224-715-6452" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={set('company')} className="input-base" placeholder="Optional" />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <h3 className="font-heading text-base font-bold text-primary mb-1">Change Password</h3>
        <p className="text-sm text-muted mb-4">We'll send a reset link to your email address.</p>
        <button className="btn-outline text-sm">Send Reset Link</button>
      </div>

      {user?.role === 'trade' && (
        <div className="mt-8 bg-accent/5 border border-accent/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-semibold text-accent">Trade Account Active</span>
          </div>
          <p className="text-xs text-muted">Your account has wholesale pricing enabled. Contact us at <a href="mailto:tradicoreusa@gmail.com" className="text-accent hover:underline">tradicoreusa@gmail.com</a> with questions.</p>
        </div>
      )}
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [expanded, setExpanded] = useState(null)

  if (mockOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-heading text-lg text-primary mb-1">No orders yet</p>
        <p className="text-muted text-sm mb-6">Your order history will appear here.</p>
        <Link to="/collections/moulding-trim" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-primary mb-6">Order History</h2>
      <div className="space-y-3">
        {mockOrders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Order header row */}
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-mono font-semibold text-primary">{order.id}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`badge text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-heading font-bold text-primary">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <svg className={`w-4 h-4 text-muted transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded detail */}
            {expanded === order.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-body">
                            {item.name}
                            <span className="text-muted ml-2 text-xs">× {item.qty} {item.unit}</span>
                          </span>
                          <span className="font-medium text-primary">${(item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Shipped to</p>
                      <p className="text-sm text-body leading-relaxed">
                        {order.shipping.name}<br />
                        {order.shipping.address}<br />
                        {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Payment</p>
                      <p className="text-sm text-body">
                        {order.payment.method === 'ACH' ? '🏦 ACH Bank Transfer' : `💳 Card ending in ${order.payment.last4}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button className="btn-outline text-sm py-1.5 px-4">Reorder</button>
                  <button className="text-sm text-accent hover:underline">Download Invoice</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────
function AddressesTab() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState(mockAddresses)
  const [adding, setAdding] = useState(false)

  const setDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })))
    toast.success('Default address updated.')
  }

  const remove = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    toast.info('Address removed.')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-primary">Saved Addresses</h2>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm py-2 px-4">
          + Add Address
        </button>
      </div>

      {adding && (
        <div className="card p-5 mb-5 border-2 border-accent/30">
          <p className="text-sm font-medium text-primary mb-4">New Address</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Label (e.g. "Job Site")</label>
              <input type="text" className="input-base text-sm" placeholder="Office, Warehouse…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Full name</label>
              <input type="text" className="input-base text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1">Street address</label>
              <input type="text" className="input-base text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">City</label>
              <input type="text" className="input-base text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">State</label>
                <input type="text" maxLength={2} className="input-base text-sm uppercase" placeholder="IL" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">ZIP</label>
                <input type="text" className="input-base text-sm" placeholder="60642" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary text-sm py-2 px-4" onClick={() => { setAdding(false); toast.success('Address saved.') }}>Save</button>
            <button className="btn-outline text-sm py-2 px-4" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`card p-5 relative ${addr.default ? 'ring-2 ring-accent/40' : ''}`}>
            {addr.default && (
              <span className="absolute top-4 right-4 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Default</span>
            )}
            <p className="text-sm font-semibold text-primary mb-0.5">{addr.label}</p>
            {addr.company && <p className="text-xs text-muted mb-1">{addr.company}</p>}
            <p className="text-sm text-body leading-relaxed">
              {addr.name}<br />
              {addr.address}<br />
              {addr.city}, {addr.state} {addr.zip}
            </p>
            {addr.phone && <p className="text-xs text-muted mt-1">{addr.phone}</p>}
            <div className="flex gap-3 mt-4">
              {!addr.default && (
                <button onClick={() => setDefault(addr.id)} className="text-xs text-accent hover:underline">Set as default</button>
              )}
              <button onClick={() => remove(addr.id)} className="text-xs text-muted hover:text-error transition-colors">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hardwood Quotes Tab ──────────────────────────────────────────────────────
function QuotesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-primary">Hardwood Quotes</h2>
        <Link to="/contact?type=hardwood-quote" className="btn-primary text-sm py-2 px-4">
          + Request Quote
        </Link>
      </div>

      {mockHardwoodQuotes.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-heading text-lg text-primary mb-1">No quotes yet</p>
          <p className="text-muted text-sm mb-6">Request pricing for tropical hardwood species.</p>
          <Link to="/contact?type=hardwood-quote" className="btn-primary">Request a Quote</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockHardwoodQuotes.map(q => (
            <div key={q.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-semibold text-primary">{q.id}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[q.status] || 'bg-gray-100 text-gray-600'}`}>
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted">Requested {new Date(q.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {q.quoteAmount && (
                  <div className="text-right">
                    <p className="text-xs text-muted mb-0.5">Quoted price</p>
                    <p className="font-heading font-bold text-primary text-lg">${q.quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Species</p>
                  <p className="text-body">{q.species}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Application</p>
                  <p className="text-body">{q.application}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Volume</p>
                  <p className="text-body">{q.volume}</p>
                </div>
              </div>

              {q.notes && (
                <p className="mt-3 text-sm text-muted italic border-l-2 border-gray-200 pl-3">{q.notes}</p>
              )}

              {q.status === 'quoted' && (
                <div className="mt-4 flex gap-3">
                  <button className="btn-primary text-sm py-2 px-4">Accept & Order</button>
                  <Link to="/contact" className="btn-outline text-sm py-2 px-4">Ask a Question</Link>
                </div>
              )}
              {q.status === 'pending' && (
                <p className="mt-3 text-xs text-muted">Our team will respond within 1–2 business days.</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-wood-light/30 border border-wood/20 rounded-xl p-5">
        <p className="text-sm font-semibold text-primary mb-1">Need a large-volume quote?</p>
        <p className="text-sm text-muted mb-3">
          For orders over 2,000 bf or container loads, contact our hardwood team directly for the best pricing.
        </p>
        <a href="mailto:tradicoreusa@gmail.com" className="text-sm text-accent hover:underline font-medium">
          tradicoreusa@gmail.com →
        </a>
      </div>
    </div>
  )
}

// ─── Main Account Page ────────────────────────────────────────────────────────
export default function Account() {
  const { currentUser, token, isAuthenticated, logout } = useAuth()
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'profile'
  const setTab = (id) => setSearchParams({ tab: id })

  useEffect(() => {
    document.title = 'My Account | TradiCore Lumber and Products'
  }, [])

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-bg">
          <div className="text-center px-4 max-w-sm">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary mb-2">Sign in required</h1>
            <p className="text-muted text-sm mb-6">Please sign in to access your account dashboard.</p>
            <div className="flex flex-col gap-3">
              <Link to="/login" state={{ from: '/account' }} className="btn-primary justify-center">Sign In</Link>
              <Link to="/register" className="btn-outline justify-center">Create Account</Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleLogout = () => {
    logout()
    toast.info('You have been signed out.')
    navigate('/')
  }

  return (
    <Layout>
      <div className="bg-primary text-white py-10">
        <div className="container-site">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-lg">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </span>
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h1>
                <p className="text-white/60 text-sm">{currentUser?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-outline-white text-sm py-2 px-4">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-site py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar nav */}
          <aside className="lg:w-52 shrink-0">
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-body hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link to="/trade" className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-accent/5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Trade Account
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </aside>

          {/* Tab content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'profile'   && <ProfileTab   user={currentUser} token={token} updateUser={updateUser} />}
            {activeTab === 'orders'    && <OrdersTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'quotes'    && <QuotesTab />}
          </main>
        </div>
      </div>
    </Layout>
  )
}
