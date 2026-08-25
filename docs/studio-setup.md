# Studio setup

`/studio` is the editing room for this website. Your client signs in there to
change copy, photos, links, and SEO. Guests never see it.

You do **not** use Sanity Studio (`/admin`). That URL now redirects to
`/studio`. Accounts, comments, and the change log live in an encrypted vault
written by the server. Password hashes are never in git or `NEXT_PUBLIC_*`
variables.

Website pages still read published content from your existing Sanity
**production** dataset. That is storage only — nobody needs a Sanity login.

## What you need to complete

### 1. Write token (keep the one you already have)

In [Sanity Manage](https://www.sanity.io/manage) → API → Tokens, keep an
**Editor or Admin** token for the **production** dataset.

Put it in `SANITY_API_WRITE_TOKEN`. Studio uses it on the server to save
drafts, publish, and store the encrypted vault. Never prefix it with
`NEXT_PUBLIC_`. Do not revoke it after seeding.

### 2. Environment variables

Add these to `.env.local` and to Vercel (Production + Preview):

```
STUDIO_SESSION_SECRET=
STUDIO_OWNER_EMAIL=
STUDIO_OWNER_NAME=
STUDIO_OWNER_PASSWORD=
```

Generate a session secret (32+ characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`STUDIO_OWNER_PASSWORD` must be at least 10 characters. It is only used to
create the first Owner account.

Keep existing Sanity variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN`,
`SANITY_API_WRITE_TOKEN`.

### 3. Bootstrap the Owner

```bash
npm run studio:bootstrap
npm run dev
```

Sign in at [http://localhost:3000/studio/login](http://localhost:3000/studio/login)
with `STUDIO_OWNER_EMAIL` / `STUDIO_OWNER_PASSWORD`.

After the first successful login:

1. Change your password at `/studio/account`.
2. Remove `STUDIO_OWNER_PASSWORD` from `.env.local` and Vercel.
3. Add Editors and Reviewers at `/studio/team`. Share those passwords
   privately; there is no email invite.

## Roles

| Role | Can do |
| --- | --- |
| Owner | Edit, preview, publish, restore versions, manage the team, comment |
| Editor | Edit, preview, publish, comment |
| Reviewer | Preview, comment (cannot save or publish) |

## Workflow

Edit in `/studio`. The real website sits beside the form and refreshes after you pause typing (or click **Save draft**). Click **Publish** when the live page looks right.

Guests still see published content until you publish.
Restore (Owner only) writes the old version back as a draft.

Keep image uploads at **4 MB or smaller**.

## Optional guest gate

If `ENABLE_SITE_PASSWORD=true`, `/studio` stays reachable for signed-in
editors. The guest password is separate from Studio accounts.

## Troubleshooting

- **Login says Studio is not configured:** set `STUDIO_SESSION_SECRET` and
  `SANITY_API_WRITE_TOKEN`, then restart `npm run dev`.
- **Save draft fails:** the write token is missing, revoked, or cannot write
  to `production`.
- **Publish does not update the live site:** the Sanity webhook to
  `/api/revalidate` still needs to be enabled.
