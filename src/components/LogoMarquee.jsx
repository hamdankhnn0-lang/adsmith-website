import { clientLogos } from '../data/site.js'

/**
 * Placeholder client wordmarks in greyscale at a uniform height. Swap the
 * strings in `clientLogos` for images when real logos land. The marquee needs
 * the list duplicated once.
 */
export default function LogoMarquee() {
  const track = [...clientLogos, ...clientLogos]

  return (
    <div className="border-y border-hairline-cool bg-canvas-soft py-8">
      <p className="mb-6 text-center caption text-ink-mute-2">
        Trusted by operators who care about the details
      </p>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 pr-12 sm:gap-16 sm:pr-16">
          {track.map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="whitespace-nowrap text-[0.9rem] font-medium tracking-[0.08em] text-ink-faint transition-colors duration-200 hover:text-ink"
            >
              {logo}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas-soft to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas-soft to-transparent sm:w-24" />
      </div>
    </div>
  )
}
