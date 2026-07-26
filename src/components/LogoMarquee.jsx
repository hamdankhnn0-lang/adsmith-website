import { clientLogos } from '../data/site.js'

/**
 * Placeholder client wordmarks. Swap the strings in `clientLogos` for <img>
 * tags when real logos land — the marquee needs the list duplicated once.
 */
export default function LogoMarquee() {
  const track = [...clientLogos, ...clientLogos]

  return (
    <div className="relative overflow-hidden border-y border-ink/8 bg-paper py-7">
      <p className="mb-6 text-center text-[0.7rem] uppercase tracking-[0.24em] text-smoke-400">
        Trusted by operators who care about the details
      </p>

      <div className="relative">
        <div className="flex w-max animate-marquee gap-14 pr-14 sm:gap-20 sm:pr-20">
          {track.map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="whitespace-nowrap text-[0.95rem] font-medium uppercase tracking-[0.22em] text-smoke-400 transition-colors duration-300 hover:text-ink"
            >
              {logo}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper to-transparent sm:w-32" />
      </div>
    </div>
  )
}
