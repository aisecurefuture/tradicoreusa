import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { submitContactForm, submitQuoteRequest } from '../../api/contact'
import { speciesList as speciesData } from '../../data/speciesData'
import { mouldingCategories } from '../../data/mockData'

const TABS = [
  { id: 'general',  label: 'General Inquiry' },
  { id: 'hardwood', label: 'Hardwood Quote' },
  { id: 'moulding', label: 'Moulding Quote' },
]

const SUBJECTS = [
  'Product availability',
  'Pricing & trade accounts',
  'Order status',
  'Shipping & logistics',
  'Technical / installation',
  'Returns & claims',
  'Other',
]

// ─── General Inquiry ──────────────────────────────────────────────────────────
function GeneralForm({ user }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name:    user ? `${user.firstName} ${user.lastName}` : '',
    email:   user?.email  || '',
    phone:   user?.phone  || '',
    company: user?.company || '',
    subject: '',
    message: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = f => e => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required.'
    if (!form.email.trim())   e.email   = 'Required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.subject)        e.subject = 'Required.'
    if (!form.message.trim()) e.message = 'Required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await submitContactForm(form)
      if (res.success) { setDone(true) }
      else { toast.error(res.error || 'Submission failed.') }
    } finally { setLoading(false) }
  }

  if (done) return <SuccessBanner name={form.name} email={form.email} type="message" />

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Name <span className="text-red-500">*</span></label>
          <input type="text" value={form.name} onChange={set('name')}
            className={`input-base ${errors.name ? 'border-red-400' : ''}`} placeholder="Your full name" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Email <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={set('email')}
            className={`input-base ${errors.email ? 'border-red-400' : ''}`} placeholder="you@company.com" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className="input-base" placeholder="312-555-0100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={set('company')} className="input-base" placeholder="Optional" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">Subject <span className="text-red-500">*</span></label>
        <select value={form.subject} onChange={set('subject')}
          className={`input-base ${errors.subject ? 'border-red-400' : ''}`}>
          <option value="">Select a subject…</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">Message <span className="text-red-500">*</span></label>
        <textarea rows={5} value={form.message} onChange={set('message')}
          className={`input-base resize-none ${errors.message ? 'border-red-400' : ''}`}
          placeholder="How can we help?" />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      <SubmitButton loading={loading} label="Send Message" />
    </form>
  )
}

// ─── Hardwood Quote ───────────────────────────────────────────────────────────
function HardwoodQuoteForm({ user, preselectedSpecies }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name:        user ? `${user.firstName} ${user.lastName}` : '',
    email:       user?.email   || '',
    phone:       user?.phone   || '',
    company:     user?.company || '',
    species:     preselectedSpecies || '',
    application: '',
    volumeBf:    '',
    thickness:   '',
    gradeNotes:  '',
    jobStart:    '',
    deliveryState: '',
    fscRequired: false,
    message:     '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = f => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [f]: val }))
    if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required.'
    if (!form.email.trim())   e.email   = 'Required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.species)        e.species = 'Select a species.'
    if (!form.application.trim()) e.application = 'Required.'
    if (!form.volumeBf.trim())    e.volumeBf    = 'Required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await submitQuoteRequest({ type: 'hardwood', ...form })
      if (res.success) { setDone(true) }
      else { toast.error(res.error || 'Submission failed.') }
    } finally { setLoading(false) }
  }

  if (done) return <SuccessBanner name={form.name} email={form.email} type="quote" />

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="bg-wood-light/20 border border-wood/20 rounded-xl p-4 text-sm text-body">
        We respond to hardwood quotes within <strong>1 business day</strong>. For container-load inquiries (&gt;5,000 bf) email
        {' '}<a href="mailto:hardwood@tradicoreusa.com" className="text-accent hover:underline">hardwood@tradicoreusa.com</a> directly.
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Name <span className="text-red-500">*</span></label>
          <input type="text" value={form.name} onChange={set('name')}
            className={`input-base ${errors.name ? 'border-red-400' : ''}`} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Email <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={set('email')}
            className={`input-base ${errors.email ? 'border-red-400' : ''}`} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={set('company')} className="input-base" />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Species & Volume</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Species <span className="text-red-500">*</span></label>
            <select value={form.species} onChange={set('species')}
              className={`input-base ${errors.species ? 'border-red-400' : ''}`}>
              <option value="">Select species…</option>
              {speciesData.map(s => (
                <option key={s.slug} value={s.slug}>{s.name} ({s.code}) — {s.tradeName}</option>
              ))}
              <option value="unsure">Not sure — need guidance</option>
            </select>
            {errors.species && <p className="mt-1 text-xs text-red-600">{errors.species}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Application <span className="text-red-500">*</span></label>
            <input type="text" value={form.application} onChange={set('application')}
              placeholder="e.g. Exterior decking, flooring, structural beams, cladding…"
              className={`input-base ${errors.application ? 'border-red-400' : ''}`} />
            {errors.application && <p className="mt-1 text-xs text-red-600">{errors.application}</p>}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Volume (board feet) <span className="text-red-500">*</span></label>
              <input type="text" value={form.volumeBf} onChange={set('volumeBf')}
                placeholder="e.g. 500, 1200"
                className={`input-base ${errors.volumeBf ? 'border-red-400' : ''}`} />
              {errors.volumeBf && <p className="mt-1 text-xs text-red-600">{errors.volumeBf}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Thickness</label>
              <input type="text" value={form.thickness} onChange={set('thickness')}
                className="input-base" placeholder='e.g. 4/4, 8/4, 2"' />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Delivery state</label>
              <input type="text" value={form.deliveryState} onChange={set('deliveryState')}
                className="input-base" placeholder="IL, FL, TX…" maxLength={2} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Needed by / job start</label>
              <input type="date" value={form.jobStart} onChange={set('jobStart')} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Grade / quality notes</label>
              <input type="text" value={form.gradeNotes} onChange={set('gradeNotes')}
                className="input-base" placeholder="Clear, FAS, kiln-dried…" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={form.fscRequired} onChange={set('fscRequired')}
              className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30" />
            <span className="text-sm text-body">FSC certification required</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">Additional notes</label>
        <textarea rows={3} value={form.message} onChange={set('message')}
          className="input-base resize-none"
          placeholder="Face width preferences, drying method, project details…" />
      </div>

      <SubmitButton loading={loading} label="Request Hardwood Quote" />
    </form>
  )
}

