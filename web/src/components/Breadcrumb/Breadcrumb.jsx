import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted py-3">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-border select-none">/</span>}
            {isLast || !item.href ? (
              <span className={isLast ? 'text-primary font-medium' : ''}>{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-accent transition-colors">{item.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
