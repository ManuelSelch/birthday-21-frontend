import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import { createApplePass } from "../../lib/generate-apple-wallet.js";

const certificates = { wwdr: Buffer.from("test"), signerCert: Buffer.from("test"), signerKey: Buffer.from("test") };

test("the event pass retains the guest identity and QR while using the approved ticket styling", async () => {
  const pass = await createApplePass({ _id: "guest-123", name: "Max Mustermann" }, certificates);
  const props = pass.props;

  assert.equal(props.serialNumber, "guest-123");
  assert.equal(props.backgroundColor, "rgb(33, 29, 28)");
  assert.equal(props.foregroundColor, "rgb(247, 244, 239)");
  assert.equal(props.labelColor, "rgb(207, 178, 131)");
  assert.equal(props.logoText, "Unser 21. Geburtstag");
  assert.ok(props.eventTicket);
  assert.ok(props.barcodes);
  assert.equal(props.eventTicket.primaryFields.length, 0);
  assert.deepEqual(Array.from(props.eventTicket.secondaryFields), [{ key: "name", label: "Gast", value: "Max Mustermann" }]);
  assert.deepEqual(Array.from(props.eventTicket.auxiliaryFields, ({ key, value }) => [key, value]), [
    ["date", "20.11.2026"], ["time", "21 Uhr"], ["location", "Reichshof Bayreuth"],
  ]);
  assert.equal(props.barcodes[0].message, "https://geburtstag.manuelselch.de/invite?id=guest-123");
  assert.equal(props.barcodes[0].format, "PKBarcodeFormatQR");
});

test("the Wallet artwork is a real PNG with appropriately sized strip and icon assets", async () => {
  for (const [file, width, height] of [["strip.png", 375, 98], ["strip@2x.png", 750, 196], ["strip@3x.png", 1125, 294], ["icon.png", 29, 29], ["icon@2x.png", 58, 58], ["icon@3x.png", 87, 87]] as const) {
    const metadata = await sharp(await readFile(`passes/apple.pass/${file}`)).metadata();

    assert.equal(metadata.format, "png", file);
    assert.equal(metadata.width, width, file);
    assert.equal(metadata.height, height, file);
  }
});
