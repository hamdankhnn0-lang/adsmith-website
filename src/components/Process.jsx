import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { processSteps } from '../data/site.js'

export default function Process() {
  return (
    <Section id="process" tone="mist">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.6rem)] font-semibold"
          >
            From audit to{' '}
            <span className="serif-accent text-forge-600">compounding</span> growth.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end text-[1rem] leading-relaxed text-smoke-500 lg:col-span-5 lg:col-start-8"
        >
          A deliberate six-week build, then a rhythm you can set your calendar by. No mystery, no
          twelve-page reports nobody reads.
        </Reveal>
      </div>

      <div className="relative mt-14 lg:mt-20">
        {/* Timeline rail */}
        <div
          aria-hidden="true"
          className="absolute left-[15px] top-2 bottom-14 w-px bg-gradient-to-b from-ink/12 via-ink/12 via-80% to-transparent lg:left-0 lg:right-0 lg:top-[15px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />

        <ol className="relative lg:grid lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal
              key={step.step}
              as="li"
              delay={i * 100}
              className="relative pl-12 pb-12 last:pb-0 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-paper lg:relative lg:mb-8"
              >
                <span className="h-2 w-2 rounded-full bg-forge-500" />
              </span>

              <div className="flex items-center gap-3">
                <span className="text-[0.72rem] tracking-[0.22em] text-smoke-400">{step.step}</span>
                <span className="h-px w-4 bg-ink/15" aria-hidden="true" />
                <span className="text-[0.72rem] uppercase tracking-[0.16em] text-forge-600">
                  {step.duration}
                </span>
              </div>

              <h3 className="mt-4 text-[1.4rem] font-semibold tracking-[-0.035em] sm:text-[1.55rem]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[38ch] text-[0.95rem] leading-relaxed text-smoke-500">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
