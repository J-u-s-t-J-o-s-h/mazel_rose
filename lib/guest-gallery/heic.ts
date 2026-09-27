const HEIC_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "heif",
  "mif1",
  "msf1",
]);

const AVIF_BRANDS = new Set(["avif", "avis"]);

export function isHeicContainer(bytes: Uint8Array): boolean {
  const brands = ftypBrands(bytes);
  if (!brands.length) return false;
  if (brands.some((brand) => AVIF_BRANDS.has(brand))) return false;
  return brands.some((brand) => HEIC_BRANDS.has(brand));
}

function ftypBrands(bytes: Uint8Array): string[] {
  if (bytes.length < 12 || ascii(bytes, 4, 4) !== "ftyp") return [];

  const boxSize = readUint32(bytes, 0);
  const end = boxSize >= 16 ? Math.min(bytes.length, boxSize) : bytes.length;
  const brands = [ascii(bytes, 8, 4)];

  for (let offset = 16; offset + 4 <= end; offset += 4) {
    brands.push(ascii(bytes, offset, 4));
  }

  return brands;
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] ?? 0) << 24) |
    ((bytes[offset + 1] ?? 0) << 16) |
    ((bytes[offset + 2] ?? 0) << 8) |
    (bytes[offset + 3] ?? 0)
  ) >>> 0;
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(bytes[start + index] ?? 0);
  }
  return value;
}
