# mazel.rose — Launch Checklist

Status as of 2026-07-21. The codebase is feature-complete: typecheck, lint, and
production build all pass. Everything remaining is provisioning, credentials,
and real content. This doc lists exactly what is needed, who does it, and where
each item comes from.

Legend: ☐ open · ☑ done

---

## 1. Already handled — no action needed

- ☑ Codebase builds green (all 22 routes, typecheck + lint clean)
- ☑ Vercel account access — already connected to Claude's session, so **no
  Vercel tokens are needed** from you. Claude can create the project, set
  environment variables, and deploy.
- ☑ GitHub repo access (`j-u-s-t-j-o-s-h/mazel_rose`)
- ☑ `SANITY_REVALIDATE_SECRET` and other random secrets — Claude generates
  these at deploy time and sets them in Vercel. Your only task is pasting the
  revalidate secret into the Sanity webhook form when Claude hands it to you
  (step 4).

---

## 2. Decisions needed from you (no accounts required, just answers)

| # | Decision | Chosen (2026-07-21) |
|---|----------|---------------------|
| D1 | RSVP storage backend | ☑ **Airtable** (free plan: 1,000 records/base — ample for RSVPs) |
| D2 | Vercel team | ☑ **Iron Eagle Studio** |
| D3 | Domain | ☑ **mazel-rose.vercel.app** for now; custom domain may come later |
| D4 | Search-engine visibility | ☑ Keep `NEXT_PUBLIC_NOINDEX=true` |
| D5 | Site-wide password gate | ☐ Off to start; can enable any time with `ENABLE_SITE_PASSWORD=true` + a shared password |

---

## 3. Credentials needed from you

### A. Sanity (required — powers the `/admin` editing experience)

Sanity has no CLI/API path for account creation, so these steps happen in your
browser at [sanity.io/manage](https://www.sanity.io/manage) (sign up free with
Google/GitHub if you don't have an account):

1. ☑ **Create a project** — done (project ID below). Confirm the dataset is
   named `production`.
2. ☑ **Project ID**: `lsjlhtb8` → `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. ☑ **Read token** — received; verified working against the live dataset.
4. ☑ **Write token** — received; the one-time content seed has been run
   (all singleton + keyed documents upserted). **Revoke this token** in
   Manage → API → Tokens once Studio editing is confirmed working.
5. ☐ **CORS origins** — Manage → API → **CORS Origins → Add CORS origin**:
   - `http://localhost:3000` — Allow credentials **ON**
   - the production URL (once known, e.g. `https://mazel-rose.vercel.app`) —
     Allow credentials **ON**

### B. Airtable

1. ☑ **Base + table created** — base "Wedding RSVPs", table `RSVPs` with all
   12 fields, write-tested end to end (test record created and deleted).
2. ☐ **Personal access token** — [airtable.com/create/tokens](https://airtable.com/create/tokens),
   scope `data.records:write` (+ `data.records:read`), access limited to the
   "Wedding RSVPs" base. → `AIRTABLE_API_KEY`. (The deployed site calls the
   Airtable API directly, so it needs its own token — Claude's session access
   doesn't transfer.) If offered an expiration date, set ~Dec 2027.
3. ☑ **Base ID**: `appj5xF2RpxsgwJD2` → `AIRTABLE_BASE_ID`
4. `AIRTABLE_TABLE_NAME` = `RSVPs` (already the default in `.env.example`).

### C. Supabase (only if D1 = Supabase instead)

1. ☐ Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. ☐ **Project URL** and **service_role key** — Project Settings → API.
   → `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
3. ☐ Create the `rsvps` table (Claude will supply the exact SQL for the
   submission shape when this option is chosen).

---

## 4. Your two dashboard tasks after Claude deploys

1. ☐ **Revalidation webhook** — Sanity Manage → API → **Webhooks → Create
   webhook**. Claude will hand you the exact values (URL
   `https://YOUR_DOMAIN/api/revalidate`, dataset `production`, trigger on
   create/update/delete, the document-type filter from the README, projection
   `{_type,_id}`, HTTP POST, and the generated secret).
2. ☐ **Invite the website owner** — Sanity Manage → Project → **Members →
   Invite**, role **Editor**. Then share the `/admin` URL and
   [`docs/website-owner-guide.md`](./website-owner-guide.md).

---

## 5. Deployment status

1. ☑ Sanity seed run against `lsjlhtb8/production` — all documents upserted
2. ☑ Production build verified with live Sanity credentials (all 22 routes)
3. ☑ Runtime smoke test passed locally: home + `/admin` return 200, and a
   valid RSVP submission correctly reaches the Airtable provider (blocked only
   on the missing `AIRTABLE_API_KEY`)
4. ☐ **Vercel deploy — via GitHub import (owner action, ~3 min).** Claude's
   Vercel session tooling cannot upload this repo or manage env vars, so the
   project is created once by importing the GitHub repo at
   [vercel.com/new](https://vercel.com/new) under the Iron Eagle Studio team
   (project name `mazel-rose`, all build settings default) and pasting the
   env block Claude provides in chat. After this one-time import, every push
   to `main` auto-deploys.
5. ☐ Post-deploy verification (Claude): all routes, `/admin`, draft preview,
   revalidation webhook, end-to-end RSVP into Airtable
6. ☐ Hand over webhook values (step 4.1) and confirm publish → live-site
   refresh works

---

## 6. Real content punch list (after seed — edited in Studio, no code)

There are 68 placeholder markers across the fallback content. All of it becomes
editable at `/admin` after the seed:

- ☐ Couple names + monogram initials (currently "Mazel & Rose")
- ☐ Wedding date/time (currently Oct 18, 2027) and RSVP deadline
- ☐ Venue name, address, map link (currently "The Willow Estate", Aiken SC)
- ☐ Contact email (currently `hello@mazel.rose`)
- ☐ Schedule events (times, venues, dress codes)
- ☐ Travel: airports, hotels/room blocks, directions
- ☐ Registry links (currently placeholder retailers)
- ☐ Wedding party members + portrait photos
- ☐ Gallery photos (currently Unsplash placeholders; upload originals)
- ☐ Things To Do activities
- ☐ FAQs
- ☐ RSVP form settings: meal options, event list, open/closed state

---

## Known quirks (for whoever works on this next)

- **Leave `RSVP_SECRET` blank.** The API route rejects submissions lacking an
  `x-rsvp-secret` header when this is set, but the RSVP form never sends that
  header — enabling it breaks all RSVPs. The honeypot field and per-IP rate
  limiting already provide spam protection. (Fixable in code later if desired.)
- `content/*.ts` stays in the repo after launch as the seed source and as an
  automatic fallback if Sanity is ever unreachable or misconfigured.
- The write token is only needed for seeding — revoke it in Sanity Manage after
  step 5.3 for least privilege.

## Token lifetimes

- **Sanity tokens have no expiration setting** — they live until revoked.
  The read token must stay valid indefinitely (the live site uses it daily).
  The write token is revoked manually right after the one-time seed.
- **Airtable token**: used on every RSVP submission, so it must outlive the
  RSVP deadline. If the token screen offers an expiration date, set it a
  couple of months after the wedding; if it expires early, RSVPs fail
  silently. Revoke it after the wedding once responses are no longer coming in.
