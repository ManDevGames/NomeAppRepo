# Relationship Pattern Assessment™

A standalone Next.js 14 (App Router) application: a mobile-first relationship
self-reflection assessment with lead capture, a personalised result page, a
manual WhatsApp CTA, and a Supabase-backed admin dashboard.

```
Landing → Assessment (one question/screen) → Lead capture → Result → WhatsApp CTA
Admin login → Dashboard → Lead detail → CSV export
```

This is a separate deployable app from any other site — it's meant to be
linked to from a main website, Instagram, WhatsApp broadcasts, or ads via
UTM-tagged links (see **UTM examples** below), typically on its own
subdomain (e.g. `pattern.mindurmind.org.in`).

---

## ⚠️ Content status — read this first

**The 22 questions in `data/questions.json` and the six pattern write-ups in
`data/patterns.json` are clearly-marked seed/demo content**, not final,
approved, or clinically validated copy. Both files carry an `_meta` block
saying so. Replace them with the content owner's final questions and scoring
weights before running this in production — see **Replacing question/pattern
content** below. The scoring *engine* (`lib/scoring.ts`) is production-ready
and independent of the content; only the JSON needs to change.

---

## Tech stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS
- Supabase (Postgres + Auth), via `@supabase/ssr` and `@supabase/supabase-js`
- Vercel + Vercel Analytics
- Plain `wa.me` WhatsApp deep links (no WhatsApp Business API, no automation)
- Vitest for the scoring/validation unit tests

No AI, no chatbot, no custom auth, no CMS. On purpose.

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values, see below
npm run dev
```

The app runs at `http://localhost:3000`.

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this out of
     the browser — it's only read in server-side code, see
     `lib/supabase/admin.ts`)
3. Run the migrations in `supabase/migrations/` **in order**, either via the
   Supabase SQL editor (paste and run each file) or the CLI:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```
   - `0001_init.sql` creates the `pattern_id` enum and the `leads`,
     `responses`, `scores` tables, indexes, and enables RLS with **no**
     policies for `anon`/`authenticated` — all access goes through the
     service-role key server-side. See the comments in that file for why.
   - `0002_submit_assessment_rpc.sql` creates the `submit_assessment(...)`
     Postgres function used to write a lead + its responses + its scores
     atomically, and locks its `EXECUTE` grant down to `service_role` only.

## 3. Environment variables

See `.env.example`. Required:

| Variable | Where it's used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | public, safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | public, safe to expose, constrained by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **never** prefix with `NEXT_PUBLIC_`, never log it, never send it to the browser |
| `WHATSAPP_BUSINESS_NUMBER` | server only (`lib/whatsapp.ts`) | digits only with country code, e.g. `91XXXXXXXXXX`, no `+` |
| `NEXT_PUBLIC_SITE_URL` | metadata/SEO, result emails | your production URL, e.g. `https://pattern.mindurmind.org.in` |
| `RESEND_API_KEY` | server only (`lib/email.ts`) | optional — emails the result after submission; app works without it, it just won't email |
| `RESEND_FROM_EMAIL` | server only (`lib/email.ts`) | optional — must be on a domain verified in Resend; falls back to a shared test sender if unset |

## 4. Creating an admin user

There's no public sign-up screen — that's deliberate, `/admin/login` is the
only door, and anyone who successfully signs in is treated as an admin. In
the Supabase dashboard: **Authentication → Users → Add user**, set an email
and password. That's it — sign in at `/admin/login` with those credentials.

## 5. Running locally

```bash
npm run dev        # dev server
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm run test        # vitest run — scoring + validation unit tests
npm run build       # production build
```

## 6. Deployment — GitHub → Vercel → Supabase

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo. Framework preset
   auto-detects Next.js.
3. Add the environment variables from `.env.example` in **Project Settings
   → Environment Variables** (Production **and** Preview).
4. Deploy.
5. Run the Supabase migrations against your **production** Supabase project
   if you haven't already (step 2 above).

## 7. Custom domain setup

The intended production domain is something like
`pattern.mindurmind.org.in`. It is **not** configured by default — you need
to:

1. In Vercel: **Project → Settings → Domains** → add
   `pattern.mindurmind.org.in`.
2. Vercel will show you a CNAME target (typically `cname.vercel-dns.com`).
3. In your DNS provider for `mindurmind.org.in`, add a `CNAME` record:
   `pattern` → the target Vercel gives you.
