import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGuest, ticketLinks } from "../../../../features/invitation/domain/invitation";

test("only named guests with an ID can receive invitations", () => {
  for (const value of [null, {}, [], { _id: "x" }, { _id: "", name: "Max" }, { _id: "x", name: " " }]) {
    assert.equal(parseGuest(value), null);
  }
});

test("guest data retains saved attendance and defaults unset flags to false", () => {
  assert.deepEqual(parseGuest({ _id: "guest-1", name: "Max Muster", accepted: true, companion: true, points: 20 }), {
    _id: "guest-1", name: "Max Muster", accepted: true, companion: true,
  });
  assert.deepEqual(parseGuest({ _id: "guest-2", name: "Alex" }), {
    _id: "guest-2", name: "Alex", accepted: false, companion: false,
  });
});

test("tickets preserve production destinations and encode the guest ID", () => {
  const links = ticketLinks("guest &?#");

  assert.equal(links.invitation, "https://geburtstag.manuelselch.de/invite?id=guest%20%26%3F%23");
  assert.equal(links.timeline, "/timeline?id=guest%20%26%3F%23");
  assert.equal(links.wallet, "https://geburtstag.manuelselch.de/api/apple-pass?id=guest%20%26%3F%23");
  assert.equal(links.whatsapp, "https://chat.whatsapp.com/KlJOiGqBwcEDC4R4pTK0vN?mode=wwt");
});
