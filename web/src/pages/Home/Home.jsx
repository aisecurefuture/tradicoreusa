import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { submitNotifyRequest } from '../../api/contact'
import { useToast } from '../../context/ToastContext'
import { storage } from '../../utils/storage'

// ── Trade Banner ──────────────────────────────────────────────────────────────
// Commented out until trade pricing / NET-30 terms are confirmed with Alan
// function TradeBanner() {
//   const [visible, setVisible] = useState(() => !storage.get('tc_trade_banner_dismissed', false))
//   const dismiss = () => { storage.set('tc_trade_banner_dismissed', true); setVisible(false) }
//   if (!visible) return null
//   return (
//     <div className="bg-accent text-primary">
//       <div className="container-site py-2.5 flex items-center justify-between gap-4">
//         <p className="text-sm font-medium">
//           Are you a contractor or builder?{' '}
//           <Link to="/trade" className="font-bold underline hover:no-underline">
//             Ask about trade pricing and Net&nbsp;30 terms →
//           </Link>
//         </p>
//         <button onClick={dismiss} className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity" aria-label="Dismiss">
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   )
// }

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative bg-primary overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #0D2137 0%, #1A3A5C 50%, #0D2137 100%)',
      }}
    >
      {/* Decorative wood grain texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 4px,
            rgba(201,168,76,0.3) 4px,
            rgba(201,168,76,0.3) 5px
          )`
        }}
      />
      <div className="container-site relative z-10 pt-16 pb-24 md:pt-24 md:pb-36 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-5">
          Premium Wood Products — From the Source to Your Home
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance max-w-5xl mx-auto">
          Premium Wood Trim, Moulding&nbsp;&amp; Tropical&nbsp;Hardwood — Direct from the Source
        </h1>
        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          TradiCore Lumber and Products supplies contractors, builders, and architects with factory-direct MDF moulding and rare South American tropical hardwoods — not available through big-box retailers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/collections/moulding-trim" className="btn-primary text-base px-8 py-4">
            Shop Moulding &amp; Doors
          </Link>
          <Link to="/collections/tropical-hardwood" className="btn-outline-white text-base px-8 py-4">
            Explore Hardwood Species
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Trust Strips ──────────────────────────────────────────────────────────────
function TrustStrips() {
  const strips = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      label: 'Address',
      value: '1100 Sheridan Rd., Unit 5, Winthrop Harbor, IL 60096',
      href: '/contact',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      ),
      label: 'Call Us',
      value: 'Alan Pan (224) 715-6452',
      href: 'tel:+12247156452',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
        </svg>
      ),
      label: 'Direct Import',
      value: 'Premium South American Tropical Hardwoods',
      href: '/collections/tropical-hardwood',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      label: 'Questions?',
      value: 'See Our FAQs',
      href: '/faq',
    },
  ]

  return (
    <section className="border-b border-border bg-white">
      <div className="container-site grid grid-cols-2 lg:grid-cols-4">
        {strips.map((s, i) => (
          <a
            key={s.label}
            href={s.href}
            className={`flex items-start gap-3 px-6 py-5 hover:bg-bg transition-colors ${i < 3 ? 'border-r border-border' : ''}`}
          >
            <span className="text-accent mt-0.5 flex-shrink-0">{s.icon}</span>
            <div>
              <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-sm text-primary font-medium leading-snug">{s.value}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

// ── Moulding Categories ───────────────────────────────────────────────────────
const mouldingCategories = [
  { label: 'Crown Moulding',        slug: 'crown-moulding',  desc: 'Traditional & contemporary ceiling profiles' },
  { label: 'Baseboards & Skirting', slug: 'baseboards',      desc: 'Colonial, flat, ogee & custom profiles' },
  { label: 'Door Casing',           slug: 'door-casing',     desc: 'Coordinated casing for every style' },
  { label: 'Door Frames',           slug: 'door-frames',     desc: 'Complete jamb sets, standard & custom' },
  { label: 'Wall Panels',           slug: 'wall-panels',     desc: 'Beadboard, shiplap, V-groove & flat' },
  { label: 'Stair Parts',           slug: 'stair-parts',     desc: 'Newel posts, rail caps, nosing' },
  { label: 'S3S / S4S Boards',      slug: 'boards',          desc: 'Surfaced dimensional boards' },
  { label: 'Quarter Round',         slug: 'quarter-round',   desc: 'Floor trim in every finish' },
  { label: 'Shutters',              slug: 'shutters',        desc: 'Interior plantation shutters' },
]

function MouldingSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="MDF & Engineered Wood Profiles"
            title="Moulding & Trim"
            subtitle="Factory-direct profiles in MDF, pine, poplar, and falcata — raw, primed, painted, or vinyl-wrapped."
          />
          <Link to="/collections/moulding-trim" className="btn-ghost text-primary border border-border flex-shrink-0 self-start md:self-auto">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mouldingCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="card p-5 hover:border-accent hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-primary/8 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10M4 18h6" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary text-sm mb-1 leading-tight">{cat.label}</h3>
              <p className="text-xs text-muted leading-snug">{cat.desc}</p>
            </Link>
          ))}

          {/* Doors CTA card */}
          <Link
            to="/collections/doors"
            className="card p-5 border-dashed hover:border-accent hover:shadow-md transition-all text-left group relative"
          >
            <span className="absolute top-3 right-3 badge-coming-soon">Soon</span>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary text-sm mb-1">Doors</h3>
            <p className="text-xs text-muted">Shaker, Slab, Glass & Oak</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Tropical Hardwood Species ─────────────────────────────────────────────────
