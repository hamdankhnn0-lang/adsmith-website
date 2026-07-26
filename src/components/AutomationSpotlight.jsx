import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { automationCapabilities, automationFlow } from '../data/site.js'

/** Abstract node/edge diagram standing in for an n8n canvas. */
function FlowDiagram() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/80 p-6 backdrop-blur-sm sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hairline-grid opacity-80" />

      <div className="relative flex items-center justify-between">
        <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40">
          workflow · lead-intake
        </span>
        <span className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-forge-300">
          <span className="h-1.5 w-1.5 rounded-full bg-forge-500 animate-pulse-line" />
          live
        </span>
      </div>

      <ol className="relative mt-8 space-y-3">
        {automationFlow.map((node, i) => (
          <li key={node.label} className="relative">
            <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-colors duration-500 hover:border-forge-500/40 hover:bg-white/[0.07]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-ink text-[0.7rem] font-medium text-forge-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.95rem] font-medium tracking-tight text-white">
                  {node.label}
                </span>
                <span className="block truncate text-[0.82rem] text-white/45">{node.caption}</span>
              </span>
            </div>

            {i < automationFlow.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-[34px] flex h-3 w-px bg-gradient-to-b from-forge-500/70 to-white/10"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-[0.72rem] text-white/40">Avg. run time</span>
        <span className="text-[0.72rem] font-medium text-white">1.8s · 0 manual steps</span>
      </div>
    </div>
  )
}

export default function AutomationSpotlight() {
  return (
    <Section id="automation" tone="dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(47,91,255,0.22),transparent_62%)] animate-drift"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="light">n8n &amp; AI automation</Eyebrow>
          </Reveal>

          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.2rem,5vw,3.7rem)] font-semibold"
          >
            The agency that also{' '}
            <span className="serif-accent text-forge-300">automates</span> the business behind
            the ads.
          </Reveal>

          <Reveal delay={140} as="p" className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-white/60">
            Most agencies hand you leads and walk away. We build the n8n workflows and AI agents
            that catch those leads, qualify them, follow up, update your CRM and report back —
            running quietly in the background, every hour of every day.
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {automationCapabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={180 + i * 70} className="h-full">
                <div className="h-full bg-ink p-6 transition-colors duration-500 hover:bg-ink-800">
                  <h3 className="text-[1rem] font-semibold tracking-tight text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/50">{cap.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={420} className="mt-10">
            <Button href="#contact" variant="light" size="lg" withArrow>
              Map my automations
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200} className="lg:col-span-5 lg:col-start-8">
          <FlowDiagram />
        </Reveal>
      </div>
    </Section>
  )
}
