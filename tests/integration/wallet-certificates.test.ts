import { test } from "node:test";
import { WalletCertificatesDriver } from "./support/wallet-certificates-driver";

test("converts the pass and selected Apple intermediate certificates to PEM", async () => {
  const certificates = new WalletCertificatesDriver();
  await certificates.givenValidCertificates();

  await certificates.convert();

  await certificates.thenBothPemFilesMatchTheirCertificates();
});

test("preserves existing PEM files and converts after they are removed", async () => {
  const certificates = new WalletCertificatesDriver();
  await certificates.givenValidCertificatesAndExistingPemFiles();

  await certificates.convert();

  await certificates.thenConversionFailedWithoutReplacingPemFiles();

  await certificates.removeExistingPemFiles();
  await certificates.convert();

  await certificates.thenBothPemFilesMatchTheirCertificates();
});

test("reports a missing or invalid certificate without creating PEM files", async () => {
  const certificates = new WalletCertificatesDriver();
  await certificates.givenAnInvalidIntermediate();

  await certificates.convert();

  await certificates.thenConversionFailedWithoutCreatingPemFiles();
});
