import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Mail, MessageCircle } from 'lucide-react'
import Section, { Glow } from './ui/Section.jsx'
import Eyebrow from './ui/Eyebrow.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { brand, phones, services } from '../data/site.js'

/**
 * The form posts to contact.php, which ships in public/ and emails the enquiry.
 * That works on any PHP host with no third party service. Point
 * VITE_FORM_ENDPOINT somewhere else (Formspree, your own API) to override it.
 *
 * If the post fails for any reason, the error state hands the visitor straight
 * to WhatsApp and email with everything they typed still intact, so an enquiry
 * is never simply lost.
 *
 * VITE_BOOKING_URL swaps the WhatsApp booking buttons for a real scheduler.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '/contact.php'
const BOOKING_URL = import.meta.env.VITE_BOOKING_URL ?? ''

/** Compose the enquiry as a readable WhatsApp message. */
function waLink(number, form) {
  const lines = [
    'New enquiry from adsmithsolutions.com',
    '',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.company ? `Business: ${form.company}` : null,
    `Interested in: ${form.services.length ? form.services.join(', ') : 'Not sure yet'}`,
    '',
    form.message,
    // Keep the empty strings above: they are the blank lines that make the
    // message readable in WhatsApp. Only drop the optional company row.
  ].filter((line) => line !== null)
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}

const fieldBase =
  'w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 body-md text-text placeholder:text-text-faint transition-colors duration-300 focus:border-jade-400/60 focus:bg-white/[0.07] focus:outline-none'

const initialForm = { name: '', email: '', company: '', services: [], message: '' }

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

/**
 * Multi-select for the services list. A native `<select multiple>` needs a
 * held-down Ctrl or Cmd to pick more than one option, which almost nobody
 * discovers on their own, so this is a checkbox list behind a summary button
 * instead. Closes on an outside click or Escape.
 */
function ServiceMultiSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggle = (name) => {
    onChange(value.includes(name) ? value.filter((v) => v !== name) : [...value, name])
  }

  const label =
    value.length === 0
      ? 'Select services'
      : value.length === 1
        ? value[0]
        : `${value.length} services selected`

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldBase} flex items-center justify-between gap-2 text-left ${
          value.length === 0 ? 'text-text-faint' : 'text-text'
        }`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.6}
          className={`h-4 w-4 shrink-0 text-text-faint transition-transform duration-300 ease-out-quint ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={id}
          className="sheet absolute z-30 mt-2 max-h-[min(24rem,60vh)] w-full overflow-auto rounded-md p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)]"
        >
          {services.map((s) => {
            const checked = value.includes(s.name)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(s.name)}
                  className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left leading-snug body-md text-text transition-colors duration-200 hover:bg-white/[0.09]"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 ${
                      checked ? 'border-jade-400 bg-jade-500' : 'border-white/20'
                    }`}
                  >
                    {checked && <Check strokeWidth={3} className="h-3 w-3 text-on-jade" />}
                  </span>
                  {s.name}
                </button>
              </li>
            )
          })}
        </ul>
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
  const alertRef = useRef(null)

  /**
   * Bring the failure notice to the visitor rather than hoping they scroll to
   * it. Submit sits at the bottom of a long form, so the notice can open above
   * the fold and read as nothing having happened at all.
   */
  useEffect(() => {
    if (status !== 'error' || !alertRef.current) return
    alertRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    alertRef.current.focus({ preventScroll: true })
  }, [status])

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

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          website: trap,
          services: form.services.length ? form.services : ['Not specified'],
          submittedAt: new Date().toISOString(),
          page: window.location.href,
        }),
      })

      /**
       * Only ever call it sent when contact.php says so in as many words.
       *
       * A 200 is not enough on its own. Put this build somewhere PHP does not
       * run and the server hands back the source of the file, or its own error
       * page, with a perfectly cheerful 200 attached. Trusting the status code
       * meant telling people their enquiry was in our inbox when nothing had
       * been sent at all, which is the worst way this form can fail: they walk
       * away happy and we never hear from them.
       */
      const raw = await res.text()
      let body = null
      try {
        body = JSON.parse(raw)
      } catch {
        body = null // not our endpoint answering
      }

      // The server validates too. Put anything it rejects back on the field.
      if (res.status === 422 && body?.errors) {
        setErrors(body.errors)
        setStatus('idle')
        return
      }

      if (!res.ok) throw new Error(`Endpoint returned ${res.status}`)
      if (body?.ok !== true) throw new Error('Endpoint did not confirm the send')

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
          It is in our inbox. We will come back within one business day with next steps and a few
          questions before the audit. If you would rather not wait, message us on WhatsApp.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`https://wa.me/${phones[0].wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 body-md font-medium text-jade-300 underline underline-offset-4 transition-colors hover:text-text"
          >
            <MessageCircle aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
            Message us on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm)
              setStatus('idle')
            }}
            className="body-md text-text-mute underline underline-offset-4 transition-colors hover:text-text"
          >
            Send another enquiry
          </button>
        </div>
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

        <Field label="Services you need" htmlFor="services-trigger">
          <ServiceMultiSelect
            id="services-trigger"
            value={form.services}
            onChange={(next) => setForm((f) => ({ ...f, services: next }))}
          />
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
        <div
          role="alert"
          ref={alertRef}
          tabIndex={-1}
          className="mt-6 rounded-md border border-jade-400/30 bg-jade-500/10 px-4 py-4 body-md text-text focus:outline-none"
        >
          <p>That did not send. Nothing you typed is lost, so send it either of these ways:</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={waLink(phones[0].wa, form)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-jade-300 underline underline-offset-4"
            >
              <MessageCircle aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
              Send it on WhatsApp
            </a>
            <a
              href={`mailto:${brand.email}?subject=${encodeURIComponent('Enquiry from adsmithsolutions.com')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.company}\nServices: ${form.services.length ? form.services.join(', ') : 'Not sure yet'}\n\n${form.message}`)}`}
              className="inline-flex items-center gap-2 text-text-mute underline underline-offset-4 hover:text-text"
            >
              <Mail aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
              Send it by email
            </a>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          as="button"
          type="submit"
          size="lg"
          withArrow
          disabled={status === 'sending'}
          className="shrink-0 whitespace-nowrap"
        >
          {status === 'sending' ? 'Sending…' : 'Request free audit'}
        </Button>
        <p className="caption text-text-faint sm:max-w-[28ch]">
          No pitch decks, just a written audit. Or{' '}
          <a
            href={waLink(phones[0].wa, form)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-jade-300 underline underline-offset-4 hover:text-text"
          >
            send it on WhatsApp
          </a>
          .
        </p>
      </div>
    </form>
  )
}

/**
 * Booking card. Uses a real scheduler when VITE_BOOKING_URL is set, otherwise
 * books over WhatsApp, which needs no third party account to work today.
 */
function BookingCard() {
  const bookingMessage = encodeURIComponent(
    'Hi Adsmith, I would like to book a 30 minute call about growing my business.',
  )

  return (
    <div className="glass rounded-lg p-6 sm:p-8">
      <h3 className="title-md text-text">Book a 30 minute call</h3>
      <p className="mt-2 body-md text-text-mute">
        A strategy call with someone who will actually do the work, not a sales rep. Pick
        whichever is easier.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {BOOKING_URL ? (
          <Button href={BOOKING_URL} target="_blank" rel="noopener noreferrer" size="lg" withArrow>
            See available times
          </Button>
        ) : (
          phones.map((p, i) => (
            <Button
              key={p.wa}
              href={`https://wa.me/${p.wa}?text=${bookingMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant={i === 0 ? 'primary' : 'glass'}
              className="justify-between"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
                WhatsApp {p.display}
              </span>
            </Button>
          ))
        )}

        <a
          href={`mailto:${brand.email}?subject=${encodeURIComponent('Booking a call with Adsmith')}`}
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 body-md text-text-mute transition-colors duration-300 hover:text-text"
        >
          <Mail aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
          Or email {brand.email}
        </a>
      </div>

      <p className="mt-5 caption text-text-faint">
        We reply to WhatsApp within the hour during business days.
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

          {/* Stacked rather than two up: the address is long enough that a
              narrow column breaks it mid word. */}
          <Reveal delay={260} className="mt-10 flex flex-col gap-6 border-t border-white/8 pt-8">
            <div>
              <span className="block micro text-text-faint">Email</span>
              <a
                href={`mailto:${brand.email}`}
                className="mt-2 block body-md text-text transition-colors hover:text-jade-300"
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
