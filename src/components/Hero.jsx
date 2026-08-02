import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'
import { heroStats } from '../data/site.js'

const rows = [
  { channel: 'Meta Ads', spend: '£12,480', roas: '5.1x', booked: '412' },
  { channel: 'Google Search', spend: '£8,240', roas: '4.4x', booked: '298' },
  { channel: 'Performance Max', spend: '£5,100', roas: '3.9x', booked: '176' },
  { channel: 'TikTok Ads', spend: '£3,860', roas: '4.8x', booked: '151' },
]

const logLines = [
  { t: '09:41:02', m: 'lead.received  →  qualify_agent' },
  { t: '09:41:03', m: 'agent.score    →  hot (0.91)' },
  { t: '09:41:04', m: 'whatsapp.send  →  delivered' },
]

/**
 * The product is the argument. A light reporting panel with a dark automation
 * log composited over it, in place of any atmospheric backdrop.
 */
function ProductPanes() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border border-hairline bg-canvas shadow-float">
        <div className="flex items-center justify-between border-b border-hairline-cool px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="caption font-medium text-ink">Campaign performance</span>
          </div>
          <span className="micro text-ink-mute-2">Last 30 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse">
            <thead>
              <tr className="border-b border-hairline-cool">
                {['Channel', 'Spend', 'ROAS', 'Booked'].map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`micro font-medium uppercase tracking-[0.06em] text-ink-mute-2 ${
                      i === 0 ? 'px-5 py-2.5 text-left' : 'px-5 py-2.5 text-right'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.channel} className="border-b border-hairline-cool last:border-0">
                  <td className="px-5 py-3 caption text-ink">{r.channel}</td>
                  <td className="px-5 py-3 caption text-right tabular-nums text-ink-mute">
                    {r.spend}
                  </td>
                  <td className="px-5 py-3 caption text-right tabular-nums text-ink">{r.roas}</td>
                  <td className="px-5 py-3 caption text-right tabular-nums text-ink-mute">
                    {r.booked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between bg-canvas-soft px-5 py-3">
          <span className="micro text-ink-mute">Blended ROAS</span>
          <span className="caption font-medium tabular-nums text-ink">4.7x</span>
        </div>
      </div>

      {/* Floating dark pane, the second layer of the composite. It clips the
          bottom left corner rather than covering any table rows. */}
      <div className="mt-4 overflow-hidden rounded-lg bg-canvas-night shadow-float sm:absolute sm:-bottom-24 sm:-left-8 sm:mt-0 sm:w-[18rem] lg:-left-12">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="micro text-white/70">n8n · lead intake</span>
        </div>
        <div className="px-4 py-3">
          {logLines.map((l) => (
            <div key={l.t} className="flex gap-3 code-type text-[0.72rem] leading-6">
              <span className="shrink-0 tabular-nums text-white/35">{l.t}</span>
              <span className="truncate text-white/80">{l.m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative bg-canvas">
      <div className="mx-auto w-full max-w-[1280px] px-6 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:px-10 lg:pb-36 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-canvas-soft px-2.5 py-1 micro text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Forged for Growth
              </span>
            </Reveal>

            <Reveal delay={60} as="h1" className="mt-6 display-xxl text-ink">
              Precision marketing, masterfully built.
            </Reveal>

            <Reveal delay={120} as="p" className="mt-6 max-w-[46ch] body-lg text-ink-mute">
              Adsmith builds advertising and automation systems for restaurants, hotels, local
              brands and premium SMEs. Engineered like craft, measured like finance.
            </Reveal>

            <Reveal delay={180} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#contact" size="lg">
                Book a call
              </Button>
              <Button href="#contact" size="lg" variant="outline">
                Get a free audit
              </Button>
            </Reveal>
          </div>

          {/* min-w-0 stops the 30rem table forcing the grid track wider than
              the viewport; the table scrolls inside its own container. */}
          <Reveal delay={160} className="min-w-0 lg:col-span-6">
            <ProductPanes />
          </Reveal>
        </div>

        <Reveal delay={240} className="mt-20 lg:mt-28">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-hairline-cool pt-8 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block display-md tabular-nums text-ink">{stat.value}</span>
                  <span className="mt-1 block caption text-ink-mute">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
