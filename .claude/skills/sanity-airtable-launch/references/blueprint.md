# Blueprint: Sanity + Airtable + Vercel Launch Playbook

Generalized from the mazel.rose launch (2026-07-21). Substitute your
project's values for the ALL_CAPS placeholders.

## Contents

1. [Health check & checklist file](#1-health-check--checklist-file)
2. [Sanity provisioning](#2-sanity-provisioning)
3. [Airtable provisioning](#3-airtable-provisioning)
4. [Secrets](#4-secrets)
5. [Seed & local verification](#5-seed--local-verification)
6. [Vercel deploy](#6-vercel-deploy)
7. [Post-deploy verification](#7-post-deploy-verification)
8. [Sanity revalidation webhook](#8-sanity-revalidation-webhook)
9. [Owner onboarding](#9-owner-onboarding)
10. [Porting to a new codebase](#10-porting-to-a-new-codebase)

---

## 1. Health check & checklist file

```bash
npm install && npm run typecheck && npm run lint && npm run build
```

All three must pass before provisioning. Then create
`docs/launch-checklist.md` in the repo with sections: decisions, credentials
needed (with exact where-to-get-it steps), deployment status, content punch
list, known quirks, token lifetimes. Commit and push after every status
change. Never commit secret values to the checklist — record *that* a token
was received, not the token.

## 2. Sanity provisioning

User does this in a browser at sanity.io/manage (no API exists for account
or project creation):

1. Create project, dataset `production`, visibility public (published
   content only; drafts stay private).
2. Copy the **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. API → Tokens → Add API token, name `read`, permissions **Viewer**
   → `SANITY_API_READ_TOKEN` (shown once; lives forever until revoked).
4. Add API token, name `seed`, permissions **Editor**
   → `SANITY_API_WRITE_TOKEN` (revoke after seeding).
5. API → CORS Origins: add `http://localhost:3000` and the production URL,
   both with **Allow credentials ON**. Without this, `/admin` sign-in loops.

Verify the read token immediately (don't wait for deploy):

```bash
curl -sS -H "Authorization: Bearer $SANITY_API_READ_TOKEN" \
  "https://PROJECT_ID.api.sanity.io/v2026-02-01/data/query/production?query=*%5B0%5D"
```

## 3. Airtable provisioning

If Airtable MCP tools are connected, do it all yourself: find or create the
base, create the table, then **create each field with the exact names and
types the provider code writes** (open the provider adapter and copy the
field names from the `fields:` object). Types: `email` for email,
`multilineText` for long/JSON-ish fields, `singleLineText` otherwise.
Finish with a write test: create a record via API, confirm the values, delete
it.

If no MCP access, give the user a click-by-click: create base → rename table
→ add fields from the exact-name table → delete leftover default fields.

The deployed site always needs its own **personal access token** regardless
of MCP access (create at airtable.com/create/tokens — NOT the deprecated
/create/apikey page): scopes `data.records:read` + `data.records:write`,
access restricted to the one base, expiration past the form deadline.
Base ID is the `appXXXXXXXXXXXXXX` segment of the base URL.

## 4. Secrets

```bash
openssl rand -hex 32   # SANITY_REVALIDATE_SECRET
```

Generate; give to the user only where they must paste it (Sanity webhook
form). Do not commit. Check for booby-trap env vars before setting anything
else (see SKILL.md pitfalls — e.g. a form-gating secret the client never
sends).

## 5. Seed & local verification

Write `.env.local` (confirm it's gitignored first) with all values, then:

```bash
npm run sanity:seed        # idempotent; images seed empty by design
npm run build              # must stay green with real credentials
npm run start &            # then smoke-test:
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/        # 200
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/admin   # 200
```

Test the form API with a payload that satisfies the zod schema (read
`lib/*/schema.ts` to build it). Expected result **before** the provider
token exists: the provider's own "not configured" error — that's a pass; it
proves validation, routing, and provider selection all work.

## 6. Vercel deploy

The user imports the repo once: vercel.com/new → select team → import the
GitHub repo → default build settings → paste the env block below into the
Environment Variables panel (Vercel parses a whole pasted .env block) →
Deploy. Every push to the default branch auto-deploys afterward.

Env block template — adapt names to the project's `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://PROJECT.vercel.app
NEXT_PUBLIC_SITE_NAME=SITE_NAME
NEXT_PUBLIC_NOINDEX=true
NEXT_PUBLIC_SANITY_PROJECT_ID=PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
SANITY_API_READ_TOKEN=sk...
SANITY_REVALIDATE_SECRET=GENERATED_HEX
FORM_PROVIDER=airtable
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=TABLE_NAME
```

Deliberate omissions: the Sanity **write** token (seed is done; least
privilege) and any form-gating secret the client doesn't send.

## 7. Post-deploy verification

Run all of these yourself; report results as a table.

```bash
# Routes
curl -s -o /dev/null -w '%{http_code}' https://SITE/           # 200
curl -s -o /dev/null -w '%{http_code}' https://SITE/admin      # 200
curl -s https://SITE/robots.txt                                # Disallow: / if noindex

# Revalidation secret round-trip (proves Vercel env matches webhook secret)
SECRET=GENERATED_HEX
BODY='{"_type":"SOME_TYPE","_id":"SOME_ID"}'
TS=$(date +%s%3N)
SIG=$(printf '%s' "$TS.$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary \
      | basenc --base64url | tr -d '=\n')
curl -s -X POST https://SITE/api/revalidate \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: t=$TS,v1=$SIG" -d "$BODY"
# expect {"revalidated":true,...}; also confirm an UNSIGNED post returns 401

# End-to-end form test
curl -s -X POST https://SITE/api/FORM_ROUTE -H 'Content-Type: application/json' \
  -d 'SCHEMA_VALID_TEST_PAYLOAD'
# expect {"success":true,"id":"rec..."} — then verify the record's field
# values in Airtable and DELETE the test record.
```

## 8. Sanity revalidation webhook

Sanity Manage → API → Webhooks → Create webhook:

- URL: `https://SITE/api/revalidate` · Dataset: `production`
- Trigger on: Create + Update + Delete · HTTP method: POST
- Filter: `_type in [LIST_EVERY_SCHEMA_TYPE_THE_SITE_QUERIES]`
- Projection: `{_type,_id}`
- Secret: the generated hex value
- **Check "Enable webhook"** (defaults off!) · leave drafts/versions
  triggers off

## 9. Owner onboarding

1. Sanity Manage → Members → invite owner's email as **Editor** (can edit
   and publish; cannot touch tokens, billing, members).
2. Airtable: create a **share view link** (open table → Share and sync →
   create view link → `/shrXXXX...` URL). Verify it returns 200 without
   auth. This is the owner's read-only submissions bookmark. Do NOT use a
   collaborator invite link for this.
3. Generate the owner cheat sheet from `assets/cheat-sheet-template.md`,
   filling every placeholder. Pair it with a short personal email that
   (a) pre-announces the Sanity invite email so it isn't treated as spam,
   (b) states the can't-break-it rule, (c) offers a first-edit phone call.
4. After the owner confirms Studio access works: revoke the seed token.

## 10. Porting to a new codebase

To reapply this workflow to a site that doesn't have the architecture yet,
port these pieces (mazel_rose is the reference implementation):

- `sanity/` — env, client, queries, mappers, schemas, structure; Studio
  route at `app/admin/[[...tool]]/page.tsx`; `sanity.config.ts` + `sanity.cli.ts`
- `content/*.ts` — typed fallback/seed content with `isPlaceholder` flags
- `scripts/seed-sanity.ts` — idempotent `createOrReplace` upserts with
  stable singleton IDs
- `app/api/revalidate/route.ts` — HMAC signature check + `revalidateTag`/path
- Form: zod schema, provider interface, Airtable adapter
  (`lib/rsvp/` in the reference — rename per domain), API route with
  honeypot + rate limiting
- `.env.example` documenting every variable
- `docs/` — launch checklist + owner guide, adapted

Fit the schema types, seed content, and Airtable field set to the new
site's domain; the workflow phases stay identical.
