import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export class WalletCertificatesDriver {
  private readonly directory = mkdtempSync(join(tmpdir(), "wallet-certificates-"));
  private result: ReturnType<typeof spawnSync> | undefined;

  async givenValidCertificates(): Promise<void> {
    for (const name of ["pass", "intermediate"]) {
      execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-subj", `/CN=${name}`, "-keyout", join(this.directory, `${name}.key`), "-out", join(this.directory, `${name}.pem`), "-days", "1"], { stdio: "ignore" });
      execFileSync("openssl", ["x509", "-in", join(this.directory, `${name}.pem`), "-outform", "DER", "-out", join(this.directory, `${name}.cer`)]);
      rmSync(join(this.directory, `${name}.pem`));
    }
  }

  async givenValidCertificatesAndExistingPemFiles(): Promise<void> {
    await this.givenValidCertificates();
    for (const name of ["pass", "wwdr"]) writeFileSync(join(this.directory, `${name}.pem`), "existing");
  }

  async givenAnInvalidIntermediate(): Promise<void> {
    await this.givenValidCertificates();
    writeFileSync(join(this.directory, "intermediate.cer"), "invalid");
  }

  async removeExistingPemFiles(): Promise<void> {
    for (const name of ["pass", "wwdr"]) rmSync(join(this.directory, `${name}.pem`));
  }

  async convert(): Promise<void> {
    this.result = spawnSync("bash", [resolve("scripts/convert-wallet-certificates.sh"), join(this.directory, "intermediate.cer"), join(this.directory, "pass.cer"), this.directory], { encoding: "utf8" });
  }

  async thenBothPemFilesMatchTheirCertificates(): Promise<void> {
    try {
      assert.equal(this.result?.status, 0, String(this.result?.stderr));
      for (const [source, target] of [["pass", "pass"], ["intermediate", "wwdr"]]) {
        const original = execFileSync("openssl", ["x509", "-inform", "DER", "-in", join(this.directory, `${source}.cer`), "-outform", "DER"]);
        const converted = execFileSync("openssl", ["x509", "-in", join(this.directory, `${target}.pem`), "-outform", "DER"]);
        assert.deepEqual(converted, original);
      }
    } finally { this.cleanup(); }
  }

  async thenConversionFailedWithoutReplacingPemFiles(): Promise<void> {
    assert.notEqual(this.result?.status, 0);
    for (const name of ["pass", "wwdr"]) assert.equal(readFileSync(join(this.directory, `${name}.pem`), "utf8"), "existing");
  }

  async thenConversionFailedWithoutCreatingPemFiles(): Promise<void> {
    try {
      assert.notEqual(this.result?.status, 0);
      for (const name of ["pass", "wwdr"]) assert.throws(() => readFileSync(join(this.directory, `${name}.pem`)), { code: "ENOENT" });
    } finally { this.cleanup(); }
  }

  private cleanup(): void { rmSync(this.directory, { recursive: true, force: true }); }
}
