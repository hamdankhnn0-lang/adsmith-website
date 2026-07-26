import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import Wordmark from './ui/Wordmark.jsx'
import { navLinks } from '../data/site.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
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

  // Until the page scrolls the bar floats over the near-black hero, so it has
  // to invert. Once the white backdrop appears it flips back to ink.
  const onDark = !scrolled && !open

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-quint ${
          scrolled || open
            ? 'border-b border-ink/8 bg-white/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-6 sm:px-8 lg:px-12"
        >
          <a href="#top" className="shrink-0" aria-label="Adsmith — home">
            <Wordmark tone={onDark ? 'light' : 'dark'} />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-[0.88rem] font-medium tracking-tight transition-colors duration-300 ${
                    onDark ? 'text-white/65 hover:text-white' : 'text-smoke-600 hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#contact"
              className={`text-[0.88rem] font-medium tracking-tight transition-colors duration-300 ${
                onDark ? 'text-white/65 hover:text-white' : 'text-smoke-600 hover:text-ink'
              }`}
            >
              Free audit
            </a>
            <Button href="#contact" size="sm" withArrow>
              Book a call
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
              onDark ? 'border-white/20 text-white' : 'border-ink/10 text-ink'
            }`}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex h-3 w-4 flex-col justify-between">
              <span
                className={`block h-px w-full bg-current transition-transform duration-300 ease-out-quint ${
                  open ? 'translate-y-[5.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-transform duration-300 ease-out-quint ${
                  open ? '-translate-y-[5.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile sheet. `visibility` rides the transition so the panel can
          animate out, then stops its links being focusable while closed. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 transition-[visibility] duration-500 lg:hidden ${
          open ? 'visible' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/25 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 top-0 origin-top bg-white pb-8 pt-[88px] shadow-[0_30px_80px_-30px_rgba(10,10,10,0.35)] transition-transform duration-500 ease-out-quint ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <ul className="flex flex-col px-6 sm:px-8">
            {navLinks.map((link, i) => (
              <li key={link.href} className="border-b border-ink/8 last:border-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-[1.35rem] font-medium tracking-[-0.03em] text-ink"
                >
                  {link.label}
                  <span className="text-[0.7rem] font-normal tracking-[0.2em] text-smoke-400">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 px-6 sm:px-8">
            <Button href="#contact" onClick={() => setOpen(false)} size="lg" withArrow>
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
