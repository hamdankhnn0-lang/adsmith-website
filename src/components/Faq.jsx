import { useState } from 'react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { faqs } from '../data/site.js'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <Section tone="mist" containerClassName="py-16 sm:py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>Before you ask</Eyebrow>
          </Reveal>
          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(1.9rem,4vw,2.7rem)] font-semibold"
          >
            The short answers.
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Reveal key={faq.q} delay={i * 80}>
                <div className="border-t border-ink/10 last:border-b">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-ink sm:text-[1.15rem]">
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                          isOpen ? 'border-forge-500 bg-forge-500 text-white' : 'border-ink/15 text-ink'
                        }`}
                      >
                        <span className="absolute h-px w-3 bg-current" />
                        <span
                          className={`absolute h-3 w-px bg-current transition-transform duration-300 ease-out-quint ${
                            isOpen ? 'scale-y-0' : 'scale-y-100'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-quint ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[58ch] pb-7 text-[0.96rem] leading-relaxed text-smoke-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
