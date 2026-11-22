// Best Buy Canada: each phone unlocked at its catalog storage, paid in full,
// and on the Monthly Subscription where it's offered. Also the phones'
// pictures for the page, from any Best Buy listing of the model.
//
// Endpoints (no sign-in; requested from inside a bestbuy.ca page):
//   search  GET  /api/v2/json/search?query=...      SKUs, names, pictures
//   offers  GET  /api/offers/v1/products/<sku>/offers   price and handling fees by province
//   plans   POST /sidekick/api/plans                 the Monthly Subscription behind the
//                                                    store's quote tool (Sidekick)
// The subscription's Keep-the-Tech amount is asked for with includeTax: false:
// it goes by the price alone, without the handling fee or tax. Kevin confirmed
// this is right; the quote page adds the fee, which tips a $1,749.99 phone
// over the $1,750 line from a $400 to a $500 keep amount.
import { cents, matchDevice, parseStorage } from "../lib.mjs";

const SITE = "https://www.bestbuy.ca";
const PAGE = `${SITE}/en-ca/category/unlocked-mobile-phones/743355`;
const LISTING_PREFIX = /^(open box|refurbished[^-]*|brand new)\s+-\s+/i;

export default {
  seller: "Best Buy",
  async offers({ devices, region, json, source, image, log }) {
    const offers = [];
    for (const device of devices) {
      const search = await json(PAGE, { url: `${SITE}/api/v2/json/search?query=${encodeURIComponent(`${device.brand} ${device.name} unlocked`)}&pageSize=60&lang=en-CA` });
      const listings = search.products.map((product) => ({ ...product, model: matchDevice(devices, product.name.replace(LISTING_PREFIX, "")) })).filter((product) => product.model?.id === device.id);
      // A picture from any listing of the model, a new one first
      const pictured = listings.find((product) => !LISTING_PREFIX.test(product.name)) ?? listings[0];
      if (pictured?.thumbnailImage) image(device.id, pictured.thumbnailImage.replace(/\/\d+x\d+\//, "/250x250/"));

      // New and sold by Best Buy itself, at the catalog storage: the cheapest colour
      const candidates = listings
        .filter((product) => !product.isMarketplace && !LISTING_PREFIX.test(product.name) && /unlocked/i.test(product.name) && parseStorage(product.name) === device.storage)
        .sort((a, b) => a.salePrice - b.salePrice);
      if (!candidates.length) continue;
      const product = candidates[0];

      const [offer] = await json(PAGE, { url: `${SITE}/api/offers/v1/products/${product.sku}/offers` });
      if (!offer || offer.sellerId !== "bbyca") continue;
      const price = offer.salePrice;
      const ehf = offer.ehf?.find((fee) => fee.province === region.code)?.amount ?? 0;
      const url = `${SITE}${product.productUrl}`;
      const sale = offer.salePrice < offer.regularPrice ? ` On sale from $${offer.regularPrice}.` : "";
      offers.push({
        id: `${device.id}-bestbuy`,
        phone: device.id,
        kind: "outright",
        seller: "Best Buy",
        title: "Unlocked",
        condition: "new",
        price,
        ehf,
        note: `Best Buy Financing (no payments for 12 months) adds a $69.99 admin fee.${sale}`,
        source: source(`Best Buy, ${product.name}`, url),
      });

      const quote = await json(PAGE, {
        url: `${SITE}/sidekick/api/plans`,
        body: { sku: product.sku, province: region.code, locale: "en", accessories: [], includeTax: false, isMember: false },
      }).catch(() => undefined);
      const subscription = quote?.plans?.find((plan) => plan.financeOptionType === "MSUB");
      if (subscription?.kttValue > 0) {
        offers.push({
          id: `${device.id}-bestbuy-subscription`,
          phone: device.id,
          kind: "subscription",
          seller: "Best Buy",
          title: "Monthly Subscription, unlocked",
          condition: "new",
          price,
          ehf,
          adminFee: cents(subscription.adminFeeAmount),
          keepAmount: cents(subscription.kttValue),
          termMonths: subscription.term,
          note: "Financed through Fairstone, subject to credit approval. At the end, return the phone in good working order, or pay the Keep-the-Tech amount to keep it.",
          source: source("Best Buy's quote tool (Sidekick)", `${SITE}/sidekick/en-ca/store/973/product/${product.sku}/quote`),
        });
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones`);
    return offers;
  },
};
