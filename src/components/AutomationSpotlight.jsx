import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { automationCapabilities, automationFlow } from '../data/site.js'

/** A workflow pane rendered as product chrome rather than an illustration. */
function WorkflowPane() {
  return (
    <div className="overflow-hidden rounded-lg bg-canvas-night shadow-float">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="code-type text-[0.78rem] text-white/60">workflow / lead intake</span>
        <span className="inline-flex items-center gap-1.5 micro text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Live
        </span>
      </div>

      <ol className="p-5">
        {automationFlow.map((node, i) => (
          <li key={node.label}>
            <div className="flex items-center gap-3 rounded-sm bg-canvas-night-soft px-4 py-3">
              <span className="code-type shrink-0 text-[0.78rem] tabular-nums text-white/35">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block caption font-medium text-on-dark">{node.label}</span>
                <span className="block micro text-white/45">{node.caption}</span>
              </span>
            </div>
            {i < automationFlow.length - 1 && (
              <span aria-hidden="true" className="ml-8 block h-2.5 w-px bg-white/15" />
            )}
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
        <span className="micro text-white/45">Average run time</span>
        <span className="caption tabular-nums text-on-dark">1.8s · 0 manual steps</span>
      </div>
    </div>
  )
}

export default function AutomationSpotlight() {
  return (
    <Section id="automation" tone="soft">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow>n8n and AI automation</Eyebrow>

          <h2 className="mt-4 display-xl text-ink">
            The agency that also automates the business behind the ads.
          </h2>

          <p className="mt-5 max-w-[50ch] body-lg text-ink-mute">
            Most agencies hand you leads and walk away. We build the n8n workflows and AI agents
            that catch those leads, qualify them, follow up, update your CRM and report back. All
            of it running quietly in the background, every hour of every day.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {automationCapabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-lg border border-hairline bg-canvas p-6">
                  <h3 className="heading-md text-ink">{cap.title}</h3>
                  <p className="mt-2 body-md text-ink-mute">{cap.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <Button href="#contact" size="lg">
              Map my automations
            </Button>
          </div>
        </div>

        <Reveal delay={120} className="lg:col-span-6">
          <WorkflowPane />
        </Reveal>
      </div>
    </Section>
  )
}
