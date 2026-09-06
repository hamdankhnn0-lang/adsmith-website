# Pizza Box Peshawar — Review & Reputation Dashboard

A production-ready review and reputation management platform for Pizza Box
Peshawar: a branded customer QR feedback flow, a Google Business Profile
integration, an admin analytics dashboard, AI-assisted (never automatic)
review replies, competitor benchmarking, alerts, and reporting.

**Google policy compliance is a hard requirement of this build.** The app
never auto-posts reviews, never writes review text on a customer's behalf,
never gates the Google review link by star rating, and never auto-publishes
an AI-generated reply — a human manager must always click "Approve & Reply."

---

## Tech stack

- **Frontend/Backend:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **Database:** PostgreSQL, via Prisma ORM 6
- **Auth:** NextAuth (credentials + JWT sessions), role-based access control
- **Charts:** Recharts
- **AI:** OpenAI API (optional) with a rule-based fallback so the app works with zero AI keys
- **Google:** Google Business Profile OAuth 2.0 + My Business v4 review API
- **QR codes:** `qrcode` (PNG/SVG, client-generated)
- **Exports:** CSV, Excel (`exceljs`), PDF (`jspdf` + `jspdf-autotable`)

---

## 1. Installation

```bash
npm install
```

## 2. Database setup

You need a PostgreSQL 14+ instance. Locally:

```bash
# create a database
createdb pizzabox

# copy env and fill in DATABASE_URL (see below)
cp .env.example .env
```

Run migrations and generate the Prisma client:

```bash
npm run db:migrate      # applies prisma/migrations, prompts for a name on first run
```

Seed realistic demo data (5 branches, ~200 Google reviews, private feedback,
competitors, sample alerts):

```bash
npm run db:seed
```

Demo login credentials (password is the same for all): **`PizzaBox@123`**

| Role | Email |
|---|---|
| Super Admin | `admin@pizzabox.pk` |
| Analyst | `analyst@pizzabox.pk` |
| Branch Manager (per branch) | `manager.hayatabad@pizzabox.pk`, `manager.university-town@pizzabox.pk`, `manager.shami-road@pizzabox.pk`, `manager.gulbahar@pizzabox.pk`, `manager.dha@pizzabox.pk` |

## 3. Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/pizzabox
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback
OPENAI_API_KEY=
TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)
```

Never commit real credentials — `.env*` is already git-ignored.

## 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`. The
customer-facing feedback pages are public at `/review/<branch-slug>` (e.g.
`/review/hayatabad`) and require no login.

## 5. Build for production

```bash
npm run build
npm start
```

---

## Google Business Profile API setup

The app uses OAuth 2.0 + the My Business v4 review API
(`developers.google.com/my-business/content/review-data`) to fetch and reply
to real Google reviews.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a
   project and enable:
   - **My Business Account Management API**
   - **My Business Business Information API**
   - **My Business API** (v4, review data)
2. Configure the OAuth consent screen (internal or external, as appropriate)
   with the scope `https://www.googleapis.com/auth/business.manage`.
3. Create an **OAuth 2.0 Client ID** (Web application) and add
   `http(s)://<your-domain>/api/google/oauth/callback` as an authorized
   redirect URI.
