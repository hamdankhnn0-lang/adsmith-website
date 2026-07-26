/**
 * Placeholder wordmark for Adsmith — a typographic lockup with a forged
 * "anvil" mark. Swap the <Mark /> for a real logo file when one exists.
 */
const Mark = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M6 25 16 6l10 19"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path d="M11 18.5h10" className="text-forge-500" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
  </svg>
)

export default function Wordmark({ tone = 'dark', className = '', showMark = true }) {
  const color = tone === 'dark' ? 'text-ink' : 'text-white'

  return (
    <span className={`inline-flex items-center gap-2.5 ${color} ${className}`}>
      {showMark && <Mark className="h-6 w-6 shrink-0" />}
      <span className="text-[1.32rem] font-semibold tracking-[-0.045em] leading-none">
        Adsmith
      </span>
    </span>
  )
}
