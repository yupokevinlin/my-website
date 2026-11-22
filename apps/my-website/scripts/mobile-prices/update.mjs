// Re-reads the prices on /mobile from the sellers' pages. Run from the repo root:
//   node apps/my-website/scripts/mobile-prices/update.mjs            compare only
//   node apps/my-website/scripts/mobile-prices/update.mjs --write    save what changed
// Options: --region bc (the data file), --only <text> (offers whose id contains
// it), --headless (stores often block a hidden browser, so a window is the default).
//
// An offer in src/mobile/data/<region>.json is re-read when it has a `check`:
//   "check": { "url": "...", "fields": { "price": "Device price\\s*\\$([\\d,.]+)" } }
// The script opens the URL in Chrome, takes the page's visible text, and reads
// each field (a path into the offer, like "returnOption.monthly") with its
// pattern's first capture group. Offers without a `check` are listed with
// their source link, to look at by hand: carriers' prices sit behind plan
// pickers that a pattern can't follow.
//
// Sellers redesign their pages. When a pattern stops matching, the script says
// so and leaves the number alone: open the page, fix the pattern, run again.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(here, `../../src/mobile/data/${option("region", "bc")}.json`);
const data = JSON.parse(await readFile(file, "utf8"));
const only = option("only", "");
// The date in Vancouver, where the prices apply
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver" }).format(new Date());

const get = (object, dotted) => dotted.split(".").reduce((value, key) => value?.[key], object);
const set = (object, dotted, value) => {
  const keys = dotted.split(".");
  const last = keys.pop();
  keys.reduce((target, key) => target[key], object)[last] = value;
};
const toNumber = (text) => Number(text.replace(/[^\d.]/g, ""));

const offers = data.offers.filter((offer) => offer.id.includes(only));
const checked = offers.filter((offer) => offer.check);
const byHand = offers.filter((offer) => !offer.check);

// Installed Chrome, since Playwright's own Chromium may not be downloaded
const browser = await chromium.launch({ channel: "chrome", headless: flag("headless") });
const context = await browser.newContext({ locale: "en-CA", timezoneId: "America/Vancouver", viewport: { width: 1280, height: 900 } });
const texts = new Map();
const textOf = async (url) => {
  if (!texts.has(url)) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      // Prices are filled in by scripts after the page loads
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
      await page.waitForTimeout(2_000);
      // The visible text, then all of it: folded sections ("How It's
      // Calculated") are only in textContent, which runs labels and amounts
      // together, so patterns allow for no space between them
      texts.set(url, await page.evaluate(() => `${document.body.innerText}\n${document.body.textContent}`));
    } catch (error) {
      texts.set(url, new Error(String(error.message).split("\n")[0]));
    } finally {
      await page.close();
    }
  }
  return texts.get(url);
};

let changed = 0;
let failed = 0;
for (const offer of checked) {
  const text = await textOf(offer.check.url);
  console.log(`\n${offer.id}\n  ${offer.check.url}`);
  if (text instanceof Error) {
    failed += 1;
    console.log(`  COULD NOT OPEN: ${text.message}`);
    continue;
  }
  let allRead = true;
  for (const [field, pattern] of Object.entries(offer.check.fields)) {
    const match = text.match(new RegExp(pattern));
    const before = get(offer, field);
    if (!match) {
      failed += 1;
      allRead = false;
      console.log(`  ${field}: NOT FOUND (still ${before}); the page may have changed`);
      continue;
    }
    const now = toNumber(match[1]);
    if (now === before) {
      console.log(`  ${field}: ${before} (same)`);
    } else {
      changed += 1;
      console.log(`  ${field}: ${before} -> ${now} CHANGED`);
      set(offer, field, now);
    }
  }
  if (allRead) offer.source.checked = today;
}
await browser.close();

if (byHand.length) {
  console.log("\nCheck these by hand (no pattern can read them):");
  for (const offer of byHand) console.log(`  ${offer.id} (checked ${offer.source.checked})\n    ${offer.source.url}`);
}

console.log(`\n${checked.length} offers read, ${changed} numbers changed, ${failed} not read, ${byHand.length} to check by hand.`);
if (flag("write")) {
  // The page's "prices checked" date moves only when every offer was read
  if (!failed && !byHand.length && !only) data.region.checked = today;
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${file}`);
} else if (changed) {
  console.log("Run again with --write to save the changes.");
}
