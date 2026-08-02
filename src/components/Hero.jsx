import { MessageCircle, TrendingUp } from 'lucide-react'
import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'
import { Glow } from './ui/Section.jsx'
import { heroStats } from '../data/site.js'

const channels = [
  { name: 'Meta Ads', spend: '£12,480', roas: '5.1x', width: '92%' },
  { name: 'Google Search', spend: '£8,240', roas: '4.4x', width: '74%' },
  { name: 'TikTok Ads', spend: '£3,860', roas: '4.8x', width: '52%' },
]

/** Layered glass panels standing in for the product, in place of stock imagery. */
function HeroPanels() {
  return (
    <div className="relative">
      <div className="glass edge-light rounded-lg p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 caption text-text-mute">
            <TrendingUp aria-hidden="true" strokeWidth={1.6} className="h-4 w-4 text-jade-400" />
            Blended performance
          </span>
          <span className="micro text-text-faint">30 days</span>
        </div>

        <div className="mt-6 space-y-5">
          {channels.map((c) => (
            <div key={c.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="body-md text-text">{c.name}</span>
                <span className="caption tabular-nums text-text-mute">
                  {c.spend} · <span className="text-jade-300">{c.roas}</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-jade-600 to-jade-400"
                  style={{ width: c.width }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
          <span className="caption text-text-mute">Blended ROAS</span>
          <span className="font-display text-[1.35rem] font-semibold tabular-nums text-text">
            4.7x
          </span>
        </div>
      </div>

      {/* Second pane, offset so the two read as a composite */}
      <div className="glass-strong mt-4 rounded-lg p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:absolute sm:-bottom-12 sm:-left-10 sm:mt-0 sm:w-[17.5rem] lg:-left-14">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jade-500/15 text-jade-300">
            <MessageCircle aria-hidden="true" strokeWidth={1.7} className="h-4 w-4" />
          </span>
          <span className="caption text-text">WhatsApp AI Agent</span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-jade-400 animate-breathe" />
        </div>
        <p className="mt-3 body-md text-text-mute">
          Answered 214 chats today. Average reply in 4 seconds.
        </p>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ground">
      <Glow className="-left-[15%] -top-[20%] h-[42rem] w-[42rem] animate-float" />
      <Glow className="-right-[10%] top-[6%] h-[34rem] w-[34rem]" tone="sand" />

      {/* Faint grid, kept very low contrast so it reads as texture not chrome */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:90px_90px] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />

      <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-36 lg:px-10 lg:pb-36 lg:pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 micro text-text-mute">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-jade-400 animate-breathe"
                />
                Forged for Growth
              </span>
            </Reveal>

            <Reveal delay={80} as="h1" className="mt-7 display-1 text-text">
              Precision marketing,{' '}
              <span className="bg-gradient-to-br from-jade-200 via-jade-400 to-jade-600 bg-clip-text text-transparent">
                masterfully
              </span>{' '}
              built.
            </Reveal>

            <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] body-lg text-text-mute">
              Adsmith builds advertising systems and WhatsApp AI agents for restaurants, hotels,
              local brands and premium SMEs. Engineered like craft, measured like finance.
            </Reveal>

            <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#contact" size="lg" withArrow>
                Book a call
              </Button>
              <Button href="#whatsapp" size="lg" variant="glass">
                See the WhatsApp agent
              </Button>
            </Reveal>
          </div>

          <Reveal delay={200} className="min-w-0 lg:col-span-6">
            <HeroPanels />
          </Reveal>
        </div>

        <Reveal delay={320} className="mt-24 lg:mt-32">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-9 border-t border-white/8 pt-10 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-[2.1rem] font-semibold tracking-[-0.035em] tabular-nums text-text sm:text-[2.5rem]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block caption text-text-faint">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
