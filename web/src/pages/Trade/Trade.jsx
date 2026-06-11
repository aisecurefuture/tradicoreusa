import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { events } from '../../lib/analytics'
import { submitTradeInquiry } from '../../api/contact'

const BENEFITS = [
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Wholesale Pricing',
    body: 'Save 20–40% off retail on moulding and up to 35% on tropical hardwood species with volume commitments.',
  },
  // {
  //   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  //   title: 'NET-30 Invoicing',
  //   body: 'Qualified accounts receive NET-30 terms, consolidated monthly invoicing, and priority ACH payment processing.',
  // },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Dedicated Rep',
    body: 'A named account manager handles your quotes, tracks your orders, and coordinates with our Suriname supply team.',
  },
  {
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    title: 'Advance Scheduling',
    body: 'Lock in hardwood allocations 90 days out and hold moulding inventory with a 10% deposit. No surprise shortfalls.',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Quality Guarantee',
    body: 'All hardwood is graded and inspected at origin. Moulding ships with zero-defect guarantee — we replace, no questions asked.',
  },
  {
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    title: 'Species Exclusivity',
    body: 'Trade accounts get first access to limited-run species like Koenatepi and Zwarte Kabbes before they open to retail.',
  },
]

const ELIGIBILITY = [
  'Licensed general contractors and remodelers',
  'Millwork shops and custom cabinet makers',
  'Flooring and hardwood dealers',
  'Architectural and interior design firms',
  'Builders and residential developers',
  'Commercial fit-out and hospitality contractors',
]

const VOLUME_OPTIONS = [
  'Under $10,000 / year',
  '$10,000 – $50,000 / year',
  '$50,000 – $150,000 / year',
  '$150,000 – $500,000 / year',
  'Over $500,000 / year',
]

