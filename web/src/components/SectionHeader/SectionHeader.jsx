export default function SectionHeader({ eyebrow, title, subtitle, center = false, light = false, className = '' }) {
  const align = center ? 'text-center' : ''
  const titleColor = light ? 'text-white' : 'text-primary'
  const subColor   = light ? 'text-white/70' : 'text-muted'

  return (
    <div className={`${align} ${className}`}>
      {eyebrow && (
        <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${light ? 'text-accent' : 'text-accent'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-3 ${titleColor}`}>{title}</h2>
      {subtitle && <p className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${subColor}`}>{subtitle}</p>}
    </div>
  )
}
