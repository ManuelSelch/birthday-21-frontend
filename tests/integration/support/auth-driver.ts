import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import { auth } from "../../../features/admin-auth/app/http";

export class AuthDriver {
  private time = 1_700_000_000;
  private response?: Response;
  private cookie = "";

  constructor(context: TestContext) {
    const original = process.env;
    process.env = { ...original, ADMIN_PASSWORD: "party", NODE_ENV: "production" };
    context.after(() => { process.env = original; });
    context.mock.method(Date, "now", () => this.time * 1000);
  }

  async login(password = "party", returnTo = "/admin/points") {
    this.response = await auth.login(new Request("https://party.test/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, returnTo }),
    }));
    const cookie = this.response.headers.get("set-cookie");
    if (cookie) this.cookie = cookie.split(";")[0];
  }

  async openProtectedApi() {
    this.response = auth.authorize(new Request("https://party.test/api/guests", {
      headers: { Cookie: this.cookie },
    })) ?? Response.json({ success: true });
  }

  async logout() {
    this.response = await auth.logout();
    if (this.response.ok) this.cookie = "";
  }

  removePassword() { delete process.env.ADMIN_PASSWORD; }
  useEmptyPassword() { process.env.ADMIN_PASSWORD = ""; }
  changePassword() { process.env.ADMIN_PASSWORD = "new-party-password"; }
  expireSession() { this.time += 43200; }
  tamperWithSession() { this.cookie += "x"; }
  thenStatus(status: number) { assert.equal(this.response?.status, status); }
  async thenDestination(destination: string) { assert.equal((await this.response!.json()).redirectTo, destination); }
  thenCookieIsSecure() {
    const cookie = this.response!.headers.get("set-cookie")!;
    for (const flag of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Max-Age=43200"]) assert.ok(cookie.includes(flag), flag);
    assert.equal(this.response!.headers.get("cache-control"), "no-store");
    assert.equal(cookie.includes("party"), false);
  }
  thenCookieIsCleared() { assert.match(this.response!.headers.get("set-cookie")!, /Max-Age=0/); }
}
