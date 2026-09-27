const JPEG_SOI = [0xff, 0xd8];

function concat(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(bytes[start + index] ?? 0);
  }
  return value;
}

export function stripImageMetadata(bytes: Uint8Array, mimeType: string): Uint8Array {
  if (mimeType === "image/jpeg") return stripJpegApp1(bytes);
  if (mimeType === "image/png") return stripPngMetadata(bytes);
  if (mimeType === "image/webp") return stripWebpMetadata(bytes);
  return bytes;
}

function stripJpegApp1(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 4 || bytes[0] !== JPEG_SOI[0] || bytes[1] !== JPEG_SOI[1]) {
    return bytes;
  }

  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let offset = 2;

  while (offset + 1 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      parts.push(bytes.slice(offset));
      break;
    }

    const marker = bytes[offset + 1];
    if (marker === 0xd8) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) {
      parts.push(bytes.slice(offset));
      break;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      parts.push(bytes.slice(offset, offset + 2));
      offset += 2;
      continue;
    }
    if (offset + 3 >= bytes.length) {
      parts.push(bytes.slice(offset));
      break;
    }

    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) {
      parts.push(bytes.slice(offset));
      break;
    }

    const isExifOrXmp = marker === 0xe1;
    if (!isExifOrXmp) {
      parts.push(bytes.slice(offset, offset + 2 + segmentLength));
    }
    offset += 2 + segmentLength;
  }

  return concat(parts);
}

function stripPngMetadata(bytes: Uint8Array): Uint8Array {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 8 || signature.some((byte, index) => bytes[index] !== byte)) {
    return bytes;
  }

  const drop = new Set(["eXIf", "tEXt", "iTXt", "zTXt"]);
  const parts: Uint8Array[] = [bytes.slice(0, 8)];
  let offset = 8;

  while (offset + 12 <= bytes.length) {
    const length =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];
    const type = ascii(bytes, offset + 4, 4);
    const chunkEnd = offset + 12 + length;
    if (length < 0 || chunkEnd > bytes.length) return bytes;
    if (!drop.has(type)) parts.push(bytes.slice(offset, chunkEnd));
    offset = chunkEnd;
    if (type === "IEND") break;
  }

  return concat(parts);
}

function stripWebpMetadata(bytes: Uint8Array): Uint8Array {
  if (ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") return bytes;

  const drop = new Set(["EXIF", "XMP "]);
  const chunks: Uint8Array[] = [];
  let offset = 12;

  while (offset + 8 <= bytes.length) {
    const type = ascii(bytes, offset, 4);
    const size =
      bytes[offset + 4] |
      (bytes[offset + 5] << 8) |
      (bytes[offset + 6] << 16) |
      (bytes[offset + 7] << 24);
    const padded = size + (size % 2);
    const chunkEnd = offset + 8 + padded;
    if (size < 0 || chunkEnd > bytes.length) return bytes;
    if (!drop.has(type)) chunks.push(bytes.slice(offset, chunkEnd));
    offset = chunkEnd;
  }

  if (offset !== bytes.length) return bytes;

  const body = concat(chunks);
  const output = new Uint8Array(12 + body.length);
  output.set(bytes.slice(0, 4), 0);
  const riffSize = 4 + body.length;
  output[4] = riffSize & 0xff;
  output[5] = (riffSize >> 8) & 0xff;
  output[6] = (riffSize >> 16) & 0xff;
  output[7] = (riffSize >> 24) & 0xff;
  output.set(bytes.slice(8, 12), 8);
  output.set(body, 12);
  return output;
}

export function readImageOrientation(bytes: Uint8Array, mimeType: string): number {
  if (mimeType === "image/jpeg") return readJpegOrientation(bytes);
  if (mimeType === "image/png") return readPngOrientation(bytes);
  if (mimeType === "image/webp") return readWebpOrientation(bytes);
  return 1;
}

export async function stripImageFile(file: File, mimeType: string): Promise<File> {
  const type = mimeType || file.type;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const orientation = readImageOrientation(bytes, type);
  if (orientation > 1) {
    const baked = await bakeOrientation(bytes, type, orientation, file.name, file.lastModified);
    if (baked) return baked;
  }
  const stripped = stripImageMetadata(bytes, type);
  const copy = new ArrayBuffer(stripped.byteLength);
  new Uint8Array(copy).set(stripped);
  return new File([copy], file.name, { type, lastModified: file.lastModified });
}

function readU16(bytes: Uint8Array, offset: number, little: boolean): number {
  if (offset + 1 >= bytes.length) return 0;
  return little
    ? bytes[offset] | (bytes[offset + 1] << 8)
    : (bytes[offset] << 8) | bytes[offset + 1];
}

function readU32(bytes: Uint8Array, offset: number, little: boolean): number {
  if (offset + 3 >= bytes.length) return 0;
  return little
    ? (bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)) >>>
        0
    : ((bytes[offset] << 24) |
        (bytes[offset + 1] << 16) |
        (bytes[offset + 2] << 8) |
        bytes[offset + 3]) >>>
        0;
}

