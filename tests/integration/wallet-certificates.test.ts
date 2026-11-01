import { test } from "node:test";
import { WalletCertificatesDriver } from "./support/wallet-certificates-driver";

test("automatically finds the matching intermediate and converts both certificates to PEM", async () => {
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

test("reports a missing matching intermediate without creating PEM files", async () => {
  const certificates = new WalletCertificatesDriver();
  await certificates.givenAnInvalidIntermediate();

  await certificates.convert();

  await certificates.thenConversionFailedWithoutCreatingPemFiles();
});