const PRODUCT_INTERESTS = [
  { id: 'moulding',  label: 'MDF / Engineered Moulding & Trim' },
  { id: 'hardwood',  label: 'Tropical Hardwood Species' },
  { id: 'doors',     label: 'Moulded / Fiberglass Doors' },
  { id: 'all',       label: 'All product lines' },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

export default function Trade() {
  const { isAuthenticated, currentUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    firstName:       currentUser?.firstName || '',
    lastName:        currentUser?.lastName  || '',
    email:           currentUser?.email     || '',
    phone:           currentUser?.phone     || '',
    company:         currentUser?.company   || '',
    title:           '',
    address:         '',
    city:            '',
    state:           '',
    zip:             '',
    businessType:    '',
    licenseNumber:   '',
    annualVolume:    '',
    productInterest: [],
    howHeard:        '',
    message:         '',
  })

  useEffect(() => {
    document.title = 'Trade Accounts | TradiCore Lumber and Products'
  }, [])

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n })
  }

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      productInterest: f.productInterest.includes(id)
        ? f.productInterest.filter(x => x !== id)
        : [...f.productInterest, id],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required.'
    if (!form.lastName.trim())  e.lastName  = 'Required.'
    if (!form.email.trim())     e.email     = 'Required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.phone.trim())     e.phone     = 'Required.'
    if (!form.company.trim())   e.company   = 'Required.'
    if (!form.businessType.trim()) e.businessType = 'Required.'
    if (!form.annualVolume)     e.annualVolume = 'Required.'
    if (form.productInterest.length === 0) e.productInterest = 'Select at least one.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await submitTradeInquiry(form)
      if (res.success) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(res.error || 'Submission failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary text-white py-16 lg:py-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest text-accent uppercase mb-4">
              Trade Program
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Built for the pros who build.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Tradicore LLC supplies premium softwood products through trusted manufacturing partners
              in Asia and is expanding into direct-source hardwood products from South America. By
              sourcing directly from harvest operations and eliminating middlemen, we provide
              competitive pricing, consistent quality, and reliable supply chain solutions for
              distributors, manufacturers, and commercial projects throughout North America.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#apply" className="btn-primary">Apply Now</a>
              <a href="mailto:tradicoreusa@gmail.com" className="btn-outline-white">
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div className="bg-bg py-16">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-3">Trade account benefits</h2>
            <p className="text-muted max-w-xl mx-auto">Everything you need to build a reliable supply chain — without the middleman markup.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="card p-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-primary mb-2">{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who qualifies */}
      <div className="bg-primary/3 border-y border-primary/10 py-14">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">Who qualifies?</h2>
              <p className="text-muted mb-6 leading-relaxed">
                We work with trade professionals across residential, commercial, and hospitality sectors.
                Applications are reviewed within 2 business days and approved accounts receive login
                credentials with wholesale pricing immediately visible.
              </p>
              <ul className="space-y-3">
                {ELIGIBILITY.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-body">
                    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-5">How it works</p>
              <ol className="space-y-5">
                {[
                  ['Apply below', 'Fill out the application — takes about 3 minutes.'],
                  ['We review', 'Our team verifies your business within 2 business days.'],
                  ['Get approved', 'Your account is upgraded with wholesale pricing.'],
                  ['Start ordering', 'Place orders online or via your account rep.'],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-primary text-sm">{title}</p>
                      <p className="text-xs text-muted mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Application form */}
      <div id="apply" className="bg-bg py-16">
        <div className="container-site max-w-2xl">
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-2">Application received!</h2>
              <p className="text-muted mb-6 leading-relaxed">
                Thanks, <strong>{form.firstName}</strong>. Our team will review your application and
                follow up at <strong>{form.email}</strong> within 2 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="btn-primary justify-center">Back to Home</Link>
                <Link to="/collections/tropical-hardwood" className="btn-outline justify-center">
                  Browse Hardwood Species
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="font-heading text-3xl font-bold text-primary mb-2">Apply for a trade account</h2>
                <p className="text-muted">No annual fees. No minimums. Cancel any time.</p>
              </div>

              <div className="card p-8">
                <form onSubmit={handleSubmit} noValidate className="space-y-6">

                  {/* Contact info */}
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Contact Information</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1.5">First name <span className="text-red-500">*</span></label>
                          <input type="text" value={form.firstName} onChange={set('firstName')}
                            className={`input-base ${errors.firstName ? 'border-red-400' : ''}`} />
                          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1.5">Last name <span className="text-red-500">*</span></label>
                          <input type="text" value={form.lastName} onChange={set('lastName')}
                            className={`input-base ${errors.lastName ? 'border-red-400' : ''}`} />
                          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Title / Role</label>
                        <input type="text" value={form.title} onChange={set('title')}
                          className="input-base" placeholder="e.g. Project Manager, Owner" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input type="email" value={form.email} onChange={set('email')}
                            className={`input-base ${errors.email ? 'border-red-400' : ''}`} />
                          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1.5">Phone <span className="text-red-500">*</span></label>
                          <input type="tel" value={form.phone} onChange={set('phone')}
                            className={`input-base ${errors.phone ? 'border-red-400' : ''}`} />
                          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business info */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Business Information</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Company name <span className="text-red-500">*</span></label>
                        <input type="text" value={form.company} onChange={set('company')}
                          className={`input-base ${errors.company ? 'border-red-400' : ''}`} />
                        {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Business type <span className="text-red-500">*</span></label>
                        <input type="text" value={form.businessType} onChange={set('businessType')}
                          placeholder="e.g. General Contractor, Flooring Dealer, Millwork Shop"
                          className={`input-base ${errors.businessType ? 'border-red-400' : ''}`} />
                        {errors.businessType && <p className="mt-1 text-xs text-red-600">{errors.businessType}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Contractor / business license number</label>
                        <input type="text" value={form.licenseNumber} onChange={set('licenseNumber')}
                          className="input-base" placeholder="Optional but speeds up approval" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-primary mb-1.5">City</label>
                          <input type="text" value={form.city} onChange={set('city')} className="input-base" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1.5">State</label>
                          <select value={form.state} onChange={set('state')} className="input-base">
                            <option value="">—</option>
                            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Purchasing info */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Purchasing Details</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Estimated annual purchase volume <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {VOLUME_OPTIONS.map(opt => (
                            <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              form.annualVolume === opt
                                ? 'border-accent bg-accent/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300 text-body'
                            }`}>
                              <input type="radio" name="annualVolume" value={opt} checked={form.annualVolume === opt}
                                onChange={set('annualVolume')} className="text-accent focus:ring-accent/30" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>
                        {errors.annualVolume && <p className="mt-1 text-xs text-red-600">{errors.annualVolume}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Product lines of interest <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {PRODUCT_INTERESTS.map(p => (
                            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              form.productInterest.includes(p.id)
                                ? 'border-accent bg-accent/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300 text-body'
                            }`}>
                              <input type="checkbox" checked={form.productInterest.includes(p.id)}
                                onChange={() => toggleInterest(p.id)}
                                className="text-accent focus:ring-accent/30 rounded" />
                              <span className="text-sm">{p.label}</span>
                            </label>
                          ))}
                        </div>
                        {errors.productInterest && <p className="mt-1 text-xs text-red-600">{errors.productInterest}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">How did you hear about us?</label>
                        <input type="text" value={form.howHeard} onChange={set('howHeard')}
                          className="input-base" placeholder="Trade show, referral, Google…" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Additional notes</label>
                        <textarea rows={3} value={form.message} onChange={set('message')}
                          className="input-base resize-none"
                          placeholder="Upcoming projects, specific species or profiles you need, anything that helps us prepare…" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting…
                      </span>
                    ) : 'Submit Trade Account Application'}
                  </button>

                  <p className="text-xs text-muted text-center">
                    Questions? Email us at{' '}
                    <a href="mailto:tradicoreusa@gmail.com" className="text-accent hover:underline">
                      tradicoreusa@gmail.com
                    </a>
                    {' '}or call <a href="tel:+12247156452" className="text-accent hover:underline">224-715-6452</a>.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
