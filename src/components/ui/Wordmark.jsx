/**
 * Placeholder wordmark for Adsmith. Swap the mark for a real logo file when
 * one exists; the type lockup can stay.
 */
const Mark = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <rect
      x="0.75"
      y="0.75"
      width="30.5"
      height="30.5"
      rx="9"
      fill="rgba(255,255,255,0.05)"
      stroke="rgba(255,255,255,0.14)"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 22.5 16 9.5l6.5 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9 18.1h6.2"
      stroke="var(--color-jade-400)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default function Wordmark({ className = '', showMark = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-text ${className}`}>
      {showMark && <Mark className="h-8 w-8 shrink-0" />}
      <span className="font-display text-[1.2rem] font-semibold tracking-[-0.03em] leading-none">
        Adsmith
      </span>
    </span>
  )
}
