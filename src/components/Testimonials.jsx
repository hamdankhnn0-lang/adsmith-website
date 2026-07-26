import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { testimonials } from '../data/site.js'

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

export default function Testimonials() {
  return (
    <Section id="proof" tone="light">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Social proof</Eyebrow>
          </Reveal>
          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.6rem)] font-semibold"
          >
            Quiet work that{' '}
            <span className="serif-accent text-forge-600">speaks</span> loudly.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[36ch] self-end text-[0.92rem] leading-relaxed text-smoke-400 lg:col-span-4 lg:col-start-9"
        >
          Placeholder testimonials shown below — swap in real client quotes, names and logos when
          approvals come through.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 90} className="h-full">
            <figure className="group relative flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-mist p-8 transition-all duration-500 ease-out-quint hover:-translate-y-1 hover:border-ink/20 hover:bg-paper hover:shadow-[0_28px_60px_-38px_rgba(10,10,10,0.5)]">
              <span
                aria-hidden="true"
                className="font-display text-[3.5rem] leading-none text-ink/12 transition-colors duration-500 group-hover:text-forge-500/40"
              >
                &ldquo;
              </span>

              <blockquote className="-mt-4 text-[1.02rem] leading-relaxed text-ink/85">
                {t.quote}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-3.5 border-t border-ink/10 pt-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[0.75rem] font-medium tracking-wide text-white">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.92rem] font-medium tracking-tight text-ink">
                    {t.name}
                  </span>
                  <span className="block text-[0.82rem] leading-snug text-smoke-400">
                    {t.role} · {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} className="mt-14">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {[
            { value: '92%', label: 'Client retention past 12 months' },
            { value: '<60s', label: 'Average speed-to-lead after automation' },
            { value: '6 wks', label: 'From kickoff to a fully built system' },
          ].map((item) => (
            <div key={item.label} className="bg-paper px-8 py-9 text-center">
              <span className="block display-tight text-[2.4rem] font-semibold text-ink">
                {item.value}
              </span>
              <span className="mt-2 block text-[0.82rem] leading-relaxed text-smoke-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
