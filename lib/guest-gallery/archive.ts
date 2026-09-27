const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let crc = n;
  for (let k = 0; k < 8; k += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  CRC_TABLE[n] = crc >>> 0;
}

const DOS_TIME = 12 << 11;
const DOS_DATE = ((2026 - 1980) << 9) | (11 << 5) | 8;

export type ZipFile = {
  name: string;
  bytes: Uint8Array;
};

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function zipStoredStream(nextFile: () => Promise<ZipFile | null>): ReadableStream<Uint8Array> {
  const entries: Array<{ name: Uint8Array; crc: number; size: number; offset: number }> = [];
  let offset = 0;
  let finished = false;

  return new ReadableStream({
    async pull(controller) {
      if (finished) return;
      const file = await nextFile();
      if (file) {
        const name = new TextEncoder().encode(file.name);
        const checksum = crc32(file.bytes);
        const local = localHeader(name, checksum, file.bytes.length);
        entries.push({ name, crc: checksum, size: file.bytes.length, offset });
        offset += local.length + file.bytes.length;
        controller.enqueue(local);
        controller.enqueue(file.bytes);
        return;
      }

      if (!entries.length) {
        controller.error(new Error("The archive has no files."));
        return;
      }
      let centralSize = 0;
      for (const entry of entries) {
        const central = centralHeader(entry.name, entry.crc, entry.size, entry.offset);
        controller.enqueue(central);
        centralSize += central.length;
      }
      controller.enqueue(endOfCentralDirectory(entries.length, centralSize, offset));
      finished = true;
      controller.close();
    },
  });
}

export function zipStoredFiles(files: ZipFile[]): Uint8Array {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  let centralSize = 0;

  for (const file of files) {
    const name = new TextEncoder().encode(file.name);
    const checksum = crc32(file.bytes);
    const local = localHeader(name, checksum, file.bytes.length);
    locals.push(local, file.bytes);
    const central = centralHeader(name, checksum, file.bytes.length, offset);
    centrals.push(central);
    offset += local.length + file.bytes.length;
    centralSize += central.length;
  }

  const end = endOfCentralDirectory(files.length, centralSize, offset);
  const total = offset + centralSize + end.length;
  const zip = new Uint8Array(total);
  let cursor = 0;
  for (const part of [...locals, ...centrals, end]) {
    zip.set(part, cursor);
    cursor += part.length;
  }
  return zip;
}

function localHeader(name: Uint8Array, checksum: number, size: number): Uint8Array {
  const header = new Uint8Array(30 + name.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0x0800, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, DOS_TIME, true);
  view.setUint16(12, DOS_DATE, true);
  view.setUint32(14, checksum, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, name.length, true);
  view.setUint16(28, 0, true);
  header.set(name, 30);
  return header;
}

function centralHeader(name: Uint8Array, checksum: number, size: number, offset: number): Uint8Array {
  const header = new Uint8Array(46 + name.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0x0800, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, DOS_TIME, true);
  view.setUint16(14, DOS_DATE, true);
  view.setUint32(16, checksum, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, name.length, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, offset, true);
  header.set(name, 46);
  return header;
}

function endOfCentralDirectory(count: number, centralSize: number, centralOffset: number): Uint8Array {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, count, true);
  view.setUint16(10, count, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, 0, true);
  return header;
}
