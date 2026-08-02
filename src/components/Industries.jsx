import { useState } from 'react'
import { Check } from 'lucide-react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
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
    <Section id="industries" tone="soft">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Who we work with</Eyebrow>
          <h2 className="mt-4 display-xl text-ink">
            Built for businesses where reputation is the product.
          </h2>
        </div>
        <p className="max-w-[44ch] self-end body-lg text-ink-mute lg:col-span-5">
          We specialise rather than spread thin. These are the six categories where our systems,
          creative frameworks and automations already have a track record.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <div
            role="tablist"
            aria-label="Industries we serve"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="overflow-hidden rounded-lg border border-hairline bg-canvas"
          >
            {industries.map((industry) => {
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
                  className={`flex w-full items-center gap-3 border-b border-hairline-cool px-5 py-4 text-left transition-colors duration-200 last:border-b-0 ${
                    isActive ? 'bg-canvas-soft' : 'hover:bg-canvas-soft'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-primary' : 'bg-hairline-cool-3'
                    }`}
                  />
                  <span
                    className={`heading-md transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink-mute'
                    }`}
                  >
                    {industry.name}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-7">
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            className="h-full rounded-lg bg-canvas-night p-8 text-on-dark shadow-float lg:p-10"
          >
            <div key={current.id} className="animate-[fade-up_400ms_var(--ease-out-quint)_both]">
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 micro font-medium text-on-primary">
                {current.metric}
              </span>

              <h3 className="mt-6 display-lg text-on-dark">{current.name}</h3>
              <p className="mt-3 max-w-[44ch] body-lg text-white/60">{current.line}</p>

              <ul className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 caption text-white/80">
                    <Check
                      aria-hidden="true"
                      strokeWidth={2}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    />
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
