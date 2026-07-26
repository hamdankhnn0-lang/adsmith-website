import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  LayoutTemplate,
  MapPin,
  MessagesSquare,
  Search,
  Share2,
  Video,
  Workflow,
} from 'lucide-react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import { services } from '../data/site.js'

const icons = {
  workflow: Workflow,
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
  // At md it stays a single cell so it pairs with GMB instead of leaving a hole.
  wide: 'lg:col-span-3',
}

const EASE = [0.22, 1, 0.36, 1]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } },
}

/** Feed the pointer position to the card's radial glow. */
function trackPointer(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function Chip({ children, bright }) {
  return (
    <li
      className={`rounded-full border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] transition-colors duration-[400ms] ease-out-quint ${
        bright
          ? 'border-white/15 bg-white/[0.04] text-white/60 group-hover:border-forge-500/40 group-hover:text-white/80'
          : 'border-white/10 text-white/45 group-hover:border-white/20 group-hover:text-white/70'
      }`}
    >
      {children}
    </li>
  )
}

function LearnMore({ label, primary }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full text-[0.82rem] font-medium tracking-tight transition-all duration-[400ms] ease-out-quint ${
        primary
          ? 'bg-white px-5 py-2.5 text-ink group-hover:bg-forge-500 group-hover:text-white'
          : 'border border-white/12 px-4 py-2 text-white/70 group-hover:border-forge-500/50 group-hover:bg-forge-500/10 group-hover:text-white'
      }`}
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-[400ms] ease-out-quint group-hover:translate-x-1"
      />
    </span>
  )
}

/** The abstract filament that only the hero tile carries. */
function Filament() {
  return (
    <svg
      viewBox="0 0 320 120"
      fill="none"
      aria-hidden="true"
      className="w-full max-w-[420px] text-white/12 transition-colors duration-[600ms] group-hover:text-forge-500/45"
    >
      <path
        d="M8 60h52a24 24 0 0 0 24-24v-8a24 24 0 0 1 24-24h60"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M8 60h52a24 24 0 0 1 24 24v8a24 24 0 0 0 24 24h60" stroke="currentColor" strokeWidth="1.25" />
      <path d="M168 4h64a24 24 0 0 1 24 24v20a24 24 0 0 0 24 24h32" stroke="currentColor" strokeWidth="1.25" />
      <path d="M168 116h64a24 24 0 0 0 24-24V72a24 24 0 0 1 24-24h32" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="60" r="4" fill="currentColor" />
      <circle cx="168" cy="4" r="4" fill="currentColor" />
      <circle cx="168" cy="116" r="4" fill="currentColor" />
      <circle
        cx="312"
        cy="48"
        r="5"
        className="text-forge-500"
        fill="currentColor"
      />
    </svg>
  )
}

function ServiceCard({ service, reduced }) {
  const Icon = icons[service.icon]
  const isHero = service.size === 'lg'
  const isWide = service.size === 'wide'

  const iconWell = (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-[400ms] ease-out-quint group-hover:-rotate-6 group-hover:border-forge-500/40 group-hover:bg-forge-500/15 group-hover:text-forge-300 ${
        isHero ? 'h-16 w-16' : 'h-12 w-12'
      }`}
    >
      <Icon strokeWidth={1.4} className={isHero ? 'h-7 w-7' : 'h-5 w-5'} aria-hidden="true" />
    </span>
  )

  return (
    <motion.article
      variants={cardVariants}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onPointerMove={reduced ? undefined : trackPointer}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-[background-color,box-shadow] duration-[400ms] ease-out-quint hover:bg-white/[0.055] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_32px_80px_-40px_rgba(47,91,255,0.55)] focus-within:bg-white/[0.055] sm:p-8 ${
        spans[service.size] ?? ''
      }`}
    >
      {/* Gradient border, revealed on hover */}
      <span
        aria-hidden="true"
        className="gradient-ring pointer-events-none absolute inset-0 z-20 rounded-[24px] bg-[linear-gradient(140deg,rgba(47,91,255,0.9),rgba(147,169,255,0.4)_42%,rgba(255,255,255,0.05)_72%)] opacity-0 transition-opacity duration-[400ms] ease-out-quint group-hover:opacity-100 group-focus-within:opacity-100"
      />

      {/* Filament along the top edge — ignites left to right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,var(--color-forge-500),rgba(147,169,255,0.7),transparent)] transition-transform duration-[700ms] ease-out-quint group-hover:scale-x-100"
      />

      {/* Pointer-tracked glow */}
      <span
        aria-hidden="true"
        className="pointer-glow pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-[400ms] ease-out-quint group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="grain-layer pointer-events-none absolute inset-0 -z-10 opacity-[0.14] mix-blend-overlay"
      />

      {/* Glass icon well — sits with the copy on the wide tile, above it elsewhere */}
      {!isWide && iconWell}

      {/* Wide tile reads across; the rest read down. */}
      <div
        className={
          isWide
            ? 'flex flex-1 flex-col gap-8 pt-6 lg:flex-row lg:items-center lg:gap-14 lg:pt-8'
            : 'flex flex-1 flex-col'
        }
      >
        <div className={isWide ? 'lg:w-[40%] lg:shrink-0' : ''}>
          {isWide && <div className="mb-6">{iconWell}</div>}
          <h3
            className={`font-semibold tracking-[-0.035em] text-white ${
              isHero
                ? 'mt-7 text-[1.9rem] sm:text-[2.3rem]'
                : isWide
                  ? 'text-[1.22rem] lg:text-[1.5rem]'
                  : 'mt-6 text-[1.22rem]'
            }`}
          >
            {service.name}
          </h3>

          <p
            className={`mt-3 leading-relaxed text-white/50 ${
              isHero ? 'max-w-[36ch] text-[1.02rem]' : 'text-[0.92rem]'
            }`}
          >
            {service.summary}
          </p>
        </div>

        {/* The filament fills the hero tile's midsection instead of leaving a hole. */}
        {isHero && (
          <div className="hidden flex-1 items-center justify-center py-8 lg:flex">
            <Filament />
          </div>
        )}

        <ul
          className={`flex flex-wrap gap-1.5 ${
            isWide ? 'lg:flex-1' : isHero ? 'pt-8' : 'mt-auto pt-7'
          }`}
        >
          {service.chips.map((chip) => (
            <Chip key={chip} bright={isHero}>
              {chip}
            </Chip>
          ))}
        </ul>

        <div className={isWide ? 'lg:shrink-0' : 'mt-6'}>
          <LearnMore label={isHero ? 'Explore automation' : 'Learn more'} primary={isHero} />
        </div>
      </div>

      {/* One stretched link makes the whole tile a single, labelled target. */}
      <a
        href="#contact"
        aria-label={`Learn more about ${service.name}`}
        className="absolute inset-0 z-30 rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
      />
    </motion.article>
  )
}

export default function Services() {
  const reduced = useReducedMotion()

  return (
    <Section id="services" tone="void">
      {/* Ambient ground: radial wash, two blurred shapes, a very soft grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(47,91,255,0.16),transparent_60%)]" />
        <div className="absolute inset-0 hairline-grid opacity-40" />
        <motion.div
          animate={reduced ? undefined : { y: [0, -26, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(47,91,255,0.18),transparent_62%)] blur-2xl"
        />
        <motion.div
          animate={reduced ? undefined : { y: [0, 22, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: -6 }}
          className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,169,255,0.12),transparent_64%)] blur-2xl"
        />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow tone="light">Our services</Eyebrow>
          <h2 className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.7rem)] font-semibold text-white">
            Everything you need to{' '}
            <span className="serif-accent text-forge-300">scale</span> online.
          </h2>
        </div>
        <p className="max-w-[46ch] self-end text-[1rem] leading-relaxed text-white/50 lg:col-span-5">
          From paid acquisition to websites and automation, we build marketing systems that
          generate measurable growth.
        </p>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="relative mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:auto-rows-[minmax(19.5rem,auto)]"
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} reduced={reduced} />
        ))}
      </motion.div>
    </Section>
  )
}
