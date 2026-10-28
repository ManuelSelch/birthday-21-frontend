import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGuestList } from "../../../../features/guests/domain/guest-data";

test("stored video flags must be actual booleans, not missing or truthy values", () => {
  const guest = { _id: "guest-1", name: "Alex", groups: [], hosts: [] };
  for (const video of [undefined, null, 0, 1, "false", "true"]) {
    assert.deepEqual(parseGuestList([{ ...guest, video }]), { ok: false, invalidIds: ["guest-1"] });
  }
  for (const video of [true, false]) {
    assert.deepEqual(parseGuestList([{ ...guest, video }]), { ok: true, guests: [{ ...guest, video }] });
  }
});
