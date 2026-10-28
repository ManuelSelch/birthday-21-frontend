import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import { createPasswordHash, signSession } from "../../../features/admin-auth/infra/security";

export class AdminRoutesDriver {
  private response?: Response;
  private cookie = "";
  private cockpitRequests: { url: string; method: string; data?: unknown }[] = [];
  private readonly hash = createPasswordHash("isolated test password");

  private constructor(private readonly routes: {
    guests: typeof import("../../../app/api/guests/route");
    points: typeof import("../../../app/api/points/route");
    checkIn: typeof import("../../../app/api/check-in/route");
  }) {}

  static async create(context: TestContext) {
    context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
      const url = String(input);
      driver.cockpitRequests.push({ url, method: options?.method ?? "GET", data: options?.body ? JSON.parse(String(options.body)) : undefined });
      return Response.json(url.includes("/items/") ? [{ _id: "guest-1", name: "Alex", accepted: true }] : { _id: "guest-1", name: "Alex", accepted: true });
    });
    process.env.COCKPIT_API_URL = "https://fake-cockpit.test/api";
    process.env.COCKPIT_API_KEY = "fake-api-key";
    const routes = {
      guests: await import("../../../app/api/guests/route"),
      points: await import("../../../app/api/points/route"),
      checkIn: await import("../../../app/api/check-in/route"),
    };
    const driver = new AdminRoutesDriver(routes);
    process.env.ADMIN_PASSWORD_HASH = driver.hash;
    process.env.ADMIN_SESSION_SECRET = "test-secret-".repeat(6);
    process.env.APP_ORIGIN = "https://party.test";
    return driver;
  }

  signIn() {
    this.cookie = "birthday_admin=" + signSession({
      passwordHash: this.hash, sessionSecret: process.env.ADMIN_SESSION_SECRET!,
      origin: "https://party.test", secure: false,
    }, Math.floor(Date.now() / 1000));
  }

  async readGuests() {
    this.response = await this.routes.guests.GET(new Request("https://party.test/api/guests", { headers: { Cookie: this.cookie } }));
  }

  async changePoints(points: unknown = 42, origin = "https://party.test") {
    this.response = await this.routes.points.POST(new Request("https://party.test/api/points", {
      method: "POST", headers: { Cookie: this.cookie, Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ id: "guest-1", points }),
    }));
  }

  async attemptPointsThroughGet() {
    this.response = await this.routes.points.GET();
  }

  async checkIn() {
    this.response = await this.routes.checkIn.POST(new Request("https://party.test/api/check-in", {
      method: "POST", headers: { Cookie: this.cookie, Origin: "https://party.test", "Content-Type": "application/json" },
      body: JSON.stringify({ id: "guest-1" }),
    }));
  }

  thenStatus(status: number) { assert.equal(this.response?.status, status); }
  thenCockpitWasNotAccessed() { assert.equal(this.cockpitRequests.length, 0); }
  thenPrivateResponse() { assert.equal(this.response!.headers.get("cache-control"), "no-store"); }
  thenPointsWereSaved() { assert.deepEqual(this.cockpitRequests.at(-1)?.data, { data: { _id: "guest-1", points: 42 } }); }
}
