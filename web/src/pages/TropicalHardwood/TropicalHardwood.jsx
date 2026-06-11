import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { speciesList, speciesApplicationTags } from '../../data/speciesData'

const WOOD_COLORS = {
  BAS: '#5C3317', BGR: '#A0724A', WAN: '#8B4513', ZWK: '#1A0A00',
  RLO: '#8B1A1A', MKG: '#6B4423', WPL: '#E8D5B0', MKB: '#4A2C17',
  ROK: '#7B2D2D', KOE: '#F5E6C8', BRH: '#3D1F0A', GRH: '#4B2D5E',
}

function SpeciesGridCard({ species }) {
  const swatch = WOOD_COLORS[species.code] || '#8B6914'

  return (
    <Link
      to={`/species/${species.slug}`}
      className="group rounded-xl border border-border bg-white hover:border-accent hover:shadow-lg transition-all overflow-hidden flex flex-col"
    >
      <div className="h-2 w-full" style={{ background: swatch }} />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-primary/40 uppercase block mb-0.5">{species.code}</span>
            <h3 className="font-heading font-semibold text-primary text-base leading-tight group-hover:text-accent transition-colors">
              {species.name}
            </h3>
            <p className="text-xs text-muted italic mt-0.5 leading-snug">{species.tradeName}</p>
          </div>
          <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <p className="text-xs text-primary/65 leading-relaxed line-clamp-2">{species.colorDescription}</p>

        <div className="flex flex-wrap gap-1 mt-auto">
          {species.applications.slice(0, 3).map(app => (
            <span key={app} className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-full">{app}</span>
          ))}
          {species.applications.length > 3 && (
            <span className="text-[10px] text-muted">+{species.applications.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <div className="flex gap-3">
            <span className="text-muted">Durability: <span className="text-primary font-medium">{species.durability?.split(' (')[0]}</span></span>
          </div>

        </div>
      </div>
    </Link>
  )
}

export default function TropicalHardwood() {
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    document.title = 'Tropical Hardwood Species | TradiCore Lumber and Products'
  }, [])

  const filtered = activeFilter
    ? speciesList.filter(s => s.applications.includes(activeFilter))
    : speciesList

  return (
    <Layout>
      {/* Coming Soon banner */}
      <div className="bg-accent text-primary">
        <div className="container-site py-3 flex items-center justify-center gap-3 text-center">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-sm">
            Tropical Hardwood &amp; Lumber — <span className="font-bold">Coming Soon</span>.
            Orders will be available in 2–3 months. <a href="/contact?type=hardwood" className="underline hover:no-underline font-bold">Request a quote</a> or{' '}
            <a href="/contact" className="underline hover:no-underline font-bold">contact us</a> in the meantime.
          </p>
        </div>
      </div>
      {/* Hero */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2D1810 0%, #4A2C17 40%, #3D2B1F 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(-30deg, transparent, transparent 8px, rgba(201,168,76,0.4) 8px, rgba(201,168,76,0.4) 9px)`
          }}
        />
        <div className="container-site relative z-10">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Tropical Hardwood' },
          ]} />
          <div className="max-w-3xl mt-4">
            <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Direct Import — Suriname, South America
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Tropical Hardwoods — Direct from Suriname
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">
              TradiCore's vertically integrated supply chain gives us direct access to Suriname harvesting operations — delivering exotic species at lower baseline cost than Asian-routed imports, with grades and consistency unavailable through secondary markets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact?mode=quote" className="btn-primary">Request a Custom Quote</Link>
              <a href="#species" className="btn-outline-white">Browse All 12 Species ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why TradiCore advantage strip */}
      <section className="bg-accent/10 border-y border-border">
        <div className="container-site py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌳', label: 'Direct Harvest Access', sub: 'Suriname operations' },
            { icon: '🚢', label: 'Shorter Supply Chain', sub: 'No Asian re-routing' },
            { icon: '📐', label: 'Consistent Grade', sub: 'Stable pricing & supply' },
            { icon: '🦋', label: 'Unique Species', sub: 'Not in big-box retail' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-primary">{item.label}</p>
                <p className="text-xs text-muted">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Species grid */}
      <section id="species" className="py-14 lg:py-20" style={{ background: 'linear-gradient(180deg, #F3EDE3 0%, #FAF7F2 100%)' }}>
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <SectionHeader
              eyebrow="12 Exotic Species"
              title="Browse All Species"
              subtitle="Click any species for full details, properties, and to request a quote."
            />

          </div>

          {/* Application filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!activeFilter ? 'bg-primary text-white border-primary' : 'border-border text-primary hover:border-accent'}`}
            >
              All Applications
            </button>
            {['Marine', 'Flooring', 'Furniture', 'Structural', 'Decking', 'Joinery', 'Cabinetry', 'Carving', 'Veneer'].map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag === activeFilter ? null : tag)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${activeFilter === tag ? 'bg-primary text-white border-primary' : 'border-border text-primary hover:border-accent'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted mb-4">No species match that application.</p>
              <button onClick={() => setActiveFilter(null)} className="btn-primary">Show All Species</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(s => <SpeciesGridCard key={s.id} species={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why TradiCore detail section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-site">
          <SectionHeader
            eyebrow="The TradiCore Hardwood Advantage"
            title="Why Our Hardwood Is Different"
            center
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            {[
              {
                title: 'Direct Harvest Access',
                body: 'TradiCore has direct relationships with certified Suriname harvesting operations. We control grade selection at the source — not after the fact at a warehouse in Asia or Miami.',
              },
              {
                title: 'Unique Species Availability',
                body: 'Species like Zwarte (Dragon-Phoenix Sandalwood) and Bruinhart are practically nonexistent in the U.S. secondary market. Our supply chain is one of the only legitimate commercial sources.',
              },
              {
                title: 'Shorter Supply Chain = Lower Cost',
                body: 'Most U.S. tropical hardwood routes through Asian re-exporters, adding 2–4 middlemen and 6–12 weeks transit. TradiCore\'s Suriname-direct path cuts that to a fraction.',
              },
              {
                title: 'Consistent Grade & Predictable Supply',
                body: 'Direct sourcing means we know exactly what\'s in the pipeline. Contractors can plan large projects knowing material will arrive on grade, on time, at a stable price baseline.',
              },
            ].map(p => (
              <div key={p.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-lg mb-2">{p.title}</h4>
                  <p className="text-white/65 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/contact?mode=quote" className="btn-primary text-base px-8 py-4">
              Request a Custom Quote
            </Link>
            <p className="text-white/40 text-xs mt-3">Typically respond within 1 business day</p>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-10 bg-bg-warm border-t border-border">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-primary">Download our Hardwood Species Guide</p>
            <p className="text-sm text-muted">Full species catalog with properties, applications, and pricing guidance.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href={`/downloads/${encodeURIComponent('Tradicore Tropical Wood Species Offering.pdf')}`}
              download
              className="btn-primary"
            >
              Species Guide PDF
            </a>

          </div>
        </div>
      </section>
    </Layout>
  )
}
