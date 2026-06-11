import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import ProductCard from '../../components/ProductCard/ProductCard'
import QuantityInput from '../../components/QuantityInput/QuantityInput'
import Badge from '../../components/Badge/Badge'
import Spinner from '../../components/Spinner/Spinner'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { getProductBySlug, getRelatedProducts, mouldingCategories } from '../../data/mockData'
import { formatPrice } from '../../utils/formatPrice'

const MATERIAL_CALLOUTS = {
  MDF: {
    title: 'About MDF',
    body: 'MDF (Medium Density Fiberboard) takes paint exceptionally evenly — ideal for painted trim packages. It doesn\'t expand or contract with humidity the way solid wood does, making it the professional\'s choice for stable, painted interior millwork.',
  },
  'Radiata Pine': {
    title: 'About Radiata Pine',
    body: 'Radiata Pine is a fast-growing softwood with a consistent, fine grain. It accepts stain and paint well and machines cleanly. An affordable option for trim that will be painted or stained on-site.',
  },
  Poplar: {
    title: 'About Poplar',
    body: 'Poplar is a hardwood that machines exceptionally well, accepts paint to a glass-smooth finish, and is a favorite of cabinet makers and custom trim installers. Slightly harder and more durable than pine or MDF for high-traffic millwork.',
  },
  'South American Pine': {
    title: 'About South American Pine',
    body: 'South American Pine (Pinus radiata or similar) offers straight grain and consistent density. A reliable substrate for primed or painted applications at a competitive price point.',
  },
  Falcata: {
    title: 'About Falcata',
    body: 'Falcata is a lightweight, fast-growing tropical hardwood used widely in engineered moulding. Its low density makes it easy to handle and cut, while its fine grain accepts primer and paint cleanly.',
  },
}

const finishVariant = { Raw: 'raw', Primed: 'primed', Painted: 'painted', 'Vinyl Film': 'vinyl' }

export default function Product() {
  const { productSlug } = useParams()
  const [qty, setQty]         = useState(1)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    setQty(1)
    const t = setTimeout(() => {
      const p = getProductBySlug(productSlug)
      setProduct(p)
      setActiveImg(0)
      setLoading(false)
      if (p) document.title = `${p.name} | TradiCore USA`
    }, 150)
    return () => clearTimeout(t)
  }, [productSlug])

  const handleAddToCart = () => {
    addToCart(product, qty)
    toast.success(`${qty}× ${product.name} added to cart`)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-site py-24 text-center">
          <h1 className="font-heading text-2xl text-primary mb-4">Product Not Found</h1>
          <Link to="/collections/moulding-trim" className="btn-primary">Back to Moulding & Trim</Link>
        </div>
      </Layout>
    )
  }

  const categoryMeta = mouldingCategories.find(c => c.slug === product.categorySlug)
  const related = getRelatedProducts(product, 3)

  // Generate gallery images (main + 2 alternates using placehold with slight tint variation)
  const gallery = [
    product.imageUrl,
    `https://placehold.co/600x400/1A3A5C/FAF7F2?text=${encodeURIComponent(product.name + ' Detail')}`,
    `https://placehold.co/600x400/3D2410/FAF7F2?text=${encodeURIComponent(product.name + ' Profile')}`,
  ]

  const callout = MATERIAL_CALLOUTS[product.material]

  return (
    <Layout>
      <div className="container-site py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Moulding & Trim', href: '/collections/moulding-trim' },
          { label: categoryMeta?.label ?? product.categorySlug, href: `/collections/${product.categorySlug}` },
          { label: product.name },
        ]} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4 mb-12">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="rounded-xl overflow-hidden border border-border bg-bg-warm aspect-[4/3]">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors w-20 h-16 flex-shrink-0 ${activeImg === i ? 'border-accent' : 'border-border hover:border-primary/40'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={finishVariant[product.finish] ?? 'new'}>{product.finish}</Badge>
              <Badge variant="trade">{product.material}</Badge>
              {product.inStock && !product.comingSoon && <Badge variant="in-stock">In Stock</Badge>}
              {product.comingSoon && <Badge variant="coming-soon">Coming Soon</Badge>}
            </div>

            {/* Name & SKU */}
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-muted">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {product.price ? (
                <>
                  <span className="font-bold text-3xl text-primary">{formatPrice(product.price)}</span>
                  <span className="text-muted text-sm">per {product.unit}</span>
                </>
              ) : (
                <span className="text-lg text-muted italic">Price on request</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-primary/80 leading-relaxed">{product.description}</p>

            {/* Specs table */}
            {product.dimensions && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-bg-warm px-4 py-2 border-b border-border">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Specifications</span>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.dimensions).map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-muted capitalize font-medium w-2/5">
                          {k.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="px-4 py-2.5 text-primary font-medium">{v}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 text-muted font-medium">Material</td>
                      <td className="px-4 py-2.5 text-primary font-medium">{product.material}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted font-medium">Finish</td>
                      <td className="px-4 py-2.5 text-primary font-medium">{product.finish}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Add to cart */}
            {!product.comingSoon ? (
              <div className="flex items-center gap-4">
                <QuantityInput value={qty} onChange={setQty} />
                <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center py-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            ) : (
              <button disabled className="btn-primary opacity-50 cursor-not-allowed justify-center py-3">
                <span className="badge-coming-soon mr-2">Coming Soon</span>
                Not Yet Available
              </button>
            )}

            {/* Request quote link */}
            <Link
              to={`/contact?mode=quote&product=${product.sku}`}
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Request a quote for custom dimensions or volume pricing
            </Link>
          </div>
        </div>

        {/* Material callout */}
        {callout && (
          <div className="mb-12 rounded-xl bg-accent/8 border border-accent/30 p-6 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">{callout.title}</h4>
              <p className="text-sm text-primary/75 leading-relaxed">{callout.body}</p>
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="border-t border-border pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-primary">Related Products</h2>
              <Link to={`/collections/${product.categorySlug}`} className="text-sm text-accent hover:underline">
                View all in {categoryMeta?.label} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
