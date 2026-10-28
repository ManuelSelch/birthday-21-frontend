import type { AuthConfig } from "../domain/rules";
import { PASSWORD_HASH_PATTERN } from "./security";

export function readAuthConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig | undefined {
  const { ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SESSION_SECRET: sessionSecret, APP_ORIGIN: origin } = env;
  if (!passwordHash || !PASSWORD_HASH_PATTERN.test(passwordHash) || !sessionSecret || Buffer.byteLength(sessionSecret) < 32 || !origin) return undefined;

  try {
    const url = new URL(origin);
    const secure = env.NODE_ENV === "production";
    if (url.origin !== origin || url.username || url.password) return undefined;
    if (secure ? url.protocol !== "https:" : !(
      url.protocol === "https:" ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    )) return undefined;

    return { passwordHash, sessionSecret, origin, secure };
  } catch {
    return undefined;
  }
}
