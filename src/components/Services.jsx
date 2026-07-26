import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { ArrowIcon, iconMap } from './ui/Icons.jsx'
import { services } from '../data/site.js'

function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon]

  return (
    <Reveal delay={index * 70} className="h-full">
      <article
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out-quint sm:p-8 ${
          service.featured
            ? 'border-ink bg-ink text-white hover:-translate-y-1 hover:shadow-[0_30px_70px_-32px_rgba(10,10,10,0.7)]'
            : 'border-ink/10 bg-paper hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_28px_60px_-38px_rgba(10,10,10,0.55)]'
        }`}
      >
        {/* Blue wash that only appears on hover. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
            service.featured
              ? 'bg-[radial-gradient(120%_90%_at_100%_0%,rgba(47,91,255,0.35),transparent_58%)]'
              : 'bg-[radial-gradient(120%_90%_at_100%_0%,rgba(47,91,255,0.09),transparent_58%)]'
          }`}
        />

        <div className={`relative ${service.featured ? 'lg:flex lg:items-end lg:gap-14' : ''}`}>
          <div className={service.featured ? 'lg:w-[34%] lg:shrink-0' : ''}>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-500 ${
                service.featured
                  ? 'border-white/15 bg-white/8 text-white'
                  : 'border-ink/10 bg-mist text-ink group-hover:border-forge-500/30 group-hover:bg-forge-50'
              }`}
            >
              <Icon
                className="h-7 w-7"
                accentClassName={service.featured ? 'text-forge-300' : 'text-forge-500'}
              />
            </div>

            <h3
              className={`mt-6 font-semibold tracking-[-0.03em] ${
                service.featured ? 'text-[1.5rem] lg:text-[1.9rem]' : 'text-[1.28rem]'
              }`}
            >
              {service.name}
            </h3>
          </div>

          <p
            className={`mt-3 leading-relaxed ${
              service.featured
                ? 'max-w-[46ch] text-[1rem] text-white/60 lg:mt-0'
                : 'text-[0.95rem] text-smoke-500'
            }`}
          >
            {service.summary}
          </p>
        </div>

        <div
          className={`relative mt-7 flex items-center justify-between border-t pt-5 text-[0.76rem] uppercase tracking-[0.14em] ${
            service.featured ? 'border-white/12 text-white/45' : 'border-ink/8 text-smoke-400'
          }`}
        >
          <span>{service.detail}</span>
          <ArrowIcon
            className={`h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 ease-out-quint group-hover:translate-x-0 group-hover:opacity-100 ${
              service.featured ? 'text-forge-300' : 'text-forge-500'
            }`}
          />
        </div>
      </article>
    </Reveal>
  )
}

export default function Services() {
  return (
    <Section id="services" tone="mist">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.6rem)] font-semibold">
            Seven disciplines.{' '}
            <span className="serif-accent text-forge-600">One</span> growth system.
          </Reveal>
        </div>

        <Reveal
          delay={140}
          as="p"
          className="max-w-[46ch] self-end text-[1rem] leading-relaxed text-smoke-500 lg:col-span-6 lg:col-start-7"
        >
          Channels are only as strong as the system behind them. We build the acquisition, the
          content and the automation together — so nothing leaks between the click and the booking.
        </Reveal>
      </div>

      {/* Six equal cards on a 6-column grid, then the automation card claims a
          full-width row of its own — it is the differentiator. */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-6">
        {services.map((service, i) => (
          <div
            key={service.id}
            className={service.featured ? 'sm:col-span-2 lg:col-span-6' : 'lg:col-span-2'}
          >
            <ServiceCard service={service} index={i} />
          </div>
        ))}
      </div>
    </Section>
  )
}
