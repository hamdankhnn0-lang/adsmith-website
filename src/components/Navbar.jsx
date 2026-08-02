import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import Wordmark from './ui/Wordmark.jsx'
import { navLinks } from '../data/site.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 bg-canvas transition-shadow duration-200 ${
          scrolled || open ? 'border-b border-hairline-cool' : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-10"
        >
          <a href="#top" className="shrink-0" aria-label="Adsmith home">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="body-md text-ink-mute transition-colors duration-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="#contact"
              className="body-md text-ink-mute transition-colors duration-200 hover:text-ink"
            >
              Free audit
            </a>
            <Button href="#contact" size="sm">
              Book a call
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-hairline text-ink lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex h-3 w-4 flex-col justify-between">
              <span
                className={`block h-px w-full bg-current transition-transform duration-200 ease-out-quint ${
                  open ? 'translate-y-[5.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-opacity duration-150 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-transform duration-200 ease-out-quint ${
                  open ? '-translate-y-[5.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile sheet. Visibility rides the transition so the panel can animate
          out, then stops its links being focusable while closed. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 transition-[visibility] duration-300 lg:hidden ${
          open ? 'visible' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/20 transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 top-0 border-b border-hairline bg-canvas pb-7 pt-20 transition-transform duration-300 ease-out-quint ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <ul className="flex flex-col px-6 sm:px-8">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-hairline-cool last:border-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 heading-lg text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2.5 px-6 sm:px-8">
            <Button href="#contact" onClick={() => setOpen(false)} size="lg">
              Book a call
            </Button>
            <Button href="#contact" onClick={() => setOpen(false)} size="lg" variant="outline">
              Get a free audit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
