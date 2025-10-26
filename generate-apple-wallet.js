import { PKPass } from "passkit-generator";
import fs from "fs";

const model = "./passes/apple.pass"
const wwdr = "./certificates/wwdr.pem"
const signerCert = "./certificates/pass.pem"
const signerKey = "./certificates/my-key.key"
const signerKeyPassphrase = "bkHnCvgUnLd11w"

try {
  (async () => {
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
        serialNumber: "[generated at random]",
      }
    );

    const buffer = pass.getAsBuffer();
    fs.writeFileSync("out/pass.pkpass", buffer);
  })();
} catch (err) {
  console.log(err);
}