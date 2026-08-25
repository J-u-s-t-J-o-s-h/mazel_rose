# Studio setup

Editing happens in **Sanity Studio** at `/admin`.

Sign in with the Google or GitHub account that was invited in
[Sanity Manage](https://www.sanity.io/manage). You do not need
`STUDIO_SESSION_SECRET` or a local `/studio` login.

## Invite an editor

1. Open [Sanity Manage](https://www.sanity.io/manage) for this project.
2. Members → Invite, role **Editor**.
3. Share [https://mazelrose.life/admin](https://mazelrose.life/admin).

`/studio` redirects to `/admin`.

## CORS

In Manage → API → CORS Origins, keep credentials **on** for:

- `http://localhost:3000`
- `https://mazelrose.life`
- `https://www.mazelrose.life`

If `/admin` shows a blank page or login loop, the current site URL is
missing from that list.

## Tokens

The public site still uses `SANITY_API_READ_TOKEN`. A write token is only
needed for `npm run sanity:seed`, not for day-to-day `/admin` editing.
