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
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark />
            <p className="mt-4 max-w-[32ch] caption text-ink-mute">
              {brand.promise} Performance marketing and AI automation for businesses that care how
              they show up.
            </p>
            <p className="mt-4 caption text-ink-mute-2">{brand.location}</p>

            <ul className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-ink-mute transition-colors duration-200 hover:border-hairline-strong hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
              <h2 className="caption font-medium text-ink">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="caption text-ink-mute transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="caption font-medium text-ink">Get in touch</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="caption text-ink-mute transition-colors duration-200 hover:text-ink"
                >
                  {brand.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brand.phone.replace(/[^\d+]/g, '')}`}
                  className="caption text-ink-mute transition-colors duration-200 hover:text-ink"
                >
                  {brand.phone}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="caption font-medium text-ink underline underline-offset-4"
                >
                  Book a call
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline-cool pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="caption text-ink-mute-2">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="caption text-ink-mute-2 transition-colors hover:text-ink">
              Privacy
            </a>
            <a href="#" className="caption text-ink-mute-2 transition-colors hover:text-ink">
              Terms
            </a>
            <span className="caption text-ink-mute-2">{brand.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
