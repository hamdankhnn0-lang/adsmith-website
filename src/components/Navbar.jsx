import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import Wordmark from './ui/Wordmark.jsx'
import { navLinks } from '../data/site.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Highlight whichever section is currently under the bar.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const seen = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio))
        const best = [...seen.entries()].sort((a, b) => b[1] - a[1])[0]
        setActive(best && best[1] > 0 ? best[0] : '')
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-jade-500 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-on-jade"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        {/* Floating capsule bar rather than a full width band */}
        <nav
          aria-label="Primary"
          className={`mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between rounded-full pl-5 pr-3 transition-all duration-500 ease-out-quint sm:pl-6 ${
            scrolled || open
              ? 'glass-float shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]'
              : 'border border-transparent bg-transparent'
          }`}
        >
          <a href="#top" className="shrink-0 rounded-full" aria-label="Adsmith home">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors duration-300 hover:bg-white/5 hover:text-text ${
                      isActive ? 'text-text' : 'text-text-mute'
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-center bg-jade-400 transition-transform duration-500 ease-out-quint ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#contact"
              className="rounded-full px-3.5 py-2 text-[0.9rem] text-text-mute transition-colors duration-300 hover:text-text"
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
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-text lg:hidden"
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

      {/* Mobile sheet. Visibility rides the transition so the panel can animate
          out, then stops its links being focusable while closed. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 transition-[visibility] duration-500 lg:hidden ${
          open ? 'visible' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ground/80 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-3 top-3 rounded-xl border border-white/10 bg-ground-2 px-5 pb-6 pt-24 transition-all duration-500 ease-out-quint sm:inset-x-5 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <ul className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.href} className="border-b border-white/8 last:border-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 font-display text-[1.4rem] font-semibold tracking-[-0.03em] text-text"
                >
                  {link.label}
                  <span className="micro text-text-faint">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button href="#contact" onClick={() => setOpen(false)} size="lg" withArrow>
              Book a call
            </Button>
            <Button href="#contact" onClick={() => setOpen(false)} size="lg" variant="glass">
              Get a free audit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
