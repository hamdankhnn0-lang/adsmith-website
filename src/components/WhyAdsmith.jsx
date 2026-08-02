import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { pillars } from '../data/site.js'

export default function WhyAdsmith() {
  return (
    <Section id="why" tone="canvas">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Why Adsmith</Eyebrow>
          <h2 className="mt-4 display-xl text-ink">The difference is in the craft.</h2>
        </div>
        <p className="max-w-[44ch] self-end body-lg text-ink-mute lg:col-span-5">
          Anyone can run ads. Very few build the measurement, creative and operational plumbing
          that lets those ads compound month after month. That gap is the whole business.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.number} delay={i * 70} className="h-full">
            <div className="flex h-full flex-col rounded-lg border border-hairline bg-canvas p-8 transition-[border-color,box-shadow] duration-200 hover:border-hairline-strong hover:shadow-lift">
              <span className="caption tabular-nums text-ink-mute-2">{pillar.number}</span>
              <h3 className="mt-5 heading-lg text-ink">{pillar.title}</h3>
              <span aria-hidden="true" className="mt-4 block h-px w-8 bg-primary" />
              <p className="mt-4 body-md text-ink-mute">{pillar.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
