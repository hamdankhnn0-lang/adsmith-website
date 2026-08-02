/**
 * Small label above a section title. On light bands it carries an emerald
 * dot, which is one of the few places the primary is allowed outside a CTA.
 */
export default function Eyebrow({ children, tone = 'light', className = '' }) {
  const onDark = tone === 'dark'

  return (
    <span
      className={`inline-flex items-center gap-2 caption font-medium ${
        onDark ? 'text-white/60' : 'text-ink-mute'
      } ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  )
}
