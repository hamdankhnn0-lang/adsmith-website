import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { processSteps } from '../data/site.js'

export default function Process() {
  return (
    <Section id="process" tone="raised">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            From audit to compounding growth.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end body-lg text-text-mute lg:col-span-5"
        >
          A deliberate six week build, then a rhythm you can set your calendar by. No mystery and
          no twelve page reports nobody reads.
        </Reveal>
      </div>

      <div className="relative mt-14 lg:mt-20">
        <div
          aria-hidden="true"
          className="absolute left-[5px] top-3 bottom-14 w-px bg-gradient-to-b from-jade-400/50 via-white/10 to-transparent lg:left-0 lg:right-0 lg:top-[5px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />

        <ol className="relative lg:grid lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal
              key={step.step}
              as="li"
              delay={i * 90}
              className="relative pl-10 pb-12 last:pb-0 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-jade-400 shadow-[0_0_0_4px_rgba(47,207,150,0.14)] lg:relative lg:mb-8"
              />

              <div className="flex items-center gap-3">
                <span className="micro tabular-nums text-text-faint">{step.step}</span>
                <span aria-hidden="true" className="h-px w-4 bg-white/15" />
                <span className="micro text-jade-300">{step.duration}</span>
              </div>

              <h3 className="mt-4 display-3 text-text">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] body-md text-text-mute">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
