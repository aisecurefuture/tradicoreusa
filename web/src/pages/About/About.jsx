import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'

const VALUES = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Transparency',
    body: 'We tell you exactly where the wood comes from, how it was harvested, and why it performs the way it does. No mystery sourcing.',
  },
  {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
    title: 'Responsible Sourcing',
    body: 'Our Suriname hardwood supply partners operate under government-managed concessions with verified chain-of-custody documentation.',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Builder-First',
    body: 'We started this business talking to contractors, not investors. Every product decision — pricing, packaging, lead times — is made with the job site in mind.',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Fair Pricing',
    body: 'Direct supplier relationships mean we pass real savings to trade customers — not margins stacked on margins through a chain of middlemen.',
  },
]

const TEAM = [
  {
    name: 'Alan Pan',
    title: 'Founder',
    bio: 'Entrepreneur with a background in international trade and wood products. Founded TradiCore to build a direct, transparent supply chain connecting U.S. builders with premium South American tropical hardwoods.',
    initials: 'AP',
    linkedin: 'https://www.linkedin.com/in/alan-pan-2309971/',
  },
  {
    name: 'Mohammad Akhtar',
    title: 'Co-Founder & Partner',
    bio: 'Oversees sales operations and logistics for TradiCore Lumber and Products. Brings deep experience in supply chain management and building strong relationships with trade customers across the U.S.',
    initials: 'MA',
    linkedin: null,
  },
  {
    name: 'Patrick Kelly',
    title: 'Technology & Security',
    bio: 'Leads website development, hosting, and infrastructure for TradiCore. Responsible for application security, data protection, and all digital systems that keep the platform reliable and secure.',
    initials: 'PK',
    linkedin: null,
  },
]

const TIMELINE = [
  { year: '2022', event: 'First sourcing trip to Suriname. Identified Basralocus and Bruinhart as primary species with consistent supply and exceptional durability.' },
  { year: '2023', event: 'Established direct supply agreements with Surinamese forestry partners. First container shipment of hardwood arrived in Chicago.' },
  { year: '2024', event: 'Expanded to MDF engineered moulding and trim to serve the full millwork needs of residential and commercial contractors.' },
  { year: '2025', event: 'Launched TradiCore Lumber and Products online — bringing wholesale hardwood and moulding pricing to the broader trade market.' },
  { year: '2026', event: 'Door line in development. Expanding tropical species catalog to 12 verified species with full technical documentation.' },
]

export default function About() {
  useEffect(() => {
    document.title = 'About Us | TradiCore Lumber and Products'
  }, [])

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary text-white py-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">Our Story</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Wood supply, without the runaround.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              TradiCore Lumber and Products is an Illinois-based wood products company bringing premium South American
              tropical hardwoods and engineered moulding directly to contractors, builders, and dealers
              across the United States.
            </p>
          </div>
        </div>
      </div>

      {/* Mission statement */}
      <div className="bg-accent text-primary py-12">
        <div className="container-site">
          <p className="font-heading text-2xl lg:text-3xl font-bold max-w-3xl leading-snug">
            "We believe the best building materials in the world should be accessible to every
            contractor — not just the ones with connections overseas."
          </p>
          <p className="mt-4 text-primary/70 font-medium">— Alan Pan, Founder</p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-bg py-16">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">The TradiCore Story</span>
              <h2 className="font-heading text-3xl font-bold text-primary mb-6">From Chicago to Suriname and back.</h2>
              <div className="space-y-4 text-body leading-relaxed">
                <p>
                  TradiCore was founded on a simple observation: the tropical hardwoods used in the world's
                  most durable decks, floors, and facades were nearly impossible to source reliably in the
                  U.S. — unless you knew someone. Importers were fragmented, lead times were unpredictable,
                  and pricing had little relationship to actual cost.
                </p>
                <p>
                  We went directly to the source. Our supply partners in Suriname operate under
                  government-managed forestry concessions in one of the most biodiverse regions on earth.
                  Species like Basralocus, Bruinhart, and Rode Locus have been used for centuries in marine
                  and structural applications across Europe and South America — but remain largely unknown
                  to North American builders.
                </p>
                <p>
                  On the moulding side, we source MDF and engineered profiles designed for consistency and
                  paintability — the profiles that installers actually want to work with, at prices that
                  make volume orders viable.
                </p>
                <p>
                  Our goal is straightforward: be the most reliable, transparent wood products supplier
                  for the U.S. trade market. That means honest pricing, real technical documentation,
                  and a team that answers the phone.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-6 block">Company Timeline</span>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-8">
                  {TIMELINE.map(({ year, event }) => (
                    <div key={year} className="flex gap-5 relative">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">
                        {year.slice(2)}
                      </div>
                      <div className="pt-1">
                        <p className="text-xs font-semibold text-accent mb-1">{year}</p>
                        <p className="text-sm text-body leading-relaxed">{event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-primary/3 border-y border-primary/10 py-16">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-3">What we stand for</h2>
            <p className="text-muted max-w-lg mx-auto">Four principles that shape every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="card p-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-bg py-16">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-primary mb-3">The team</h2>
            <p className="text-muted">Small, focused, and obsessed with wood.</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
              {TEAM.map(member => (
                <div key={member.name} className="card p-6 w-72 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-heading font-bold text-primary text-xl">{member.initials}</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary">{member.name}</h3>
                  <p className="text-xs text-accent font-semibold mb-3">{member.title}</p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hardwood supply section */}
      <div className="bg-primary text-white py-16">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">Our Supply Chain</span>
              <h2 className="font-heading text-3xl font-bold mb-5">Suriname — where the hardwood comes from.</h2>
              <div className="space-y-3 text-white/70 leading-relaxed text-sm">
                <p>
                  Suriname is one of the most forested countries on earth — over 90% of its land area
                  remains covered by tropical rainforest. The country's forestry sector operates under
                  strict government concession management, with annual allowable cut volumes set by the
                  Foundation for Forest Management and Production Control (SBB).
                </p>
                <p>
                  Our supply partners hold active concessions and provide full chain-of-custody
                  documentation with every shipment. Species are harvested selectively — not clear-cut —
                  and replanting programs are in place for most commercial species.
                </p>
                <p>
                  Container shipments depart the Port of Paramaribo and arrive at the Port of Houston
                  or Port of Miami on a regular schedule. Air-dried and kiln-dried material is available
                  depending on species and application.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/collections/tropical-hardwood" className="btn-primary">
                  Browse All Species
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['12', 'Verified species'],
                ['90%+', 'Forest cover in Suriname'],
                ['Selective', 'Harvest method'],
                ['Full', 'Chain-of-custody docs'],
              ].map(([stat, label]) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="font-heading text-3xl font-bold text-accent mb-1">{stat}</p>
                  <p className="text-xs text-white/60 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-bg py-14">
        <div className="container-site text-center">
          <h2 className="font-heading text-2xl font-bold text-primary mb-3">Ready to work together?</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Get wholesale pricing, dedicated support, and reliable supply through our trade program.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/trade" className="btn-primary">Apply for Trade Account</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
