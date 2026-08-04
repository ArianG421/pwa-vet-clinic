import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

// Source: Öresunds Veterinärklinik's real favicon (blue cross + dog/cat/
// rabbit silhouette), downloaded from their live site into public/brand-ref.
const SOURCE = path.join(__dirname, "..", "public", "brand-ref", "favicon.png");
// White, not brand blue — the source image is already a blue cross with
// transparent corners, so a blue backing would wash it out to near-invisible.
const BACKING = "#ffffff";

async function roundedIcon({ size, padding, background }) {
  const inner = size - padding * 2;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#fff"/></svg>`
  );
  const bg = await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const mark = await sharp(SOURCE).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

  return sharp(bg).composite([{ input: mark, gravity: "center" }]).png();
}

const targets = [
  { file: "icon-192.png", size: 192, padding: 30 },
  { file: "icon-512.png", size: 512, padding: 80 },
  { file: "maskable-512.png", size: 512, padding: 140 },
  { file: "apple-touch-icon.png", size: 180, padding: 26 },
];

for (const t of targets) {
  const img = await roundedIcon({ size: t.size, padding: t.padding, background: BACKING });
  await img.toFile(path.join(outDir, t.file));
  console.log("wrote", t.file);
}

// Favicon (32px) placed at app root for Next's static favicon convention.
const favicon = await roundedIcon({ size: 32, padding: 3, background: BACKING });
await favicon.toFile(path.join(__dirname, "..", "app", "icon.png"));
console.log("wrote app/icon.png");