4. Wait for DNS propagation and certificate issuance (usually a few
   minutes, can take longer).
5. Update `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

## 8. WhatsApp configuration

There's no API integration — the result page's CTA is a plain `wa.me` link
built server-side in `lib/whatsapp.ts` from `WHATSAPP_BUSINESS_NUMBER`, with
the user's primary pattern name pre-filled into the message text. The user
must tap the button and send the message themselves; nothing is sent
automatically.

## 9. Replacing question/pattern content

When the content owner delivers final content:

1. Replace `data/questions.json` — keep the same shape (`id`, `text`,
   `options[]` with `key`, `text`, `scores`). `scores` keys must be one of
   the six `PatternId` values in `types/index.ts`
   (`abandonment | overthinking | selfWorth | trustProtection |
   peoplePleasing | repeatingPattern`) — don't invent new pattern names.
2. Replace `data/patterns.json` similarly — same shape (`id`, `name`,
   `headline`, `shortDescription`, `experiencePoints[]`, `triggers[]`,
   `cycle`).
3. Delete the `_meta` block from both files once the content is approved,
   so it's obvious in a diff that seed content has been replaced.
4. No component or database changes are needed — the scoring engine and UI
   read the JSON at runtime import time.

## 10. UTM examples

```
https://pattern.mindurmind.org.in/?utm_source=website&utm_medium=banner
https://pattern.mindurmind.org.in/?utm_source=instagram&utm_medium=bio
https://pattern.mindurmind.org.in/?utm_source=whatsapp&utm_medium=broadcast
https://pattern.mindurmind.org.in/?utm_source=meta_ads&utm_campaign=relationship_launch
```

UTM params are captured client-side on first page load (first-touch,
persisted to `sessionStorage`, see `lib/utm.ts`) and stored on the lead row
at submission.

---

## Architecture notes

- **Scoring never trusts the browser.** The client submits raw answers
  (`{questionId, optionKey}` pairs); `lib/scoring.ts` computes pattern
  scores server-side inside `/api/submit-assessment`, after
  `lib/validation.ts` has confirmed every answer references a real question
  and a real option. Tie-breaking is deterministic — see the doc comment on
  `highestScoring` in `lib/scoring.ts`.
- **Three Supabase clients**, per Supabase's current Next.js guidance:
  - `lib/supabase/client.ts` — browser client (anon key), used only by the
    admin login form.
  - `lib/supabase/server.ts` — server client bound to request cookies (anon
    key, subject to RLS), used to check "is someone signed in right now."
  - `lib/supabase/admin.ts` — privileged client (service-role key, bypasses
    RLS), used only after a caller is already verified.
- **RLS is intentionally policy-free.** `leads`, `responses`, and `scores`
  have RLS enabled with zero policies for `anon`/`authenticated`, so neither
  the public nor a signed-in admin's browser session can query them
  directly — every read and write goes through server-side code using the
  service-role key. Admin pages are Server Components that check the
  session first, then read data server-side.
- **Atomic writes.** `submit_assessment(...)` (a Postgres function) inserts
  the lead, its responses, and its scores in one call — a failure partway
  through rolls back the whole thing, so there's no way to end up with a
  lead row and no responses/scores.
- **Result page privacy.** `/assessment/result/[leadId]` only ever selects
  `name`, `primary_pattern`, `secondary_pattern`, `assessment_completed` —
  never email or WhatsApp number — and is `noindex`.
- **Duplicate submissions.** Same normalized WhatsApp number within 24 hours
  is rejected server-side with a friendly message, before any scoring or
  writes happen.

## What's tested vs. manually reviewed

`npm run test` runs automated unit tests for the two highest-risk, pure-logic
pieces: `lib/scoring.ts` (score accumulation, primary/secondary selection,
tie determinism) and `lib/validation.ts` (name/email/WhatsApp/consent/answer
validation, including malformed and adversarial input). The submission API
route, RLS behaviour, and the full click-through flow were verified by
careful manual code review rather than automated integration tests — wiring
up a mocked Supabase client and a browser-driven E2E suite was judged
disproportionate for this MVP pass. If this grows past MVP, that's the next
testing investment worth making.

## Known limitations / not in this MVP

Per the product decisions this was built against: no personal dashboard, no
journaling, no audio practices, no automated WhatsApp messaging, no AI. The
architecture (typed content contracts, a standalone scoring lib, a clean
Supabase schema) is meant to make adding those later straightforward without
a rewrite — but none of them are implemented now.
