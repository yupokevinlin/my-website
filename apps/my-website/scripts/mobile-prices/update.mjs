// Re-reads the prices on /mobile from the sellers' sites. Run from the repo root:
//   node apps/my-website/scripts/mobile-prices/update.mjs            compare only
//   node apps/my-website/scripts/mobile-prices/update.mjs --write    save what changed
// Options: --region bc (the data file), --only <text> (offers whose id contains
// it), --headless (stores often block a hidden browser, so a window is the default).
//
// An offer in src/mobile/data/<region>.json is re-read when it has a `check`
// (or a list of them). Each names the offer's fields to read, as paths into
// the offer ("price", "returnOption.monthly"), and one of two ways to read them:
//
// 1. From the JSON the seller's own site loads (no seller publishes an
//    official price API; these are the endpoints their pages call):
//      "check": {
//        "url": "https://www.telus.com/en/mobility/phones/iphone-18-pro",
//        "api": { "url": "https://www.telus.com/mobility/configure/backend/offering-bundles?sku=..." },
//        "fields": { "fullPrice": "offerings[id^=PMSN60G95].items[category=mobility-offer].prices[type=BASE_PRICE].amount" }
//      }
//    The script opens `url`, a page on the seller's site, and requests
//    `api.url` from inside it, the way the page itself does (`method`,
//    `headers` and `body` when the endpoint needs them; `cookies` to set on the
//    site first, such as the province). A field is a path into the response:
//    keys joined by dots, `[key=value]` for the item of a list whose key equals
//    the value, `[key^=value]` for starts with, `&` for several conditions.
//    When the response isn't what the data stores, a field can be
//    { "path": "...", "add": -10, "times": 1.12 }: a plan less its autopay
//    discount, an amount with its tax.
//
// 2. From the page's text, where there is no endpoint:
//      "check": { "url": "...", "fields": { "price": "Web Code:\\s*\\d+\\s*\\$([\\d,.]+)" } }
//    Each field is a pattern; its first capture group is the number.
//
// Offers without a `check` are listed with their source link, to look at by
// hand. Sellers change their sites: when a path or pattern stops matching, the
// script says so and leaves the number alone. Open the page, fix it, run again.
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
const toNumber = (text) => Number(String(text).replace(/[^\d.]/g, ""));
const cents = (amount) => Math.round(amount * 100) / 100;

// "a.b[key=value].c": plain keys (and list positions) outside brackets,
// conditions on a list's items inside them
const walk = (json, jsonPath) => {
  let value = json;
  for (const [, key, conditions] of jsonPath.matchAll(/([^.[\]]+)|\[([^\]]+)\]/g)) {
    if (value == null) return undefined;
    if (key !== undefined) {
      value = value[key];
      continue;
    }
    if (!Array.isArray(value)) return undefined;
    if (/^\d+$/.test(conditions)) {
      value = value[Number(conditions)];
      continue;
    }
    const tests = conditions.split("&").map((condition) => {
      const [, name, starts, wanted] = condition.match(/^([^=^]+)(\^?)=(.*)$/) ?? [];
      return (item) => name !== undefined && (starts ? String(item?.[name]).startsWith(wanted) : String(item?.[name]) === wanted);
    });
    value = value.find((item) => tests.every((test) => test(item)));
  }
  return value;
};

const offers = data.offers.filter((offer) => offer.id.includes(only));
const checksOf = (offer) => [offer.check ?? []].flat();
const checked = offers.filter((offer) => checksOf(offer).length);
const byHand = offers.filter((offer) => !checksOf(offer).length);

// Installed Chrome, since Playwright's own Chromium may not be downloaded
const browser = await chromium.launch({ channel: "chrome", headless: flag("headless") });
const context = await browser.newContext({ locale: "en-CA", timezoneId: "America/Vancouver", viewport: { width: 1280, height: 900 } });

// Each page is opened once and kept, so several offers can read from it
const pages = new Map();
const open = (url, cookies = {}) => {
  if (!pages.has(url)) {
    pages.set(
      url,
      (async () => {
        const { hostname } = new URL(url);
        const domain = `.${hostname.replace(/^www\./, "")}`;
        await context.addCookies(Object.entries(cookies).map(([name, value]) => ({ name, value, domain, path: "/" })));
        const page = await context.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        // Prices and session cookies are filled in by scripts after the page loads
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
        await page.waitForTimeout(2_000);
        return page;
      })(),
    );
  }
  return pages.get(url);
};

const results = new Map();
const once = (key, read) => {
  if (!results.has(key)) results.set(key, read().catch((error) => new Error(String(error.message).split("\n")[0])));
  return results.get(key);
};

// The visible text, then all of it: folded sections ("How It's Calculated")
// are only in textContent, which runs labels and amounts together, so
// patterns allow for no space between them
const textOf = (url) => once(url, async () => (await open(url)).evaluate(() => `${document.body.innerText}\n${document.body.textContent}`));

// Requested from inside the seller's page, so it carries the page's cookies
// and passes the same checks the page's own requests do
const jsonOf = ({ url, api }) =>
  once(JSON.stringify(api), async () => {
    const page = await open(url, api.cookies);
    const reply = await page.evaluate(
      async ({ url: endpoint, method, headers, body }) => {
        const response = await fetch(endpoint, {
          method: method ?? (body ? "POST" : "GET"),
          headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
          body: body ? JSON.stringify(body) : undefined,
          credentials: new URL(endpoint, location.href).origin === location.origin ? "include" : "omit",
        });
        return { status: response.status, text: await response.text() };
      },
      api,
    );
    if (reply.status !== 200) throw new Error(`HTTP ${reply.status} from ${api.url}`);
    // Some replies start with stray whitespace before the JSON
    return JSON.parse(reply.text.slice(reply.text.search(/[[{]/)));
  });

const read = (source, check, spec) => {
  if (!check.api) {
    const match = source.match(new RegExp(spec));
    return match ? toNumber(match[1]) : undefined;
  }
  const { path: jsonPath, add = 0, times = 1 } = typeof spec === "string" ? { path: spec } : spec;
  const value = walk(source, jsonPath);
  return value == null || value === "" || Number.isNaN(toNumber(value)) ? undefined : cents((toNumber(value) + add) * times);
};

let changed = 0;
let failed = 0;
for (const offer of checked) {
  console.log(`\n${offer.id}`);
  let allRead = true;
  for (const check of checksOf(offer)) {
    console.log(`  ${check.api ? `${check.api.url}${check.api.body ? ` ${JSON.stringify(check.api.body)}` : ""}` : check.url}`);
    const source = await (check.api ? jsonOf(check) : textOf(check.url));
    if (source instanceof Error) {
      failed += 1;
      allRead = false;
      console.log(`  COULD NOT READ: ${source.message}`);
      continue;
    }
    for (const [field, spec] of Object.entries(check.fields)) {
      const before = get(offer, field);
      const now = read(source, check, spec);
      if (now === undefined) {
        failed += 1;
        allRead = false;
        console.log(`    ${field}: NOT FOUND (still ${before}); the site may have changed`);
      } else if (now === before) {
        console.log(`    ${field}: ${before} (same)`);
      } else {
        changed += 1;
        console.log(`    ${field}: ${before} -> ${now} CHANGED`);
        set(offer, field, now);
      }
    }
  }
  if (allRead) offer.source.checked = today;
}
await browser.close();

if (byHand.length) {
  console.log("\nCheck these by hand (nothing to read them from):");
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
