import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const BRAND = "#1f7a69";

function pawSvg({ size, padding, background, foreground }) {
  const inner = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const s = inner / 100;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${background ? `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${background}"/>` : ""}
  <g transform="translate(${cx - 50 * s}, ${cy - 50 * s}) scale(${s})">
    <ellipse cx="50" cy="66" rx="26" ry="22" fill="${foreground}"/>
    <ellipse cx="18" cy="38" rx="12" ry="15" fill="${foreground}"/>
    <ellipse cx="42" cy="20" rx="12" ry="15.5" fill="${foreground}"/>
    <ellipse cx="68" cy="20" rx="12" ry="15.5" fill="${foreground}"/>
    <ellipse cx="88" cy="40" rx="11.5" ry="14.5" fill="${foreground}"/>
  </g>
</svg>`;
}

const targets = [
  { file: "icon-192.png", size: 192, padding: 28, background: BRAND, foreground: "#ffffff" },
  { file: "icon-512.png", size: 512, padding: 74, background: BRAND, foreground: "#ffffff" },
  { file: "maskable-512.png", size: 512, padding: 128, background: BRAND, foreground: "#ffffff" },
  { file: "apple-touch-icon.png", size: 180, padding: 26, background: BRAND, foreground: "#ffffff" },
];

for (const t of targets) {
  const svg = pawSvg(t);
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, t.file));
  console.log("wrote", t.file);
}

// Favicon source (32px) placed at app root for Next's static favicon convention.
const faviconSvg = pawSvg({ size: 32, padding: 3, background: BRAND, foreground: "#ffffff" });
await sharp(Buffer.from(faviconSvg))
  .png()
  .toFile(path.join(__dirname, "..", "app", "icon.png"));
console.log("wrote app/icon.png");