// ─── Moulding Quote ───────────────────────────────────────────────────────────
function MouldingQuoteForm({ user }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name:        user ? `${user.firstName} ${user.lastName}` : '',
    email:       user?.email   || '',
    phone:       user?.phone   || '',
    company:     user?.company || '',
    category:    '',
    profiles:    '',
    linearFeet:  '',
    finish:      '',
    deliveryState: '',
    jobStart:    '',
    message:     '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = f => e => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name       = 'Required.'
    if (!form.email.trim())      e.email      = 'Required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.category)          e.category   = 'Required.'
    if (!form.linearFeet.trim()) e.linearFeet = 'Required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await submitQuoteRequest({ type: 'moulding', ...form })
      if (res.success) { setDone(true) }
      else { toast.error(res.error || 'Submission failed.') }
    } finally { setLoading(false) }
  }

  if (done) return <SuccessBanner name={form.name} email={form.email} type="quote" />

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Name <span className="text-red-500">*</span></label>
          <input type="text" value={form.name} onChange={set('name')}
            className={`input-base ${errors.name ? 'border-red-400' : ''}`} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Email <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={set('email')}
            className={`input-base ${errors.email ? 'border-red-400' : ''}`} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={set('company')} className="input-base" />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Product Details</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category <span className="text-red-500">*</span></label>
            <select value={form.category} onChange={set('category')}
              className={`input-base ${errors.category ? 'border-red-400' : ''}`}>
              <option value="">Select category…</option>
              {mouldingCategories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
              <option value="multiple">Multiple categories</option>
              <option value="custom">Custom profile</option>
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Specific profiles / SKUs</label>
            <input type="text" value={form.profiles} onChange={set('profiles')}
              className="input-base" placeholder="e.g. TCM-CM-002, or describe the profile" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Linear feet needed <span className="text-red-500">*</span></label>
              <input type="text" value={form.linearFeet} onChange={set('linearFeet')}
                placeholder="e.g. 500"
                className={`input-base ${errors.linearFeet ? 'border-red-400' : ''}`} />
              {errors.linearFeet && <p className="mt-1 text-xs text-red-600">{errors.linearFeet}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Finish preference</label>
              <select value={form.finish} onChange={set('finish')} className="input-base">
                <option value="">Any</option>
                <option value="primed">Primed</option>
                <option value="unfinished">Unfinished</option>
                <option value="painted">Painted white</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Delivery state</label>
              <input type="text" value={form.deliveryState} onChange={set('deliveryState')}
                className="input-base" placeholder="IL" maxLength={2} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Needed by / job start</label>
            <input type="date" value={form.jobStart} onChange={set('jobStart')} className="input-base w-48" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">Additional notes</label>
        <textarea rows={3} value={form.message} onChange={set('message')}
          className="input-base resize-none"
          placeholder="Project type, special requirements, alternate profiles…" />
      </div>

      <SubmitButton loading={loading} label="Request Moulding Quote" />
    </form>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading}
      className="btn-primary w-full py-3 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed">
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Sending…
        </span>
      ) : label}
    </button>
  )
}

