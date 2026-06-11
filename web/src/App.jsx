import { Routes, Route, useLocation } from 'react-router-dom'
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

// Phase-8+ placeholders
const Placeholder = ({ title }) => (
  <Layout>
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-3xl text-primary mb-2">{title}</h1>
        <p className="text-muted">Coming in next phase</p>
      </div>
    </div>
  </Layout>
)
const Doors             = () => <Placeholder title="Doors — Coming Soon" />
const Contact           = () => <Placeholder title="Contact / Quote" />
const About             = () => <Placeholder title="About Us" />
const FAQ               = () => <Placeholder title="FAQ" />
const Trade             = () => <Placeholder title="Trade Accounts" />

function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-bg">
        <div className="text-center px-4">
          <div className="font-heading text-8xl font-bold text-primary/10 mb-4 select-none">404</div>
          <h1 className="font-heading text-3xl text-primary mb-2">Page Not Found</h1>
          <p className="text-muted mb-8">We couldn't find what you were looking for.</p>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
      </div>
    </Layout>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
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
