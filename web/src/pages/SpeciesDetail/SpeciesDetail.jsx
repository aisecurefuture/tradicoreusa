import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Spinner from '../../components/Spinner/Spinner'
import { getSpeciesBySlug, getRelatedSpecies } from '../../data/speciesData'

const WOOD_COLORS = {
  BAS: '#5C3317', BGR: '#A0724A', WAN: '#8B4513', ZWK: '#1A0A00',
  RLO: '#8B1A1A', MKG: '#6B4423', WPL: '#E8D5B0', MKB: '#4A2C17',
  ROK: '#7B2D2D', KOE: '#F5E6C8', BRH: '#3D1F0A', GRH: '#4B2D5E',
}

function RelatedSpeciesCard({ species }) {
  return (
    <Link
      to={`/species/${species.slug}`}
      className="card group p-5 hover:border-accent hover:shadow-md transition-all"
    >
      <div className="h-1.5 w-full rounded mb-3" style={{ background: WOOD_COLORS[species.code] || '#8B6914' }} />
      <span className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">{species.code}</span>
      <h4 className="font-heading font-semibold text-primary mt-0.5 group-hover:text-accent transition-colors">{species.name}</h4>
      <p className="text-xs text-muted italic mb-3">{species.tradeName}</p>
      <div className="flex flex-wrap gap-1">
        {species.applications.slice(0, 3).map(app => (
          <span key={app} className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-full">{app}</span>
        ))}
      </div>
    </Link>
  )
}

export default function SpeciesDetail() {
  const { speciesSlug } = useParams()
  const navigate = useNavigate()
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    const t = setTimeout(() => {
      const s = getSpeciesBySlug(speciesSlug)
      if (!s) { navigate('/collections/tropical-hardwood', { replace: true }); return }
      setSpecies(s)
      setLoading(false)
      document.title = `${s.name} (${s.code}) | TradiCore Lumber and Products`
    }, 150)
    return () => clearTimeout(t)
  }, [speciesSlug, navigate])

  if (loading) return <Layout><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>
  if (!species) return null

  const related = getRelatedSpecies(species, 3)
  const swatch  = WOOD_COLORS[species.code] || '#8B6914'

  return (
    <Layout>
      {/* Page hero — earthy dark background */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, #2D1810 0%, #3D2B1F 100%)' }}>
        <div className="container-site">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Tropical Hardwood', href: '/collections/tropical-hardwood' },
            { label: species.name },
          ]} />
          <div className="flex items-start gap-4 mt-4">
            <div className="w-2 self-stretch rounded-full flex-shrink-0" style={{ background: swatch }} />
            <div>
              <span className="text-accent text-xs font-bold tracking-widest uppercase">{species.code} — {species.origin}</span>
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mt-1 leading-tight">
                {species.name}
              </h1>
              <p className="text-white/60 text-lg italic mt-1">{species.tradeName}</p>
              {species.localName !== species.name && (
                <p className="text-white/40 text-sm mt-0.5">Local name: {species.localName}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: Gallery + Properties ── */}
          <div className="flex flex-col gap-6">
            {/* Gallery */}
            <div>
              <div className="rounded-xl overflow-hidden border border-border bg-bg-warm aspect-[4/3] mb-3">
                <img
                  src={species.galleryImages?.[activeImg] ?? species.imageUrl}
                  alt={species.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {(species.galleryImages ?? [species.imageUrl]).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-colors w-20 h-14 flex-shrink-0 ${activeImg === i ? 'border-accent' : 'border-border hover:border-primary/40'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Properties table */}
            <div className="card overflow-hidden">
              <div className="bg-bg-warm px-4 py-2.5 border-b border-border">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Wood Properties</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Durability',     species.durability],
                    ['Density',        species.density],
                    ['Janka Hardness', species.janka],
                    ['Workability',    species.workability],
                    ['Best Finish',    species.finish],
                    ['Supply',         species.supply],
                  ].map(([label, val]) => (
                    <tr key={label} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-muted font-medium w-2/5 text-xs">{label}</td>
                      <td className={`px-4 py-2.5 font-medium text-xs leading-snug ${label === 'Supply' && val?.includes('Limited') ? 'text-amber-700' : 'text-primary'}`}>
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price + CTA */}
            <div className="card p-5">
              <p className="text-sm text-muted mb-4">
                Pricing available on request. Volume pricing and custom dimensions available — contact us for a quote.
              </p>
              <Link
                to={`/contact?mode=quote&species=${species.code}`}
                className="btn-primary w-full justify-center py-3 mb-2"
              >
                Request a Trade Quote for {species.code}
              </Link>
              <Link
                to="/trade?interest=tropical-hardwood"
                className="btn-ghost w-full justify-center text-sm border border-border"
              >
                Apply for Trade Account →
              </Link>
            </div>
          </div>

          {/* ── Right: Description + Applications ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Description */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">About {species.name}</h2>
              <p className="text-primary/80 leading-relaxed">{species.description}</p>
            </div>

            {/* Appearance */}
            <div className="rounded-xl border border-border p-6 bg-bg-warm">
              <h3 className="font-heading font-semibold text-primary text-lg mb-3 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: swatch }} />
                Appearance & Color
              </h3>
              <p className="text-sm text-primary/75 leading-relaxed">{species.colorDescription}</p>
            </div>

            {/* Applications */}
            <div>
              <h3 className="font-heading font-semibold text-primary text-lg mb-4">Recommended Applications</h3>
              <div className="flex flex-wrap gap-2">
                {species.applications.map(app => (
                  <span key={app} className="flex items-center gap-1.5 bg-primary/8 text-primary text-sm font-medium px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Workability callout */}
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Machining & Finishing Notes
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-wide mb-1">Workability</p>
                  <p className="text-primary/75">{species.workability}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-wide mb-1">Recommended Finish</p>
                  <p className="text-primary/75">{species.finish}</p>
                </div>
              </div>
            </div>

            {/* SKU / ordering info */}
            <div className="rounded-xl border border-border p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted mb-0.5">SKU</p>
                <p className="font-mono font-semibold text-primary">{species.sku}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Origin</p>
                <p className="font-medium text-primary">{species.origin}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Sold As</p>
                <p className="font-medium text-primary">Rough-sawn, per board foot</p>
              </div>
              <Link
                to={`/contact?mode=quote&species=${species.code}`}
                className="btn-primary flex-shrink-0"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Related species */}
        {related.length > 0 && (
          <div className="border-t border-border mt-12 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-primary">Related Species</h2>
              <Link to="/collections/tropical-hardwood" className="text-sm text-accent hover:underline">
                View all 12 species →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(s => <RelatedSpeciesCard key={s.id} species={s} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
