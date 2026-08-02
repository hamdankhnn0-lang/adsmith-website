import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { testimonials } from '../data/site.js'

const proofStats = [
  { value: '92%', label: 'Client retention past 12 months' },
  { value: '4s', label: 'Average WhatsApp reply time' },
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
    <Section id="proof" tone="ground">
      <Glow className="left-1/2 top-1/3 h-[28rem] w-[44rem] -translate-x-1/2" tone="sand" />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Social proof</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            Quiet work that speaks loudly.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[40ch] self-end body-md text-text-faint lg:col-span-5"
        >
          Placeholder testimonials are shown below. Swap in real client quotes, names and logos
          when approvals come through.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 80} className="h-full">
            <figure className="group glass relative flex h-full flex-col justify-between overflow-hidden rounded-lg p-8 transition-all duration-500 ease-out-quint hover:-translate-y-1 hover:bg-white/[0.06]">
              <span
                aria-hidden="true"
                className="ring-gradient pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(150deg,rgba(234,221,198,0.45),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <blockquote className="body-lg text-text">{t.quote}</blockquote>

              <figcaption className="mt-8 flex items-center gap-3.5 border-t border-white/8 pt-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] caption font-medium text-text">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block body-md font-medium text-text">{t.name}</span>
                  <span className="block caption text-text-faint">
                    {t.role} · {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160} className="mt-4">
        <div className="glass grid overflow-hidden rounded-lg sm:grid-cols-3">
          {proofStats.map((item, i) => (
            <div
              key={item.label}
              className={`px-8 py-9 text-center ${
                i > 0 ? 'border-t border-white/8 sm:border-l sm:border-t-0' : ''
              }`}
            >
              <span className="block font-display text-[2.2rem] font-semibold tracking-[-0.035em] tabular-nums text-text">
                {item.value}
              </span>
              <span className="mt-2 block caption text-text-faint">{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
