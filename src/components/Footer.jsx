import Wordmark from './ui/Wordmark.jsx'
import { brand, footerColumns, phones } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ground-2">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark />
            <p className="mt-5 max-w-[32ch] body-md text-text-mute">
              {brand.promise} Ads, websites and WhatsApp AI for businesses that care how they
              show up.
            </p>
            <p className="mt-5 caption text-text-faint">{brand.location}</p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
              <h2 className="micro text-text-faint">{column.heading}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="body-md text-text-mute transition-colors duration-300 hover:text-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="micro text-text-faint">Get in touch</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="body-md break-words text-text-mute transition-colors duration-300 hover:text-text"
                >
                  {brand.email}
                </a>
              </li>
              {phones.map((p) => (
                <li key={p.wa}>
                  <a
                    href={`https://wa.me/${p.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body-md text-text-mute transition-colors duration-300 hover:text-text"
                  >
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="body-md font-medium text-jade-300 transition-colors duration-300 hover:text-text"
                >
                  Book a call
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="caption text-text-faint">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <span className="micro text-text-faint">{brand.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
