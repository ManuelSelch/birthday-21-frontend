import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export class WalletCertificatesDriver {
  private readonly root = mkdtempSync(join(tmpdir(), "wallet-certificates-"));
  private readonly directory = join(this.root, "certificates");
  private result: ReturnType<typeof spawnSync> | undefined;

  constructor() { mkdirSync(this.directory); }

  async givenValidCertificates(): Promise<void> {
    const path = (name: string) => join(this.directory, name);
    const run = (args: string[]) => execFileSync("openssl", args, { stdio: "ignore" });
    run(["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-subj", "/CN=Intermediate", "-keyout", path("intermediate.key"), "-out", path("intermediate.pem"), "-days", "1"]);
    run(["req", "-new", "-newkey", "rsa:2048", "-nodes", "-subj", "/CN=Pass", "-keyout", path("pass.key"), "-out", path("pass.csr")]);
    run(["x509", "-req", "-in", path("pass.csr"), "-CA", path("intermediate.pem"), "-CAkey", path("intermediate.key"), "-set_serial", "1", "-out", path("pass.pem"), "-days", "1"]);
    for (const name of ["pass", "intermediate"]) {
      run(["x509", "-in", path(`${name}.pem`), "-outform", "DER", "-out", path(`${name}.cer`)]);
      rmSync(path(`${name}.pem`));
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
    this.result = spawnSync("bash", [resolve("scripts/convert-wallet-certificates.sh")], { cwd: this.root, encoding: "utf8" });
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
      assert.match(String(this.result?.stderr), /matching intermediate/i);
      for (const name of ["pass", "wwdr"]) assert.throws(() => readFileSync(join(this.directory, `${name}.pem`)), { code: "ENOENT" });
    } finally { this.cleanup(); }
  }

  private cleanup(): void { rmSync(this.root, { recursive: true, force: true }); }
}
