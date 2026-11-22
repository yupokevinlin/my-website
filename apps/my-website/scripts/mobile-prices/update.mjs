// Re-reads every phone's prices at every seller for /mobile. Run from the repo root:
//   node apps/my-website/scripts/mobile-prices/update.mjs            compare only
//   node apps/my-website/scripts/mobile-prices/update.mjs --write    save the result
// Options: --only telus,koodo (seller modules by file name), --region bc (the
// data file), --headless (some stores block a hidden browser, so a window is
// the default).
//
// The phones come from src/mobile/data/devices.json. Each file in sellers/ is
// one seller: it gets the phone list and a few helpers, finds which of those
// phones it sells new in BC, and returns their offers (the shapes are in
// src/mobile/types.ts). The script checks each offer, compares the result with
// the data file and prints what changed. Nothing is saved without --write.
//
// No seller publishes a price API. The modules read the JSON endpoints the
// sellers' own sites call, requested from inside a page on that site in a real
// Chrome window, the way the page itself does. When a seller changes its site
// and its module fails, the script says so and keeps that seller's previous
// offers, marked with the day they were last read, until the module is fixed.
//
// Offers marked "manual": true in the data file (sellers with no module, like
// Amazon) are kept as they are and listed at the end, to check by hand. Once
// a seller has a module, its run replaces them.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { matchDevice, offerProblems } from "./lib.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../src/mobile/data");
const file = path.join(dataDir, `${option("region", "bc")}.json`);
const data = JSON.parse(await readFile(file, "utf8"));
const { devices } = JSON.parse(await readFile(path.join(dataDir, "devices.json"), "utf8"));
const deviceIds = new Set(devices.map((device) => device.id));
// The date in Vancouver, where the prices apply
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver" }).format(new Date());

// A file starting with "_" holds code several sellers share, not a seller
const moduleFiles = (await readdir(path.join(here, "sellers"))).filter((name) => name.endsWith(".mjs") && !name.startsWith("_")).sort();
const only = option("only", "")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);
const unknown = only.filter((name) => !moduleFiles.includes(`${name}.mjs`));
if (unknown.length) throw new Error(`No seller module ${unknown.join(", ")}; there are ${moduleFiles.map((name) => name.replace(/\.mjs$/, "")).join(", ")}`);
const modules = [];
for (const name of moduleFiles) {
  if (only.length && !only.includes(name.replace(/\.mjs$/, ""))) continue;
  const { default: seller } = await import(pathToFileURL(path.join(here, "sellers", name)).href);
  modules.push({ file: name, ...seller });
}

// Installed Chrome, since Playwright's own Chromium may not be downloaded
const browser = await chromium.launch({ channel: "chrome", headless: flag("headless") });
const context = await browser.newContext({ locale: "en-CA", timezoneId: "America/Vancouver", viewport: { width: 1280, height: 900 } });

const pages = new Map();
// A page on the seller's site, opened once and kept so several requests can
// share it. Cookies (the province, for one) are set on the site first.
const open = (url, { cookies = {} } = {}) => {
  if (!pages.has(url)) {
    pages.set(
      url,
      (async () => {
        const { hostname } = new URL(url);
        const domain = `.${hostname.split(".").slice(-2).join(".")}`;
        await context.addCookies(Object.entries(cookies).map(([name, value]) => ({ name, value, domain, path: "/" })));
        const page = await context.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
        // Sites set their session cookies with scripts after the page loads
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
        await page.waitForTimeout(1_500);
        return page;
      })(),
    );
  }
  return pages.get(url);
};

