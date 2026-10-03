/**
 * Page section wrapper. Bands alternate between the base ground and a very
 * slightly lifted one so the page has rhythm without hard colour switches.
 */
const tones = {
  ground: 'bg-ground',
  raised: 'bg-ground-2',
}

export default function Section({
  id,
  tone = 'ground',
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden ${tones[tone]} ${className}`}
    >
      <div
        className={`relative mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  )
}

/** Soft radial wash used behind sections that need a little depth. */
export function Glow({ className = '', tone = 'jade' }) {
  const paint =
    tone === 'sand'
      ? 'bg-[radial-gradient(circle_at_center,rgba(234,221,198,0.10),transparent_68%)]'
      : 'bg-[radial-gradient(circle_at_center,rgba(47,207,150,0.14),transparent_68%)]'

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${paint} ${className}`}
    />
  )
}
