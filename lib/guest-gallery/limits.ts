export const GUEST_GALLERY_BUCKET = "guest-gallery";

export const GUEST_GALLERY_LIMITS = {
  maxFiles: 8,
  maxVideos: 2,
  maxImageBytes: 15 * 1024 * 1024,
  maxVideoBytes: 50 * 1024 * 1024,
  nameMin: 1,
  nameMax: 100,
  messageMax: 1000,
} as const;

export type GuestMediaType = "image" | "video";

const IMAGE_MIME = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
} as const;

const VIDEO_MIME = {
  "video/mp4": ["mp4"],
  "video/quicktime": ["mov"],
} as const;

export type ClassifiedFile = {
  mediaType: GuestMediaType;
  mimeType: string;
  extension: string;
};

export function extensionOf(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function displayFileName(filename: string): string {
  const base = (filename.split(/[/\\]/).pop() ?? "attachment").replace(
    /[\u0000-\u001f\u007f]/g,
    "",
  );
  return base.slice(0, 120) || "attachment";
}

export function classifyGuestFile(input: {
  name: string;
  mimeType: string;
  size: number;
}): { ok: true; file: ClassifiedFile } | { ok: false; error: string } {
  const extension = extensionOf(input.name);
  const mimeType = input.mimeType.trim().toLowerCase();
  const label = displayFileName(input.name);

  if (!Number.isFinite(input.size) || input.size <= 0) {
    return { ok: false, error: `${label} is empty.` };
  }

  const imageMime = matchMime(IMAGE_MIME, mimeType, extension);
  if (imageMime) {
    if (input.size > GUEST_GALLERY_LIMITS.maxImageBytes) {
      return { ok: false, error: `${label} is larger than 15 MB.` };
    }
    return {
      ok: true,
      file: { mediaType: "image", mimeType: imageMime.mime, extension: imageMime.extension },
    };
  }

  const videoMime = matchMime(VIDEO_MIME, mimeType, extension);
  if (videoMime) {
    if (input.size > GUEST_GALLERY_LIMITS.maxVideoBytes) {
      return { ok: false, error: `${label} is larger than 50 MB.` };
    }
    return {
      ok: true,
      file: { mediaType: "video", mimeType: videoMime.mime, extension: videoMime.extension },
    };
  }

  return {
    ok: false,
    error: `${label} isn't a supported file. Use a JPEG, PNG, WebP, or HEIC/HEIF photo, or a short MP4 or MOV video.`,
  };
}

function matchMime(
  table: Record<string, readonly string[]>,
  mimeType: string,
  extension: string,
): { mime: string; extension: string } | null {
  if (mimeType in table) {
    const extensions = table[mimeType];
    if (extension && !extensions.includes(extension)) return null;
    return { mime: mimeType, extension: extensions[0] };
  }

  if (!mimeType || mimeType === "application/octet-stream") {
    for (const [mime, extensions] of Object.entries(table)) {
      if (extensions.includes(extension)) {
        return { mime, extension: extensions[0] };
      }
    }
  }

  return null;
}

export function sanitizeGuestName(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}

export function sanitizeGuestMessage(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

export function validateGuestText(input: {
  guestName: string;
  message: string;
}): { ok: true; guestName: string; message: string | null } | { ok: false; error: string } {
  const guestName = sanitizeGuestName(input.guestName);
  const message = sanitizeGuestMessage(input.message);

  if (guestName.length < GUEST_GALLERY_LIMITS.nameMin) {
    return { ok: false, error: "Please enter your name." };
  }
  if (guestName.length > GUEST_GALLERY_LIMITS.nameMax) {
    return { ok: false, error: "Please keep your name under 100 characters." };
  }
  if (message.length > GUEST_GALLERY_LIMITS.messageMax) {
    return { ok: false, error: "Please keep your message under 1,000 characters." };
  }

  return { ok: true, guestName, message: message.length ? message : null };
}

export function validateGuestFiles(
  files: Array<{ name: string; mimeType: string; size: number }>,
): { ok: true; files: ClassifiedFile[] } | { ok: false; error: string } {
  if (files.length === 0) {
    return { ok: false, error: "Add at least one photo or short video." };
  }
  if (files.length > GUEST_GALLERY_LIMITS.maxFiles) {
    return { ok: false, error: "You can share up to 8 photos and videos at a time." };
  }

  const classified: ClassifiedFile[] = [];
  let videos = 0;
  for (const file of files) {
    const result = classifyGuestFile(file);
    if (!result.ok) return result;
    if (result.file.mediaType === "video") videos += 1;
    classified.push(result.file);
  }

  if (videos > GUEST_GALLERY_LIMITS.maxVideos) {
    return { ok: false, error: "You can share up to 2 short videos at a time." };
  }

  return { ok: true, files: classified };
}
