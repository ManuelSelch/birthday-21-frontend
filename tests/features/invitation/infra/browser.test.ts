import assert from "node:assert/strict";
import { test } from "node:test";
import { submitInvitation } from "../../../../features/invitation/infra/browser";

test("each invitation action preserves its GET endpoint and query", async () => {
  const calls: string[] = [];
  const request: typeof fetch = async (input, init) => {
    calls.push(String(input));
    assert.equal(init?.method, "GET");
    assert.equal(init?.cache, "no-store");
    return Response.json({ success: true });
  };

  for (const action of ["invited", "accept", "cancel"] as const) {
    assert.equal(await submitInvitation(action, "guest &1", undefined, request), true);
  }
  await submitInvitation("companion", "guest-1", true, request);
  await submitInvitation("companion", "guest-1", false, request);

  assert.deepEqual(calls, ["/api/invited?id=guest+%261", "/api/accept?id=guest+%261", "/api/cancel?id=guest+%261", "/api/companion?id=guest-1&companion=1", "/api/companion?id=guest-1&companion=0"]);
});

test("HTTP failures, failed results, invalid JSON and network errors never count as success", async () => {
  const requests: typeof fetch[] = [
    async () => Response.json({ success: true }, { status: 500 }),
    async () => Response.json({ success: false }),
    async () => Response.json({}),
    async () => Response.json(null),
    async () => new Response("not json"),
    async () => { throw new Error("offline"); },
  ];

  for (const request of requests) {
    assert.equal(await submitInvitation("accept", "guest-1", undefined, request), false);
  }
});
