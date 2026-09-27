import "server-only";

import { zipStoredStream, type ZipFile } from "@/lib/guest-gallery/archive";
import {
  isStoredGalleryPath,
  listSubmissions,
  openStoredObject,
} from "@/lib/guest-gallery/store";
import { GuestGalleryError } from "@/lib/guest-gallery/supabase";

const MAX_BYTES = 50 * 1024 * 1024;

const DOWNLOAD_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
} as const;

type DownloadMime = keyof typeof DOWNLOAD_TYPES;

export type PublicDownload = {
  id: string;
  storagePath: string;
  mimeType: DownloadMime;
  filename: string;
};

export function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function getPublicDownload(id: string): Promise<PublicDownload | null> {
  const files = await listPublicDownloads();
  return files.find((file) => file.id === id) ?? null;
}

export async function listPublicDownloads(): Promise<PublicDownload[]> {
  const rows = await listSubmissions("approved");
  const pending: Array<{ id: string; storagePath: string; mimeType: DownloadMime; guestName: string }> = [];
  for (const row of rows) {
    const media = [...(row.guest_gallery_media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    for (const item of media) {
      if (!isStoredGalleryPath(item.storage_path) || !isDownloadMime(item.mime_type)) continue;
      pending.push({
        id: item.id,
        storagePath: item.storage_path,
        mimeType: item.mime_type,
        guestName: row.guest_name,
      });
    }
  }
  const names = namedFiles(pending);
  return pending.map((item, index) => ({
    id: item.id,
    storagePath: item.storagePath,
    mimeType: item.mimeType,
    filename: names[index],
  }));
}

export async function openPublicDownload(file: PublicDownload): Promise<Response> {
  return openStoredObject(file.storagePath);
}

export async function archivePublicDownloads(files: PublicDownload[]): Promise<ReadableStream<Uint8Array>> {
  let index = 0;
  return zipStoredStream(async () => {
    while (index < files.length) {
      const file = files[index];
      index += 1;
      try {
        const stored = await openStoredObject(file.storagePath);
        const bytes = await readLimited(stored);
        if (!bytes.byteLength) continue;
        return { name: file.filename, bytes } satisfies ZipFile;
      } catch (error) {
        console.error("Guest gallery archive skipped a file", file.id, error);
      }
    }
    return null;
  });
}

function isDownloadMime(mime: string): mime is DownloadMime {
  return Object.prototype.hasOwnProperty.call(DOWNLOAD_TYPES, mime);
}

function namedFiles(items: Array<{ guestName: string; mimeType: DownloadMime }>): string[] {
  const stems = items.map((item) => guestFileStem(item.guestName));
  const totals = new Map<string, number>();
  for (const stem of stems) totals.set(stem, (totals.get(stem) ?? 0) + 1);
  const seen = new Map<string, number>();
  return items.map((item, index) => {
    const stem = stems[index] ?? "guest";
    const count = (seen.get(stem) ?? 0) + 1;
    seen.set(stem, count);
    const suffix = (totals.get(stem) ?? 1) > 1 ? `-${count}` : "";
    return `${stem}${suffix}.${DOWNLOAD_TYPES[item.mimeType]}`;
  });
}

function guestFileStem(name: string): string {
  const stem = name
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return stem || "guest";
}

async function readLimited(response: Response): Promise<Uint8Array> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    await response.body?.cancel();
    throw new GuestGalleryError("That upload is too large to save from here.", 413);
  }
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new GuestGalleryError("That upload is too large to save from here.", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
