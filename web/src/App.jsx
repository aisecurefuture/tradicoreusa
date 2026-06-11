import { Routes, Route, useLocation } from 'react-router-dom'
import { trackPageview } from './lib/analytics'
import { useEffect } from 'react'
import { useToast } from './context/ToastContext'
import Toast from './components/Toast/Toast'
import Layout from './components/Layout/Layout'

import Home from './pages/Home/Home'
import MouldingCategory from './pages/Category/MouldingTrim'
import Category from './pages/Category/Category'
import ProductDetail from './pages/Product/Product'
import TropicalHardwood from './pages/TropicalHardwood/TropicalHardwood'
import SpeciesDetail from './pages/SpeciesDetail/SpeciesDetail'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Account from './pages/Account/Account'
import Trade from './pages/Trade/Trade'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import FAQ from './pages/FAQ/FAQ'
import Doors from './pages/Doors/Doors'

function NotFound() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-bg">
        <div className="text-center px-4 max-w-md">
          <div className="font-heading text-[120px] font-bold text-primary/8 leading-none select-none mb-2">
            404
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-3">Page not found</h1>
          <p className="text-muted mb-8 leading-relaxed">
            We couldn't find the page you were looking for. It may have moved, or the link might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="btn-primary justify-center">Back to Home</a>
            <a href="/contact" className="btn-outline justify-center">Contact Us</a>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs text-muted mb-3">Looking for something specific?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                ['Moulding & Trim', '/collections/moulding-trim'],
                ['Tropical Hardwood', '/collections/tropical-hardwood'],
                ['Doors', '/collections/doors'],
                ['Trade Accounts', '/trade'],
                ['FAQ', '/faq'],
              ].map(([label, href]) => (
                <a key={href} href={href}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-muted hover:border-accent hover:text-accent transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0); trackPageview(pathname) }, [pathname])
  return null
}

export default function App() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"                              element={<Home />} />
        <Route path="/collections/moulding-trim"     element={<MouldingCategory />} />
        <Route path="/collections/tropical-hardwood" element={<TropicalHardwood />} />
        <Route path="/collections/doors"             element={<Doors />} />
        <Route path="/collections/:categorySlug"     element={<Category />} />
        <Route path="/products/:productSlug"         element={<ProductDetail />} />
        <Route path="/species/:speciesSlug"          element={<SpeciesDetail />} />
        <Route path="/cart"                          element={<Cart />} />
        <Route path="/checkout"                      element={<Checkout />} />
        <Route path="/login"                         element={<Login />} />
        <Route path="/register"                      element={<Register />} />
        <Route path="/account"                       element={<Account />} />
        <Route path="/contact"                       element={<Contact />} />
        <Route path="/about"                         element={<About />} />
        <Route path="/faq"                           element={<FAQ />} />
        <Route path="/trade"                         element={<Trade />} />
        <Route path="*"                              element={<NotFound />} />
      </Routes>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </>
  )
}
