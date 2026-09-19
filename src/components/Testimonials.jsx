import { Quote } from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { client, proofStats, testimonial } from '../data/site.js'

export default function Testimonials() {
  return (
    <Section id="proof" tone="ground">
      <Glow className="left-1/2 top-1/3 h-[28rem] w-[44rem] -translate-x-1/2" tone="sand" />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>The work</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            One year with {client.name}.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[42ch] self-end body-lg text-text-mute lg:col-span-5"
        >
          {client.name} is {client.descriptor}, doing {client.scale}. We run their ads, look
          after their website and hosting, and built the WhatsApp side of the business.
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
        {/* The quote */}
        <Reveal className="lg:col-span-7">
          <figure className="group glass relative flex h-full flex-col justify-between overflow-hidden rounded-lg p-8 transition-all duration-500 ease-out-quint hover:bg-white/[0.06] sm:p-10">
            <span
              aria-hidden="true"
              className="ring-gradient pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(150deg,rgba(234,221,198,0.45),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <Quote
              aria-hidden="true"
              strokeWidth={1.4}
              className="h-7 w-7 shrink-0 text-jade-400"
            />

            <blockquote className="mt-6 display-3 font-normal text-text">
              {testimonial.quote}
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-3.5 border-t border-white/8 pt-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jade-500/15 caption font-medium text-jade-300">
                PB
              </span>
              <span>
                <span className="block body-md font-medium text-text">{testimonial.role}</span>
                <span className="block caption text-text-faint">{testimonial.company}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* The numbers behind it */}
        <Reveal delay={100} className="lg:col-span-5">
          <div className="glass-strong flex h-full flex-col justify-center gap-8 rounded-lg p-8 sm:p-10">
            {proofStats.map((item, i) => (
              <div
                key={item.label}
                className={i > 0 ? 'border-t border-white/8 pt-8' : undefined}
              >
                <span className="block font-display text-[2rem] font-semibold tracking-[-0.035em] tabular-nums text-text sm:text-[2.35rem]">
                  {item.value}
                </span>
                <span className="mt-1.5 block body-md text-text-mute">{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
