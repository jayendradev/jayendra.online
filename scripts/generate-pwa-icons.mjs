import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const iconsDir = path.join(publicDir, "icons");
const sources = ["team.png", "avatar.jpg", "avatar.png"];

let source = null;
for (const file of sources) {
  const p = path.join(publicDir, file);
  if (fs.existsSync(p)) {
    source = p;
    break;
  }
}

if (!source) {
  console.warn("No team.png/avatar found — skipping PWA icon generation.");
  process.exit(0);
}

fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(source)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png({ quality: 90 })
    .toFile(path.join(iconsDir, name));
  console.log(`Wrote icons/${name}`);
}
