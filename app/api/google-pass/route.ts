import jwt from "jsonwebtoken";
import { GoogleAuth } from "google-auth-library";
import fs from "fs";
import path from "path";

export default async function GET(req: Request, res: Response) {
  const serviceAccountPath = path.join(process.cwd(), "certificates", "google-service-account.json");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  const issuerId = "YOUR_ISSUER_ID"; // from Google Wallet console
  const classId = `${issuerId}.demoClass`; 
  const objectId = `${issuerId}.demoObject-${Date.now()}`;

  // pass object
  const objectPayload = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    heroImage: {
      sourceUri: {
        uri: "https://example.com/image.png"
      },
      contentDescription: { defaultValue: { language: "en-US", value: "Demo pass" } }
    },
    textModulesData: [
      { header: "Title", body: "This is your custom Google Wallet pass" }
    ],
    barcode: {
      type: "QR_CODE",
      value: "1234567890"
    }
  };

  // create the JWT
  const jwtPayload = {
    iss: serviceAccount.client_email,
    aud: "google",
    origins: ["https://yourdomain.com"],
    typ: "savetowallet",
    payload: {
      genericObjects: [objectPayload]
    }
  };

  // sign it
  const token = jwt.sign(jwtPayload, serviceAccount.private_key, { algorithm: "RS256" });

  // create the "Save to Wallet" URL
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return new Response(JSON.stringify({saveUrl}))
}
