import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { testimonials } from '../data/site.js'

const proofStats = [
  { value: '92%', label: 'Client retention past 12 months' },
  { value: '<60s', label: 'Average speed to lead after automation' },
  { value: '6 wks', label: 'From kickoff to a fully built system' },
]

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

export default function Testimonials() {
  return (
    <Section id="proof" tone="canvas">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Social proof</Eyebrow>
          <h2 className="mt-4 display-xl text-ink">Quiet work that speaks loudly.</h2>
        </div>
        <p className="max-w-[40ch] self-end body-md text-ink-mute-2 lg:col-span-5">
          Placeholder testimonials are shown below. Swap in real client quotes, names and logos
          when approvals come through.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 70} className="h-full">
            <figure className="flex h-full flex-col justify-between rounded-lg border border-hairline bg-canvas p-8 transition-[border-color,box-shadow] duration-200 hover:border-hairline-strong hover:shadow-lift">
              <blockquote className="body-md text-ink">{t.quote}</blockquote>

              <figcaption className="mt-8 flex items-center gap-3 border-t border-hairline-cool pt-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas-soft caption font-medium text-ink">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block caption font-medium text-ink">{t.name}</span>
                  <span className="block caption text-ink-mute-2">
                    {t.role} · {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140} className="mt-4">
        <div className="grid overflow-hidden rounded-lg border border-hairline bg-canvas sm:grid-cols-3">
          {proofStats.map((item, i) => (
            <div
              key={item.label}
              className={`px-8 py-8 text-center ${
                i > 0 ? 'border-t border-hairline-cool sm:border-l sm:border-t-0' : ''
              }`}
            >
              <span className="block display-md tabular-nums text-ink">{item.value}</span>
              <span className="mt-1.5 block caption text-ink-mute">{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
