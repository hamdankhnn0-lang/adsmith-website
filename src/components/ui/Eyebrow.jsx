/**
 * Small uppercase label with a leading rule — used above every section title.
 */
export default function Eyebrow({ children, tone = 'dark', className = '' }) {
  const isDark = tone === 'dark'

  return (
    <span
      className={`inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] ${
        isDark ? 'text-smoke-500' : 'text-white/55'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-8 ${isDark ? 'bg-forge-500' : 'bg-forge-300'}`}
      />
      {children}
    </span>
  )
}
