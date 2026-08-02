import { useState } from 'react'
import { Check } from 'lucide-react'
import Section from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { brand, services } from '../data/site.js'

/**
 * Where submissions go. Set VITE_FORM_ENDPOINT in `.env` to a Formspree form
 * URL, an n8n webhook, or any URL that accepts a JSON POST. See the README.
 * Left empty, the form runs in demo mode: it validates and shows the success
 * state, but sends nothing.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? ''

const fieldBase =
  'w-full rounded-sm border border-hairline bg-canvas px-3 py-2 body-md text-ink placeholder:text-ink-faint transition-colors duration-200 focus:border-ink-faint focus:outline-none focus:ring-2 focus:ring-primary/40'

const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'><path d='M2.5 4.5 6 8l3.5-3.5' stroke='%23707070' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")"

const initialForm = { name: '', email: '', company: '', service: '', message: '' }

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block caption font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 caption text-ink-mute">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  // Bots fill hidden inputs; humans never see this one.
  const [trap, setTrap] = useState('')

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'A valid email address is required.'
    if (form.message.trim().length < 10)
      next.message = 'A sentence or two about your goals helps us prepare.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Silently accept the spam so the bot does not learn it was caught.
    if (trap) {
      setStatus('sent')
      return
    }

    if (!FORM_ENDPOINT) {
      setStatus('sent')
      setForm(initialForm)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          service: form.service || 'Not specified',
          submittedAt: new Date().toISOString(),
          page: window.location.href,
        }),
      })
      if (!res.ok) throw new Error(`Endpoint returned ${res.status}`)
      setStatus('sent')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex min-h-[26rem] flex-col items-start justify-center rounded-lg border border-hairline bg-canvas p-8 sm:p-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
          <Check aria-hidden="true" strokeWidth={2.2} className="h-4 w-4" />
        </span>
        <h3 className="mt-5 display-md text-ink">Request received.</h3>
        <p className="mt-3 max-w-[40ch] body-md text-ink-mute">
          Thanks. We will come back within one business day with next steps and a few questions
          before the audit.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 caption font-medium text-ink underline underline-offset-4"
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
      className="relative rounded-lg border border-hairline bg-canvas p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
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
            className={`${fieldBase} appearance-none pr-9`}
            style={{
              backgroundImage: chevron,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '12px 12px',
            }}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
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

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="mt-5 rounded-sm border border-hairline bg-canvas-soft px-4 py-3 caption text-ink"
        >
          That did not send, because the form service did not respond. Try once more, or email us
          directly at{' '}
          <a href={`mailto:${brand.email}`} className="font-medium underline underline-offset-4">
            {brand.email}
          </a>
          .
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button as="button" type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request free audit'}
        </Button>
        <p className="caption text-ink-mute-2 sm:max-w-[24ch]">
          No pitch decks. A written audit and a straight answer.
        </p>
      </div>
    </form>
  )
}

/** Placeholder for an embedded scheduler such as Cal.com or Calendly. */
function BookingCard() {
  const slots = ['Tue 10:00', 'Tue 14:30', 'Wed 09:00', 'Wed 16:00', 'Thu 11:30', 'Fri 13:00']

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="heading-lg text-ink">Book a 30 minute call</h3>
          <p className="mt-1.5 caption text-ink-mute">
            A strategy call with a senior partner, not a sales rep.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-canvas-soft px-2 py-0.5 micro text-ink-mute">
          Embed
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot, i) => (
          <button
            key={slot}
            type="button"
            className={`rounded-sm border px-3 py-2 caption tabular-nums transition-colors duration-200 ${
              i === 1
                ? 'border-primary bg-primary/10 text-ink'
                : 'border-hairline text-ink-mute hover:border-hairline-strong hover:text-ink'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <p className="mt-5 micro text-ink-mute-2">
        Placeholder scheduler. Drop your Cal.com or Calendly embed into{' '}
        <code className="code-type text-[0.72rem] text-ink-mute">BookingCard</code> to go live.
      </p>
    </div>
  )
}

export default function Contact() {
  return (
    <Section id="contact" tone="soft">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Start here</Eyebrow>

          <h2 className="mt-4 display-xl text-ink">Let us forge your growth engine.</h2>

          <p className="mt-5 max-w-[44ch] body-lg text-ink-mute">
            Tell us where you are and what you want to grow. You will get a free audit of your
            accounts, tracking and funnel, plus a clear view of what we would change first.
          </p>

          <Reveal delay={80} className="mt-8">
            <BookingCard />
          </Reveal>

          <div className="mt-8 grid gap-5 border-t border-hairline pt-7 sm:grid-cols-2">
            <div>
              <span className="block micro text-ink-mute-2">Email</span>
              <a
                href={`mailto:${brand.email}`}
                className="mt-1 block body-md text-ink underline underline-offset-4"
              >
                {brand.email}
              </a>
            </div>
            <div>
              <span className="block micro text-ink-mute-2">Phone</span>
              <a
                href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`}
                className="mt-1 block body-md text-ink underline underline-offset-4"
              >
                {brand.phone}
              </a>
            </div>
          </div>
        </div>

        <Reveal delay={100} className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
