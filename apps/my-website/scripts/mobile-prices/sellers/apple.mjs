// Apple (apple.com/ca): each iPhone Apple sells, unlocked at every storage
// Apple sells it in, paid in full.
//
// Pages (no sign-in, no endpoint call needed):
//   /ca/shop/buy-iphone                  links to each family's buy page
//   /ca/shop/buy-iphone/<family>         window.PRODUCT_SELECTION_BOOTSTRAP
//     .productSelectionData.products[]   partNumber, familyType ("iphone18promax"),
//                                        dimensionCapacity ("256gb"), fullPrice (a price key)
//     .displayValues.prices[key]         amountBeforeTradeIn, bfiPrice (the 0% financing)
// A family page can hold several models (the 18 Pro page sells the 18 Pro
// Max too), and a page with one capacity names it in the model's label
// instead ("Comes with 128GB storage"). Apple's Canadian prices are before
// tax and its pages show no environmental handling fee for BC, so ehf is 0.
import { normalizeName, offerId, parseStorage, toNumber } from "../lib.mjs";

const SITE = "https://www.apple.com";
const STORE = `${SITE}/ca/shop/buy-iphone`;

const plain = (html) =>
  String(html ?? "")
    .replace(/<as-footnote.*?<\/as-footnote>/gs, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default {
  seller: "Apple",
  async offers({ devices, open, source, log }) {
    const store = await open(STORE);
    const families = await store.evaluate(() => [
      ...new Set(
        [...document.querySelectorAll('a[href*="/ca/shop/buy-iphone/"]')]
          .map((link) => new URL(link.getAttribute("href"), location.href))
          .filter((url) => /^\/ca\/shop\/buy-iphone\/iphone-[a-z0-9-]+\/?$/.test(url.pathname))
          .map((url) => `${url.origin}${url.pathname.replace(/\/$/, "")}`),
      ),
    ]);
    if (!families.length) throw new Error(`no iPhone family links on ${STORE}`);

    const offers = [];
    for (const url of families) {
      const page = await open(url);
      // A family Apple no longer sells redirects to another page
      if (page.url().replace(/\/$/, "") !== url) {
        log(`${url} now goes to ${page.url()}, skipped`);
        continue;
      }
      const data = await page.evaluate(() => window.PRODUCT_SELECTION_BOOTSTRAP?.productSelectionData);
      if (!data?.products) throw new Error(`no product data on ${url}`);
      // The cheapest colour of each model at each storage
      const best = new Map();
      for (const product of data.products) {
        const device = devices.find((candidate) => normalizeName(candidate.name) === normalizeName(product.familyType));
        if (!device) continue;
        const label = plain(data.displayValues.dimensionScreensize?.[product.dimensionScreensize]?.value);
        const storage = parseStorage(product.dimensionCapacity ?? "") ?? parseStorage(label);
        if (!storage) continue;
        const prices = data.displayValues.prices[product.fullPrice];
        const price = toNumber(prices?.amountBeforeTradeIn);
        if (!(price > 0)) continue;
        const key = `${device.id} ${storage}`;
        if (!best.has(key) || price < best.get(key).price) best.set(key, { device, storage, price, monthly: plain(prices["bfiPrice-short"] ?? prices.bfiPrice) });
      }
      for (const { device, storage, price, monthly } of best.values()) {
        // "or $72.87 /mo. per month for 24 mo. months at 0.00% APR"
        const financing = monthly.match(/\$([\d,.]+)\s*\/mo.*?for (\d+)\s*mo.*?at ([\d.]+)% APR/);
        const note = !financing
          ? undefined
          : toNumber(financing[3]) === 0
            ? `Apple also offers 0% financing over ${financing[2]} months ($${financing[1]} a month), which costs the same in total.`
            : `Apple also offers financing at ${financing[3]}% APR over ${financing[2]} months ($${financing[1]} a month).`;
        offers.push({
          id: offerId(device.id, storage, "apple"),
          phone: device.id,
          storage,
          kind: "outright",
          seller: "Apple",
          title: "Unlocked, from apple.com or an Apple Store",
          condition: "new",
          price,
          ehf: 0,
          ...(note ? { note } : {}),
          source: source(`Apple, buy ${device.name}`, url),
        });
      }
    }
    log(`${offers.length} offers for ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones from ${families.length} family pages`);
    return offers;
  },
};
