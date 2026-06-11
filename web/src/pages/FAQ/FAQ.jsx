import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'

const FAQS = [
  {
    category: 'Ordering',
    items: [
      {
        q: 'What is the minimum order quantity?',
        a: 'For moulding and trim, there is no minimum — you can order as little as one 8-foot stick. For tropical hardwood, the minimum order is 50 board feet per species. Container-load pricing (typically 5,000+ bf) is available on request.',
      },
      {
        q: 'Do you offer volume discounts?',
        a: 'Yes. Quantity breaks apply at 500 lf (moulding) and 200 bf (hardwood). Trade account holders receive wholesale pricing automatically — apply at the Trade Accounts page.',
      },
      {
        q: 'Can I get a quote before ordering?',
        a: 'Absolutely. Use the Contact & Quotes page to submit a hardwood or moulding quote request. We respond within 1 business day for standard requests, and same day for most trade account holders.',
      },
    ],
  },
  {
    category: 'Tropical Hardwood',
    items: [
      {
        q: 'Where does the tropical hardwood come from?',
        a: 'All species are sourced from Suriname, South America. Our supply partners hold active government forestry concessions and provide full chain-of-custody documentation with every shipment. Suriname maintains over 90% forest cover — one of the highest rates in the world.',
      },
      {
        q: 'What is "board feet" and how do I calculate it?',
        a: 'Board feet (bf) is a volume measurement: 1 bf = 1 inch thick × 12 inches wide × 12 inches long. Formula: (thickness in inches × width in inches × length in feet) ÷ 12. Our product pages show price per board foot and include a quantity calculator.',
      },
      {
        q: 'Is the hardwood kiln-dried or air-dried?',
        a: 'It depends on the species and your application. Most decking and structural species ship air-dried (typically 15–18% MC). Flooring and interior species are available kiln-dried (6–8% MC) at a premium. Specify your requirement when requesting a quote.',
      },
      {
        q: 'Do you offer FSC-certified material?',
        a: 'Some species are available with FSC certification depending on the current concession status of the harvest lot. Request FSC documentation in your quote form — we will confirm availability for the specific species and volume.',
      },
      {
        q: 'How long are lead times for hardwood orders?',
        a: 'Stock material ships within 5–10 business days from our Midwest warehouse. Custom or large-volume orders sourced from the next container ship typically take 8–14 weeks. We recommend reaching out 90+ days in advance for large projects.',
      },
      {
        q: 'Can I get samples before ordering?',
        a: 'Yes. Contact us to request a sample pack — we provide small cuts (typically 6" × 3–4" face) for up to 4 species. Sample packs are free for trade account holders; a nominal fee applies for retail customers.',
      },
    ],
  },
  {
    category: 'Moulding & Trim',
    items: [
      {
        q: 'What material is the moulding made from?',
        a: 'Our moulding and trim is manufactured from pine and Malacca. These species are dimensionally stable, easy to machine, and provide a smooth, consistent surface ideal for paint finishes. Not suitable for exterior or high-moisture applications.',
      },
      {
        q: 'Is the moulding pre-primed?',
        a: 'Most profiles are available primed or unprimed. Check the product detail page for finish options. Primed profiles are ready for a topcoat — one coat of your finish paint is typically sufficient.',
      },
      {
        q: 'What lengths do the mouldings come in?',
        a: 'Standard lengths are 8 ft and 12 ft. Select profiles are available in 16 ft for runs that minimize joints. Length availability is noted on each product page.',
      },
      {
        q: 'Can I order custom profiles?',
        a: 'Custom profiles are available with a minimum order of 500 lf and a tooling lead time of 4–6 weeks. Contact us with your profile drawing or a sample piece and we will provide pricing.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'Where do you ship?',
        a: 'We ship to all 48 contiguous U.S. states. Alaska and Hawaii orders require a freight quote — contact us directly. We do not currently ship internationally.',
      },
      {
        q: 'How is large freight shipped?',
        a: 'Orders over approximately 150 lbs ship LTL (less-than-truckload) freight on pallets. You will receive a tracking number and the freight carrier will contact you to schedule a delivery appointment. Liftgate service is available for residential addresses.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'Note any visible damage on the delivery receipt before signing. Photograph the damage and contact us within 48 hours at tradicoreusa@gmail.com. We will arrange replacement or credit — we do not charge restocking fees for carrier-damaged goods.',
      },
    ],
  },
  {
    category: 'Trade Accounts',
    items: [
      {
        q: 'Who qualifies for a trade account?',
        a: 'Licensed contractors, builders, remodelers, millwork shops, flooring dealers, architects, and designers. We also work with commercial fit-out contractors and hospitality developers. Apply on the Trade Accounts page — approval takes 1–2 business days.',
      },
      {
        q: 'What are the benefits of a trade account?',
        a: 'Wholesale pricing (20–40% off retail on moulding, up to 35% on hardwood), a dedicated account manager, advance inventory reservations, and first access to limited-run species.',
      },
      {
        q: 'Is there an annual fee or minimum spend?',
        a: 'No annual fee and no minimum spend requirement. Your account stays active as long as it has at least one order per 12 months.',
      },
      {
        q: 'Can I pay by ACH bank transfer?',
        a: 'Yes — ACH is our preferred payment method for trade accounts. There are no processing fees and settlement typically takes 3–5 business days.',
      },
    ],
  },
]

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left hover:text-accent transition-colors"
      >
        <span className={`text-sm font-semibold leading-snug ${open ? 'text-accent' : 'text-primary'}`}>{q}</span>
        <svg
          className={`w-5 h-5 shrink-0 mt-0.5 transition-transform text-muted ${open ? 'rotate-180 text-accent' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-body leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    document.title = 'FAQ | TradiCore Lumber and Products'
  }, [])

  const categories = ['all', ...FAQS.map(f => f.category)]
  const visible = activeCategory === 'all' ? FAQS : FAQS.filter(f => f.category === activeCategory)

  return (
    <Layout>
      <div className="bg-primary text-white py-14">
        <div className="container-site">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} light />
          <h1 className="font-heading text-4xl font-bold mt-3 mb-2">Frequently Asked Questions</h1>
          <p className="text-white/65 max-w-lg">
            Everything you need to know about ordering, hardwood species, moulding, and trade accounts.
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* Sidebar category nav */}
          <aside className="lg:w-52 shrink-0">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Categories</p>
            <nav className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white font-medium'
                      : 'text-body hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? 'All Questions' : cat}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-xl">
              <p className="text-sm font-semibold text-primary mb-1">Still have questions?</p>
              <p className="text-xs text-muted mb-3">Our team typically responds within a few hours.</p>
              <Link to="/contact" className="text-sm text-accent hover:underline font-medium">
                Contact us →
              </Link>
            </div>
          </aside>

          {/* FAQ content */}
          <main className="flex-1 min-w-0 space-y-8">
            {visible.map(section => (
              <div key={section.category} className="card p-6">
                <h2 className="font-heading text-lg font-bold text-primary mb-2 pb-3 border-b border-gray-100">
                  {section.category}
                </h2>
                {section.items.map(item => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="bg-primary rounded-2xl p-8 text-white text-center">
              <h3 className="font-heading text-xl font-bold mb-2">Can't find your answer?</h3>
              <p className="text-white/65 text-sm mb-6">
                Reach out directly — we're happy to help with technical specs, custom quotes, or anything else.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact" className="btn-primary">Send Us a Message</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