function SuccessBanner({ name, email, type }) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-heading text-xl font-bold text-primary mb-2">
        {type === 'quote' ? 'Quote request sent!' : 'Message sent!'}
      </h3>
      <p className="text-muted text-sm max-w-sm mx-auto">
        Thanks, <strong>{name.split(' ')[0]}</strong>. We'll follow up at <strong>{email}</strong>{' '}
        {type === 'quote' ? 'within 1 business day.' : 'within 24 hours.'}
      </p>
    </div>
  )
}

// ─── Main Contact Page ────────────────────────────────────────────────────────
export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser } = useAuth()

  const typeParam = searchParams.get('type')
  const speciesParam = searchParams.get('species')

  const initialTab = typeParam === 'hardwood-quote' ? 'hardwood'
    : typeParam === 'moulding-quote' ? 'moulding'
    : 'general'

  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    document.title = 'Contact & Quotes | TradiCore Lumber and Products'
  }, [])

  const switchTab = (id) => {
    setActiveTab(id)
    setSearchParams(id === 'general' ? {} : { type: id === 'hardwood' ? 'hardwood-quote' : 'moulding-quote' })
  }

  return (
    <Layout>
      <div className="bg-primary text-white py-12">
        <div className="container-site">
          <Breadcrumb
            items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            light
          />
          <h1 className="font-heading text-4xl font-bold mt-3 mb-2">Contact & Quotes</h1>
          <p className="text-white/65 max-w-xl">
            Get in touch with our team, request pricing on tropical hardwoods, or get a quote on moulding for your next project.
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* Main form area */}
          <div className="flex-1 min-w-0">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
              {TABS.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === t.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted hover:text-primary'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="card p-8">
              {activeTab === 'general'  && <GeneralForm user={currentUser} />}
              {activeTab === 'hardwood' && <HardwoodQuoteForm user={currentUser} preselectedSpecies={speciesParam || ''} />}
              {activeTab === 'moulding' && <MouldingQuoteForm user={currentUser} />}
            </div>
          </div>

          {/* Sidebar info */}
          <aside className="lg:w-72 shrink-0 space-y-5">
            <div className="card p-6">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Get in touch</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary">General inquiries</p>
                    <a href="mailto:info@tradicoreusa.com" className="text-accent hover:underline">info@tradicoreusa.com</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary">Hardwood sales</p>
                    <a href="mailto:hardwood@tradicoreusa.com" className="text-accent hover:underline">hardwood@tradicoreusa.com</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary">Trade accounts</p>
                    <a href="mailto:sales@tradicoreusa.com" className="text-accent hover:underline">sales@tradicoreusa.com</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary">Phone / text</p>
                    <a href="tel:+13125550100" className="text-accent hover:underline">312-555-0100</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Office hours</p>
              <ul className="text-sm space-y-1.5">
                {[
                  ['Mon – Fri', '8:00 AM – 5:00 PM CT'],
                  ['Saturday',  '9:00 AM – 1:00 PM CT'],
                  ['Sunday',    'Closed'],
                ].map(([day, hrs]) => (
                  <li key={day} className="flex justify-between">
                    <span className="text-muted">{day}</span>
                    <span className="text-body font-medium">{hrs}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted mt-4">
                Quote requests submitted after hours are responded to by 10 AM the next business day.
              </p>
            </div>

            <div className="card p-6 bg-primary/3">
              <p className="text-sm font-semibold text-primary mb-2">Need wholesale pricing?</p>
              <p className="text-xs text-muted mb-3">
                Contractors and dealers can apply for a trade account to unlock volume discounts and wholesale pricing.
              </p>
              <Link to="/trade" className="btn-primary text-sm py-2 px-4 w-full justify-center">
                Apply for Trade Account
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  )
}
