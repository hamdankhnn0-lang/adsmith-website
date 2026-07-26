import { useState } from 'react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { CheckIcon } from './ui/Icons.jsx'
import { industries } from '../data/site.js'

export default function Industries() {
  const [active, setActive] = useState(industries[0].id)
  const current = industries.find((i) => i.id === active) ?? industries[0]

  const onKeyDown = (e) => {
    const idx = industries.findIndex((i) => i.id === active)
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setActive(industries[(idx + 1) % industries.length].id)
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive(industries[(idx - 1 + industries.length) % industries.length].id)
    }
  }

  return (
    <Section id="industries" tone="light">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Who we work with</Eyebrow>
          </Reveal>
          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.6rem)] font-semibold"
          >
            Built for businesses where{' '}
            <span className="serif-accent text-forge-600">reputation</span> is the product.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end text-[1rem] leading-relaxed text-smoke-500 lg:col-span-5 lg:col-start-8"
        >
          We specialise rather than spread thin. These are the six categories where our systems,
          creative frameworks and automations already have a track record.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        {/* Tab list */}
        <Reveal className="lg:col-span-5">
          <div
            role="tablist"
            aria-label="Industries we serve"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex flex-col"
          >
            {industries.map((industry, i) => {
              const isActive = industry.id === active
              return (
                <button
                  key={industry.id}
                  role="tab"
                  id={`tab-${industry.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${industry.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(industry.id)}
                  onMouseEnter={() => setActive(industry.id)}
                  className="group flex items-baseline gap-4 border-t border-ink/10 py-5 text-left last:border-b sm:py-6"
                >
                  <span
                    className={`w-6 shrink-0 text-[0.7rem] tracking-[0.16em] transition-colors duration-300 ${
                      isActive ? 'text-forge-600' : 'text-smoke-400'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`display-tight text-[1.6rem] font-semibold transition-all duration-500 ease-out-quint sm:text-[2rem] ${
                      isActive
                        ? 'translate-x-1 text-ink'
                        : 'text-smoke-400 group-hover:translate-x-1 group-hover:text-ink'
                    }`}
                  >
                    {industry.name}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Panel */}
        <Reveal delay={120} className="lg:col-span-7">
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            className="relative h-full overflow-hidden rounded-2xl bg-ink p-8 text-white sm:p-10 lg:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hairline-grid opacity-60"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,91,255,0.35),transparent_65%)]"
            />

            {/* key forces a fresh fade whenever the tab changes */}
            <div key={current.id} className="relative animate-[fade-up_600ms_var(--ease-out-quint)_both]">
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-forge-300">
                {current.metric}
              </span>

              <h3 className="mt-7 display-tight text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold">
                {current.name}
              </h3>
              <p className="mt-4 max-w-[42ch] text-[1.05rem] leading-relaxed text-white/60">
                {current.line}
              </p>

              <ul className="mt-9 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-3">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[0.9rem] text-white/75">
                    <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-forge-300" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
