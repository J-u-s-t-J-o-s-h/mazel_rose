import type { GuestMediaType } from "@/lib/guest-gallery/limits";

const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heim", "heis"]);
const MP4_BRANDS = new Set(["isom", "iso2", "mp41", "mp42", "avc1", "mp4v", "dash", "m4v ", "msnv"]);
const MOV_BRANDS = new Set(["qt  ", "mov "]);

export function identifyMedia(
  bytes: Uint8Array,
): { mediaType: GuestMediaType; mimeType: string } | { error: string } {
  if (isJpeg(bytes)) return { mediaType: "image", mimeType: "image/jpeg" };
  if (isPng(bytes)) return { mediaType: "image", mimeType: "image/png" };
  if (isWebp(bytes)) return { mediaType: "image", mimeType: "image/webp" };

  const brand = ftypBrand(bytes);
  if (brand) {
    if (HEIC_BRANDS.has(brand)) {
      return {
        error: "HEIC photos aren't supported. Please choose a JPEG, PNG, or WebP image.",
      };
    }
    if (MP4_BRANDS.has(brand)) return { mediaType: "video", mimeType: "video/mp4" };
    if (MOV_BRANDS.has(brand)) return { mediaType: "video", mimeType: "video/quicktime" };
  }

  return {
    error: "That file isn't a supported photo or short video.",
  };
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71 &&
    bytes[4] === 13 &&
    bytes[5] === 10 &&
    bytes[6] === 26 &&
    bytes[7] === 10
  );
}

function isWebp(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 12 &&
    ascii(bytes, 0, 4) === "RIFF" &&
    ascii(bytes, 8, 4) === "WEBP"
  );
}

function ftypBrand(bytes: Uint8Array): string | null {
  if (bytes.length < 12 || ascii(bytes, 4, 4) !== "ftyp") return null;
  return ascii(bytes, 8, 4);
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(bytes[start + index] ?? 0);
  }
  return value;
}