function readTiffOrientation(tiff: Uint8Array): number {
  if (tiff.length < 8) return 1;
  const order = ascii(tiff, 0, 2);
  const little = order === "II";
  if (!little && order !== "MM") return 1;
  if (readU16(tiff, 2, little) !== 42) return 1;
  const start = readU32(tiff, 4, little);
  if (start + 2 > tiff.length) return 1;
  const count = readU16(tiff, start, little);
  for (let index = 0; index < count; index += 1) {
    const entry = start + 2 + index * 12;
    if (entry + 12 > tiff.length) break;
    if (readU16(tiff, entry, little) !== 0x0112) continue;
    const value = readU16(tiff, entry + 8, little);
    if (value >= 1 && value <= 8) return value;
  }
  return 1;
}

function readJpegOrientation(bytes: Uint8Array): number {
  if (bytes.length < 4 || bytes[0] !== JPEG_SOI[0] || bytes[1] !== JPEG_SOI[1]) return 1;
  let offset = 2;
  while (offset + 4 < bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0xd8) {
      offset += 2;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (length < 2 || offset + 2 + length > bytes.length) break;
    if (marker === 0xe1 && ascii(bytes, offset + 4, 6) === "Exif\u0000\u0000") {
      return readTiffOrientation(bytes.subarray(offset + 10, offset + 2 + length));
    }
    offset += 2 + length;
  }
  return 1;
}

function readPngOrientation(bytes: Uint8Array): number {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 8 || signature.some((byte, index) => bytes[index] !== byte)) return 1;
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];
    const type = ascii(bytes, offset + 4, 4);
    const chunkEnd = offset + 12 + length;
    if (length < 0 || chunkEnd > bytes.length) return 1;
    if (type === "eXIf") return readTiffOrientation(bytes.subarray(offset + 8, offset + 8 + length));
    offset = chunkEnd;
    if (type === "IEND") break;
  }
  return 1;
}

function readWebpOrientation(bytes: Uint8Array): number {
  if (ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") return 1;
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = ascii(bytes, offset, 4);
    const size =
      bytes[offset + 4] |
      (bytes[offset + 5] << 8) |
      (bytes[offset + 6] << 16) |
      (bytes[offset + 7] << 24);
    const chunkEnd = offset + 8 + size + (size % 2);
    if (size < 0 || chunkEnd > bytes.length) return 1;
    if (type === "EXIF") {
      const payload = bytes.subarray(offset + 8, offset + 8 + size);
      const tiff = ascii(payload, 0, 6) === "Exif\u0000\u0000" ? payload.subarray(6) : payload;
      return readTiffOrientation(tiff);
    }
    offset = chunkEnd;
  }
  return 1;
}

function readJpegSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 4 || bytes[0] !== JPEG_SOI[0] || bytes[1] !== JPEG_SOI[1]) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) return null;
    if (marker === 0xd8) {
      offset += 2;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (length < 2 || offset + 2 + length > bytes.length) return null;
    const isFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isFrame) {
      const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
      const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
      if (width > 0 && height > 0) return { width, height };
      return null;
    }
    offset += 2 + length;
  }
  return null;
}

async function bakeOrientation(
  bytes: Uint8Array,
  mimeType: string,
  orientation: number,
  name: string,
  lastModified: number,
): Promise<File | null> {
  if (typeof document === "undefined" || typeof createImageBitmap !== "function") return null;
  const blob = new Blob([bytes], { type: mimeType });
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: "none" });
  } catch {
    return null;
  }

  const raw = mimeType === "image/jpeg" ? readJpegSize(bytes) : null;
  const browserAlreadyTurned =
    Boolean(raw) &&
    orientation >= 5 &&
    bitmap.width === raw!.height &&
    bitmap.height === raw!.width;
  const swap = !browserAlreadyTurned && orientation >= 5 && orientation <= 8;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? bitmap.height : bitmap.width;
  canvas.height = swap ? bitmap.width : bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return null;
  }

  if (!browserAlreadyTurned) {
    const width = bitmap.width;
    const height = bitmap.height;
    if (orientation === 2) context.transform(-1, 0, 0, 1, width, 0);
    if (orientation === 3) context.transform(-1, 0, 0, -1, width, height);
    if (orientation === 4) context.transform(1, 0, 0, -1, 0, height);
    if (orientation === 5) context.transform(0, 1, 1, 0, 0, 0);
    if (orientation === 6) context.transform(0, 1, -1, 0, height, 0);
    if (orientation === 7) context.transform(0, -1, -1, 0, height, width);
    if (orientation === 8) context.transform(0, -1, 1, 0, 0, width);
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const outputType =
    mimeType === "image/png" || mimeType === "image/webp" ? mimeType : "image/jpeg";
  const encoded = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), outputType, outputType === "image/png" ? undefined : 0.92);
  });
  if (!encoded || encoded.size <= 0) return null;
  return new File([encoded], name, { type: outputType, lastModified });
}
