# mazel.rose

A bespoke wedding website designed as an animated digital invitation — romantic, rich, and timeless.

Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Sanity CMS.

## Overview

Guests can view schedule, travel, registry, wedding party, gallery, things to do, FAQs, and submit an RSVP.

Content editors manage the site through the built-in Studio at `/studio`. Design and layout stay in code.

Owner-friendly guide: [`docs/website-owner-guide.md`](docs/website-owner-guide.md)  
Studio setup (env, first login): [`docs/studio-setup.md`](docs/studio-setup.md)

## What Studio is

`/studio` is a signed-in editing room that uses this site’s design system. After signing in, Owners, Editors, and Reviewers can review pages, leave comments, edit text/images/links/SEO, save drafts, preview, publish, and (Owners) restore previous versions. Published changes update the live site without a new Git commit or Vercel deploy.

## Local setup

```bash
npm install
cp .env.example .env.local
```

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) (dataset: `production`).
2. Add these values to `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `SANITY_API_READ_TOKEN` (Viewer token)
   - `SANITY_API_WRITE_TOKEN` (Editor/Admin token — required for seed **and** `/studio`)
   - `SANITY_REVALIDATE_SECRET` (random string)
3. Add CORS origins in Sanity Manage → API → CORS Origins:
   - `http://localhost:3000` (Allow credentials: **on**)
   - your production URL (Allow credentials: **on**)
4. Seed content:

```bash
npm run sanity:seed
```

5. Start the app:

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

Without Sanity env vars, the site still builds and serves local fallback content from `content/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run sanity:seed` | Idempotent Sanity content migration |
| `npm run studio:bootstrap` | Create the first `/studio` Owner from env vars |

## Environment variables

See `.env.example`.

### Sanity

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version date |
| `SANITY_API_READ_TOKEN` | Server read token for published + draft preview |
| `SANITY_API_WRITE_TOKEN` | Write token for seed **and** `/studio` (keep this; do not revoke after seed) |
| `SANITY_REVALIDATE_SECRET` | Webhook signature secret |

Never expose write/revalidate secrets through `NEXT_PUBLIC_` variables.

### Site / RSVP / privacy

Also supported: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_NOINDEX`, RSVP provider vars, optional `ENABLE_SITE_PASSWORD` / `SITE_PASSWORD`, and Studio vars (`STUDIO_SESSION_SECRET`, bootstrap owner email/name/password). See [`docs/studio-setup.md`](docs/studio-setup.md).

## Content architecture

Sanity is the source of truth after migration.

`content/*.ts` remains only as:

- seed source for `npm run sanity:seed`
- offline / misconfigured-Sanity fallback

Editable areas live under Studio sidebar labels such as Wedding Details, Home Page, Schedule, Travel, Registry, Wedding Party, Gallery, Things To Do, FAQs, and RSVP Form Settings.

## Migration command

```bash
SANITY_API_WRITE_TOKEN=... \
NEXT_PUBLIC_SANITY_PROJECT_ID=... \
NEXT_PUBLIC_SANITY_DATASET=production \
npm run sanity:seed
```

The script is idempotent: singleton IDs and keyed documents are upserted, not duplicated.

Images are seeded as empty fields so high-quality originals can be uploaded in Studio. Until then, the frontend gracefully falls back to the previous Unsplash placeholders where needed.

## Draft preview workflow

`/studio` shows the real website beside the form. Saving a draft (including autosave) reloads that preview via `/api/studio/preview` in Draft Mode for signed-in Studio users.

Public visitors never receive draft content.

## Publishing workflow

1. Edit in Studio
2. Confirm the live page preview
3. Publish
4. Sanity Live + webhook revalidation refresh the public site

## Revalidation webhook

In Sanity Manage → API → Webhooks:

- **URL:** `https://YOUR_DOMAIN/api/revalidate`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:**

```
_type in [
  "weddingDetails","homePage","scheduleEvent","travelOverview",
  "airport","hotel","registryIntro","registryLink","weddingPartyMember",
  "gallerySettings","galleryPhoto","localGuideIntro","activity",
  "faqPage","faqItem","rsvpFormSettings"
]
```

- **Projection:** `{_type,_id}`
- **Secret:** same as `SANITY_REVALIDATE_SECRET`
- **HTTP method:** POST

## Inviting the website owner

Day-to-day editing uses `/studio`, not a Sanity invite.

1. Complete [`docs/studio-setup.md`](docs/studio-setup.md) (write token, session secret, bootstrap).
2. Sign in at `/studio/login` as Owner.
3. Add Editors and Reviewers at `/studio/team`.
4. Share `/studio` and [`docs/website-owner-guide.md`](docs/website-owner-guide.md).

## Vercel setup

1. Deploy the Next.js app
2. Add all env vars from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain
4. Configure the revalidation webhook
5. Bootstrap Studio (`npm run studio:bootstrap`) and add people at `/studio/team`
6. Run `npm run sanity:seed` once against production dataset (locally with production credentials, or via a one-off secure job)

## RSVP data remains outside Sanity

Sanity controls only RSVP **form settings** (headings, meal options, open/closed state).

Guest responses (names, emails, attendance, dietary needs, messages) go through `/api/rsvp` and the configured provider (`local`, Airtable, or Supabase). Do not store private guest records in publicly queried Sanity documents.

## Password protection

Optional gate via `proxy.ts`:

```env
ENABLE_SITE_PASSWORD=true
SITE_PASSWORD=your-shared-password
```

`/studio`, draft-mode routes, and revalidate remain reachable for editors/webhooks.

## Troubleshooting

- **`/studio` login fails:** confirm `STUDIO_SESSION_SECRET` and `SANITY_API_WRITE_TOKEN` are set. See [`docs/studio-setup.md`](docs/studio-setup.md).
- **Draft preview fails:** confirm `SANITY_API_READ_TOKEN` has Viewer access.
- **Publish does not update site:** confirm webhook secret and `/api/revalidate` logs.
- **Missing images after seed:** upload originals in Studio; fallbacks keep layout intact meanwhile.
- **Build without Sanity IDs:** site uses local fallbacks automatically.

## Design direction

**Romantic. Rich. Timeless.**

Palette: peacock teal, burgundy, ivory/parchment, sage, sterling rose, antique brass.

Typography: Cormorant Garamond, Manrope, Great Vibes (sparingly).
