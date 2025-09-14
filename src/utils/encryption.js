// Encryption utility for document handling (AES-256-GCM streaming + envelope keys)
// NOTE: Do not log secrets. Master key must be provided via env MASTER_KEY (64 hex chars / 32 bytes).
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto";
import fs from "fs";
import path from "path";

const MASTER_KEY_HEX = process.env.MASTER_KEY; // 64 hex chars recommended
if (!MASTER_KEY_HEX) {
  console.warn(
    "[encryption] MASTER_KEY env var not set. Generate one (32 bytes hex) for production."
  );
}
const masterKey = MASTER_KEY_HEX ? Buffer.from(MASTER_KEY_HEX, "hex") : null;

function ensureMasterKey() {
  if (!masterKey || masterKey.length !== 32) {
    throw new Error(
      "Master key missing or invalid length. Set MASTER_KEY to 64 hex chars."
    );
  }
}

// Wrap a key (plaintextKey Buffer) using master key with AES-256-GCM; returns { wrapIV, tag, encKey }
export function wrapKey(plaintextKey) {
  ensureMasterKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey, iv);
  const enc = Buffer.concat([cipher.update(plaintextKey), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encKey: enc.toString("base64"),
    wrapIV: iv.toString("base64"),
    wrapTag: tag.toString("base64"),
  };
}

export function unwrapKey({ encKey, wrapIV, wrapTag }) {
  ensureMasterKey();
  const iv = Buffer.from(wrapIV, "base64");
  const tag = Buffer.from(wrapTag, "base64");
  const decipher = createDecipheriv("aes-256-gcm", masterKey, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encKey, "base64")),
    decipher.final(),
  ]);
  return plaintext; // Buffer
}

// Encrypt a file stream to destination. Returns metadata with DK wrap info.
export function encryptFile({ srcPath, destPath }) {
  const dk = randomBytes(32); // document key
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", dk, iv);

  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(srcPath);
    const output = fs.createWriteStream(destPath);

    const hash = createHash("sha256");
    input.on("data", (chunk) => hash.update(chunk));

    input.pipe(cipher).pipe(output);

    output.on("finish", () => {
      try {
        const tag = cipher.getAuthTag();
        const checksum = hash.digest("hex");
        const wrapped = wrapKey(dk);
        resolve({
          iv: iv.toString("base64"),
          tag: tag.toString("base64"),
          checksum,
          ...wrapped,
          size: fs.statSync(destPath).size,
        });
      } catch (e) {
        reject(e);
      }
    });
    input.on("error", reject);
    output.on("error", reject);
    cipher.on("error", reject);
  });
}

// Decrypt and stream to writable (e.g., HTTP response)
export function decryptToStream({ encryptedPath, metadata, writable }) {
  const { iv, tag, encKey, wrapIV, wrapTag } = metadata;
  const dk = unwrapKey({ encKey, wrapIV, wrapTag });
  const decipher = createDecipheriv(
    "aes-256-gcm",
    dk,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(encryptedPath);
    input.pipe(decipher).pipe(writable);
    writable.on("finish", resolve);
    input.on("error", reject);
    decipher.on("error", reject);
    writable.on("error", reject);
  });
}

// Utility to persist metadata JSON next to file
export function writeMetadata(metaPath, data) {
  fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));
}

export function readMetadata(metaPath) {
  return JSON.parse(fs.readFileSync(metaPath, "utf8"));
}

// Generate a secure master key (helper for manual use)
export function generateMasterKeyHex() {
  return randomBytes(32).toString("hex");
}

export default {
  encryptFile,
  decryptToStream,
  writeMetadata,
  readMetadata,
  wrapKey,
  unwrapKey,
  generateMasterKeyHex,
};
