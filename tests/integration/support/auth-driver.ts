import assert from "node:assert/strict";
import { createAuthHandlers } from "../../../features/admin-auth/app/http";
import { createPasswordHash, signSession } from "../../../features/admin-auth/infra/security";
import { AttemptLimiter } from "../../../features/admin-auth/infra/attempts";
import type { AuthConfig } from "../../../features/admin-auth/domain/rules";

export class AuthDriver {
  private time = 1_700_000_000;
  private config: AuthConfig | undefined = {
    passwordHash: createPasswordHash("party test password"),
    sessionSecret: "a".repeat(64),
    origin: "https://party.test",
    secure: true,
  };
  private readonly auth = createAuthHandlers({
    config: () => this.config,
    now: () => this.time,
    limiter: new AttemptLimiter(),
  });
  private response?: Response;
  private cookie = "";

  async login(password = "party test password", origin = "https://party.test", returnTo = "/admin/points") {
    this.response = await this.auth.login(new Request("https://party.test/api/admin/login", {
      method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ password, returnTo }),
    }));
    const cookie = this.response.headers.get("set-cookie");
    if (cookie) this.cookie = cookie.split(";")[0];
  }

  async openProtectedApi(mutation = false, origin?: string) {
    this.response = this.auth.authorize(new Request("https://party.test/api/guests", {
      method: mutation ? "POST" : "GET",
      headers: { Cookie: this.cookie, ...(origin ? { Origin: origin } : {}) },
    })) ?? Response.json({ success: true });
  }

  async logout(origin = "https://party.test") {
    this.response = await this.auth.logout(new Request("https://party.test/api/admin/logout", {
      method: "POST", headers: { Origin: origin, Cookie: this.cookie },
    }));
    if (this.response.ok) this.cookie = "";
  }

  thenRedirectUsesConfiguredOrigin() {
    const destination = this.auth.loginUrl(new Request("http://localhost:3187/admin/scanner?mode=scan"));
    assert.equal(destination.origin, "https://party.test");
    assert.equal(destination.pathname, "/admin/login");
    assert.equal(destination.searchParams.get("returnTo"), "/admin/scanner?mode=scan");
  }

  removeConfiguration() { this.config = undefined; }
  expireSession() { this.time += 43200; }
  tamperWithSession() { this.cookie += "x"; }
  useFutureSession() {
    this.cookie = "birthday_admin=" + signSession(this.config!, this.time + 100);
  }
  async thenStatus(status: number) { assert.equal(this.response?.status, status); }
  async thenDestination(destination: string) { assert.equal((await this.response!.json()).redirectTo, destination); }
  thenCookieIsSecure() {
    const cookie = this.response!.headers.get("set-cookie")!;
    for (const flag of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Max-Age=43200"]) assert.ok(cookie.includes(flag), flag);
    assert.equal(this.response!.headers.get("cache-control"), "no-store");
  }
  thenCookieIsCleared() { assert.match(this.response!.headers.get("set-cookie")!, /Max-Age=0/); }
  thenRetryIsAvailable() { assert.equal(this.response!.headers.get("retry-after"), "900"); }
}
