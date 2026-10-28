import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import { metadata } from "../../app/invite/layout";

test("invitation previews have public, guest-independent German metadata", () => {
  assert.equal(metadata.metadataBase?.toString(), "https://geburtstag.manuelselch.de/");
  assert.equal(metadata.title, "21. Geburtstag");
  assert.equal(metadata.description, "Du bist eingeladen! Alle Infos & deine Zusage findest du hier.");
  assert.deepEqual(metadata.openGraph, {
    title: metadata.title,
    description: metadata.description,
    type: "website",
    locale: "de_DE",
    siteName: "21. Geburtstag",
  });
  // Do not replace the personalised invitation URL with a generic canonical URL.
  assert.equal(metadata.alternates, undefined);
});

test("the route's Open Graph image is exactly the approved 1200 × 630 banner", async () => {
  const image = await readFile(new URL("../../app/invite/opengraph-image.jpg", import.meta.url));
  const approved = await readFile(new URL("../../mockups/share-banner/invitation-banner.jpg", import.meta.url));

  assert.deepEqual(image, approved);
  const info = await sharp(image).metadata();
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
  assert.equal(info.format, "jpeg");
  assert.ok(image.length < 300_000);
  assert.equal(
    (await readFile(new URL("../../app/invite/opengraph-image.alt.txt", import.meta.url), "utf8")).trim(),
    "Du bist eingeladen – 21. Geburtstag von Manuel, Marco & David",
  );
});
