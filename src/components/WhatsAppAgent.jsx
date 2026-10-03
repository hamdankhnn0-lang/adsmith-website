import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  Check,
  Contact,
  Filter,
  Languages,
  MessageCircle,
  Plug,
  Sheet,
  Sparkles,
  UserRoundCheck,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { whatsapp, whatsappBenefits, whatsappFeatures, whatsappThread } from '../data/site.js'

const featureIcons = {
  zap: Zap,
  sparkles: Sparkles,
  filter: Filter,
  utensils: UtensilsCrossed,
  calendar: CalendarCheck,
  contact: Contact,
  sheet: Sheet,
  plug: Plug,
  languages: Languages,
  handoff: UserRoundCheck,
  chart: BarChart3,
  book: BookOpen,
}

/** Handset mockup carrying a real exchange rather than lorem bubbles. */
function ConversationMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[21rem]">
      <Glow className="-inset-8 h-auto w-auto" />

      <div className="glass-strong edge-light overflow-hidden rounded-xl p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,1)]">
        <div className="overflow-hidden rounded-[1.125rem] bg-ground-2">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jade-500/18 text-jade-300">
              <MessageCircle aria-hidden="true" strokeWidth={1.7} className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block caption font-medium text-text">Adsmith AI</span>
              <span className="flex items-center gap-1.5 micro normal-case tracking-normal text-jade-300">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-jade-400 animate-breathe"
                />
                online
              </span>
            </span>
          </div>

          {/* Thread */}
          {/* Bubbles arrive one at a time when the phone scrolls into view,
              rather than having played out before anyone got here. */}
          <ol className="space-y-2.5 px-4 py-5">
            {whatsappThread.map((m, i) => {
              const mine = m.from === 'us'
              return (
                <Reveal
                  as="li"
                  key={i}
                  delay={180 + i * 260}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 ${
                      mine
                        ? 'rounded-br-sm bg-jade-500/18 text-text'
                        : 'rounded-bl-sm bg-white/[0.06] text-text-mute'
                    }`}
                  >
                    <p className="caption leading-relaxed">{m.text}</p>
                    {/* Solid colours rather than opacity so contrast is
                        predictable on both bubble fills. */}
                    <span
                      className={`mt-1 block text-[0.7rem] tabular-nums ${
                        mine ? 'text-jade-200' : 'text-text-faint'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </Reveal>
              )
            })}
          </ol>

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-white/8 px-4 py-3">
            <span className="flex-1 rounded-full bg-white/[0.05] px-3 py-2 caption text-text-faint">
              Message
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jade-500 text-on-jade">
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path
                  d="M2 8h11M8.5 3.5 13 8l-4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Floating stat, the second layer of the composite */}
      <div className="sheet absolute -bottom-8 left-0 rounded-md px-4 py-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,1)] sm:-left-12">
        <span className="block font-display text-[1.35rem] font-semibold tabular-nums text-text">
          4s
        </span>
        <span className="block micro text-text-faint">avg. reply</span>
      </div>
    </div>
  )
}

export default function WhatsAppAgent() {
  return (
    <Section id="whatsapp" tone="raised">
      <Glow className="-left-[12%] top-[10%] h-[34rem] w-[34rem]" />
      <Glow className="-right-[14%] bottom-0 h-[30rem] w-[30rem]" tone="sand" />

      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-6">
          <Reveal>
            <Eyebrow>WhatsApp AI Agent</Eyebrow>
          </Reveal>

          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            Close your call center.{' '}
            <span className="bg-gradient-to-br from-jade-200 via-jade-400 to-jade-600 bg-clip-text text-transparent">
              Let AI handle
            </span>{' '}
            your WhatsApp.
          </Reveal>

          <Reveal delay={140} as="p" className="mt-6 max-w-[52ch] body-lg text-text-mute">
            {whatsapp.subheading}
          </Reveal>

          <Reveal delay={200} className="mt-10">
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {whatsappBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jade-500/18 text-jade-300"
                  >
                    <Check strokeWidth={2.4} className="h-3 w-3" />
                  </span>
                  <span className="body-md text-text">{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={260} className="mt-10">
            <Button href="#contact" size="lg" withArrow>
              {whatsapp.cta}
            </Button>
          </Reveal>
        </div>

        <Reveal delay={180} className="min-w-0 lg:col-span-6 lg:pl-8">
          <ConversationMockup />
        </Reveal>
      </div>

      {/* Capability grid */}
      <div className="mt-24 lg:mt-32">
        <Reveal as="h3" className="display-3 text-text">
          Everything the agent can do.
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whatsappFeatures.map((feature, i) => {
            const Icon = featureIcons[feature.icon]
            return (
              <Reveal as="li" key={feature.label} delay={(i % 3) * 60} className="h-full">
                <div className="group glass flex h-full items-center gap-3.5 rounded-md px-4 py-3.5 transition-all duration-500 ease-out-quint hover:-translate-y-0.5 hover:border-jade-400/30 hover:bg-white/[0.07]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/[0.05] text-text-mute transition-colors duration-500 group-hover:bg-jade-500/15 group-hover:text-jade-300">
                    <Icon strokeWidth={1.6} className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="body-md text-text">{feature.label}</span>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
