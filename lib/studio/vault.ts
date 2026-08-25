import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getProductionWriteClient, hasSanityWriteAccess } from "./clients";
import type { StudioChange, StudioComment, StoredUser } from "./types";

const LOCAL_VAULT_PATH = path.join(process.cwd(), ".data", "studio-vault.json");

export const STUDIO_VAULT_ID = "studioVault";

export type StudioVaultData = {
  users: StoredUser[];
  comments: StudioComment[];
  changes: StudioChange[];
};

const EMPTY_VAULT: StudioVaultData = {
  users: [],
  comments: [],
  changes: [],
};

function vaultKey(): Buffer {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("STUDIO_SESSION_SECRET is not configured.");
  }
  return createHash("sha256").update(`mazel-rose-studio-vault:${secret}`).digest();
}

function encryptPayload(data: StudioVaultData): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", vaultKey(), iv);
  const encoded = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encoded.toString("base64url")}`;
}

function decryptPayload(ciphertext: string): StudioVaultData {
  const [ivPart, tagPart, dataPart] = ciphertext.split(".");
  if (!ivPart || !tagPart || !dataPart) {
    throw new Error("Studio vault is unreadable.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    vaultKey(),
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  const json = Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
  const parsed = JSON.parse(json) as Partial<StudioVaultData>;
  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    comments: Array.isArray(parsed.comments) ? parsed.comments : [],
    changes: Array.isArray(parsed.changes) ? parsed.changes : [],
  };
}

type VaultRow = {
  _id: string;
  _rev?: string;
  ciphertext?: string;
};

async function readLocalVaultRow(): Promise<VaultRow | null> {
  try {
    const raw = await readFile(LOCAL_VAULT_PATH, "utf8");
    return JSON.parse(raw) as VaultRow;
  } catch {
    return null;
  }
}

async function writeLocalVault(ciphertext: string): Promise<void> {
  await mkdir(path.dirname(LOCAL_VAULT_PATH), { recursive: true });
  await writeFile(
    LOCAL_VAULT_PATH,
    `${JSON.stringify({ _id: STUDIO_VAULT_ID, ciphertext }, null, 2)}\n`,
    "utf8",
  );
}

async function readVaultRow(): Promise<VaultRow | null> {
  if (!hasSanityWriteAccess()) {
    return readLocalVaultRow();
  }
  const client = getProductionWriteClient();
  return client.fetch<VaultRow | null>(`*[_id == $id][0]{ _id, _rev, ciphertext }`, {
    id: STUDIO_VAULT_ID,
  });
}

export async function readStudioVault(): Promise<StudioVaultData> {
  const row = await readVaultRow();
  if (!row?.ciphertext) return { ...EMPTY_VAULT, users: [], comments: [], changes: [] };
  return decryptPayload(row.ciphertext);
}

export async function updateStudioVault<T>(
  mutator: (data: StudioVaultData) => T | Promise<T>,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const row = await readVaultRow();
    const current = row?.ciphertext
      ? decryptPayload(row.ciphertext)
      : {
          users: [] as StoredUser[],
          comments: [] as StudioComment[],
          changes: [] as StudioChange[],
        };

    const result = await mutator(current);
    const ciphertext = encryptPayload(current);

    try {
      if (!hasSanityWriteAccess()) {
        await writeLocalVault(ciphertext);
        return result;
      }
      const client = getProductionWriteClient();
      await client.createOrReplace({
        _id: STUDIO_VAULT_ID,
        _type: "studioVault",
        ciphertext,
      });
      return result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Could not save studio data.");
}
