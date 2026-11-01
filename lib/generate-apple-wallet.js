import { PKPass } from "passkit-generator";
import fs from "fs";

const model = "./passes/apple.pass";
const wwdr = "./certificates/wwdr.pem";
const signerCert = "./certificates/pass.pem";
const signerKey = "./certificates/my-key.key";
const signerKeyPassphrase = process.env.APPLE_WALLET_KEY_PASSPHRASE;

export async function createApplePass(guest, certificates) {
  const guestLink = `https://geburtstag.manuelselch.de/invite?id=${guest._id}`;

  const pass = await PKPass.from(
    {
      model,
      certificates,
    },
    {
      serialNumber: guest._id,
      description: `Ticket für ${guest.name}`
    }
  );

  pass.secondaryFields.push({ key: "name", label: "Gast", value: guest.name });
  pass.setBarcodes({
    message: guestLink,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1"
  });

  return pass;
}

export default async function generateApplePass(guest) {
  const pass = await createApplePass(guest, {
    wwdr: fs.readFileSync(wwdr),
    signerCert: fs.readFileSync(signerCert),
    signerKey: fs.readFileSync(signerKey),
    signerKeyPassphrase,
  });

  return pass.getAsBuffer();
}