const speciesData = [
  { code: 'BAS', name: 'Basralocus',     tradeName: 'Double-col. Sappanwood', apps: ['Marine', 'Decking'],     slug: 'basralocus' },
  { code: 'BGR', name: 'Berg Gronfolo',  tradeName: 'Quare Wood',             apps: ['Joinery', 'Furniture'],  slug: 'berg-gronfolo' },
  { code: 'WAN', name: 'Wana',           tradeName: 'Red Nick Camphor',       apps: ['Boat Build', 'Decking'], slug: 'wana' },
  { code: 'ZWK', name: 'Zwarte',         tradeName: 'Dragon-Phoenix Sandal.', apps: ['Decorative', 'Panels'],  slug: 'zwarte' },
  { code: 'RLO', name: 'Rode Locus',     tradeName: 'Jatoba',                 apps: ['Flooring', 'Stairs'],    slug: 'rode-locus' },
  { code: 'MKG', name: 'Makagrin',       tradeName: 'Ipe / White Cedar',      apps: ['Trim', 'Flooring'],      slug: 'makagrin' },
  { code: 'WPL', name: 'Horse-hoof Bean',tradeName: 'Witte',                  apps: ['Structural', 'Panels'],  slug: 'horse-hoof-bean' },
  { code: 'MKB', name: 'Watai Bean',     tradeName: 'Maka Kabbes',            apps: ['Marine', 'Exterior'],    slug: 'watai-bean' },
  { code: 'ROK', name: 'Rode Kabbes',    tradeName: 'Red Chicken-Wing',       apps: ['Construction', 'Beams'], slug: 'rode-kabbes' },
  { code: 'KOE', name: 'Koenatepi',      tradeName: 'White Sourwood',         apps: ['Furniture', 'Cabinets'], slug: 'koenatepi' },
  { code: 'BRH', name: 'Bruinhart',      tradeName: 'Chicken-wing Wood',      apps: ['Luxury Furn.', 'Veneer'],slug: 'bruinhart' },
]

