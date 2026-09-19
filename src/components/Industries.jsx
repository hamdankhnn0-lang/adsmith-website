import { useState } from 'react'
import { Check } from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
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
    <Section id="industries" tone="raised">
      <Glow className="-right-[16%] top-[8%] h-[32rem] w-[32rem]" tone="sand" />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Who we work with</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            Built for businesses where reputation is the product.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[44ch] self-end body-lg text-text-mute lg:col-span-5"
        >
          We specialise rather than spread thin. These are the six categories where our systems,
          creative frameworks and AI agents already have a track record.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <div
            role="tablist"
            aria-label="Industries we serve"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="glass overflow-hidden rounded-lg p-1.5"
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
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3.5 text-left transition-all duration-300 ease-out-quint ${
                    isActive ? 'bg-white/[0.07] text-text' : 'text-text-mute hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-jade-400' : 'bg-white/20'
                    }`}
                  />
                  <span className="title-md">{industry.name}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            className="glass-strong relative h-full overflow-hidden rounded-lg p-8 lg:p-10"
          >
            <Glow className="-right-20 -top-20 h-64 w-64" />

            <div key={current.id} className="animate-[pop-in_0.5s_var(--ease-out-quint)_both]">
              <span className="inline-flex items-center rounded-full bg-jade-500/15 px-3 py-1 caption font-medium text-jade-300">
                {current.metric}
              </span>

              <h3 className="mt-7 display-3 text-text">{current.name}</h3>
              <p className="mt-4 max-w-[44ch] body-lg text-text-mute">{current.line}</p>

              <ul className="mt-9 grid gap-3 border-t border-white/8 pt-7 sm:grid-cols-3">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 body-md text-text">
                    <Check
                      aria-hidden="true"
                      strokeWidth={2.2}
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-jade-400"
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
