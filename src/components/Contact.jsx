import { useState } from 'react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { CheckIcon } from './ui/Icons.jsx'
import { brand, services } from '../data/site.js'

const fieldBase =
  'w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-[0.95rem] text-white placeholder:text-white/30 transition-colors duration-300 focus:border-forge-500 focus:bg-white/[0.07] focus:outline-none'

const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'><path d='M2.5 4.5 6 8l3.5-3.5' stroke='white' stroke-opacity='0.45' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")"

const initialForm = {
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[0.72rem] uppercase tracking-[0.16em] text-white/45"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-[0.8rem] text-forge-300">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Front-end only. Point `submit` at your form endpoint (Formspree, Resend,
 * an n8n webhook, etc.) — the success state is already wired.
 */
function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'A valid email address is required.'
    if (form.message.trim().length < 10)
      next.message = 'A sentence or two about your goals helps us prepare.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    // TODO: replace with a real submission (POST to your endpoint / n8n webhook).
    setSent(true)
    setForm(initialForm)
  }

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forge-500 text-white">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3 className="mt-6 text-[1.6rem] font-semibold tracking-[-0.035em]">Request received.</h3>
        <p className="mt-3 max-w-[40ch] text-[0.98rem] leading-relaxed text-white/55">
          Thanks — we&rsquo;ll come back within one business day with next steps and a few
          questions before the audit.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 text-[0.88rem] font-medium text-forge-300 underline underline-offset-4 transition-colors hover:text-white"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            placeholder="Jordan Ellis"
            className={fieldBase}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@company.com"
            className={fieldBase}
          />
        </Field>

        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={update('company')}
            placeholder="Harbour Row Hospitality"
            className={fieldBase}
          />
        </Field>

        <Field label="Primary interest" htmlFor="service">
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={update('service')}
            className={`${fieldBase} appearance-none pr-10`}
            style={{ backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px 12px' }}
          >
            <option value="" className="bg-ink">
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.name} className="bg-ink">
                {s.name}
              </option>
            ))}
            <option value="Not sure yet" className="bg-ink">
              Not sure yet
            </option>
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="What are you trying to grow?" htmlFor="message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={update('message')}
            placeholder="Two restaurants in the city centre, weekday covers are soft, currently running boosted posts only…"
            className={`${fieldBase} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button as="button" type="submit" size="lg" withArrow>
          Request free audit
        </Button>
        <p className="text-[0.78rem] leading-relaxed text-white/35 sm:max-w-[24ch]">
          No pitch decks. A written audit and a straight answer.
        </p>
      </div>
    </form>
  )
}

/** Placeholder for an embedded scheduler (Cal.com, Calendly, HubSpot…). */
function BookingCard() {
  const slots = ['Tue · 10:00', 'Tue · 14:30', 'Wed · 09:00', 'Wed · 16:00', 'Thu · 11:30', 'Fri · 13:00']

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hairline-grid opacity-70" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[1.15rem] font-semibold tracking-tight">Book a 30-minute call</h3>
          <p className="mt-1.5 text-[0.88rem] text-white/45">
            Strategy call with a senior partner — not a sales rep.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/12 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/40">
          Embed
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot, i) => (
          <button
            key={slot}
            type="button"
            className={`rounded-lg border px-3 py-2.5 text-[0.82rem] transition-colors duration-300 ${
              i === 1
                ? 'border-forge-500 bg-forge-500/15 text-white'
                : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <p className="relative mt-5 text-[0.75rem] leading-relaxed text-white/30">
        Placeholder scheduler. Drop your Cal.com or Calendly embed into{' '}
        <code className="text-white/50">BookingCard</code> to go live.
      </p>
    </div>
  )
}

export default function Contact() {
  return (
    <Section id="contact" tone="dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,91,255,0.2),transparent_65%)]"
      />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="light">Start here</Eyebrow>
          </Reveal>

          <Reveal
            delay={80}
            as="h2"
            className="mt-6 display-tight text-[clamp(2.3rem,5.4vw,4rem)] font-semibold"
          >
            Let&rsquo;s forge your{' '}
            <span className="serif-accent text-forge-300">growth</span> engine.
          </Reveal>

          <Reveal delay={140} as="p" className="mt-6 max-w-[44ch] text-[1.02rem] leading-relaxed text-white/55">
            Tell us where you are and what you want to grow. You&rsquo;ll get a free audit of your
            accounts, tracking and funnel — plus a clear view of what we&rsquo;d change first.
          </Reveal>

          <Reveal delay={200} className="mt-10">
            <BookingCard />
          </Reveal>

          <Reveal delay={260} className="mt-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-white/35">
                Email
              </span>
              <a
                href={`mailto:${brand.email}`}
                className="mt-1.5 block text-[0.95rem] text-white transition-colors hover:text-forge-300"
              >
                {brand.email}
              </a>
            </div>
            <div>
              <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-white/35">
                Phone
              </span>
              <a
                href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`}
                className="mt-1.5 block text-[0.95rem] text-white transition-colors hover:text-forge-300"
              >
                {brand.phone}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
