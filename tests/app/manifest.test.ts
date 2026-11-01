import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import manifest from "../../app/manifest";

test("the installed admin app opens the guest list in standalone mode", () => {
  const app = manifest();

  assert.equal(app.name, "21. Geburtstag");
  assert.equal(app.id, "/admin");
  assert.equal(app.start_url, "/admin/guests");
  assert.equal(app.scope, "/admin/");
  assert.equal(app.display, "standalone");
  assert.equal(app.lang, "de");
  assert.equal(app.theme_color, "#1a1919");
  assert.equal(app.background_color, "#1a1919");
});

test("install icons exist as correctly sized PNGs", async () => {
  const icons = manifest().icons;

  assert.ok(icons);
  assert.deepEqual(icons.map(icon => icon.sizes), ["192x192", "512x512"]);
  for (const icon of icons) {
    const png = await readFile(new URL(`../../public${icon.src}`, import.meta.url));
    const size = Number(icon.sizes?.split("x")[0]);

    assert.equal(icon.type, "image/png");
    assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
});
