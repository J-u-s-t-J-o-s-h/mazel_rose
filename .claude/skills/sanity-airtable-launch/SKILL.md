---
name: sanity-airtable-launch
description: >
  Launch and hand off a content-editable website using Sanity CMS (embedded
  Studio at /admin), Airtable as the form-submission backend, and Vercel
  hosting. Use this skill whenever the user wants to take a site live with an
  editable CMS, provision Sanity or Airtable for a project, wire up
  RSVP/contact/lead-form storage, deploy a CMS-backed Next.js site to Vercel,
  or onboard a non-technical owner to edit their own website — even if they
  don't name these tools explicitly ("make it so my client can edit the text",
  "set up the wedding site like last time", "launch this site and let my mom
  manage it"). Also use it to verify or debug an existing
  Sanity + Airtable + Vercel deployment: webhooks, tokens, CORS, or
  end-to-end form tests.
---

# Sanity + Airtable + Vercel Site Launch

A battle-tested workflow for taking a Next.js site from "builds locally" to
"live, content-editable by a non-technical owner, with form submissions
landing in a spreadsheet." First proven on the mazel.rose wedding site
(J-u-s-t-J-o-s-h/mazel_rose); designed to be reapplied to any site with the
same architecture.

## Read this first

`references/blueprint.md` is the full playbook: exact steps, commands,
env-var template, webhook config, and verification procedures. Read it before
starting a launch. This file is the orchestration layer — what to do in what
order and why.

## Architecture assumptions

The target site should have (or you should add — see "Porting to a new
codebase" in the blueprint):

- Sanity Studio embedded at `/admin`, schemas in `sanity/schemaTypes/`
- Local fallback content in `content/*.ts` that doubles as the seed source
  (site works with zero env vars; Sanity becomes source of truth after seed)
- An idempotent seed script (`npm run sanity:seed`)
- `/api/revalidate` route that verifies the Sanity webhook signature
- A form API route with a pluggable provider (Airtable adapter posting to
  `api.airtable.com` with exact field names)

## Workflow phases

Work through these in order. Keep a living checklist file in the repo
(`docs/launch-checklist.md`), updating and committing it as each item
completes — it is the single source of truth for "where are we," survives
session restarts, and tells the owner exactly what is still needed from them.

1. **Health check** — `npm run typecheck && npm run lint && npm run build`
   must be green before provisioning anything.
2. **Decisions from the user** — form backend, Vercel team, domain, indexing
   (noindex for private sites), password gate. Record answers in the
   checklist. Recommend Airtable for non-technical owners (spreadsheet UI,
   free tier: 1,000 records/base).
3. **Provisioning** — Sanity project + tokens + CORS (user does this in
   browser; there is no API for it), Airtable base/table/token (use the
   Airtable MCP tools if connected — check before sending the user to
   click around), generated secrets (`openssl rand -hex 32`). Details and
   exact click-paths: blueprint §2–§4.
4. **Seed + local verification** — run the seed, then build and smoke-test
   locally with real credentials before deploying. Test the form API with a
   schema-valid payload: reaching the provider's "not configured" error is a
   PASS when the provider token isn't set yet. Blueprint §5.
5. **Deploy** — Vercel GitHub import by the user (one-time, ~3 min) with a
   paste-ready env block you prepare. Why not deploy for them: the Vercel
   MCP tooling cannot upload a full repo or set env vars, and git-linked
   projects auto-deploy every push afterward, which is the better steady
   state anyway. Blueprint §6.
6. **Post-deploy verification** — do not declare success until you have
   proven, from your own shell: all routes 200, robots behavior correct, a
   correctly signed revalidate request succeeds (proves the secret
   round-trip), and an end-to-end form submission lands in Airtable — then
   delete the test record. Blueprint §7 has the signed-HMAC curl recipe.
7. **Webhook + owner onboarding** — Sanity webhook (exact values in
   blueprint §8), invite owner as **Editor** (never Admin), send them a
   cheat sheet generated from `assets/cheat-sheet-template.md`, and set up
   a read-only Airtable **share view link** for seeing submissions.

## Hard-won pitfalls (each of these bit us once)

- **Env vars that gate the form API can brick it.** If an API route rejects
  requests missing a secret header that the site's own form never sends,
  setting that env var breaks every submission. Grep the client code for the
  header before setting any such variable (mazel_rose example:
  `RSVP_SECRET` / `x-rsvp-secret` — must stay unset).
- **Airtable "API keys" are deprecated.** Users landing on
  airtable.com/create/apikey see a scary banner; the personal access token
  (airtable.com/create/tokens) is correct and goes in the same
  `AIRTABLE_API_KEY`-style env var — the code sends it as a Bearer token.
- **Invite link ≠ share link.** An Airtable URL containing
  `inviteId`/`inviteToken` is a single-use collaborator invitation. The
  bookmarkable read-only list is a **share view link** (`/shrXXXX...`),
  created via Share and sync on the view. Verify it loads with an
  unauthenticated fetch before handing it out.
- **The "Enable webhook" checkbox.** Sanity's webhook form defaults to
  disabled; a saved-but-disabled webhook fails silently. Also leave
  "trigger on drafts" off — publishes only.
- **Field names are a contract.** The Airtable table's field names must match
  the provider code exactly, including capitalization. Create fields from the
  code, not from memory. A write-test (create + delete a record) proves it.
- **Token lifetimes.** Sanity tokens never expire (revoke the write/seed
  token right after seeding; the read token must live forever). Airtable
  tokens power every live submission — if an expiration is offered, set it
  comfortably past the form deadline, or submissions fail silently.
- **Remote sessions lose local state.** Commit and push the checklist and
  docs constantly. If git push is rejected because the remote is ahead of a
  freshly-restored local clone, the remote is the truth: fetch and
  rebase/reset onto it.

## Owner handoff principles

The handoff artifacts (cheat sheet, email) are for a non-technical reader.
Plain sentences, no em dashes or arrow chains, no vendor jargon ("the editing
room", not "the CMS"). Three rules do the anti-anxiety work: nothing is
public until Publish; you cannot break the design; re-publishing fixes
everything. Give them exactly two bookmarks: the `/admin` editor and the
read-only submissions list. Pre-announce the Sanity invite email so it isn't
mistaken for spam. Full templates: `assets/cheat-sheet-template.md`.
