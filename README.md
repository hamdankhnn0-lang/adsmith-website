# Adsmith — marketing site

Single page marketing site for **Adsmith**, a performance marketing agency building
WhatsApp AI agents.
Built with React 18, Vite and Tailwind CSS v4.

> **Build. Market. Automate.** Precision marketing, masterfully built.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle locally
```

The build output in `dist/` is fully static — deploy it to Netlify, Vercel, Cloudflare
Pages or any static host with no extra configuration.

## Design system

A deep teal ink ground rather than black, so frosted panels and the jade primary sit in the
same temperature family. Warm sand carries the editorial accents and keeps the palette off
the usual dark plus one neon scheme.

| Token | Value | Used for |
| --- | --- | --- |
| `ground` / `ground-2` / `ground-3` | `#0a1315` / `#0e1b1e` / `#132528` | Page ground, alternating band, raised chrome |
| `jade-500` | `#2fcf96` | Primary CTA fill, active dots |
| `jade-400` / `jade-300` / `jade-200` | `#4ee2ac` / `#7ff0c6` / `#b6f7dd` | Accent type, gradient stops, icons on dark fills |
| `on-jade` | `#04211a` | Type on the jade fill |
| `sand` | `#eaddc6` | Warm accent, second gradient tone |
| `text` / `text-mute` / `text-faint` | `#f2f6f4` / `#9bb0aa` / `#8a9d98` | Primary, secondary and tertiary copy |

Greys are biased toward the accent hue rather than neutral, so nothing reads as an
unconsidered default. `text-faint` is set light enough to clear 4.5:1 on the *lightest*
frosted panel, not just on the base ground; darkening it breaks WCAG AA on glass.

**Surfaces.** `glass` and `glass-strong` are the two frosted treatments, both capped at a
modest blur so low end mobile does not choke. `edge-light` adds the top hairline that reads
as brushed metal. `ring-gradient` paints a 1px gradient border using two masks, and is what
every card fades in on hover.

**Type** — Bricolage Grotesque at 500 to 600 for display with tracking from `-0.035em` down
to `-0.015em`, Inter at 400 to 500 for body. Tiers are utilities (`display-1`, `display-2`,
`display-3`, `title-md`, `body-lg`, `body-md`, `caption`, `micro`) defined alongside the
tokens in the `@theme` block at the top of `src/index.css`, so re-skinning the site means
editing that one file.

**Copy style** — the site is written without hyphens or dashes of any kind. Compounds are
either spaced or reworded, and sentences break rather than lean on an em dash. Worth
preserving when adding copy.

## Performance and SEO

- **No animation library.** Scroll reveals are an `IntersectionObserver` plus one CSS
  utility, staggered through a `--reveal-delay` custom property. Dropping Framer Motion took
  the bundle from 104 kB to 64 kB gzipped.
- **Fonts load without blocking first paint**, via a preload plus a `media="print"` swap,
  with a `noscript` fallback.
- **Structured data**: `ProfessionalService` JSON-LD in `index.html` listing every service.
- `robots.txt` and `sitemap.xml` ship in `public/`, pointing at `https://adsmithsolutions.com/`,
  matching the `canonical`, `og:url` and JSON-LD entries in `index.html`.
- Privacy and Terms are plain static pages in `public/`, so there is no router and no rewrite
  rules are needed on shared hosting.

## Structure

```
src/
  App.jsx                 section order for the page
  index.css               design tokens, keyframes, base styles, custom utilities
  data/site.js            every piece of copy: nav, services, industries, FAQs, footer
  components/
    Navbar.jsx            floating glass capsule bar
    Hero.jsx              headline, CTAs, layered glass panels, stat row
    ClientStrip.jsx       named client credibility strip
    Services.jsx          the 7 services as a bento grid; WhatsApp AI is the hero tile
    WhatsAppAgent.jsx     WhatsApp AI Agent: benefits, handset mockup, capability grid
    Industries.jsx        6 client types as an accessible tab list + detail panel
    WhyAdsmith.jsx        4 value pillars
    Process.jsx           4 step timeline (horizontal on desktop, vertical on mobile)
    Testimonials.jsx      the PizzaBox quote and the real result figures
    Faq.jsx               3 item accordion
    Contact.jsx           contact form with WhatsApp handoff, booking card
    Footer.jsx            wordmark, nav columns, legal links
    ui/                   Button, Section, Eyebrow, Reveal, Wordmark
```

