/**
 * Placeholder wordmark for Adsmith. The mark carries the one emerald accent
 * the brand allows outside a CTA. Swap for a real logo when one exists.
 */
const Mark = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />
    <path
      d="M9 23 16 9l7 14"
      stroke="var(--color-canvas)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12.4 18.2h7.2" stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

export default function Wordmark({ tone = 'dark', className = '', showMark = true }) {
  const color = tone === 'dark' ? 'text-ink' : 'text-white'

  return (
    <span className={`inline-flex items-center gap-2.5 ${color} ${className}`}>
      {showMark && <Mark className="h-7 w-7 shrink-0" />}
      <span className="text-[1.15rem] font-medium tracking-[-0.02em] leading-none">Adsmith</span>
    </span>
  )
}
