# Adsmith — marketing site

Single-page marketing site for **Adsmith**, a performance marketing and automation agency.
Built with React 18, Vite and Tailwind CSS v4.

> **Forged for Growth** — precision marketing, masterfully built.

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

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#0A0A0A` | Dark sections, body text, primary surfaces |
| `paper` / `mist` | `#FFFFFF` / `#F6F6F4` | Light and off-white editorial bands |
| `forge-500` | `#2F5BFF` | CTAs, hover states, icon accents, highlights |
| `forge-300` | `#93A9FF` | Accent type on dark backgrounds |
| `forge-900` | `#0B1F5C` | Deep navy in gradient washes |

Black and white carry the layout; blue is deliberately rationed to CTAs, hover states,
one detail per icon and the italic accent word in each headline.

**Type** — Inter for everything structural, Instrument Serif (italic) for the accent word
inside headlines. Both load from Google Fonts in `index.html` with system fallbacks.

All tokens live in the `@theme` block at the top of `src/index.css`, so re-skinning the
site is a matter of editing that one block.

## Structure

```
src/
  App.jsx                 section order for the page
  index.css               design tokens, keyframes, base styles, custom utilities
  data/site.js            every piece of copy: nav, services, industries, FAQs, footer
  components/
    Navbar.jsx            sticky bar; inverts to white type over the hero
    Hero.jsx              headline, CTAs, drifting gradient backdrop, stat row
    LogoMarquee.jsx       placeholder client wordmarks
    Services.jsx          the 7 services; n8n card spans a full row
    Industries.jsx        6 client types as an accessible tab list + detail panel
    WhyAdsmith.jsx        4 value pillars
    Process.jsx           4-step timeline (horizontal on desktop, vertical on mobile)
    Testimonials.jsx      placeholder quotes + proof stats
    AutomationSpotlight.jsx  n8n / AI workflow section with an abstract flow diagram
    Faq.jsx               3-item accordion
    Contact.jsx           contact form + scheduler placeholder
    Footer.jsx            wordmark, nav columns, socials
    ui/                   Button, Section, Eyebrow, Reveal, Wordmark, Icons
```

### Editing copy

Almost all text lives in `src/data/site.js`. Adding a service is a new entry in
`services` plus an icon in `ui/Icons.jsx`; adding an industry is a new entry in
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

## Where form submissions land

Out of the box the contact form runs in **demo mode**: it validates, shows the success
state, and sends nothing anywhere. To start receiving enquiries, set one environment
variable — `VITE_FORM_ENDPOINT` — to a URL that accepts a JSON `POST`. Copy `.env.example`
to `.env` for local development, and set the same variable in your host's dashboard for
production.

Each submission is posted as JSON:

```json
{
  "name": "Jordan Ellis",
  "email": "jordan@harbourrow.com",
  "company": "Harbour Row Hospitality",
  "service": "Meta Ads",
  "message": "Two restaurants in the city centre, weekday covers are soft.",
  "submittedAt": "2026-07-26T11:38:19.200Z",
  "page": "https://adsmith.agency/"
}
```

Three ways to receive it:

| Option | Endpoint to use | Where you read submissions | Setup |
| --- | --- | --- | --- |
| **Formspree** | `https://formspree.io/f/xxxxxxxx` | Emailed to you, plus a dashboard archive | Sign up, create a form, paste the URL. ~5 minutes, free tier covers 50/month |
| **n8n webhook** | `https://your-n8n-host/webhook/adsmith-contact` | Wherever you route it — email, WhatsApp, Google Sheet, CRM | A Webhook trigger node plus whatever you want it to do next |
| **Netlify Forms** | — | Netlify dashboard, with email notifications | Netlify-only; needs a small change to the form markup |

The n8n route is the one that matches what the site sells: the webhook can qualify the
lead, notify you instantly, and file it — the "speed-to-lead" workflow described in the
automation section.

Until an endpoint is set, the enquiry routes nowhere, so keep the email address and phone
number in `data/site.js` accurate — those work with no configuration at all.

The form also carries a hidden honeypot field. Bots fill it, real people never see it, and
those submissions are dropped silently without reaching your endpoint.

## Placeholders to replace before launch

- **Logo** — `ui/Wordmark.jsx` renders a typographic lockup. Drop in a real logo file there
  and in `public/favicon.svg`.
- **Contact details** — `brand.email` and `brand.phone` in `data/site.js` are made up.
- **Scheduler** — `BookingCard` in `Contact.jsx` is a styled stand-in. Replace it with a
  Cal.com or Calendly embed.
- **Testimonials and client logos** — placeholder names and wordmarks in `data/site.js`.
- **Stats** — the hero and proof numbers are illustrative.
- **Social links** — the footer icons point at `#`.

## Accessibility and motion

- Scroll reveals use `IntersectionObserver` and are disabled under
  `prefers-reduced-motion: reduce`, along with the drifting gradients and marquee.
- The industries tab list supports arrow-key navigation and full ARIA tab semantics.
- The mobile menu locks background scroll, closes on `Escape`, and its links leave the tab
  order when closed.
- Visible focus rings are set globally in `index.css`, and there is a skip link in the navbar.
