import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { pillars } from '../data/site.js'

export default function WhyAdsmith() {
  return (
    <Section id="why" tone="dark">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hairline-grid opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(47,91,255,0.16),transparent_65%)]"
      />

      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="light">Why Adsmith</Eyebrow>
          </Reveal>
          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.6rem)] font-semibold"
          >
            The difference is in the{' '}
            <span className="serif-accent text-forge-300">craft</span>.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end text-[1rem] leading-relaxed text-white/55 lg:col-span-5 lg:col-start-8"
        >
          Anyone can run ads. Very few build the measurement, creative and operational plumbing
          that lets those ads compound month after month. That gap is the whole business.
        </Reveal>
      </div>

      <div className="relative mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-20">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.number} delay={i * 80} className="h-full">
            <div className="group relative flex h-full flex-col bg-ink p-8 transition-colors duration-500 hover:bg-ink-800 sm:p-10">
              <span className="text-[0.72rem] tracking-[0.22em] text-forge-300">
                {pillar.number}
              </span>

              <h3 className="mt-6 text-[1.6rem] font-semibold tracking-[-0.035em] sm:text-[1.8rem]">
                {pillar.title}
              </h3>

              <span
                aria-hidden="true"
                className="mt-5 block h-px w-10 bg-white/20 transition-all duration-500 ease-out-quint group-hover:w-20 group-hover:bg-forge-500"
              />

              <p className="mt-5 max-w-[42ch] text-[0.96rem] leading-relaxed text-white/55">
                {pillar.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
