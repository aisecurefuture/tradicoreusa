import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { doorCategories } from '../../data/doorData'

const DOOR_STYLES = [
  {
    name: 'Shaker',
    desc: 'Clean recessed-panel construction. Works equally well in traditional and transitional interiors.',
    tag: 'Most Popular',
    tagColor: 'bg-accent/10 text-accent',
  },
  {
    name: 'Smooth Slab',
    desc: 'Contemporary flat face. Ideal for modern and minimalist projects where paint finish is paramount.',
    tag: null,
    tagColor: '',
  },
  {
    name: 'Glass',
    desc: 'French and light-glass configurations that bring daylight into interior rooms.',
    tag: null,
    tagColor: '',
  },
  {
    name: 'Oak Slab',
    desc: 'Real oak veneer on MDF core. A warm, natural finish ready for stain or clear coat.',
    tag: 'New',
    tagColor: 'bg-green-100 text-green-700',
  },
]

export default function Doors() {
  const [activeCategory, setActiveCategory] = useState(doorCategories[0]?.id || '')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySent, setNotifySent] = useState(false)

  useEffect(() => {
    document.title = 'Doors | TradiCore Lumber and Products'
  }, [])

  const currentCategory = doorCategories.find(c => c.id === activeCategory) || doorCategories[0]

  const handleNotify = (e) => {
    e.preventDefault()
    if (notifyEmail) setNotifySent(true)
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary text-white py-14">
        <div className="container-site">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Doors' }]} light />
          <div className="flex items-start justify-between gap-6 mt-3 flex-wrap">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="font-heading text-4xl font-bold">Door Collection</h1>
                <span className="text-xs font-semibold bg-accent/20 text-accent px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-white/65 text-lg leading-relaxed">
                Shaker, Smooth Slab, Glass, and Oak Slab interior doors — available in standard sizes
                and custom dimensions. Online ordering launching later this year.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="bg-accent/10 border-b border-accent/20 py-4">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-primary">
            🚪 Our door line is in final development. Get notified when online ordering goes live.
          </p>
          {notifySent ? (
            <p className="text-sm font-semibold text-green-700">✓ You're on the list!</p>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                value={notifyEmail}
                onChange={e => setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-base text-sm py-2 w-52"
                required
              />
              <button type="submit" className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Style overview */}
      <div className="bg-bg py-14">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-primary mb-2">Door styles</h2>
            <p className="text-muted max-w-md mx-auto text-sm">Four collections to suit every interior — from traditional to contemporary.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DOOR_STYLES.map(style => (
              <div key={style.name} className="card p-5">
                <div className="w-16 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="2" width="18" height="20" rx="1" strokeWidth="1.25" />
                    <line x1="3" y1="7" x2="21" y2="7" strokeWidth="1.25" />
                    <line x1="3" y1="16" x2="21" y2="16" strokeWidth="1.25" />
                    <circle cx="18" cy="11.5" r="0.75" fill="currentColor" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-primary">{style.name}</h3>
                    {style.tag && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.tagColor}`}>
                        {style.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{style.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product browser */}
      <div className="bg-primary/3 border-y border-primary/10 py-14">
        <div className="container-site">
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">Browse profiles</h2>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {doorCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-body hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {currentCategory && (
            <>
              <p className="text-sm text-muted mb-6">{currentCategory.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentCategory.products.map(product => (
                  <div key={product.id} className="card p-4 text-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                      <svg className="w-10 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="2" width="18" height="20" rx="1" strokeWidth="1" />
                        <line x1="3" y1="7" x2="21" y2="7" strokeWidth="1" />
                        <line x1="3" y1="16" x2="21" y2="16" strokeWidth="1" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-primary leading-tight mb-0.5">{product.name}</p>
                    <p className="text-[10px] text-muted font-mono">{product.sku}</p>
                    <span className="mt-2 inline-block text-[10px] font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Specs & features */}
      <div className="bg-bg py-14">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-5">Construction & specs</h2>
              <dl className="space-y-4">
                {[
                  ['Core material',    'High-density MDF with solid wood edge banding'],
                  ['Face material',    'MDF smooth (paintable), or real oak veneer (Oak Slab)'],
                  ['Standard sizes',  '24", 28", 30", 32", 36" wide × 80" height; 6/8 and 7/0 available'],
                  ['Thickness',       '1-3/8" (interior) standard; 1-3/4" available on request'],
                  ['Finish',          'Primed (paint-ready) or unfinished; oak slab raw only'],
                  ['Fire rating',     '20-min and 60-min fire-rated cores available on request'],
                  ['Custom sizes',    'Available with a 4–6 week lead time; minimum order applies'],
                ].map(([term, def]) => (
                  <div key={term} className="flex gap-4 text-sm border-b border-gray-100 pb-3 last:border-0">
                    <dt className="w-36 shrink-0 font-semibold text-primary">{term}</dt>
                    <dd className="text-muted">{def}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-5">Trade & volume orders</h2>
              <p className="text-muted text-sm leading-relaxed mb-5">
                For builders, developers, and millwork shops needing 10+ doors, we offer project
                pricing with consolidated invoicing. Specify your door schedule and we'll quote the
                full list — mixed profiles, sizes, and finishes on a single PO.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  'Mixed-profile project quotes',
                  // 'NET-30 invoicing for trade accounts',
                  'Bundled delivery with moulding orders',
                  'Shop drawings available on request',
                  'Custom size and fire-rating options',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-body">
                    <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link to="/contact?type=moulding-quote" className="btn-primary text-sm">Request Door Quote</Link>
                <Link to="/trade" className="btn-outline text-sm">Trade Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
