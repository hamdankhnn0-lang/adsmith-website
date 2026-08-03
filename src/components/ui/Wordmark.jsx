/**
 * Adsmith lockup: the A mark plus the wordmark.
 *
 * The mark is redrawn as vector from the supplied logo. `barColor` lets the
 * accent bar follow the site palette on dark surfaces while the standalone
 * logo file keeps the original brand blue.
 */
export const BRAND_BLUE = '#2563eb'

export const AMark = ({ className = '', barColor = BRAND_BLUE, title }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : 'true'}
    aria-label={title}
    className={className}
  >
    {/* Heavy geometric A: outer silhouette with the counter knocked out */}
    <path
      d="M32 4 60 60H45.2L32 32.4 18.8 60H4L32 4Z"
      fill="currentColor"
    />
    {/* Accent crossbar */}
    <rect x="19.5" y="38.5" width="25" height="8.5" rx="1" fill={barColor} />
  </svg>
)

export default function Wordmark({ className = '', showMark = true, barColor }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-text ${className}`}>
      {showMark && <AMark className="h-7 w-7 shrink-0" barColor={barColor} />}
      <span className="font-display text-[1.3rem] font-semibold tracking-[-0.035em] leading-none">
        Adsmith
      </span>
    </span>
  )
}
