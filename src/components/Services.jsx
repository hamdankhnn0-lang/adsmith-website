import {
  ArrowUpRight,
  LayoutTemplate,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Search,
  Share2,
  Video,
} from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import { services, whatsappThread } from '../data/site.js'

const icons = {
  whatsapp: MessageCircle,
  meta: Share2,
  search: Search,
  video: Video,
  social: MessagesSquare,
  pin: MapPin,
  web: LayoutTemplate,
}

/* Bento placement. Everything else falls through as a single cell. */
const spans = {
  lg: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  // At md it stays a single cell so it pairs with the tile before it.
  wide: 'lg:col-span-3',
}

function Chip({ children }) {
  return (
    <li className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 caption text-text-mute transition-colors duration-300 group-hover:border-white/14 group-hover:text-text">
      {children}
    </li>
  )
}

function ServiceCard({ service, index }) {
  const Icon = icons[service.icon]
  const isHero = service.size === 'lg'
  const isWide = service.size === 'wide'

  const iconWell = (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-text transition-all duration-500 ease-out-quint group-hover:border-jade-400/40 group-hover:bg-jade-500/15 group-hover:text-jade-300 ${
        isHero ? 'h-14 w-14' : 'h-11 w-11'
      }`}
    >
      <Icon strokeWidth={1.5} className={isHero ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
    </span>
  )

  return (
    <Reveal delay={index * 60} className={`h-full ${spans[service.size] ?? ''}`}>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-lg p-7 transition-all duration-500 ease-out-quint hover:-translate-y-1 sm:p-8 ${
          isHero
            ? 'glass-strong shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]'
            : 'glass hover:bg-white/[0.06]'
        }`}
      >
        {/* Gradient ring, revealed on hover */}
        <span
          aria-hidden="true"
          className="ring-gradient pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(140deg,rgba(78,226,172,0.75),rgba(234,221,198,0.28)_45%,transparent_72%)] opacity-0 transition-opacity duration-500 ease-out-quint group-hover:opacity-100 group-focus-within:opacity-100"
        />

        {isHero && (
          <Glow className="-right-24 -top-24 h-72 w-72 opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
        )}

        {!isWide && iconWell}

        <div
          className={
            isWide
              ? 'flex flex-1 flex-col gap-8 pt-6 lg:flex-row lg:items-center lg:gap-14 lg:pt-0'
              : 'flex flex-1 flex-col'
          }
        >
          <div className={isWide ? 'lg:w-[40%] lg:shrink-0' : ''}>
            {isWide && <div className="mb-6">{iconWell}</div>}

            <h3
              className={`text-text ${
                isHero ? 'mt-7 display-3' : isWide ? 'title-md lg:display-3' : 'mt-5 title-md'
              }`}
            >
              {service.name}
            </h3>

            <p className={`mt-3 body-md text-text-mute ${isHero ? 'max-w-[40ch]' : ''}`}>
              {service.summary}
            </p>
          </div>

          {/* The tile is large, so it shows the agent working rather than
              leaving the space empty. */}
          {isHero && (
            <ul className="mt-8 hidden flex-1 flex-col justify-center gap-2.5 lg:flex">
              {whatsappThread.slice(0, 3).map((m, i) => {
                const mine = m.from === 'us'
                return (
                  <li key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <span
                      className={`max-w-[74%] rounded-lg px-3.5 py-2.5 caption leading-relaxed ${
                        mine
                          ? 'rounded-br-sm bg-jade-500/16 text-text'
                          : 'rounded-bl-sm bg-white/[0.05] text-text-mute'
                      }`}
                    >
                      {m.text}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <ul
            className={`flex flex-wrap gap-1.5 ${
              isWide ? 'lg:flex-1' : isHero ? 'pt-8' : 'mt-auto pt-6'
            }`}
          >
            {service.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </ul>

          <div
            className={`flex items-center gap-1.5 text-[0.9rem] font-medium text-text ${
              isWide ? 'lg:shrink-0' : 'mt-6'
            }`}
          >
            {isHero ? 'Explore the agent' : 'Learn more'}
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.8}
              className="h-4 w-4 text-jade-300 transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        {/* One stretched link makes the whole tile a single, labelled target. */}
        <a
          href={service.href ?? '#contact'}
          aria-label={`Learn more about ${service.name}`}
          className="absolute inset-0 rounded-lg"
        >
          <span className="sr-only">Learn more about {service.name}</span>
        </a>
      </article>
    </Reveal>
  )
}

export default function Services() {
  return (
    <Section id="services" tone="ground">
      <Glow className="left-1/2 top-0 h-[30rem] w-[46rem] -translate-x-1/2" />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Our services</Eyebrow>
          </Reveal>
          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            Everything you need to scale online.
          </Reveal>
        </div>
        <Reveal
          delay={140}
          as="p"
          className="max-w-[46ch] self-end body-lg text-text-mute lg:col-span-5"
        >
          From paid acquisition to websites and conversational AI, we build marketing systems that
          generate measurable growth.
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:auto-rows-[minmax(19rem,auto)]">
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </Section>
  )
}