4. Put the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`,
   and set `GOOGLE_REDIRECT_URI` to match exactly.
5. **Note:** access to the My Business APIs requires your Google account/org
   to be granted API access by Google (a manual approval process for new
   projects). Until that's granted, the app runs fully in **demo mode**
   using seeded data — nothing is blocked.

### Connecting a branch

1. Log in as a Super Admin and go to **Settings**.
2. Click **Connect Google Business Profile** — you'll be redirected to
   Google's consent screen and back.
3. Click **Load Locations** to list the Google locations available on the
   connected account.
4. For each branch, select its matching Google location from the dropdown
   and click **Save**.
5. Click **Sync Now** on a connected branch to pull its reviews — this
   fetches reviews via the API, upserts them, and runs sentiment/topic
   analysis on anything new.

Tokens are AES-256-GCM encrypted before being stored (`TOKEN_ENCRYPTION_KEY`)
and are never sent to the frontend. If Google returns an expired/invalid
token, permission error, quota error, or a missing location, the UI surfaces
a specific, actionable message (see `src/lib/google/business-profile.ts` and
`src/lib/google/oauth.ts`).

## OpenAI setup (optional)

Set `OPENAI_API_KEY` to enable:
- LLM-based sentiment/topic classification (`gpt-4o-mini`) instead of the
  built-in rule-based keyword classifier
- Higher-quality AI-generated reply drafts

Without a key, everything still works — a deterministic rule-based
classifier and template replies are used instead. Either way, **no reply is
ever posted without a human clicking "Approve & Reply."**

---

## Creating branches

Branches are fully data-driven — there is no code change required to add a
6th, 20th, or 50th branch:

1. Go to **Settings → Branches → Add Branch**.
2. Fill in the name, address, target rating, and (optionally) the Google
   review URL.
3. A slug, a `/review/<slug>` feedback page, and a Google location slot are
   created automatically.

## Creating QR codes

Every active branch automatically gets a QR code on the **QR Codes** page,
pointing to `APP_URL/review/<branch-slug>`. From there you can download PNG
or SVG, print a branded card, or copy the raw URL.

---

## Architecture

```
src/
  app/
    review/[slug]/          Public customer feedback page (mobile-first)
    (admin)/                 Authenticated admin dashboard (role-gated)
      dashboard/ branches/ reviews/ feedback/ analytics/
      competitors/ ai-insights/ alerts/ reports/ qr-codes/ settings/
    api/
      feedback/               Private customer feedback (public POST, rate-limited)
      reviews/[id]/            AI draft generation + human-approved reply posting
      google/                  OAuth flow, location mapping, review sync
      competitors/ branches/ alerts/ reports/ export/
  lib/
    ai/                        Sentiment/topic classification + reply drafting
    google/                    OAuth client, Business Profile REST client, sync
    data/                      Aggregation/query layer (KPIs, branch metrics, etc.)
    alerts/engine.ts           Rule-based alert generation
    export/tabular.ts          CSV / XLSX / PDF export
    rbac.ts, crypto.ts, rate-limit.ts   Security primitives
prisma/
  schema.prisma                Full data model (see below)
  seed.ts                      Demo data generator
```

### Data model

`users`, `branches`, `google_locations`, `oauth_tokens`, `google_reviews`,
`customer_feedback`, `review_analysis`, `review_topics`, `review_responses`,
`competitors`, `competitor_locations`, `competitor_reviews`, `alerts`,
`daily_reports`, `audit_logs` — see `prisma/schema.prisma` for the full
schema with relations and indexes.

### Roles

- **Super Admin** — everything, including Google integration and branch/user management.
- **Branch Manager** — scoped to their own branch's reviews, feedback, and performance (enforced server-side on every API route, not just hidden in the UI).
- **Analyst** — reports, analytics, and competitor analysis across all branches.

---

## Security

- NextAuth credentials login with hashed passwords (bcrypt), JWT sessions, `proxy.ts` (Next.js 16's middleware) redirecting unauthenticated requests.
- Server-side RBAC on every mutating API route (`src/lib/rbac.ts`), not just UI hiding.
- Zod validation on every write endpoint.
- OAuth tokens encrypted at rest (AES-256-GCM); never exposed to the client.
- Rate limiting on the public feedback endpoint and AI draft generation.
- Audit log (`audit_logs`) for reply posting, Google connect/disconnect, branch/competitor creation.
- SQL injection is structurally prevented (Prisma, no raw SQL); XSS is prevented by React's default escaping.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) set in `next.config.ts`.

**Known limitations to harden further for a large-scale production
deployment:** the in-memory rate limiter should be swapped for a shared
store (e.g. Redis/Upstash) behind multiple server instances; NextAuth's own
`/api/auth/*` routes aren't separately rate-limited; branch-scoped exports
aren't yet filtered for Branch Manager role (they see all branches' data in
exports, though not in the dashboard UI).

---

## Demo mode

Everything in this app works before any Google or OpenAI credentials are
configured:

- `npm run db:seed` populates 5 branches, ~200 realistic Google reviews
  (varied ratings/dates/sentiment), ~80 private feedback entries, 4 demo
  competitors (clearly labeled "Demo Data"), and sample alerts.
- Sentiment/topic analysis uses a deterministic rule-based classifier.
- AI reply drafts use branded templates.
- The dashboard banner explicitly says "Running in demo mode" until a
  branch is connected to a real Google Business Profile location.

## Deployment

- **App:** Vercel (or any Node host). Set all `.env.example` variables in
  your host's environment variable settings.
- **Database:** any managed PostgreSQL (Neon, Supabase, RDS, etc.) — set
  `DATABASE_URL` and run `npx prisma migrate deploy` as part of your deploy
  step.
- Set `GOOGLE_REDIRECT_URI` and `APP_URL`/`NEXTAUTH_URL` to your real
  production domain before connecting Google Business Profile — the QR
  codes and OAuth callback both depend on `APP_URL` being correct.
