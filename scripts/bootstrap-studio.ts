/**
 * Create local Studio accounts from environment variables.
 *
 * Usage:
 *   npm run studio:bootstrap
 *
 * Requires STUDIO_SESSION_SECRET, STUDIO_OWNER_EMAIL, and
 * STUDIO_OWNER_PASSWORD. Also seeds editor@local.test and reviewer@local.test
 * with the same password when those accounts are missing.
 */

import {
  bootstrapOwnerFromEnv,
  seedDevStudioUsers,
} from "../lib/studio/user-store";

async function main() {
  const owner = await bootstrapOwnerFromEnv();
  if (owner.created) {
    console.log(`Created Owner account for ${owner.email}`);
  } else {
    console.log("Owner account already exists.");
  }

  const password = process.env.STUDIO_OWNER_PASSWORD;
  if (!password) {
    console.log("STUDIO_OWNER_PASSWORD is unset; skipped Editor/Reviewer seed.");
    return;
  }

  const created = await seedDevStudioUsers(password);
  if (created.length === 0) {
    console.log("Editor and Reviewer accounts already exist.");
    return;
  }
  console.log(`Created: ${created.join(", ")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
