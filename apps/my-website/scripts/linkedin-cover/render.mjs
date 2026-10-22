// Renders linkedin-cover-<season>.png, the 1584 x 396 background photos for the top of Kevin's
// LinkedIn profile: the home page's picture for each season, without text. They aren't part of the
// site: upload them on LinkedIn (the camera button on the cover), one as the cover or all four in
// Premium's cover slideshow. After editing linkedin-cover.html, run from the repo root:
//   node apps/my-website/scripts/linkedin-cover/render.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const SEASONS = ["spring", "summer", "autumn", "winter"];

// Each season's picture and sky, as on the home page (SEASON_SCENE in src/v2/season.ts). Node can't
// import season.ts, which imports another file without an extension, so this reads it as text.
const source = fs.readFileSync(path.resolve(here, "../../src/v2/season.ts"), "utf8");
const scenes = Object.fromEntries(
  [...source.matchAll(/(\w+): \{ image: "([^"]+)", sky: "([^"]+)" \}/g)].map(([, season, image, sky]) => [season, { image, sky }]),
);
for (const season of SEASONS) {
  if (!scenes[season]) throw new Error(`No ${season} picture in SEASON_SCENE (src/v2/season.ts)`);
}
// Summer's sky is a sunset with its glow on the horizon, so it spans the whole picture, as on the
// home page, to keep the glow on the hills. The clear skies are fitted to the banner, so their blue
// shows along its top.
const WHOLE_SKY = new Set(["summer"]);

// Installed Chrome, since Playwright's own Chromium may not be downloaded. Drawn at 2x and
// scaled down, for smooth edges.
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 2 });
for (const season of SEASONS) {
  await page.goto(pathToFileURL(path.join(here, "linkedin-cover.html")).href);
  await page.evaluate(async ({ image, sky, whole }) => {
    const scene = document.querySelector(".scene");
    scene.src = `../../public${image}`;
    await scene.decode();
    const back = document.querySelector(".sky");
    back.style.background = sky;
    back.classList.toggle("whole", whole);
  }, { ...scenes[season], whole: WHOLE_SKY.has(season) });
  const png = await page.screenshot();
  const out = path.join(here, `linkedin-cover-${season}.png`);
  await sharp(png).resize(1584, 396).png({ compressionLevel: 9 }).toFile(out);
  console.log(`Wrote ${out}`);
}
await browser.close();
