// Converts screenshots to WebP next to the originals, e.g. from the repo root:
//   node apps/my-website/scripts/to-webp.mjs apps/my-website/public/resources/images/projects/new1.png
// Quality 80 suits UI screenshots. Pass --quality 85 for renders with smooth
// dark gradients (the ray-tracing images), which band at 80. Delete the
// originals once the page points at the .webp files.
// Keep og:image files (og-image.png, ray-tracing/thumbs) as PNG or JPG, because
// LinkedIn doesn't show WebP previews. Keep the sky faces as JPG too: they hold
// log-encoded brightness, and lossy WebP shifts it.
import { parseArgs } from "node:util";
import sharp from "sharp";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { quality: { type: "string", default: "80" } },
});

for (const file of positionals) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  if (out === file) throw new Error(`Not a PNG or JPG: ${file}`);
  const { size } = await sharp(file).webp({ quality: Number(values.quality), effort: 6, smartSubsample: true }).toFile(out);
  console.log(`Wrote ${out} (${Math.round(size / 1024)} KB)`);
}