// JSON from an endpoint, requested from inside `page` (a URL on the seller's
// site) the way that page's own scripts request it
const json = async (page, { url, method, headers = {}, body, cookies } = {}) => {
  const tab = await open(page, { cookies });
  const reply = await tab.evaluate(
    async ({ endpoint, method: verb, headers: extra, body: payload }) => {
      const response = await fetch(endpoint, {
        method: verb ?? (payload === undefined ? "GET" : "POST"),
        headers: { ...(payload === undefined ? {} : { "Content-Type": "application/json" }), ...extra },
        body: payload === undefined ? undefined : JSON.stringify(payload),
        credentials: new URL(endpoint, location.href).origin === location.origin ? "include" : "omit",
      });
      return { status: response.status, text: await response.text() };
    },
    { endpoint: url, method, headers, body },
  );
  if (reply.status < 200 || reply.status > 299) throw new Error(`HTTP ${reply.status} from ${url}: ${reply.text.slice(0, 160)}`);
  // Some replies start with stray whitespace before the JSON
  return JSON.parse(reply.text.slice(reply.text.search(/[[{]/)));
};

// A page's text: what is shown, then everything, since folded sections are
// only in textContent
const text = async (url, options) => (await open(url, options)).evaluate(() => `${document.body.innerText}\n${document.body.textContent}`);

const images = {};
const runSeller = async (module) => {
  const log = (...parts) => console.log(`  [${module.seller}]`, ...parts);
  const helpers = {
    devices,
    region: data.region,
    today,
    open,
    json,
    text,
    log,
    match: (name) => matchDevice(devices, name),
    source: (label, url, verified = "primary") => ({ label, url, verified, checked: today }),
    // A picture of the phone for the page (Best Buy's module records them)
    image: (deviceId, url) => {
      if (deviceIds.has(deviceId) && /^https:\/\//.test(url) && !images[deviceId]) images[deviceId] = url;
    },
  };
  const started = Date.now();
  try {
    const offers = await module.offers(helpers);
    const accepted = [];
    for (const offer of offers) {
      const problems = offerProblems(offer, deviceIds);
      if (problems.length) log(`DROPPED ${offer.id ?? "(no id)"}: ${problems.join("; ")}`);
      else accepted.push(offer);
    }
    const ids = accepted.map((offer) => offer.id);
    const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (repeated.length) throw new Error(`the same id twice: ${[...new Set(repeated)].join(", ")}`);
    log(`${accepted.length} offers for ${new Set(accepted.map((offer) => offer.phone)).size} phones in ${Math.round((Date.now() - started) / 1000)} s`);
    return { module, ok: true, offers: accepted };
  } catch (error) {
    log(`FAILED: ${String(error?.message ?? error).split("\n")[0]}`);
    return { module, ok: false };
  }
};

// A few sellers at a time: each is a different site
const results = [];
const queue = [...modules];
await Promise.all(
  Array.from({ length: Math.min(3, queue.length) }, async () => {
    while (queue.length) results.push(await runSeller(queue.shift()));
  }),
);
await browser.close();

// The new offer list: what each seller's module found, and the previous
// offers of every other seller (a module that failed or didn't run, and the
// manual ones). A seller's module replaces all its offers, manual ones too.
const ran = new Map(results.filter((result) => result.ok).map((result) => [result.module.seller, result.offers]));
const previous = data.offers ?? [];
const offers = [...previous.filter((offer) => !ran.has(offer.seller)), ...[...ran.values()].flat()];

// What changed
const flat = (value, prefix = "") =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, inner]) => (key === "source" ? [] : flat(inner, prefix ? `${prefix}.${key}` : key)))
    : [[prefix, JSON.stringify(value)]];
const before = new Map(previous.map((offer) => [offer.id, offer]));
const after = new Map(offers.map((offer) => [offer.id, offer]));
let changes = 0;
console.log("");
for (const [id, offer] of after) {
  const old = before.get(id);
  if (!old) {
    changes += 1;
    console.log(`NEW      ${id}`);
    continue;
  }
  const oldFields = new Map(flat(old));
  const diffs = flat(offer).filter(([key, value]) => oldFields.get(key) !== value);
  if (diffs.length) {
    changes += 1;
    console.log(`CHANGED  ${id}: ${diffs.map(([key, value]) => `${key} ${oldFields.get(key) ?? "-"} -> ${value}`).join(", ")}`);
  }
}
for (const id of before.keys()) {
  if (!after.has(id)) {
    changes += 1;
    console.log(`GONE     ${id}`);
  }
}

// The phones the page lists: those with at least one offer, newest first
const previousPhones = new Map((data.phones ?? []).map((phone) => [phone.id, phone]));
const offered = new Set(offers.map((offer) => offer.phone));
const phones = devices
  .filter((device) => offered.has(device.id))
  .map((device) => ({ ...device, image: images[device.id] ?? previousPhones.get(device.id)?.image }))
  .sort((a, b) => b.released.localeCompare(a.released));
const unsold = devices.filter((device) => !offered.has(device.id)).map((device) => device.name);

const failed = results.filter((result) => !result.ok).map((result) => result.module.seller);
const sellers = { ...data.sellers };
for (const result of results) sellers[result.module.seller] = { checked: result.ok ? today : (data.sellers?.[result.module.seller]?.checked ?? null), ok: result.ok };

const manual = offers.filter((offer) => offer.manual);
console.log("");
if (unsold.length) console.log(`Nobody sells these new, so the page leaves them off: ${unsold.join(", ")}`);
if (manual.length) {
  console.log("Check these by hand (no module reads them):");
  for (const offer of manual) console.log(`  ${offer.id} (checked ${offer.source.checked})\n    ${offer.source.url}`);
}
console.log(
  `\n${results.length} sellers read (${failed.length ? `FAILED: ${failed.join(", ")}` : "none failed"}), ${offers.length} offers for ${phones.length} phones, ${changes} changes, ${phones.filter((phone) => !phone.image).length} phones without a picture.`,
);

if (flag("write")) {
  const allRan = !only.length && !failed.length;
  const out = { ...data, region: { ...data.region, checked: allRan ? today : data.region.checked }, sellers, phones, offers };
  await writeFile(file, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${file}${allRan ? "" : " (the page's date stays, since not every seller was read)"}`);
} else if (changes) {
  console.log("Run again with --write to save the changes.");
}
