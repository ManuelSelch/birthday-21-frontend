import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTimeline, invitationReturnLink } from "../../../../features/timeline/domain/timeline";

const item = (start = "2026-11-14 19:00") => ({
  _id: "arrival", title: "Empfang", subtitle: "Ankommen",
  description: "Erst mal ankommen, etwas trinken und Hallo sagen.", start,
});

test("maps only display fields and sorts chronologically across midnight", () => {
  const entries = parseTimeline([
    { ...item("2026-11-15 00:30"), _id: "dance", title: "Musik & Tanz", privateNote: "secret" },
    item(),
  ]);

  assert.deepEqual(entries.map(entry => entry.title), ["Empfang", "Musik & Tanz"]);
  assert.equal(entries[0].time, "19:00");
  assert.equal(entries[1].time, "00:30");
  assert.equal("privateNote" in entries[1], false);
});

test("uses Berlin venue time for ISO timestamps regardless of server timezone", () => {
  assert.equal(parseTimeline([item("2026-11-14T18:00:00Z")])[0].time, "19:00");
  assert.equal(parseTimeline([item("2026-07-14T17:00:00Z")])[0].time, "19:00");
  assert.equal(parseTimeline([item("2026-11-14T19:00:00+01:00")])[0].time, "19:00");
});

test("accepts blank subtitle and description and an empty collection", () => {
  assert.deepEqual(parseTimeline([]), []);
  assert.equal(parseTimeline([{ ...item(), subtitle: "", description: "" }])[0].subtitle, "");
});

test("rejects invalid collection data rather than rendering a broken schedule", () => {
  for (const value of [null, {}, { items: [] }, [null], [{ ...item(), title: " " }], [{ ...item(), subtitle: undefined }], [{ ...item(), description: {} }], [{ ...item(), _id: "" }]]) {
    assert.throws(() => parseTimeline(value), /timeline/i);
  }
  for (const start of ["19:00", "", "invalid", "2026-02-30 19:00", "2026-11-14 25:00"]) {
    assert.throws(() => parseTimeline([item(start)]), /timeline/i);
  }
});

test("return links are local and encode a single invitation ID", () => {
  assert.equal(invitationReturnLink("guest &?#"), "/invite?id=guest%20%26%3F%23");
  for (const id of [undefined, "", " ", ["a", "b"]]) assert.equal(invitationReturnLink(id), null);
});
