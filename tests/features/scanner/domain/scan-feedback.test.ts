import { test } from "node:test";
import assert from "node:assert/strict";
import { scanFeedback } from "../../../../features/scanner/domain/scan-feedback";

test("successful check-in shows a German confirmation", () => {
  assert.deepEqual(scanFeedback({ success: true }), {
    tone: "success", title: "Ticket gültig", message: "Check-in erfolgreich.",
  });
});

test("check-in warnings remain distinct from errors", () => {
  assert.deepEqual(scanFeedback({ success: false, warning: "guest is already checked in" }), {
    tone: "warning", title: "Bereits eingecheckt", message: "Dieser Gast wurde bereits eingecheckt.",
  });
  assert.equal(scanFeedback({ success: false, warning: "guest has not accepted invitation" }).message,
    "Dieser Gast hat die Einladung noch nicht angenommen.");
});

test("invalid tickets and server failures have readable error feedback", () => {
  assert.equal(scanFeedback({ success: false, error: "ticket is invalid" }).message, "Dieses Ticket ist ungültig.");
  assert.equal(scanFeedback({ success: false, error: "server error" }).message, "Das Ticket konnte nicht geprüft werden. Bitte erneut versuchen.");
});

test("unrecognized response details are preserved", () => {
  assert.equal(scanFeedback({ success: false, error: "Service unavailable" }).message, "Service unavailable");
  assert.equal(scanFeedback({ success: false }).tone, "error");
});