function HardwoodSection() {
  return (
    <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(180deg, #F3EDE3 0%, #FAF7F2 100%)' }}>
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <SectionHeader
              eyebrow="TradiCore's Differentiator — Direct from Suriname"
              title="Premium Tropical Hardwoods"
              subtitle="12 exotic species. Direct harvest access means lower cost, consistent grade, and species not broadly available to U.S. importers."
            />
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                'Direct Harvest Access',
                'Consistent Grade & Supply',
                'Shorter Supply Chain than Asia',
                'Unique Species',
              ].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-accent/15 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Link to="/collections/tropical-hardwood" className="btn-primary flex-shrink-0 self-start md:self-auto">
            View All 12 Species
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {speciesData.map((s) => (
            <Link
              key={s.code}
              to={`/species/${s.slug}`}
              className="group rounded-xl border border-border/60 bg-white hover:border-accent hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Color swatch */}
              <div
                className="h-2 w-full"
                style={{
                  background: woodColor(s.code),
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-primary/50 uppercase">{s.code}</span>
                  <svg className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-primary text-sm mb-0.5 leading-tight">{s.name}</h3>
                <p className="text-xs text-muted mb-2 leading-tight">{s.tradeName}</p>
                <div className="flex flex-wrap gap-1">
                  {s.apps.map(app => (
                    <span key={app} className="text-[10px] bg-primary/8 text-primary/70 px-1.5 py-0.5 rounded">{app}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-muted text-sm mb-4">Ready to spec a project? Our team responds within 1 business day.</p>
          <Link to="/contact?mode=quote" className="btn-primary">
            Request a Custom Quote
          </Link>
        </div>
      </div>
    </section>
  )
}

function woodColor(code) {
  const colors = {
    BAS: '#5C3317', BGR: '#A0724A', WAN: '#8B4513', ZWK: '#1A0A00',
    RLO: '#8B1A1A', MKG: '#6B4423', WPL: '#E8D5B0', MKB: '#4A2C17',
    ROK: '#7B2D2D', KOE: '#F5E6C8', BRH: '#3D1F0A', GRH: '#4B2D5E',
  }
  return colors[code] || '#8B6914'
}

// ── Doors Coming Soon ─────────────────────────────────────────────────────────
function DoorsSection() {
  const [email, setEmail]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    const res = await submitNotifyRequest(email)
    setSubmitting(false)
    if (res.success) {
      setDone(true)
      toast.success("You're on the list! We'll notify you when doors launch.")
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="container-site">
        <div className="max-w-3xl mx-auto text-center">
          <span className="badge-coming-soon mb-4 inline-block text-sm px-3 py-1">Coming Soon</span>
          <SectionHeader
            title="Door Line — Launching Soon"
            subtitle="Shaker, Smooth Slab, Glass, and Oak Slab doors available in standard sizes and custom dimensions."
            center
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            {['Shaker', 'Smooth Slab', 'Glass', 'Oak Slab'].map(style => (
              <div key={style} className="card p-4 text-center opacity-75">
                <div className="w-12 h-16 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="2" width="18" height="20" rx="1" strokeWidth="1.5"/>
                    <line x1="3" y1="8" x2="21" y2="8" strokeWidth="1.5"/>
                    <line x1="3" y1="16" x2="21" y2="16" strokeWidth="1.5"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-primary">{style}</span>
                <p className="text-[10px] text-muted mt-0.5">Coming Soon</p>
              </div>
            ))}
          </div>

          {done ? (
            <div className="bg-success/10 border border-success/30 text-success rounded-lg px-6 py-4 text-sm font-medium">
              You're on the list! We'll email you when the door line launches.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-base flex-1"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Notify Me'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Why TradiCore ─────────────────────────────────────────────────────────────
function WhySection() {
  const pillars = [
    {
      icon: '🌳',
      title: 'Direct Harvest Access',
      body: 'TradiCore has direct relationships with Suriname harvesting operations — giving us access to species and grades not available through secondary markets.',
    },
    {
      icon: '🚢',
      title: 'Shorter Supply Chain',
      body: 'We cut out Asian re-export middlemen. Suriname-origin timber comes directly to Chicago — fewer hands, lower cost, faster availability.',
    },
    {
      icon: '📐',
      title: 'Consistent Grade & Supply',
      body: 'Our direct sourcing means consistent log quality, predictable availability, and a stable price baseline — critical for contractors planning large projects.',
    },
    {
      icon: '🦋',
      title: 'Unique Species',
      body: 'Species like Zwarte (Dragon-Phoenix Sandalwood) and Bruinhart are practically unavailable anywhere else in the U.S. market.',
    },
  ]

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container-site">
        <SectionHeader
          eyebrow="The TradiCore Advantage"
          title="Why Our Hardwood Is Different"
          subtitle="Most tropical hardwoods sold in the U.S. route through Asia, adding cost and inconsistency. Ours don't."
          center
          light
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {pillars.map(p => (
            <div key={p.title} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-3xl mb-4 block">{p.icon}</span>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">{p.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/about" className="btn-secondary">
            Learn More About TradiCore
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Downloads Section ─────────────────────────────────────────────────────────
const downloads = [
  { label: 'Moulding Catalogue',         file: 'Moulding Catalogue.pdf',                                        category: 'moulding' },
  { label: 'TradiCore Moulding & Doors', file: 'TradiCore Moulding & Door catalog 04232026.pdf',                 category: 'moulding' },
  { label: 'Tropical Wood Species Guide',file: 'Tradicore Tropical Wood Species Offering.pdf',                   category: 'hardwood' },
  { label: 'Professional Presentation',  file: 'TradiCore_Professional_Presentation 2.pdf',                      category: 'company' },
]

function DownloadsSection() {
  return (
    <section className="py-14 bg-bg-warm border-t border-border">
      <div className="container-site">
        <SectionHeader
          eyebrow="Resources"
          title="Product Catalogs & Spec Sheets"
          subtitle="Download our current product catalogs and technical documents."
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
          {downloads.map(({ label, file, category }) => (
            <a
              key={file}
              href={`/downloads/${encodeURIComponent(file)}`}
              download={file}
              className="card px-5 py-4 flex items-center gap-4 hover:border-accent hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/8 group-hover:bg-accent/20 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-primary truncate">{label}</p>
                <p className="text-xs text-muted capitalize">{category} • PDF</p>
              </div>
              <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    document.title = 'TradiCore Lumber and Products — Premium Wood Products'
  }, [])

  return (
    <Layout>
      {/* <TradeBanner /> */}
      <Hero />
      <TrustStrips />
      <MouldingSection />
      <HardwoodSection />
      <DoorsSection />
      <WhySection />
      <DownloadsSection />
    </Layout>
  )
}
