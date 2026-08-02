# Adsmith Brand Identity System

Twelve logo concepts, a color and type system, spacing rules, and usage guidance for **Adsmith**, a performance marketing agency (Meta / Google / TikTok Ads, SEO, AI automation, and web development).

Open **[`gallery.html`](./gallery.html)** in a browser for the full, illustrated brand book — every concept shown on light and dark ground, the palette, typography specimen, clear-space diagram, do/don't examples, and applied usage mockups (browser tab, app icon, business card, product nav bar, social avatar).

## Files

```
brand/
├── gallery.html                      Full illustrated brand book (open this first)
├── logos/                            12 concepts, ink-on-light (default) versions
│   ├── 01-wordmark-solid.svg
│   ├── 02-wordmark-twotone.svg
│   ├── 03-monogram-badge.svg
│   ├── 04-monogram-outline.svg
│   ├── 05-icon-wordmark-peak.svg     ← recommended primary lockup
│   ├── 06-icon-wordmark-focus.svg
│   ├── 07-stacked-peak.svg
│   ├── 08-stacked-spark.svg
│   ├── 09-badge-circular-monogram.svg
│   ├── 10-badge-circular-focus.svg
│   ├── 11-favicon-peak.svg           ← recommended favicon
│   ├── 12-favicon-monogram.svg
│   └── reverse/                      White-ink versions for dark backgrounds
│       ├── 01-wordmark-solid-reverse.svg
│       ├── 02-wordmark-twotone-reverse.svg
│       ├── 04-monogram-outline-reverse.svg
│       ├── 05-icon-wordmark-peak-reverse.svg
│       ├── 06-icon-wordmark-focus-reverse.svg
│       ├── 07-stacked-peak-reverse.svg
│       └── 08-stacked-spark-reverse.svg
└── README.md                         This file
```

The circular badges (09, 10) and favicons (11, 12) already carry their own ink background, so the same file works on either light or dark pages. The monogram badge (03) is the same — self-contained, no reverse needed.

All twelve are hand-built vector geometry — straight edges, arcs, and Bézier strokes only. No stock icons, no clip art. Every shape is a plain `<path>`, `<rect>`, `<circle>` or `<polygon>` with literal fill/stroke colors, so they open cleanly in Illustrator, Figma, or any text editor for further edits.

## The two mark families

- **Peak** — a flat-topped wedge (reads as the letter A) crossed by a blue bar that doubles as an ascent/performance tick. Used in concepts 01, 05, 07, 11.
- **AS Monogram** — a solid A locked against a fluid, hand-drawn S stroke. Used in concepts 03, 04, 09, 12.
- **Focus** — a ring and a fixed center point, standing for precision ad targeting. Used in concepts 06, 10.
- **Spark** — an asymmetric four-point mark, a nod to craft and AI automation. Used in concept 08.

## Color palette

| Token | Hex | Use |
|---|---|---|
| Ink | `#111111` | Primary type, mark color on light ground, fill for dark surfaces |
| Paper | `#FFFFFF` | Reverse mark color on ink surfaces, base surface for print/UI |
| Accent Blue | `#2563EB` | The one signature detail per lockup; primary actions in product |

## Typography

**Plus Jakarta Sans**, used end to end — wordmark, product UI, and marketing — differentiated only by weight and size:

- Display / H1 — 56–64px, weight 800, −2% tracking
- H2 — 32–40px, weight 800, −1.5% tracking
- H3 — 20–24px, weight 700, −1% tracking
- Body — 16–17px, weight 400–500, 0% tracking, 1.6 line-height
- Caption — 12–13px, weight 600, +2% tracking
- Eyebrow / label — 11–12px, weight 700, +8–9% tracking, uppercase
- Wordmark tracking — −4% to −5%, tighter than body copy

## Spacing & minimum size

Clear space on every side of the mark = **X**, the height of the accent bar inside the icon.

| Context | Minimum size |
|---|---|
| Favicon / browser tab | 16 px |
| App icon, social avatar | 32 px |
| Icon + Wordmark, digital | 24 px icon height |
| Icon + Wordmark, print | 18 mm wide |
| Wordmark only, print | 22 mm wide |
| App icon artwork (master) | 1024 × 1024 px |

Don't: stretch or distort · recolor off-palette · add drop shadow or bevel · rotate the mark · place on busy imagery · crowd or duplicate the mark.

## Recommendation

**Go with the Peak family as the primary system**: concept **05, Icon + Wordmark — Peak**, paired with its stacked (07), wordmark (01/02), and favicon (11) companions. Keep the **AS Monogram Seal** (03/09) in reserve for avatars and stamps where a contained badge, not a wordmark, is the format.

Why Peak: the wedge reads as the letter A — the first letter of Adsmith — so the mark and the name reinforce each other on sight. The crossbar doubles as an ascent tick (performance going up) without depicting any single ad platform, so it won't age out as channels change. Built from two shapes only, it survives at a 16px favicon where most agency marks collapse into a smudge, and it scales confidently from an enterprise pitch deck down to a restaurant window decal.

See `gallery.html` for the full rationale and every concept side by side.
