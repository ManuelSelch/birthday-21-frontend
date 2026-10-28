import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";

if (process.stdin.isTTY) {
  console.error("Pipe a password from standard input; see docs/admin-login/SETUP.md.");
  process.exit(1);
}

const password = readFileSync(0, "utf8");
if (password.length < 12 || password.length > 1024) {
  console.error("Use a password between 12 and 1024 characters (without a trailing newline).");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
console.log(`scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`);
