import assert from "node:assert/strict";
import { test } from "node:test";
import { createPasswordHash, verifyPassword, signSession, validSession } from "../../../../features/admin-auth/infra/security";
import { AttemptLimiter } from "../../../../features/admin-auth/infra/attempts";

test("salted password hashes verify only the original password", async () => {
  const hash = createPasswordHash("correct horse battery staple");

  assert.notEqual(hash, createPasswordHash("correct horse battery staple"));
  assert.equal(await verifyPassword("correct horse battery staple", hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
  assert.equal(await verifyPassword("password", "invalid"), false);
});

test("sessions expire, reject tampering and are invalidated by credential rotation", () => {
  const config = { passwordHash: createPasswordHash("test password"), sessionSecret: "a".repeat(64), origin: "http://localhost:3000", secure: false };
  const now = 1_700_000_000;
  const token = signSession(config, now);

  assert.equal(validSession(token, config, now), true);
  assert.equal(validSession(token, config, now + 43199), true);
  assert.equal(validSession(token, config, now + 43200), false);
  assert.equal(validSession(token, config, now - 1), false);
  assert.equal(validSession(token + "x", config, now), false);
  assert.equal(validSession("garbage", config, now), false);
  assert.equal(validSession(token, { ...config, sessionSecret: "b".repeat(64) }, now), false);
  assert.equal(validSession(token, { ...config, passwordHash: createPasswordHash("new password") }, now), false);
});

test("login attempt budget is fixed, global and resets at the window boundary", () => {
  const limiter = new AttemptLimiter();

  for (let i = 0; i < 10; i++) assert.equal(limiter.consume(1000), 0);
  assert.equal(limiter.consume(1000), 900);
  assert.equal(limiter.consume(1500), 400);
  assert.equal(limiter.consume(1900), 0);
});
