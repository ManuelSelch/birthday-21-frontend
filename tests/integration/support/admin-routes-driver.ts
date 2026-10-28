import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import { createSession } from "../../../features/admin-auth/infra/session";

export class AdminRoutesDriver {
  private response?: Response;
  private cookie = "";
  private failCockpit = false;
  private savedResult: unknown = { _id: "new-guest" };
  private cockpitRequests: { url: string; method: string; data?: unknown }[] = [];

  private constructor(private readonly routes: {
    guests: typeof import("../../../app/api/guests/route");
    points: typeof import("../../../app/api/points/route");
    checkIn: typeof import("../../../app/api/check-in/route");
  }) {}

  static async create(context: TestContext) {
    context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
      const url = String(input);
      driver.cockpitRequests.push({ url, method: options?.method ?? "GET", data: options?.body ? JSON.parse(String(options.body)) : undefined });
      if (driver.failCockpit) return new Response("private upstream detail", { status: 500 });
      if (options?.method === "POST" && url.endsWith("/item/guests")) return Response.json(driver.savedResult);
      return Response.json(url.includes("/items/") ? [{ _id: "guest-1", name: "Alex", accepted: true }] : { _id: "guest-1", name: "Alex", accepted: true });
    });
    const original = process.env;
    process.env = { ...original, ADMIN_PASSWORD: "party" };
    context.after(() => { process.env = original; });
    process.env.COCKPIT_API_URL = "https://fake-cockpit.test/api";
    process.env.COCKPIT_API_KEY = "fake-api-key";
    const routes = {
      guests: await import("../../../app/api/guests/route"),
      points: await import("../../../app/api/points/route"),
      checkIn: await import("../../../app/api/check-in/route"),
    };
    const driver = new AdminRoutesDriver(routes);
    return driver;
  }

  signIn() {
    this.cookie = "birthday_admin=" + createSession();
  }

  async readGuests() {
    this.response = await this.routes.guests.GET(new Request("https://party.test/api/guests", { headers: { Cookie: this.cookie } }));
  }

  async addGuest(body: unknown = { name: "  New Guest  " }, origin: string | null = "https://party.test") {
    this.response = await this.routes.guests.POST(new Request("https://party.test/api/guests", {
      method: "POST", headers: { Cookie: this.cookie, ...(origin === null ? {} : { Origin: origin }), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }));
  }

  async sendMalformedGuestBody(body: string, contentType = "application/json") {
    this.response = await this.routes.guests.POST(new Request("https://party.test/api/guests", {
      method: "POST", headers: { Cookie: this.cookie, Origin: "https://party.test", "Content-Type": contentType }, body,
    }));
  }

  makeCockpitFail() { this.failCockpit = true; }
  returnUnconfirmedSave() { this.savedResult = { error: "private upstream detail" }; }
  thenGuestWasCreated() {
    assert.equal(this.cockpitRequests.length, 1);
    assert.deepEqual(this.cockpitRequests[0].data, { data: {
      name: "New Guest", invited: false, accepted: false, checked_in: false, companion: false, points: 0,
    } });
  }
  async thenCreationSucceeded() { assert.deepEqual(await this.response!.json(), { success: true }); }
  async thenGenericSaveError() {
    assert.deepEqual(await this.response!.json(), { error: "Gast konnte nicht hinzugefügt werden. Bitte versuche es erneut." });
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
