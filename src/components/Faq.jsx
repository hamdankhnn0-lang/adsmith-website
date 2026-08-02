import { useState } from 'react'
import { Plus } from 'lucide-react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import { faqs } from '../data/site.js'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <Section tone="canvas" containerClassName="py-14 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Eyebrow>Before you ask</Eyebrow>
          <h2 className="mt-4 display-lg text-ink">The short answers.</h2>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.q} className="border-b border-hairline-cool first:border-t">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="heading-md text-ink">{faq.q}</span>
                    <Plus
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={`h-4 w-4 shrink-0 text-ink-mute transition-transform duration-200 ease-out-quint ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out-quint ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[58ch] pb-6 body-md text-ink-mute">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
