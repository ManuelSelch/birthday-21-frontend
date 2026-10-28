import { createHash, createHmac, randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SESSION_SECONDS, type AuthConfig } from "../domain/rules";

const deriveKey = promisify(scrypt);
export const PASSWORD_HASH_PATTERN = /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/;

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!PASSWORD_HASH_PATTERN.test(hash) || password.length > 1024) return false;
  const [, salt, expected] = hash.split(":");
  const actual = await deriveKey(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

function credentialVersion(config: AuthConfig): string {
  return createHash("sha256").update(config.passwordHash).digest("hex");
}

function signature(payload: string, config: AuthConfig): Buffer {
  return createHmac("sha256", config.sessionSecret).update(payload).digest();
}

export function signSession(config: AuthConfig, now: number): string {
  const payload = Buffer.from(JSON.stringify({
    version: 1,
    issued: now,
    expires: now + SESSION_SECONDS,
    credential: credentialVersion(config),
    nonce: randomBytes(16).toString("hex"),
  })).toString("base64url");

  return `${payload}.${signature(payload, config).toString("base64url")}`;
}

export function validSession(token: string | undefined, config: AuthConfig, now: number): boolean {
  if (!token || token.length > 1024) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return false;
  const [payload, encodedSignature] = parts;
  const received = Buffer.from(encodedSignature, "base64url");
  const expected = signature(payload, config);
  if (received.toString("base64url") !== encodedSignature || received.length !== expected.length || !timingSafeEqual(received, expected)) return false;

  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return value !== null && value.version === 1 &&
      Number.isSafeInteger(value.issued) && Number.isSafeInteger(value.expires) &&
      value.issued <= now && value.expires > now &&
      value.expires === value.issued + SESSION_SECONDS &&
      value.credential === credentialVersion(config);
  } catch {
    return false;
  }
}
