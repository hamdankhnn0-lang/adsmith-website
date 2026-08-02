import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { processSteps } from '../data/site.js'

export default function Process() {
  return (
    <Section id="process" tone="soft">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-4 display-xl text-ink">From audit to compounding growth.</h2>
        </div>
        <p className="max-w-[44ch] self-end body-lg text-ink-mute lg:col-span-5">
          A deliberate six week build, then a rhythm you can set your calendar by. No mystery and
          no twelve page reports nobody reads.
        </p>
      </div>

      <div className="relative mt-12 lg:mt-16">
        <div
          aria-hidden="true"
          className="absolute left-[3px] top-2 bottom-12 w-px bg-hairline lg:left-0 lg:right-0 lg:top-[3px] lg:bottom-auto lg:h-px lg:w-auto"
        />

        <ol className="relative lg:grid lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal
              key={step.step}
              as="li"
              delay={i * 80}
              className="relative pl-8 pb-10 last:pb-0 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 block h-[7px] w-[7px] rounded-full bg-primary lg:relative lg:mb-7"
              />

              <div className="flex items-center gap-2.5">
                <span className="micro tabular-nums text-ink-mute-2">{step.step}</span>
                <span aria-hidden="true" className="h-px w-3 bg-hairline-cool-3" />
                <span className="micro text-ink-mute">{step.duration}</span>
              </div>

              <h3 className="mt-3 heading-lg text-ink">{step.title}</h3>
              <p className="mt-2.5 max-w-[38ch] body-md text-ink-mute">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
