// Best Buy Canada: each phone unlocked at every storage it sells, paid in
// full, and on the Monthly Subscription where it's offered. Also each phone's
// storage sizes and colours for the page, with a picture of each colour.
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
import { cents, matchDevice, offerId, parseStorage } from "../lib.mjs";

const SITE = "https://www.bestbuy.ca";
const PAGE = `${SITE}/en-ca/category/unlocked-mobile-phones/743355`;
const LISTING_PREFIX = /^(open box|refurbished[^-]*|brand new)\s+-\s+/i;

export default {
  seller: "Best Buy",
  // Best Buy's bot shield blocked fast runs: 1.5 s between requests, and only
  // when asked (--only bestbuy or --all)
  pace: 1_500,
  whenAsked: true,
  async offers({ devices, region, json, source, variant, log }) {
    const offers = [];
    for (const device of devices) {
      const search = await json(PAGE, { url: `${SITE}/api/v2/json/search?query=${encodeURIComponent(`${device.brand} ${device.name} unlocked`)}&pageSize=60&lang=en-CA` });
      const listings = search.products.map((product) => ({ ...product, model: matchDevice(devices, product.name.replace(LISTING_PREFIX, "")) })).filter((product) => product.model?.id === device.id);
      // New and sold by Best Buy itself: "Apple iPhone 18 Pro 256GB - Burgundy - Unlocked"
      const sold = listings
        .filter((product) => !product.isMarketplace && !LISTING_PREFIX.test(product.name) && /unlocked/i.test(product.name) && parseStorage(product.name))
        .map((product) => ({ ...product, storage: parseStorage(product.name), colour: product.name.split(" - ")[1]?.trim() }))
        .sort((a, b) => a.salePrice - b.salePrice);
      // Every storage and colour, with its picture, for the page's choices
      for (const product of sold) {
        if (product.colour && !/unlocked/i.test(product.colour) && product.thumbnailImage) {
          variant(device.id, { storage: product.storage, colour: product.colour, image: product.thumbnailImage.replace(/\/\d+x\d+\//, "/250x250/") });
        }
      }

      // Each storage at its cheapest colour
      const storages = [...new Set(sold.map((product) => product.storage))];
      for (const storage of storages) {
        const product = sold.find((candidate) => candidate.storage === storage);
        await priceStorage({ device, storage, product });
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones`);
    return offers;

    // Best Buy's price for one storage, paid in full and on the subscription
    async function priceStorage({ device, storage, product }) {

      const [offer] = await json(PAGE, { url: `${SITE}/api/offers/v1/products/${product.sku}/offers` });
      if (!offer || offer.sellerId !== "bbyca") return;
      const price = offer.salePrice;
      const ehf = offer.ehf?.find((fee) => fee.province === region.code)?.amount ?? 0;
      const url = `${SITE}${product.productUrl}`;
      const sale = offer.salePrice < offer.regularPrice ? ` On sale from $${offer.regularPrice}.` : "";
      offers.push({
        id: offerId(device.id, storage, "bestbuy"),
        phone: device.id,
        storage,
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
          id: offerId(device.id, storage, "bestbuy", "subscription"),
          phone: device.id,
          storage,
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
  },
};
