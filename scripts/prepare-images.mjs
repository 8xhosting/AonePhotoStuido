/**
 * One-off setup script: copies the studio's selected photos from ./images
 * into public/images with semantic names, trimming the white scanner borders
 * from the flat album pages. Run: node scripts/prepare-images.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const srcDir = path.resolve("images");
const outDir = path.resolve("public/images");
mkdirSync(outDir, { recursive: true });

// [source, destination, trimWhiteBorders]
const jobs = [
  ["8.jpeg", "studio-gear.jpeg", false],       // camera equipment wall with studio neon
  ["11.jpeg", "wedding-collage.jpeg", true],   // 6-photo real wedding collage
  ["13.jpeg", "studio-wall.jpeg", false],      // studio photo-wall interior
  ["14.jpeg", "studio-shop.jpeg", false],      // studio shop counter interior
  ["15.jpeg", "newborn-collage.jpeg", true],   // newborn session 9-grid
  ["16.jpeg", "album-krishna.jpeg", false],    // little-krishna baby album design
  ["6.jpeg", "album-bride.jpeg", true],        // "The Bride" album spread
  ["7.jpeg", "album-wedding.jpeg", true],      // bride + wedding ceremony spread
  ["10.jpeg", "album-engagement.jpeg", true],  // forever + engagement spread
  ["12.jpeg", "album-love-story.jpeg", true],  // love story album cover
  ["5.jpeg", "gift-poster.jpeg", false],       // gift items promo poster
  ["3.jpeg", "poster-light.jpeg", false],      // light brand poster
];

for (const [src, dest, trim] of jobs) {
  let img = sharp(path.join(srcDir, src));
  if (trim) img = img.trim({ background: "#ffffff", threshold: 40 });
  await img
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, dest));
  const meta = await sharp(path.join(outDir, dest)).metadata();
  console.log(`${src} -> ${dest}  ${meta.width}x${meta.height}`);
}
console.log("Done.");
