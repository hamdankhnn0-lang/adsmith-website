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

`dist/` holds everything that gets deployed: the static site, plus `contact.php` and
`.htaccess`. See **Going live** below for the upload steps.

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
    Contact.jsx           contact form posting to contact.php, booking card
    Footer.jsx            wordmark, nav columns, legal links
    ui/                   Button, Section, Eyebrow, Reveal, Wordmark, BrandMarks,
                          ScrollProgress

public/
  contact.php             form endpoint: validates, blocks spam, emails the enquiry
  .htaccess               https, canonical host, caching, security headers
  privacy.html            standalone legal pages, no router needed
  terms.html
  logo.svg                blue lockup for print and social
```

### Editing copy

Almost all text lives in `src/data/site.js`. Adding a service is a new entry in
`services` plus a Lucide icon in the `icons` map in `Services.jsx`; adding an industry is a new entry in
`industries` — both sections render from the array.

## Going live on HostBreak (or any cPanel host)

The site is static plus one PHP file, which is exactly what shared hosting is good at.

**1. Set up mail delivery first.** Enquiries land in `adsmithenquiries@gmail.com`, an
ordinary free Gmail inbox, so there is nothing to create there. There is one thing to create
in cPanel though: under Email Accounts, add `noreply@adsmithsolutions.com`. It needs no
inbox and nobody ever logs into it; it exists purely so the domain has a legitimate address
to send *from*, which is what stops the host rejecting the send as spoofing. Skip it and
`contact.php` sends nothing.

**Expect the first few enquiries to land in Gmail's Spam folder**, not Inbox. Shared hosting
IPs have no sending history with Google, and Gmail is unforgiving of that regardless of how
correct the message is. Open the first one and mark it "Not spam" as soon as it arrives;
that teaches Gmail to trust the sender, and the ones after tend to land properly. If nothing
arrives at all, including in Spam, that is a different problem: read
**Where enquiries land** further down for the fallback log that catches it either way.

**2. Build.**

```bash
npm install
npm run build
```

**3. Upload.** Put the *contents* of `dist/` into `public_html`, not the folder itself. That
includes `.htaccess` and `contact.php`, both of which are easy to miss because File Manager
hides dotfiles until you enable "Show Hidden Files" in its settings.

**4. Point the domain.** The nameservers are already set to HostBreak's, so the domain should
resolve once it propagates. Then issue the free SSL certificate in cPanel under SSL/TLS
Status, and confirm `https://adsmithsolutions.com` loads. The `.htaccess` forces https and
strips the `www.` prefix, so there is one canonical address.

**5. Send yourself a test enquiry** through the live form and confirm it lands in the
`enquiries@` inbox. Check the spam folder on the first one.

### If the form reports an error

`contact.php` writes any enquiry it could not email to `.enquiries.log` next to itself, so
nothing is lost while mail is being sorted out. `.htaccess` blocks that file from the web.
Read it over FTP or File Manager. The usual causes are the mailbox not existing yet, or the
host requiring SMTP authentication rather than `mail()`.

### Redeploying

Run `npm run build` again and re-upload the contents of `dist/`. Asset filenames are
fingerprinted and `.htaccess` tells browsers never to cache the HTML, so visitors pick up a
new build immediately rather than seeing a stale page.

### Other hosts

Netlify, Vercel and Cloudflare Pages all work too, but none of them run PHP. On those, set
`VITE_FORM_ENDPOINT` to a form service (Formspree or similar) and the form posts there
instead. Build command `npm run build`, publish directory `dist`.

## Where enquiries land

The form posts to **`/contact.php`**, which ships in `public/`. It validates the submission,
drops anything that trips the honeypot, guards against header injection, and emails the
enquiry to `adsmithenquiries@gmail.com`. `Reply-To` is set to whoever filled the form in,
so replying goes straight back to them, not to the Gmail account.

That address is a free Gmail inbox rather than a mailbox on the domain, which is cheaper but
means Google has no reason yet to trust mail arriving from a shared host. The first few
enquiries commonly land in Spam. Marking one "Not spam" fixes it for the ones after. If a
paid mailbox on the domain is set up later, change the recipient by editing `TO_ADDRESS` in
`public/contact.php`; mail sent from and to the same domain does not carry this problem.

**When the post fails**, the form does not simply give up. The error panel keeps everything
typed and offers two working routes out: a WhatsApp link with the whole enquiry already
composed, and a `mailto:` with the same. There is also a permanent "send it on WhatsApp"
link beside the submit button for anyone who prefers it.

Two optional environment variables. Copy `.env.example` to `.env` for local work.

| Variable | Effect when set |
| --- | --- |
| `VITE_FORM_ENDPOINT` | Post somewhere other than `/contact.php`. Needed on hosts without PHP. |
| `VITE_BOOKING_URL` | The booking card shows a single "See available times" button pointing at your Cal.com or Calendly page. |

Submissions arrive as JSON:

```json
{
  "name": "Ahmed Khan",
  "email": "ahmed@karachibistro.pk",
  "company": "Karachi Bistro",
  "services": ["WhatsApp AI Agent", "Meta Ads"],
  "message": "Two branches in Peshawar, we want WhatsApp ordering and ads.",
  "submittedAt": "2026-08-04T07:21:16.925Z",
  "page": "https://adsmithsolutions.com/"
}
```

## Still outstanding before launch

Everything on the page is now real. These are the loose ends:

- **The domain.** `adsmithsolutions.com` needs to exist and resolve before the site goes
  live. Enquiries themselves go to `adsmithenquiries@gmail.com`, which already works; check
  its Spam folder for the first few, per the note in Going Live above.
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
