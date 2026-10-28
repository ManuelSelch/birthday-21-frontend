import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import api from "../../../lib/api";

export class AdminClientDriver {
  private requests: { url: string; options?: RequestInit }[] = [];

  constructor(context: TestContext) {
    context.mock.method(globalThis, "fetch", async (url: string, options?: RequestInit) => {
      this.requests.push({ url, options });
      return Response.json({ success: true });
    });
  }

  async changePoints() { await api.setPoints({ _id: "guest-1" }, 42); }
  async checkIn() { assert.equal((await api.checkIn("guest-1")).success, true); }

  thenPostBodiesWereSent() {
    assert.deepEqual(this.requests.map(({ url, options }) => ({
      url, method: options?.method, contentType: (options?.headers as Record<string, string>)?.["Content-Type"],
      body: JSON.parse(String(options?.body)),
    })), [
      { url: "/api/points", method: "POST", contentType: "application/json", body: { id: "guest-1", points: 42 } },
      { url: "/api/check-in", method: "POST", contentType: "application/json", body: { id: "guest-1" } },
    ]);
  }
}
