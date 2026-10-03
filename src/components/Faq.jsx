import { useState } from 'react'
import { Plus } from 'lucide-react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { faqs } from '../data/site.js'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <Section tone="raised" containerClassName="py-16 sm:py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>Before you ask</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            The short answers.
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Reveal key={faq.q} delay={i * 70}>
                <div
                  className={`mb-3 overflow-hidden rounded-md transition-colors duration-300 ${
                    isOpen ? 'glass' : 'border border-white/6 bg-white/[0.02]'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                    >
                      <span className="title-md text-text">{faq.q}</span>
                      <Plus
                        aria-hidden="true"
                        strokeWidth={1.6}
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out-quint ${
                          isOpen ? 'rotate-45 text-jade-300' : 'text-text-faint'
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-quint ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[58ch] px-6 pb-6 body-md text-text-mute">{faq.a}</p>
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