### Editing copy

Almost all text lives in `src/data/site.js`. Adding a service is a new entry in
`services` plus a Lucide icon in the `icons` map in `Services.jsx`; adding an industry is a new entry in
`industries` — both sections render from the array.

## Going live

The site is a static bundle, so any static host works and none of them need a server.

1. Push this branch to GitHub (already done).
2. Create a project on **Netlify**, **Vercel** or **Cloudflare Pages** and point it at this
   repo. Every host detects Vite automatically; if asked, the settings are:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add the `VITE_FORM_ENDPOINT` environment variable in the host's dashboard (see below).
4. Attach your domain in the host's DNS settings, and the free HTTPS certificate is issued
   for you.

Deploys then happen on every push to the branch. To ship a build by hand instead, run
`npm run build` and drag the `dist` folder onto Netlify Drop.

## Where enquiries land

The contact form and the booking card both work out of the box, with no backend
and no third party account.

**By default the form hands off to WhatsApp.** On submit it opens a chat to the
first number in `phones` (see `src/data/site.js`) with the name, email, business,
chosen service and message already written into the draft. The visitor presses
send. The success panel also offers a retry link and an email fallback in case
the handoff is blocked.

**The booking card** offers both WhatsApp numbers with a prefilled booking
message, plus an email link.

Two optional environment variables change that behaviour. Copy `.env.example`
to `.env` for local work and set the same values in your host's dashboard for
production.

| Variable | Effect when set |
| --- | --- |
| `VITE_FORM_ENDPOINT` | The form POSTs JSON to this URL instead of opening WhatsApp. Works with Formspree or any endpoint of your own. |
| `VITE_BOOKING_URL` | The booking card shows a single "See available times" button pointing at your Cal.com or Calendly page. |

With `VITE_FORM_ENDPOINT` set, each submission arrives as JSON:

```json
{
  "name": "Ahmed Khan",
  "email": "ahmed@karachibistro.pk",
  "company": "Karachi Bistro",
  "service": "WhatsApp AI Agent",
  "message": "Two branches, we want WhatsApp ordering and ads.",
  "submittedAt": "2026-08-03T09:14:22.410Z",
  "page": "https://adsmithsolutions.com/"
}
```

The form carries a hidden honeypot field. Bots fill it, real people never see
it, and those submissions are dropped without reaching WhatsApp or your endpoint.

## Still outstanding before launch

Everything on the page is now real. These are the loose ends:

- **The domain and mailbox.** `adsmithsolutions.com` and `enquiries@adsmithsolutions.com`
  must exist and receive mail before the site goes live, or enquiries bounce.
- **The logo** in `ui/Wordmark.jsx` is redrawn as vector from a screenshot. If the original
  SVG turns up, swap it in for an exact match. `public/logo.svg` holds the blue version for
  print and social; on screen the bar renders jade so the page carries one accent.
- **Social profiles.** The footer row was removed rather than ship dead icons. Re-add it once
  the accounts exist.
- **Legal pages** in `public/privacy.html` and `public/terms.html` are drafts written to match
  how the site actually behaves today. Worth a lawyer's eye before you take on clients abroad.
- **A scheduler**, if you want real calendar booking rather than the WhatsApp route. Set
  `VITE_BOOKING_URL`.

Every figure on the site traces to the PizzaBox engagement. If those numbers change, they live
in `proofStats` and `industries` in `src/data/site.js`.

## Accessibility and motion

- Scroll reveals use `IntersectionObserver` and are disabled under
  `prefers-reduced-motion: reduce`.
- Verified against the rendered page: one `h1`, no heading level jumps, every control has an
  accessible name, every field has a label, and zero colour contrast failures at WCAG AA.
- The industries tab list supports arrow-key navigation and full ARIA tab semantics.
- The mobile menu locks background scroll, closes on `Escape`, and its links leave the tab
  order when closed.
- Visible focus rings are set globally in `index.css`, and there is a skip link in the navbar.
