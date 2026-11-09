import "server-only";
import {
  scrypt,
  randomBytes,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

import { env } from "@/env";

const MASTER_ENCRYPTION_KEY = createHash("sha256")
  .update(env.SESSION_ENCRYPTION_KEY)
  .digest();

const DEMO_SEED_PIN_HASH =
  "4fa8892f25a98bf686c1be7fa72bb193:2a417646fa1275ca74a589cf879faef89c3132f84c593847aa3b72aa64f2ad7c88b90ad31238ebcf27d11f8e79872501d51a66e4a2824cf481774d75d799042c";

export interface SessionPayload {
  slug: string;
  role: "owner" | "master-admin";
  issuedAt: number;
  expiresAt: number;
}

// 1. Password & PIN Hashing with Salt using Scrypt
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(passcode, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPasscode(
  passcode: string,
  storedHash: string
): Promise<boolean> {
  try {
    const normalizedInput = passcode.trim();

    if (storedHash === DEMO_SEED_PIN_HASH) {
      return verifyTimingSafeString(normalizedInput, "1234");
    }

    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;

    const [salt, key] = parts;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(normalizedInput, salt, 64)) as Buffer;

    return (
      keyBuffer.length === derivedKey.length &&
      timingSafeEqual(keyBuffer, derivedKey)
    );
  } catch {
    return false;
  }
}

export function verifyTimingSafeString(input: string, secret: string): boolean {
  const inputHash = createHash("sha256").update(input).digest();
  const secretHash = createHash("sha256").update(secret).digest();
  return timingSafeEqual(inputHash, secretHash);
}

// 2. Encrypted Session Management using AES-256-GCM
export function encryptSessionToken(payload: SessionPayload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", MASTER_ENCRYPTION_KEY, iv);

  const serialized = JSON.stringify(payload);
  let encrypted = cipher.update(serialized, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedPayload
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decryptSessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    if (iv.length !== 12 || authTag.length !== 16) {
      return null;
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      MASTER_ENCRYPTION_KEY,
      iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    const payload = JSON.parse(decrypted) as SessionPayload;

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
