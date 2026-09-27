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

export async function stripImageFile(file: File, mimeType: string): Promise<File> {
  const stripped = stripImageMetadata(new Uint8Array(await file.arrayBuffer()), mimeType);
  const type = mimeType || file.type;
  const copy = new ArrayBuffer(stripped.byteLength);
  new Uint8Array(copy).set(stripped);
  return new File([copy], file.name, { type, lastModified: file.lastModified });
}
