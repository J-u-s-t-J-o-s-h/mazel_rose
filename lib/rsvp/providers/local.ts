import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import type { RsvpProvider, RsvpResult, RsvpSubmission } from "../types";

/**
 * Development fallback: appends RSVP submissions to a local JSONL file.
 * Not intended for production guest-list storage.
 */
export const localProvider: RsvpProvider = {
  name: "local",
  async submit(data: RsvpSubmission): Promise<RsvpResult> {
    const id = `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record = {
      id,
      ...data,
      submittedAt: new Date().toISOString(),
    };

    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "rsvps.jsonl"),
      `${JSON.stringify(record)}\n`,
      "utf8",
    );

    return { success: true, id };
  },
};
