/**
 * Geometric, stroke-based icon set drawn on a 32×32 grid.
 * Each icon uses `currentColor` for structure and the blue accent only for
 * one deliberate detail, so cards stay black-and-white until you hover.
 */

const wrap = (children) => ({ className = '', accentClassName = 'text-forge-500' }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    {typeof children === 'function' ? children(accentClassName) : children}
  </svg>
)

const s = {
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const MetaIcon = wrap((accent) => (
  <>
    <path
      {...s}
      d="M4 20.5c0-5.5 2.6-10 6.2-10 2.5 0 4 2 5.8 5.2 1.8 3.2 3.3 5.2 5.8 5.2 3.6 0 6.2-4.5 6.2-10"
    />
    <circle cx="10.2" cy="10.5" r="2.4" className={accent} stroke="currentColor" strokeWidth="1.4" />
    <circle cx="21.8" cy="20.9" r="2.4" {...s} />
  </>
))

export const SearchIcon = wrap((accent) => (
  <>
    <circle cx="14" cy="14" r="8" {...s} />
    <path {...s} d="M20 20l7 7" />
    <path d="M10.5 14h7" className={accent} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M14 10.5v7" className={accent} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </>
))

export const WaveIcon = wrap((accent) => (
  <>
    <path {...s} d="M3 16c2.6 0 2.6-7 5.2-7s2.6 14 5.2 14 2.6-11 5.2-11 2.6 7 5.2 7" />
    <path d="M28.5 19h.5" className={accent} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="26" cy="19" r="1.6" className={accent} stroke="currentColor" strokeWidth="1.4" />
  </>
))

export const GridIcon = wrap((accent) => (
  <>
    <rect x="4" y="4" width="10" height="10" rx="2.5" {...s} />
    <rect x="18" y="4" width="10" height="10" rx="2.5" {...s} />
    <rect x="4" y="18" width="10" height="10" rx="2.5" {...s} />
    <rect
      x="18"
      y="18"
      width="10"
      height="10"
      rx="2.5"
      className={accent}
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </>
))

export const PinIcon = wrap((accent) => (
  <>
    <path {...s} d="M16 28c5.4-6 8.2-10.2 8.2-14A8.2 8.2 0 0 0 7.8 14c0 3.8 2.8 8 8.2 14Z" />
    <circle cx="16" cy="13.6" r="3.1" className={accent} stroke="currentColor" strokeWidth="1.6" />
  </>
))

export const LayersIcon = wrap((accent) => (
  <>
    <rect x="3.5" y="6" width="25" height="19" rx="3" {...s} />
    <path {...s} d="M3.5 11.5h25" />
    <circle cx="8" cy="8.8" r="0.9" fill="currentColor" className={accent} stroke="none" />
    <path {...s} d="M9 17h9M9 20.6h6" />
  </>
))

export const CircuitIcon = wrap((accent) => (
  <>
    <circle cx="7" cy="8" r="2.6" {...s} />
    <circle cx="7" cy="24" r="2.6" {...s} />
    <circle cx="25" cy="16" r="2.9" className={accent} stroke="currentColor" strokeWidth="1.6" />
    <path {...s} d="M9.6 8h4.9a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h1.6" />
    <path {...s} d="M9.6 24h4.9a3 3 0 0 0 3-3v-2a3 3 0 0 1 3-3h1.6" />
  </>
))

export const iconMap = {
  meta: MetaIcon,
  search: SearchIcon,
  wave: WaveIcon,
  grid: GridIcon,
  pin: PinIcon,
  layers: LayersIcon,
  circuit: CircuitIcon,
}

/* ---------------------------------------------------------------- social */

export const LinkedInIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.69h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.31-2.02 2.66v5.14h-4v-11Z" />
  </svg>
)

export const InstagramIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
  </svg>
)

export const XIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.53 3H20.5l-6.49 7.42L21.5 21h-5.86l-4.59-6-5.25 6H2.83l6.94-7.94L2.5 3h6l4.15 5.49L17.53 3Zm-1.04 16.2h1.64L7.6 4.71H5.84l10.65 14.49Z" />
  </svg>
)

export const YouTubeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15.06V8.94L15.2 12 10 15.06Z" />
  </svg>
)

export const CheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 8.4 6.2 11.6 13 4.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M1 8h13M9 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
