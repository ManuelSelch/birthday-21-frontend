import { SESSION_COOKIE, SESSION_SECONDS, safeAdminDestination, type AuthConfig } from "../domain/rules";
import { readAuthConfig } from "../infra/config";
import { loginAttempts, type AttemptLimiter } from "../infra/attempts";
import { signSession, validSession, verifyPassword } from "../infra/security";

export function privateJson(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  const result = new Headers(headers);
  result.set("Cache-Control", "no-store");
  return Response.json(body, { status, headers: result });
}

export async function readAdminBody(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

function requestToken(request: Request): string | undefined {
  const cookies = (request.headers.get("cookie") ?? "").split(";").map(value => value.trim());
  const matches = cookies.filter(value => value.startsWith(SESSION_COOKIE + "="));
  return matches.length === 1 ? matches[0].slice(SESSION_COOKIE.length + 1) : undefined;
}

function sessionCookie(token: string, config: AuthConfig, now: number, clear = false): string {
  const age = clear ? 0 : SESSION_SECONDS;
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${age}`,
    `Expires=${new Date(clear ? 0 : (now + age) * 1000).toUTCString()}`,
    ...(config.secure ? ["Secure"] : []),
  ].join("; ");
}

export function createAuthHandlers(dependencies: {
  config: () => AuthConfig | undefined;
  now: () => number;
  limiter: AttemptLimiter;
}) {
  function authenticated(token: string | undefined): boolean {
    const config = dependencies.config();
    return !!config && validSession(token, config, dependencies.now());
  }

  function authorize(request: Request): Response | undefined {
    if (!authenticated(requestToken(request))) return privateJson({ success: false, error: "Unauthorized" }, 401);
    const config = dependencies.config()!;
    if (!["GET", "HEAD"].includes(request.method) && request.headers.get("origin") !== config.origin) {
      return privateJson({ success: false, error: "Forbidden" }, 403);
    }
  }

  async function login(request: Request): Promise<Response> {
    if (request.method !== "POST") return privateJson({ error: "Method not allowed" }, 405, { Allow: "POST" });
    const config = dependencies.config();
    if (!config) return privateJson({ error: "Anmeldung nicht verfügbar." }, 503);
    if (request.headers.get("origin") !== config.origin) return privateJson({ error: "Forbidden" }, 403);
    const now = dependencies.now();
    const retryAfter = dependencies.limiter.consume(now);
    if (retryAfter) return privateJson({ error: "Zu viele Versuche.", retryAfter }, 429, { "Retry-After": String(retryAfter) });

    const body = await readAdminBody(request);
    if (!body || typeof body.password !== "string" || !await verifyPassword(body.password, config.passwordHash)) {
      return privateJson({ error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." }, 401);
    }

    return privateJson({
      redirectTo: safeAdminDestination(typeof body.returnTo === "string" ? body.returnTo : undefined),
    }, 200, { "Set-Cookie": sessionCookie(signSession(config, now), config, now) });
  }

  async function logout(request: Request): Promise<Response> {
    if (request.method !== "POST") return privateJson({ error: "Method not allowed" }, 405, { Allow: "POST" });
    const config = dependencies.config();
    if (!config) return privateJson({ error: "Anmeldung nicht verfügbar." }, 503);
    if (request.headers.get("origin") !== config.origin) return privateJson({ error: "Forbidden" }, 403);
    return privateJson({ success: true }, 200, { "Set-Cookie": sessionCookie("", config, dependencies.now(), true) });
  }

  function loginUrl(request: Request): URL {
    const current = new URL(request.url);
    // Next's dev server can normalize request.url to localhost; use the configured browser origin.
    const destination = new URL("/admin/login", dependencies.config()?.origin ?? current.origin);
    destination.searchParams.set("returnTo", safeAdminDestination(current.pathname + current.search));
    return destination;
  }

  return { authenticated, authorize, login, logout, loginUrl };
}

export const auth = createAuthHandlers({
  config: readAuthConfig,
  now: () => Math.floor(Date.now() / 1000),
  limiter: loginAttempts,
});
