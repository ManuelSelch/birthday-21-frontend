import { test } from "node:test";
import { WalletCertificateDownloadDriver } from "./support/wallet-certificate-download-driver";

test("downloads Apple's WWDR G4 certificate to the certificates directory", async () => {
  const download = new WalletCertificateDownloadDriver();

  await download.download();

  await download.thenAppleG4CertificateWasSaved();
});

test("reports a failed download without leaving a partial certificate", async () => {
  const download = new WalletCertificateDownloadDriver();
  download.givenDownloadFailure();

  await download.download();

  await download.thenDownloadFailedWithoutPartialCertificate();
});
