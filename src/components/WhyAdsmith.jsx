import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { pillars } from '../data/site.js'

export default function WhyAdsmith() {
  return (
    <Section id="why" tone="ground">
      <Glow className="-left-[14%] top-1/4 h-[32rem] w-[32rem]" />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Why Adsmith</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            The difference is in the craft.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end body-lg text-text-mute lg:col-span-5"
        >
          Anyone can run ads. Very few build the measurement, creative and operational plumbing
          that lets those ads compound month after month. That gap is the whole business.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.number} delay={i * 70} className="h-full">
            <div className="group glass relative flex h-full flex-col overflow-hidden rounded-lg p-7 transition-all duration-500 ease-out-quint hover:-translate-y-1 hover:bg-white/[0.06]">
              <span
                aria-hidden="true"
                className="ring-gradient pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(150deg,rgba(78,226,172,0.6),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="micro text-jade-300">{pillar.number}</span>
              <h3 className="mt-6 display-3 text-text">{pillar.title}</h3>
              <span
                aria-hidden="true"
                className="mt-5 block h-px w-9 bg-white/20 transition-all duration-500 ease-out-quint group-hover:w-16 group-hover:bg-jade-400"
              />
              <p className="mt-5 body-md text-text-mute">{pillar.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
