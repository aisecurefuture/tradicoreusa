import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import Badge from '../Badge/Badge'

const finishVariant = { Raw: 'raw', Primed: 'primed', Painted: 'painted', 'Vinyl Film': 'vinyl' }

export default function ProductCard({ product }) {
  const { toast } = useToast()

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group flex flex-col hover:border-accent hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-bg-warm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.comingSoon && (
          <span className="absolute top-2 left-2 badge-coming-soon">Coming Soon</span>
        )}
        {!product.comingSoon && product.inStock && (
          <span className="absolute top-2 left-2 badge-in-stock">In Stock</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant={finishVariant[product.finish] ?? 'new'}>{product.finish}</Badge>
          <Badge variant="trade">{product.material}</Badge>
        </div>

        <h3 className="font-semibold text-primary text-sm leading-snug flex-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-muted">SKU: {product.sku}</p>

        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-border">
          {product.comingSoon ? (
            <span className="badge-coming-soon text-xs">Soon</span>
          ) : (
            <Link
              to={`/contact?type=moulding`}
              onClick={e => e.stopPropagation()}
              className="flex-shrink-0 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-accent hover:text-primary transition-colors"
            >
              Request a Quote
            </Link>
          )}
        </div>
      </div>
    </Link>
  )
}
