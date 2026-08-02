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
  // At md it stays a single cell so it pairs with the tile before it.
  wide: 'lg:col-span-3',
}

const EASE = [0.22, 1, 0.36, 1]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const flowSteps = [
  'trigger  new_lead',
  'agent    qualify',
  'crm      upsert',
  'notify   whatsapp',
]

function Chip({ children, onDark }) {
  return (
    <li
      className={`rounded-full px-2 py-0.5 micro ${
        onDark ? 'bg-white/10 text-white/75' : 'bg-canvas-soft text-ink'
      }`}
    >
      {children}
    </li>
  )
}

function LearnMore({ label, onDark }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[0.875rem] font-medium leading-none ${
        onDark ? 'text-white' : 'text-ink'
      }`}
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
      />
    </span>
  )
}

function ServiceCard({ service }) {
  const Icon = icons[service.icon]
  const isHero = service.size === 'lg'
  const isWide = service.size === 'wide'
  const onDark = Boolean(service.featured)

  const iconWell = (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md ${
        onDark ? 'bg-white/10 text-white' : 'bg-canvas-soft text-ink'
      } ${isHero ? 'h-12 w-12' : 'h-10 w-10'}`}
    >
      <Icon strokeWidth={1.5} className={isHero ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
    </span>
  )

  return (
    <motion.article
      variants={cardVariants}
      className={`group relative flex flex-col rounded-lg border p-8 transition-[border-color,box-shadow,transform] duration-200 ease-out-quint hover:-translate-y-0.5 hover:shadow-float focus-within:shadow-float ${
        onDark
          ? 'border-canvas-night bg-canvas-night text-on-dark'
          : 'border-hairline bg-canvas hover:border-hairline-strong'
      } ${spans[service.size] ?? ''}`}
    >
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
            className={`${isHero ? 'mt-6 display-md' : isWide ? 'mt-0 heading-lg' : 'mt-5 heading-lg'} ${
              onDark ? 'text-on-dark' : 'text-ink'
            }`}
          >
            {service.name}
          </h3>

          <p
            className={`mt-2.5 body-md ${onDark ? 'text-white/60' : 'text-ink-mute'} ${
              isHero ? 'max-w-[38ch]' : ''
            }`}
          >
            {service.summary}
          </p>
        </div>

        {/* The developer DNA of the offering, shown rather than described. */}
        {isHero && (
          <div className="mt-8 hidden flex-1 items-center lg:flex">
            <div className="w-full rounded-sm bg-canvas-night-soft p-4">
              {flowSteps.map((step, i) => (
                <div key={step} className="flex gap-3 code-type text-[0.78rem] leading-6">
                  <span className="tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
                  <span className="whitespace-pre text-white/75">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ul
          className={`flex flex-wrap gap-1.5 ${
            isWide ? 'lg:flex-1' : isHero ? 'pt-8' : 'mt-auto pt-6'
          }`}
        >
          {service.chips.map((chip) => (
            <Chip key={chip} onDark={onDark}>
              {chip}
            </Chip>
          ))}
        </ul>

        <div className={isWide ? 'lg:shrink-0' : 'mt-5'}>
          <LearnMore label={isHero ? 'Explore automation' : 'Learn more'} onDark={onDark} />
        </div>
      </div>

      {/* One stretched link makes the whole tile a single, labelled target. */}
      <a
        href="#contact"
        aria-label={`Learn more about ${service.name}`}
        className="absolute inset-0 rounded-lg focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-deep"
      />
    </motion.article>
  )
}

export default function Services() {
  const reduced = useReducedMotion()

  return (
    <Section id="services" tone="canvas">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Our services</Eyebrow>
          <h2 className="mt-4 display-xl text-ink">Everything you need to scale online.</h2>
        </div>
        <p className="max-w-[46ch] self-end body-lg text-ink-mute lg:col-span-5">
          From paid acquisition to websites and automation, we build marketing systems that
          generate measurable growth.
        </p>
      </div>

      <motion.div
        variants={gridVariants}
        initial={reduced ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:auto-rows-[minmax(18rem,auto)]"
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </motion.div>
    </Section>
  )
}
