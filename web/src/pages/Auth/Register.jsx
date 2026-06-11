import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { registerUser } from '../../api/auth'
import Layout from '../../components/Layout/Layout'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

const ACCOUNT_TYPES = [
  { value: 'customer',    label: 'Individual / Homeowner' },
  { value: 'contractor',  label: 'Contractor / Builder' },
  { value: 'dealer',      label: 'Dealer / Distributor' },
  { value: 'architect',   label: 'Architect / Designer' },
]

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', accountType: 'customer',
    address: '', city: '', state: '', zip: '',
    password: '', confirmPassword: '',
    agreeTerms: false, tradeInterest: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1) // 1 = account info, 2 = shipping + password

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required.'
    if (!form.lastName.trim()) e.lastName = 'Required.'
    if (!form.email.trim()) e.email = 'Required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.password) e.password = 'Required.'
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters.'
    if (!form.confirmPassword) e.confirmPassword = 'Required.'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    try {
      const res = await registerUser(form)
      if (!res.success) {
        setErrors({ form: res.error || 'Registration failed. Please try again.' })
        return
      }
      login(res.data.token, res.data.user)
      toast.success('Account created! Welcome to TradiCore USA.')
      navigate(form.tradeInterest ? '/trade' : '/account', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] bg-bg flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="font-heading text-2xl font-bold text-primary">
                Tradi<span className="text-accent">Core</span>
                <span className="text-sm font-normal text-muted ml-1">USA</span>
              </span>
            </Link>
            <h1 className="font-heading text-3xl font-bold text-primary mb-1">Create your account</h1>
            <p className="text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8 px-2">
            {[1, 2].map(n => (
              <div key={n} className="flex items-center gap-3 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step === n ? 'bg-accent text-white' :
                  step > n  ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > n ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : n}
                </div>
                <span className={`text-xs font-medium ${step === n ? 'text-primary' : 'text-muted'}`}>
                  {n === 1 ? 'Account Info' : 'Security'}
                </span>
                {n < 2 && <div className={`flex-1 h-px ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="card p-8">
            {errors.form && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2H9v-2zm0-8h2v6H9V5z" clipRule="evenodd" />
                </svg>
                {errors.form}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">First name <span className="text-red-500">*</span></label>
                    <input type="text" autoComplete="given-name" value={form.firstName} onChange={set('firstName')}
                      className={`input-base ${errors.firstName ? 'border-red-400' : ''}`} placeholder="Patrick" />
                    {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">Last name <span className="text-red-500">*</span></label>
                    <input type="text" autoComplete="family-name" value={form.lastName} onChange={set('lastName')}
                      className={`input-base ${errors.lastName ? 'border-red-400' : ''}`} placeholder="Kelly" />
                    {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Email address <span className="text-red-500">*</span></label>
                  <input type="email" autoComplete="email" value={form.email} onChange={set('email')}
                    className={`input-base ${errors.email ? 'border-red-400' : ''}`} placeholder="you@company.com" />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
                  <input type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')}
                    className="input-base" placeholder="312-555-0100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Account type</label>
                  <select value={form.accountType} onChange={set('accountType')} className="input-base">
                    {ACCOUNT_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {(form.accountType !== 'customer') && (
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">Company name</label>
                    <input type="text" autoComplete="organization" value={form.company} onChange={set('company')}
                      className="input-base" placeholder="Your company LLC" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-primary mb-1.5">State</label>
                    <select value={form.state} onChange={set('state')} className="input-base">
                      <option value="">Select state…</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={form.tradeInterest} onChange={set('tradeInterest')}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30" />
                  <span className="text-sm text-body">
                    I'm interested in a <span className="text-accent font-medium">trade / wholesale account</span> — I'll get info after registering.
                  </span>
                </label>

                <button type="button" onClick={nextStep} className="btn-primary w-full py-3 text-base justify-center">
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={set('password')}
                      placeholder="At least 8 characters"
                      className={`input-base pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                      {showPw ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  {/* Strength bar */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(n => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${
                          form.password.length >= n * 3
                            ? n <= 1 ? 'bg-red-400'
                            : n <= 2 ? 'bg-yellow-400'
                            : n <= 3 ? 'bg-blue-400'
                            : 'bg-green-500'
                            : 'bg-gray-200'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Repeat your password"
                    className={`input-base ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <label className={`flex items-start gap-2.5 cursor-pointer select-none ${errors.agreeTerms ? 'text-red-600' : ''}`}>
                    <input type="checkbox" checked={form.agreeTerms} onChange={set('agreeTerms')}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30" />
                    <span className="text-sm text-body">
                      I agree to the{' '}
                      <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                      <span className="text-red-500 ml-0.5">*</span>
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-xs text-red-600 -mt-1 ml-6">{errors.agreeTerms}</p>}
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)}
                    className="btn-outline flex-1 py-3 text-base justify-center">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="btn-primary flex-[2] py-3 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Creating account…
                      </span>
                    ) : 'Create account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
