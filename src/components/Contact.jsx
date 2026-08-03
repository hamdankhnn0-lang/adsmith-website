import { useState } from 'react'
import { Check } from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { brand, phones, services } from '../data/site.js'

/**
 * Where submissions go. Set VITE_FORM_ENDPOINT in `.env` to a Formspree form
 * URL or any URL that accepts a JSON POST. See the README. Left empty, the
 * form runs in demo mode: it validates and shows the success state, but sends
 * nothing.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? ''

const fieldBase =
  'w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 body-md text-text placeholder:text-text-faint transition-colors duration-300 focus:border-jade-400/60 focus:bg-white/[0.07] focus:outline-none'

const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'><path d='M2.5 4.5 6 8l3.5-3.5' stroke='%239bb0aa' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")"

const initialForm = { name: '', email: '', company: '', service: '', message: '' }

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block micro text-text-mute">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 caption text-jade-300">
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
      <div className="glass-strong flex min-h-[27rem] flex-col items-start justify-center rounded-lg p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade-500 text-on-jade">
          <Check aria-hidden="true" strokeWidth={2.4} className="h-5 w-5" />
        </span>
        <h3 className="mt-6 display-3 text-text">Request received.</h3>
        <p className="mt-3 max-w-[40ch] body-md text-text-mute">
          Thanks. We will come back within one business day with next steps and a few questions
          before the audit.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 body-md font-medium text-jade-300 underline underline-offset-4 transition-colors hover:text-text"
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
      className="glass-strong relative rounded-lg p-6 sm:p-8"
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
            placeholder="Your name"
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
            placeholder="Your business name"
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
            style={{
              backgroundImage: chevron,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '12px 12px',
            }}
          >
            <option value="" className="bg-ground-2">
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.name} className="bg-ground-2">
                {s.name}
              </option>
            ))}
            <option value="Not sure yet" className="bg-ground-2">
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
            placeholder="Two branches in Peshawar. Weekday orders are slow and we are only boosting posts right now."
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
          className="mt-6 rounded-md border border-jade-400/30 bg-jade-500/10 px-4 py-3.5 body-md text-text"
        >
          That did not send, because the form service did not respond. Try once more, or email us
          directly at{' '}
          <a href={`mailto:${brand.email}`} className="text-jade-300 underline underline-offset-4">
            {brand.email}
          </a>
          .
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button as="button" type="submit" size="lg" withArrow disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request free audit'}
        </Button>
        <p className="caption text-text-faint sm:max-w-[24ch]">
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
    <div className="glass rounded-lg p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="title-md text-text">Book a 30 minute call</h3>
          <p className="mt-2 caption text-text-mute">
            A strategy call with a senior partner, not a sales rep.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 micro text-text-faint">
          Embed
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot, i) => (
          <button
            key={slot}
            type="button"
            className={`rounded-md border px-3 py-2.5 caption tabular-nums transition-all duration-300 ${
              i === 1
                ? 'border-jade-400/50 bg-jade-500/12 text-text'
                : 'border-white/10 text-text-mute hover:border-white/25 hover:text-text'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <p className="mt-5 caption text-text-faint">
        Placeholder scheduler. Drop your Cal.com or Calendly embed into{' '}
        <code className="font-mono text-[0.78rem] text-text-mute">BookingCard</code> to go live.
      </p>
    </div>
  )
}

export default function Contact() {
  return (
    <Section id="contact" tone="ground">
      <Glow className="left-1/2 -top-20 h-[30rem] w-[52rem] -translate-x-1/2" />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <Eyebrow>Start here</Eyebrow>
          </Reveal>

          <Reveal delay={80} as="h2" className="mt-6 display-2 text-text">
            Let us forge your growth engine.
          </Reveal>

          <Reveal delay={140} as="p" className="mt-6 max-w-[44ch] body-lg text-text-mute">
            Tell us where you are and what you want to grow. You will get a free audit of your
            accounts, tracking and funnel, plus a clear view of what we would change first.
          </Reveal>

          <Reveal delay={200} className="mt-10">
            <BookingCard />
          </Reveal>

          <Reveal delay={260} className="mt-10 grid gap-5 border-t border-white/8 pt-8 sm:grid-cols-2">
            <div>
              <span className="block micro text-text-faint">Email</span>
              <a
                href={`mailto:${brand.email}`}
                className="mt-2 block break-words body-md text-text transition-colors hover:text-jade-300"
              >
                {brand.email}
              </a>
            </div>
            <div>
              <span className="block micro text-text-faint">WhatsApp</span>
              {phones.map((p) => (
                <a
                  key={p.wa}
                  href={`https://wa.me/${p.wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block body-md text-text transition-colors hover:text-jade-300"
                >
                  {p.display}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="min-w-0 lg:col-span-6 lg:col-start-7 lg:self-center">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
