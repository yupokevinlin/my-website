#!/usr/bin/env node
/**
 * Earth and Moon texture preprocessing for the "Flying Past Earth" simulation.
 *
 * Sources (NASA, public domain):
 *  - Blue Marble Next Generation, December 2004, with topography and
 *    bathymetry (NASA Earth Observatory, Reto Stöckli):
 *    https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/
 *  - Black Marble 2016 night lights (NASA Earth Observatory, Joshua Stevens,
 *    Suomi NPP VIIRS data from Miguel Román, NASA GSFC):
 *    https://science.nasa.gov/earth/earth-observatory/earth-at-night/
 *  - Blue Marble clouds (same collection)
 *  - CGI Moon Kit, LRO colour map (NASA's Scientific Visualization Studio,
 *    Ernie Wright): https://svs.gsfc.nasa.gov/4720
 *
 * Writes equirectangular JPEGs (longitude -180..180 left to right, north up)
 * to public/ray-tracing/earth/<tier>/{day,clouds,night}.jpg and
 * public/ray-tracing/moon/<tier>/moon.jpg. Clouds and night lights are
 * single-channel. The night lights keep only the warm city light: Black
 * Marble's bluish moonlit land and ice are removed.
 *
 * Usage:  node apps/my-website/scripts/preprocess-earth.mjs <download dir>
 * Files already in <download dir> are reused.
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";

const SOURCES = {
  day: "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x21600x10800.jpg",
  night: "https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg",
  clouds: "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_8192.tif",
  moon: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.tif",
};
const EARTH_TIERS = [2048, 4096, 8192];
const MOON_TIERS = [1024, 2048, 4096];

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ray-tracing");
const downloads = process.argv[2];
if (!downloads) {
  console.error("Usage: node preprocess-earth.mjs <download dir>");
  process.exit(1);
}

async function source(name) {
  const file = join(downloads, name, `${name}${SOURCES[name].endsWith(".tif") ? ".tif" : ".jpg"}`);
  if (!existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    console.log(`Downloading ${name}…`);
    const res = await fetch(SOURCES[name]);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
  }
  return file;
}

const open = (file) => sharp(file, { limitInputPixels: false });
const out = (...parts) => {
  const file = join(root, ...parts);
  mkdirSync(dirname(file), { recursive: true });
  return file;
};

/** Black Marble city lights only: warm light minus the bluish moonlit background. */
async function nightLights(file, width) {
  const { data, info } = await open(file).resize(width, width / 2, { kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const lights = Buffer.alloc(px);
  for (let i = 0; i < px; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const v = Math.max(0, Math.min(r, g) - 0.75 * b);
    lights[i] = Math.min(255, Math.round(255 * Math.pow(v / 160, 0.8)));
  }
  return sharp(lights, { raw: { width: info.width, height: info.height, channels: 1 } });
}

const day = await source("day");
const night = await source("night");
const clouds = await source("clouds");
const moon = await source("moon");

for (const w of EARTH_TIERS) {
  const size = { width: w, height: w / 2 };
  await open(day).resize(size.width, size.height, { kernel: "lanczos3" }).jpeg({ quality: 86, mozjpeg: true }).toFile(out("earth", String(w), "day.jpg"));
  await open(clouds).resize(size.width, size.height, { kernel: "lanczos3" }).toColourspace("b-w").jpeg({ quality: 84, mozjpeg: true }).toFile(out("earth", String(w), "clouds.jpg"));
  await (await nightLights(night, w)).toColourspace("b-w").jpeg({ quality: 84, mozjpeg: true }).toFile(out("earth", String(w), "night.jpg"));
  console.log(`earth ${w} done`);
}
for (const w of MOON_TIERS) {
  await open(moon).resize(w, w / 2, { kernel: "lanczos3" }).jpeg({ quality: 86, mozjpeg: true }).toFile(out("moon", String(w), "moon.jpg"));
  console.log(`moon ${w} done`);
}
