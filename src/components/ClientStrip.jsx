import { client } from '../data/site.js'

/**
 * Credibility strip. One real client, named with permission, rather than a
 * marquee of logos we do not have. Add more names here as they sign.
 */
export default function ClientStrip() {
  return (
    <div className="border-y border-white/6 bg-ground-2/60">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-5 py-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:px-8 sm:text-left lg:px-10">
        <span className="micro text-text-faint">Trusted by</span>

        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-jade-500/15 font-display text-[0.85rem] font-semibold text-jade-300"
          >
            PB
          </span>
          <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-text">
            {client.name}
          </span>
        </span>

        <span aria-hidden="true" className="hidden h-4 w-px bg-white/12 sm:block" />

        <span className="body-md text-text-mute">
          {client.descriptor.charAt(0).toUpperCase() + client.descriptor.slice(1)}, serving{' '}
          {client.scale}
        </span>
      </div>
    </div>
  )
}
