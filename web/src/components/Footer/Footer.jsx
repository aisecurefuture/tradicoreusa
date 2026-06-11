import { Link } from 'react-router-dom'

const downloads = [
  { label: 'Moulding Catalogue',          file: 'Moulding Catalogue.pdf' },
  { label: 'TradiCore Moulding & Doors',  file: 'TradiCore Moulding & Door catalog 04232026.pdf' },
  { label: 'Jiraw Moulding & Doors 2026', file: 'Jiraw Moulding & Door catalog 2026.pdf' },
  { label: 'Jiraw Door Catalogue 2025',   file: 'Jiraw Door Catalogue 2025.pdf' },
  { label: 'Tropical Hardwood Species',   file: 'Tradicore Tropical Wood Species Offering.pdf' },
  { label: 'Hardwood White Paper',        file: 'TradiCore_Tropical_Hardwood_VC_White_Paper_Rev1 05072026.pdf' },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-primary">
                  <path d="M16 4L4 10v6l12 6 12-6v-6L16 4z" fill="currentColor" opacity=".9"/>
                  <path d="M4 16v6l12 6 12-6v-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Tradi<span className="text-accent">Core</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Premium Wood Trim, Moulding & Tropical Hardwood — Direct from the Source to Your Home.
            </p>
            <p className="text-white/40 text-xs">Illinois Registered LLC</p>
            <div className="flex gap-3 mt-4">
              {['facebook', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#" aria-label={s} className="w-8 h-8 rounded bg-white/10 hover:bg-accent hover:text-primary text-white/60 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Products</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Crown Moulding',        '/collections/crown-moulding'],
                ['Baseboards & Skirting', '/collections/baseboards'],
                ['Door Casing',           '/collections/door-casing'],
                ['Wall Panels',           '/collections/wall-panels'],
                ['Stair Parts',           '/collections/stair-parts'],
                ['Tropical Hardwood',     '/collections/tropical-hardwood'],
                ['Doors',                 '/collections/doors'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-white/60 hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['About Us',         '/about'],
                ['Contact / Quote',  '/contact'],
                ['Trade Accounts',   '/trade'],
                ['FAQ',              '/faq'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-white/60 hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-3 text-sm uppercase tracking-wide">Downloads</h3>
            <ul className="space-y-1.5 text-sm">
              {downloads.map(({ label, file }) => (
                <li key={file}>
                  <a
                    href={`/downloads/${encodeURIComponent(file)}`}
                    download={file}
                    className="flex items-center gap-1.5 text-white/60 hover:text-accent transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>1100 Sheridan Rd., Unit 5<br />Winthrop Harbor, IL 60096</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <a href="tel:+12247156452" className="hover:text-accent transition-colors block">Alan Pan: (224) 715-6452</a>
                  <a href="tel:+18475053302" className="hover:text-accent transition-colors block">Mohammad: (847) 505-3302</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:tradicoreusa@gmail.com" className="hover:text-accent transition-colors">
                  tradicoreusa@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} TradiCore LLC. All rights reserved.</p>
          <p>Traditional Precision. Premium Supply.</p>
        </div>
      </div>
    </footer>
  )
}
