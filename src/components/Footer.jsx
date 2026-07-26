import Wordmark from './ui/Wordmark.jsx'
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from './ui/Icons.jsx'
import { brand, footerColumns } from '../data/site.js'

const socials = [
  { label: 'LinkedIn', href: '#', Icon: LinkedInIcon },
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'X', href: '#', Icon: XIcon },
  { label: 'YouTube', href: '#', Icon: YouTubeIcon },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hairline-grid opacity-50" />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark tone="light" />
            <p className="mt-5 max-w-[30ch] text-[0.92rem] leading-relaxed text-white/45">
              {brand.promise} Performance marketing and AI automation for businesses that care how
              they show up.
            </p>
            <p className="mt-6 text-[0.8rem] text-white/30">{brand.location}</p>

            <ul className="mt-8 flex items-center gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-forge-500 hover:text-white"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
              <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-white/35">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[0.9rem] text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-white/35">Get in touch</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="text-[0.9rem] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {brand.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`}
                  className="text-[0.9rem] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {brand.phone}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[0.9rem] text-forge-300 transition-colors duration-300 hover:text-white"
                >
                  Book a call
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-white/30">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[0.8rem] text-white/30 transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="#" className="text-[0.8rem] text-white/30 transition-colors hover:text-white/70">
              Terms
            </a>
            <span className="text-[0.8rem] uppercase tracking-[0.16em] text-white/25">
              {brand.tagline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
