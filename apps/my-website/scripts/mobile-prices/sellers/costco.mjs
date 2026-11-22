// Costco (costco.ca): each phone sold unlocked online, at every storage sold,
// paid in full. Costco sells to members only.
//
// Pages and endpoints (no sign-in):
//   /s?keyword=...                   search results: product pages /p/-/<slug>/<product id>
//   /p/-/<slug>/<product id>         the product; its storage buttons carry each item number
//                                    (id="Button_unselected-variant-<item>", aria-label "256 GB")
//   GET gdx-api.costco.com/catalog/product/dispprice-api/v3/display-price?...&item=<item>&state=BC
//                                    priceData[].displayPrice[0].onlinePrice, the discount
//                                    (aggregatedDiscountAmt) and linkFees (the eco fee)
// The price endpoint only answers the page's own requests (it needs headers the
// page's bot protection adds), so the module doesn't call it: it picks the
// storage on the page, as a shopper would, and reads the reply the page gets.
// The page asks for the price at the delivery postal code it picks from the
// visitor's location; only replies for BC are used. The JSON-LD on the page
// gives one price for every variant, so it isn't read.
import { cents, matchDevice, offerId, parseStorage } from "../lib.mjs";

const SITE = "https://www.costco.ca";
const SEARCHES = ["unlocked phone", "unlocked iphone", "unlocked samsung galaxy", "google pixel unlocked"];
const NOT_NEW = /refurbished|renewed|pre-owned|open box/i;

// "Samsung Galaxy Z Fold8 5G Unlocked Smartphone" -> "Samsung Galaxy Z Fold8 5G"
const modelName = (title) => title.replace(/,.*$/, "").replace(/\s+unlocked\b.*$/i, "");

// The price reply the page gets for `item` in BC, after picking its storage
// (or reloading, when it is already picked)
const priceOf = async (page, item) => {
  const reply = page.waitForResponse(
    (response) => {
      if (!response.url().includes("/display-price") || response.status() !== 200) return false;
      const query = new URL(response.url()).searchParams;
      return query.get("state") === "BC" && (query.get("item") ?? "").split(",").includes(item);
    },
    { timeout: 30_000 },
  );
  const button = page.locator(`button[id$="-variant-${item}"]`).first();
  if ((await button.count()) && (await button.getAttribute("aria-pressed")) !== "true") await button.click();
  else await page.reload({ waitUntil: "domcontentloaded" });
  const data = await (await reply).json();
  return data.priceData?.find((entry) => entry.id === item);
};

export default {
  seller: "Costco",
  async offers({ devices, open, source, log }) {
    // Product pages for catalog phones, from the search results
    const products = new Map();
    for (const keyword of SEARCHES) {
      const page = await open(`${SITE}/s?keyword=${encodeURIComponent(keyword)}`);
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href*="/p/"]')].map((link) => ({ href: link.href, title: link.textContent.trim() })),
      );
      for (const { href, title } of links) {
        const id = href.match(/\/p\/[^?#]*\/(\d+)(?:[?#]|$)/)?.[1];
        if (!id || NOT_NEW.test(title) || title.length < 8) continue;
        const device = matchDevice(devices, modelName(title));
        if (!device) continue;
        if (!products.has(id)) products.set(id, { id, device, title, url: href.replace(/[?#].*$/, "") });
      }
    }
    if (!products.size) throw new Error("no catalog phones in Costco's search results");

    const offers = [];
    const priced = new Set();
    for (const product of products.values()) {
      const { device } = product;
      const page = await open(product.url);
      // The item at each storage: its storage buttons, or, on a page without
      // them, the item shown at the storage its title names
      const buttons = await page.evaluate(() =>
        [...document.querySelectorAll('button[id*="-variant-"]')].map((button) => ({ item: button.id.match(/(\d+)$/)?.[1], label: button.getAttribute("aria-label") ?? "" })),
      );
      const items = buttons.filter((button) => button.item && parseStorage(button.label)).map((button) => ({ item: button.item, storage: parseStorage(button.label) }));
      if (!items.length && parseStorage(product.title)) {
        const item = (await page.evaluate(() => document.body.innerText)).match(/\bItem\s+(\d+)/)?.[1];
        if (item) items.push({ item, storage: parseStorage(product.title) });
      }
      if (!items.length) {
        log(`${product.title}: no item with a storage`);
        continue;
      }
      for (const { item, storage } of items) {
        if (priced.has(`${device.id} ${storage}`)) continue;
        const entry = await priceOf(page, item).catch((error) => {
          log(`${product.title}: no BC price for item ${item} (${String(error.message).split("\n")[0]})`);
          return undefined;
        });
        const shown = entry?.displayPrice?.[0];
        if (!(shown?.onlinePrice > 0)) continue;
        const discount = shown.aggregatedDiscountAmt > 0 ? shown.aggregatedDiscountAmt : 0;
        const ehf = cents((entry.linkFees ?? []).reduce((sum, fee) => sum + (fee.unitAmount?.amount ?? 0), 0));
        const name = (await page.evaluate(() => document.querySelector("h1")?.textContent?.trim())) || product.title;
        // What the page says about the item picked: the sale's dates, members-only
        // pricing, delivery
        await page.waitForTimeout(1_500);
        const shownText = await page.evaluate(() => document.body.innerText);
        const saleDates = shownText.match(/Valid for orders placed ([\d/]+) to ([\d/]+)/);
        const signIn = /Sign In for Price/i.test(shownText);
        const noDelivery = /\nDelivery\s*\n\s*Unavailable/.test(shownText);
        offers.push({
          id: offerId(device.id, storage, "costco"),
          phone: device.id,
          storage,
          kind: "outright",
          seller: "Costco",
          title: "Unlocked, costco.ca (members)",
          condition: "new",
          price: cents(shown.onlinePrice - discount),
          ehf,
          note: [
            discount > 0 ? `On sale, $${discount} off${saleDates ? ` until ${saleDates[2]}` : ""}.` : "",
            signIn ? "Costco shows this price only to members who sign in." : "",
            noDelivery ? "Delivery showed as unavailable in BC when checked; it may be in warehouses." : "",
            "Costco's 2% Executive reward is not counted. The phone kiosks inside warehouses sell carrier deals that aren't listed online.",
          ]
            .filter(Boolean)
            .join(" "),
          source: source(`Costco, ${name}`, product.url),
        });
        priced.add(`${device.id} ${storage}`);
      }
    }
    log(`${offers.length} offers for ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones from ${products.size} product pages found`);
    return offers;
  },
};
