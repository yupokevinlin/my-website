// Renders public/resources/og-image.png, the 1200 x 630 picture LinkedIn, Slack
// and search results show for links to the home page. Edit og-image.html when
// the name or title changes, then run from the repo root:
//   node apps/my-website/scripts/og-image/render.mjs
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../public/resources/og-image.png");

// Installed Chrome, since Playwright's own Chromium may not be downloaded
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(here, "og-image.html")).href);
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await browser.close();

await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
console.log(`Wrote ${out}`);
