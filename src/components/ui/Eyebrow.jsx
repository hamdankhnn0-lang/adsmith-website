/** Small capitalised label above a section title, in a frosted pill. */
export default function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 micro text-text-mute ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-jade-400 animate-breathe" />
      {children}
    </span>
  )
}
