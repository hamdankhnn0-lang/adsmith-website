import { clientLogos } from '../data/site.js'

/**
 * Placeholder client wordmarks. Swap the strings in `clientLogos` for images
 * when real logos land. The marquee needs the list duplicated once.
 */
export default function LogoMarquee() {
  const track = [...clientLogos, ...clientLogos]

  return (
    <div className="border-y border-white/6 bg-ground-2/60 py-9">
      <p className="mb-7 text-center micro text-text-faint">
        Trusted by operators who care about the details
      </p>

      <div className="relative overflow-hidden">
        <ul className="flex w-max animate-marquee gap-14 pr-14 sm:gap-20 sm:pr-20">
          {track.map((logo, i) => (
            <li
              key={`${logo}-${i}`}
              aria-hidden={i >= clientLogos.length}
              className="whitespace-nowrap font-display text-[0.95rem] font-medium tracking-[0.14em] text-text-faint transition-colors duration-300 hover:text-text"
            >
              {logo}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ground-2 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ground-2 to-transparent sm:w-32" />
      </div>
    </div>
  )
}
