import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const mouldingLinks = [
  { label: 'All Moulding & Trim',  href: '/collections/moulding-trim' },
  { label: 'Crown Moulding',       href: '/collections/crown-moulding' },
  { label: 'Baseboards & Skirting',href: '/collections/baseboards' },
  { label: 'Door Casing',          href: '/collections/door-casing' },
  { label: 'Door Frames',          href: '/collections/door-frames' },
  { label: 'Wall Panels',          href: '/collections/wall-panels' },
  { label: 'Stair Parts',          href: '/collections/stair-parts' },
  { label: 'S3S / S4S Boards',     href: '/collections/boards' },
  { label: 'Quarter Round',        href: '/collections/quarter-round' },
  { label: 'Shutters',             href: '/collections/shutters' },
]

const hardwoodLinks = [
  { label: 'All Species',          href: '/collections/tropical-hardwood' },
  { label: 'BAS — Basralocus',     href: '/species/basralocus' },
  { label: 'BGR — Berg Gronfolo',  href: '/species/berg-gronfolo' },
  { label: 'WAN — Wana',           href: '/species/wana' },
  { label: 'ZWK — Zwarte',         href: '/species/zwarte' },
  { label: 'RLO — Rode Locus',     href: '/species/rode-locus' },
  { label: 'MKG — Makagrin',       href: '/species/makagrin' },
  { label: 'WPL — Horse-hoof Bean',href: '/species/horse-hoof-bean' },
  { label: 'MKB — Watai Bean',     href: '/species/watai-bean' },
  { label: 'ROK — Rode Kabbes',    href: '/species/rode-kabbes' },
  { label: 'KOE — Koenatepi',      href: '/species/koenatepi' },
  { label: 'BRH — Bruinhart',      href: '/species/bruinhart' },
  { label: 'GRH — Groenhart',      href: '/species/groenhart' },
  { label: 'Request a Quote',      href: '/contact?mode=quote', divider: true },
]

function Dropdown({ links, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-xl min-w-[220px] py-1 z-50">
      {links.map((link) => (
        <span key={link.href}>
          {link.divider && <hr className="my-1 border-border" />}
          <Link
            to={link.href}
            onClick={onClose}
            className="block px-4 py-2 text-sm text-primary hover:bg-bg hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  )
}

function NavDropdown({ label, links }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded transition-colors ${open ? 'text-accent' : 'text-white/90 hover:text-white'}`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <Dropdown links={links} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function Navbar() {
  const { cartCount } = useCart()
  const { isAuthenticated, currentUser, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const accountRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handler(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [])

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="bg-primary sticky top-0 z-40 shadow-md">
        <div className="container-site flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="bg-white rounded-md px-2 py-1">
              <img
                src="/logo.png"
                alt="TradiCore Lumber and Products"
                className="h-8 w-auto"
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavDropdown label="Moulding & Trim" links={mouldingLinks} />
            <NavDropdown label="Tropical Hardwood" links={hardwoodLinks} />
            <Link to="/collections/doors" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 text-white/90 hover:text-white transition-colors">
              Doors
              <span className="text-[10px] font-semibold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded">Soon</span>
            </Link>
            <Link to="/about" className="text-sm font-medium px-3 py-2 text-white/90 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium px-3 py-2 text-white/90 hover:text-white transition-colors">Contact / Quote</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Trade account CTA */}
            <Link to="/trade" className="hidden lg:flex items-center gap-1.5 border border-accent text-accent text-xs font-semibold px-3 py-1.5 rounded hover:bg-accent hover:text-primary transition-colors">
              Trade Account
            </Link>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(o => !o)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-xl min-w-[160px] py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <p className="px-4 py-2 text-xs text-muted border-b border-border">{currentUser?.email}</p>
                      <Link to="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-primary hover:bg-bg">Dashboard</Link>
                      <Link to="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-primary hover:bg-bg">Orders</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-bg">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"    onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-primary hover:bg-bg">Sign In</Link>
                      <Link to="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-primary hover:bg-bg">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-white/80 hover:text-white transition-colors" aria-label={`Cart (${cartCount})`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
          {/* Panel */}
          <div className="w-80 max-w-full bg-primary h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="bg-white rounded px-2 py-0.5">
                <img src="/logo.png" alt="TradiCore" className="h-7 w-auto" />
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {/* Moulding section */}
              <MobileSection
                label="Moulding & Trim"
                open={mobileSection === 'moulding'}
                onToggle={() => setMobileSection(s => s === 'moulding' ? null : 'moulding')}
                links={mouldingLinks}
                onClose={() => setMobileOpen(false)}
              />
              <MobileSection
                label="Tropical Hardwood"
                open={mobileSection === 'hardwood'}
                onToggle={() => setMobileSection(s => s === 'hardwood' ? null : 'hardwood')}
                links={hardwoodLinks}
                onClose={() => setMobileOpen(false)}
              />

              {[
                { label: 'Doors', href: '/collections/doors', badge: 'Coming Soon' },
                { label: 'About', href: '/about' },
                { label: 'Contact / Quote', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
              ].map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                  {item.badge && <span className="text-[10px] font-semibold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded">{item.badge}</span>}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10">
                <Link
                  to="/trade"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center border border-accent text-accent text-sm font-semibold px-4 py-2.5 rounded hover:bg-accent hover:text-primary transition-colors mb-3"
                >
                  Trade Account
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-white/80 hover:text-white">My Account</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login"    onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-white/80 hover:text-white">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-white/80 hover:text-white">Create Account</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

function MobileSection({ label, open, onToggle, links, onClose }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5">
          {links.map(link => (
            <span key={link.href}>
              {link.divider && <hr className="my-1 border-white/10" />}
              <Link
                to={link.href}
                onClick={onClose}
                className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
