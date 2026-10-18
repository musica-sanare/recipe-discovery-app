/**
 * Minimal ZIP reader for well-formed archives such as .xlsx files: stored and
 * deflated entries only, CRC-checked, no ZIP64. Avoids a third-party dependency.
 */
import { crc32, inflateRawSync } from "node:zlib";

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const MAX_COMMENT_LENGTH = 0xffff;

function findEndOfCentralDirectory(buffer: Buffer): number {
  const minStart = Math.max(0, buffer.length - 22 - MAX_COMMENT_LENGTH);
  for (let offset = buffer.length - 22; offset >= minStart; offset--) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) {
      return offset;
    }
  }
  throw new Error("Not a ZIP archive: end of central directory not found");
}

export function readZipEntries(buffer: Buffer): Map<string, Buffer> {
  const eocd = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map<string, Buffer>();

  for (let i = 0; i < entryCount; i++) {
    if (buffer.readUInt32LE(offset) !== CENTRAL_SIGNATURE) {
      throw new Error("Corrupt ZIP archive: bad central directory entry");
    }
    const method = buffer.readUInt16LE(offset + 10);
    const expectedCrc = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const size = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);
    offset += 46 + nameLength + extraLength + commentLength;

    if (compressedSize === 0xffffffff || size === 0xffffffff || localOffset === 0xffffffff) {
      throw new Error(`ZIP64 entries are not supported: ${name}`);
    }
    if (buffer.readUInt32LE(localOffset) !== LOCAL_SIGNATURE) {
      throw new Error(`Corrupt ZIP archive: bad local header for ${name}`);
    }
    const dataStart = localOffset + 30 + buffer.readUInt16LE(localOffset + 26) + buffer.readUInt16LE(localOffset + 28);
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);

    let data: Buffer;
    if (method === 0) {
      data = Buffer.from(raw);
    } else if (method === 8) {
      data = inflateRawSync(raw);
    } else {
      throw new Error(`Unsupported ZIP compression method ${String(method)} for ${name}`);
    }
    if (data.length !== size || crc32(data) !== expectedCrc) {
      throw new Error(`ZIP entry failed integrity check: ${name}`);
    }
    entries.set(name, data);
  }
  return entries;
}
