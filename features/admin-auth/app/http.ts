import { SESSION_COOKIE, SESSION_SECONDS, safeAdminDestination } from "../domain/rules";
import { createSession, passwordMatches, validSession } from "../infra/session";

export function privateJson(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  const result = new Headers(headers);
  result.set("Cache-Control", "no-store");
  return Response.json(body, { status, headers: result });
}

export async function readAdminBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function sessionCookie(token: string, clear = false): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : SESSION_SECONDS}` +
    (process.env.NODE_ENV === "production" ? "; Secure" : "");
}

export const auth = {
  authenticated: validSession,

  authorize(request: Request): Response | undefined {
    const cookie = (request.headers.get("cookie") ?? "").split(";")
      .map(value => value.trim()).find(value => value.startsWith(SESSION_COOKIE + "="));
    if (!validSession(cookie?.slice(SESSION_COOKIE.length + 1))) {
      return privateJson({ success: false, error: "Unauthorized" }, 401);
    }
  },

  async login(request: Request): Promise<Response> {
    if (!process.env.ADMIN_PASSWORD) return privateJson({ error: "Anmeldung nicht verfügbar." }, 503);
    const body = await readAdminBody(request);
    if (!passwordMatches(body?.password)) {
      return privateJson({ error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." }, 401);
    }

    return privateJson({
      redirectTo: safeAdminDestination(typeof body?.returnTo === "string" ? body.returnTo : undefined),
    }, 200, { "Set-Cookie": sessionCookie(createSession()) });
  },

  async logout(): Promise<Response> {
    return privateJson({ success: true }, 200, { "Set-Cookie": sessionCookie("", true) });
  },

  loginUrl(request: Request): URL {
    const current = new URL(request.url);
    const destination = new URL("/admin/login", current.origin);
    destination.searchParams.set("returnTo", safeAdminDestination(current.pathname + current.search));
    return destination;
  },
};
