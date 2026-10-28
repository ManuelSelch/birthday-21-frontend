import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../invitation-2026/assets/gala.jpg', import.meta.url));
const output = fileURLToPath(new URL('./invitation-banner.jpg', import.meta.url));
const width = 1200;
const height = 630;

// All lettering is composited separately so it remains crisp and editable.
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#080c18" stop-opacity=".96"/>
      <stop offset=".54" stop-color="#080c18" stop-opacity=".77"/>
      <stop offset="1" stop-color="#080c18" stop-opacity=".18"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d1220" stop-opacity="0"/>
      <stop offset="1" stop-color="#0d1220" stop-opacity=".65"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#bottom)"/>
  <rect x="30.5" y="30.5" width="1139" height="569" fill="none" stroke="#d9bd86" stroke-opacity=".35"/>
  <path d="M88 145H140" stroke="#d9bd86" stroke-width="2"/>
  <text x="88" y="190" fill="#e4c991" font-family="Arial, sans-serif" font-size="19" letter-spacing="5">DU BIST EINGELADEN</text>
  <text x="80" y="336" fill="#d9bd86" font-family="Georgia, serif" font-size="150">21.</text>
  <text x="84" y="432" fill="#f7f3ed" font-family="Georgia, serif" font-size="94" letter-spacing="-3">Geburtstag</text>
  <text x="90" y="505" fill="#e2ded7" font-family="Arial, sans-serif" font-size="20" letter-spacing="4">MANUEL · MARCO · DAVID</text>
</svg>`);

await sharp(source)
  .resize(width, height, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(output);

const metadata = await sharp(output).metadata();
if (metadata.width !== width || metadata.height !== height || metadata.format !== 'jpeg') {
  throw new Error('Unexpected banner dimensions or format');
}
console.log(`Created ${width} × ${height} JPEG: ${output}`);
