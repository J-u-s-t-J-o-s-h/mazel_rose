import { isHeicContainer } from "@/lib/guest-gallery/heic";
import { displayFileName, GUEST_GALLERY_LIMITS } from "@/lib/guest-gallery/limits";
import { stripImageFile } from "@/lib/guest-gallery/strip-metadata";

export const HEIC_CONVERT_ERROR =
  "We couldn't process this iPhone photo. Please try another photo.";

const JPEG_QUALITY = 0.9;

export async function normalizeGuestFile(file: File): Promise<File> {
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  if (!isHeicContainer(header)) return file;

  const label = displayFileName(file.name);
  if (file.size > GUEST_GALLERY_LIMITS.maxImageBytes) {
    throw new Error(`${label} is larger than 15 MB.`);
  }

  try {
    const { heicTo } = await import("heic-to/next");
    const converted = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: JPEG_QUALITY,
    });
    const jpeg = new File([converted], jpegName(file.name), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
    const stripped = await stripImageFile(jpeg, "image/jpeg");
    if (stripped.size <= 0) throw new Error("empty");
    return stripped;
  } catch (error) {
    if (error instanceof Error && error.message.endsWith("is larger than 15 MB.")) {
      throw error;
    }
    throw new Error(HEIC_CONVERT_ERROR);
  }
}

function jpegName(filename: string): string {
  const base = displayFileName(filename).replace(/\.(heic|heif)$/i, "");
  const dot = base.lastIndexOf(".");
  const stem = (dot > 0 ? base.slice(0, dot) : base).trim() || "photo";
  return `${stem}.jpg`;
}
