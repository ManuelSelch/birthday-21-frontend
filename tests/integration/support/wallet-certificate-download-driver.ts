import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export class WalletCertificateDownloadDriver {
  private readonly root = mkdtempSync(join(tmpdir(), "wallet-download-"));
  private readonly bin = join(this.root, "bin");
  private readonly output = join(this.root, "certificates", "AppleWWDRCAG4.cer");
  private failure = false;
  private result: ReturnType<typeof spawnSync> | undefined;

  constructor() { mkdirSync(this.bin); }
  givenDownloadFailure(): void { this.failure = true; }

  async download(): Promise<void> {
    const curl = join(this.bin, "curl");
    writeFileSync(curl, `#!/bin/bash\nprintf '%s\\n' "$@" > "$CURL_ARGS"\nwhile [ "$#" -gt 0 ]; do\n  if [ "$1" = "--output" ]; then shift; printf 'certificate' > "$1"; fi\n  shift\ndone\nexit ${this.failure ? 22 : 0}\n`);
    chmodSync(curl, 0o755);
    this.result = spawnSync("bash", [resolve("scripts/download-wallet-certificate.sh")], {
      cwd: this.root,
      env: { ...process.env, PATH: `${this.bin}:${process.env.PATH}`, CURL_ARGS: join(this.root, "args") },
      encoding: "utf8",
    });
  }

  async thenAppleG4CertificateWasSaved(): Promise<void> {
    try {
      assert.equal(this.result?.status, 0, String(this.result?.stderr));
      assert.equal(readFileSync(this.output, "utf8"), "certificate");
      assert.match(readFileSync(join(this.root, "args"), "utf8"), /https:\/\/www\.apple\.com\/certificateauthority\/AppleWWDRCAG4\.cer/);
    } finally { this.cleanup(); }
  }

  async thenDownloadFailedWithoutPartialCertificate(): Promise<void> {
    try {
      assert.notEqual(this.result?.status, 0);
      assert.equal(existsSync(this.output), false);
    } finally { this.cleanup(); }
  }

  private cleanup(): void { rmSync(this.root, { recursive: true, force: true }); }
}
