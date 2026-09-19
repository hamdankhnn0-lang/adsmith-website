/**
 * Social marks only. Everything else in the UI uses Lucide, but Lucide no
 * longer ships brand glyphs, so these stay hand drawn.
 */

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
