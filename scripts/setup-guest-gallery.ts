import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Applies the guest-gallery migration when a Supabase access token is available.
 * Runtime uploads use SUPABASE_URL and SUPABASE_SECRET_KEY only.
 *
 *   SUPABASE_ACCESS_TOKEN=... SUPABASE_URL=... npx tsx scripts/setup-guest-gallery.ts
 */
const sqlPath = path.join(
  process.cwd(),
  "supabase/migrations/20260926120000_guest_gallery.sql",
);

async function main() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = url?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
  if (!url || !token || !ref) {
    console.error(
      "Set SUPABASE_URL and SUPABASE_ACCESS_TOKEN, then run this script. The SQL file is supabase/migrations/20260926120000_guest_gallery.sql.",
    );
    process.exitCode = 1;
    return;
  }

  const query = readFileSync(sqlPath, "utf8");
  const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const body = await response.text();
  if (!response.ok) {
    console.error("Supabase migration failed", response.status, body.slice(0, 500));
    process.exitCode = 1;
    return;
  }
  console.log("Guest gallery tables and storage bucket are ready.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
