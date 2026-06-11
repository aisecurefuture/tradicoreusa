import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'

// Unique color swatch per species code
const WOOD_COLORS = {
  BAS: '#5C3317', BGR: '#A0724A', WAN: '#8B4513', ZWK: '#1A0A00',
  RLO: '#8B1A1A', MKG: '#6B4423', WPL: '#E8D5B0', MKB: '#4A2C17',
  ROK: '#7B2D2D', KOE: '#F5E6C8', BRH: '#3D1F0A', GRH: '#4B2D5E',
}

export default function SpeciesCard({ species, showQuoteButton = true }) {
  const swatchColor = WOOD_COLORS[species.code] || '#8B6914'

  return (
    <div className="card group flex flex-col hover:border-accent hover:shadow-lg transition-all">
      {/* Color swatch bar */}
      <div className="h-2 w-full rounded-t-lg" style={{ background: swatchColor }} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Code + name */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">{species.code}</span>
            {species.supply === 'Limited — contact for availability' && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Limited</span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-primary text-base leading-tight group-hover:text-accent transition-colors">
            {species.name}
          </h3>
          <p className="text-xs text-muted mt-0.5 italic">{species.tradeName}</p>
        </div>

        {/* Applications */}
        <div className="flex flex-wrap gap-1">
          {species.applications.slice(0, 3).map(app => (
            <span key={app} className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-full">{app}</span>
          ))}
          {species.applications.length > 3 && (
            <span className="text-[10px] text-muted px-1">+{species.applications.length - 3}</span>
          )}
        </div>

        {/* Properties */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="text-muted">Durability:</span>
          </div>
          <span className="text-primary font-medium truncate">{species.durability?.split(' ')[0]}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="text-muted">Density:</span>
          </div>
          <span className="text-primary font-medium truncate">{species.density?.split(' ')[0]}</span>
        </div>

        {/* Price */}
        <div className="border-t border-border pt-3 mt-auto flex items-end justify-between gap-2">
          <div>
            {species.price ? (
              <>
                <span className="font-bold text-primary">{formatPrice(species.price)}</span>
                <span className="text-xs text-muted ml-1">/ {species.unit}</span>
              </>
            ) : (
              <span className="text-sm text-muted italic">Quote only</span>
            )}
          </div>
          {showQuoteButton && (
            <Link
              to={`/contact?mode=quote&species=${species.code}`}
              onClick={e => e.stopPropagation()}
              className="flex-shrink-0 text-xs font-semibold border border-accent text-accent px-3 py-1.5 rounded hover:bg-accent hover:text-primary transition-colors"
            >
              Request Quote
            </Link>
          )}
        </div>
      </div>

      {/* Full card link overlay */}
      <Link
        to={`/species/${species.slug}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`View ${species.name}`}
      />
    </div>
  )
}
