import { PKPass } from "passkit-generator";
import fs from "fs";

const model = "./passes/apple.pass"
const wwdr = "./certificates/wwdr.pem"
const signerCert = "./certificates/pass.pem"
const signerKey = "./certificates/my-key.key"
const signerKeyPassphrase = "bkHnCvgUnLd11w"

export default async function generateApplePass(guest) {
    const pass = await PKPass.from(
      {
        model,
        certificates: {
          wwdr: fs.readFileSync(wwdr),
          signerCert: fs.readFileSync(signerCert),
          signerKey: fs.readFileSync(signerKey),
          signerKeyPassphrase,
        },
      },
      {
        serialNumber: guest._id,
        description: `Ticket for ${guest.name}`,
        barcode: {
          message: guest._id,
          format: "PKBarcodeFormatQR"
        },

        eventTicket: {
          primaryFields: [
            { key: "name", label: "Guest", value: guest.name },
            { key: "date", label: "Date", value: "01.11.2025" }
          ],
        },
      }
    );

    return pass.getAsBuffer();
}