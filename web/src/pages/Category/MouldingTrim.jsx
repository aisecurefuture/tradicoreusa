import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { mouldingCategories } from '../../data/mockData'

const categoryIcons = {
  'crown-moulding':  'M4 18L8 10l4 4 4-8 4 10',
  'baseboards':      'M4 20h16M4 16h16M4 12h10',
  'door-casing':     'M8 20V8m0 0h8m-8 0l-4 4m12-4l4 4',
  'door-frames':     'M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9',
  'wall-panels':     'M4 5h16v14H4z M9 5v14 M14 5v14',
  'stair-parts':     'M3 21l4-4h4l4-4h4l2-2',
  'boards':          'M4 6h16M4 10h16M4 14h16M4 18h16',
  'quarter-round':   'M4 20 Q4 4 20 4',
  'shutters':        'M6 3h12v18H6z M6 8h12 M6 13h12',
}

export default function MouldingTrim() {
  useEffect(() => {
    document.title = 'Moulding & Trim | TradiCore Lumber and Products'
  }, [])

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-primary text-white py-12">
        <div className="container-site">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Moulding & Trim' },
          ]} />
          <SectionHeader
            eyebrow="MDF & Engineered Wood Profiles"
            title="Moulding & Trim"
            subtitle="Factory-direct profiles in MDF, pine, poplar, and falcata — raw, primed, painted, or vinyl-wrapped."
            light
          />
        </div>
      </div>

      {/* Category grid */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mouldingCategories.map(cat => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="card group p-6 hover:border-accent hover:shadow-lg transition-all flex items-start gap-5"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d={categoryIcons[cat.slug] || 'M4 6h16M4 12h16M4 18h7'} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-primary text-lg mb-1 group-hover:text-accent transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-muted leading-snug">{cat.description}</p>
              </div>
              <svg className="w-5 h-5 text-muted group-hover:text-accent transition-colors flex-shrink-0 self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Trade CTA */}
        <div className="mt-12 rounded-xl bg-primary/5 border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-semibold text-primary text-lg">Buying in volume?</h4>
            <p className="text-muted text-sm mt-1">Apply for a trade account and get wholesale pricing on all moulding and trim profiles.</p>
          </div>
          <Link to="/trade" className="btn-primary flex-shrink-0">Apply for Trade Account</Link>
        </div>
      </div>
    </Layout>
  )
}
