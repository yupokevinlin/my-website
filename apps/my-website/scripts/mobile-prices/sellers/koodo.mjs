// Koodo: each phone it sells new, at every storage it sells (each on its first
// active colour), on Happy Tab Plus (nothing upfront, the rest over 24 months),
// with the cheapest plan that qualifies. A phone without Tab Plus (some older or
// cheaper ones) gets the Tab tier it has that costs least for the phone. One
// offer per storage. Koodo has no return program.
//
// Endpoints (no sign-in; requested from inside koodomobile.com/en/phones):
//   phones   POST /api/commerce-postpaid/postpaid-devices   the phones page's list: one
//            colour per model, with its page slug, storage and SKU
//   storage  GET  /_next/data/commerce-postpaid/en/phones/<slug>.json?prov=bc&slug=<slug>
//            a phone page's data, with every storage and colour (listVariations)
//   offers   POST /api/commerce-postpaid/postpaid-details   the device's Tab offers: full
//            price (BASE_PRICE), upfront (DISCOUNTED_PRICE), monthly, Tab Bonus
//   plans    POST /api/commerce-postpaid/rate-plans         each Tab tier's plans: price,
//            auto-pay discount, data, included services. Body as the rate plans page
//            (/en/rate-plans?plans=device) sends it, read 2026-11-22.
// Prices: OFFER_PRICE is not upfront: it repeats PROMOTIONAL_DISCOUNT, the Tab
// Bonus already taken off the monthly payments. The $80 connection fee is
// waived on online orders, the way the comparison counts them.
import { cents, matchDevice, offerId, parseStorage, toNumber } from "../lib.mjs";

const SITE = "https://www.koodomobile.com";
const PAGE = `${SITE}/en/phones?prov=bc`;
const API = `${SITE}/api/commerce-postpaid`;

const price = (item, type) => {
  const found = item?.prices?.find((entry) => entry.type === type);
  return found === undefined ? undefined : toNumber(found.amount);
};
const attribute = (item, property) => item?.specification?.flatMap((spec) => spec.attributes ?? []).find((entry) => entry.property === property)?.value;

const planData = (plan) => {
  const data = plan.content?.data;
  if (/unlimited/i.test(String(data?.value ?? ""))) return "unlimited";
  if (/^gb$/i.test(data?.unit ?? "") && Number(data.value) > 0) return Number(data.value);
  if (Number(plan.rawContent?.dataValueInGb) > 0) return Number(plan.rawContent.dataValueInGb);
  const gb = plan.description?.match(/(\d+)\s*GB/i);
  return gb ? Number(gb[1]) : undefined;
};

// What the plan's included services say about network, coverage and hotspot
const planFeatures = (plan) => {
  const services = plan.dependencies?.included?.map((service) => service.description ?? "") ?? [];
  const features = [];
  const speed = services.map((text) => text.match(/^(5G\+?) Speed/i)).find(Boolean);
  if (speed) features.push(speed[1].toUpperCase());
  const coverage = services.map((text) => text.match(/^Plan Coverage in (.+)$/i)).find(Boolean);
  if (coverage) features.push(`${coverage[1].replace(/\s*&\s*/g, " and ")} roaming`);
  else if (/nationwide/i.test(plan.description ?? "")) features.push("Canada-wide");
  if (services.some((text) => /^Hotspot/i.test(text))) features.push("Hotspot");
  return features;
};

export default {
  seller: "Koodo",
  async offers({ devices, json, source, log }) {
    const order = { lang: "en", prov: "bc", orderType: "ACTIVATION", credit: "B", deviceType: "PHONE", noCache: false };
    const listing = await json(PAGE, { url: `${API}/postpaid-devices`, body: { ...order, giftId: "", promoCode: "", promotionId: "" } });
    const products = (listing.catalogue?.offerings ?? []).filter((item) => item.category === "mobility-product");
    if (!products.length) throw new Error("no phones in postpaid-devices");

    const tiers = await json(PAGE, {
      url: `${API}/rate-plans`,
      body: { lang: "en", prov: "BC", accountType: "I", accountSubtype: "R", deviceType: "PHONE", creditClass: "B", planType: "NONBYOD", orderType: "ACTIVATION" },
    });

    // New phones matched to the catalog, with a SKU at each storage the phone
    // page offers (its first active colour)
    const phones = new Map();
    const variants = [];
    for (const product of products) {
      const { content = {} } = product;
      if (product.type !== "new" || !content.url) continue;
      const device = matchDevice(devices, content.name ?? product.description);
      if (!device || phones.has(device.id)) continue;
      const page = await json(PAGE, { url: `${SITE}/_next/data/commerce-postpaid/en/phones/${content.url}.json?prov=bc&slug=${content.url}` });
      const skus = new Map();
      for (const item of page.pageProps?.listVariations ?? []) {
        if (item.type !== "new" || (item.koodoParameters?.status ?? "Active") !== "Active") continue;
        const storage = parseStorage(`${item.storage?.size}${item.storage?.unit}`);
        // The offers endpoint takes the product code without its leading N
        const sku = item.productCode?.replace(/^N/, "");
        if (storage && sku && !skus.has(storage)) skus.set(storage, sku);
      }
      // The listed colour's storage, should the page's data leave it out
      const listedStorage = parseStorage(content.storage ?? "");
      if (listedStorage && product.sku && !skus.has(listedStorage)) skus.set(listedStorage, product.sku);
      if (!skus.size) continue;
      phones.set(device.id, device);
      for (const [storage, sku] of skus) variants.push({ device, slug: content.url, storage, sku });
    }

    const offers = [];
    for (const { device, slug, storage, sku } of variants) {
      const details = await json(PAGE, { url: `${API}/postpaid-details`, body: { ...order, sku } });
      // The Tab tiers (Tab Plus, Tab, Tab Lite; "No Tab" has no monthly), the
      // one that costs least for the phone (to the dollar, since monthly
      // payments are rounded), Tab Plus on a tie, then the least upfront
      const total = (choice) => Math.round(choice.upfront + choice.monthlyKeep * choice.termMonths);
      const tabs = (details.offerings ?? [])
        .map((offer) => ({
          offer,
          plus: attribute(offer, "priceTierLabel") === "Tab Plus",
          fullPrice: price(offer, "BASE_PRICE"),
          monthlyKeep: price(offer, "MONTHLY_INSTALLMENT"),
          upfront: price(offer, "DISCOUNTED_PRICE") ?? 0,
          termMonths: Number(attribute(offer, "deviceTerm")),
        }))
        .filter((choice) => choice.fullPrice > 0 && choice.monthlyKeep !== undefined && choice.termMonths > 0)
        .sort((a, b) => total(a) - total(b) || b.plus - a.plus || a.upfront - b.upfront);
      if (!tabs.length) continue;
      const { offer: tab, fullPrice, monthlyKeep, upfront, termMonths } = tabs[0];

      // The cheapest plan in the same Tab tier
      const tier = (tiers.offers ?? []).find((offer) => offer.id === tab.id) ?? (tiers.offers ?? []).find((offer) => offer.content?.priceTierId === attribute(tab, "priceTierId"));
      const plans = (tier?.plans ?? [])
        .map((plan) => {
          const discount = price(plan, "PAD_DISCOUNT") ?? 0;
          return { plan, discount, monthly: cents(price(plan, "BASE_PRICE") - discount), gb: planData(plan) };
        })
        .filter((choice) => choice.monthly > 0 && choice.gb !== undefined)
        .sort((a, b) => a.monthly - b.monthly);
      if (!plans.length) {
        log(`no plan found for ${device.name} ${storage} on ${tab.description}`);
        continue;
      }
      const { plan, discount, monthly, gb } = plans[0];

      const bonus = tab.dependencies?.included?.flatMap((promotion) => promotion.alterations ?? []).find((alteration) => alteration.type === "EQUIPMENT_BONUS" && alteration.value > 0);
      const shipping = price(tab, "SHIPPING_FEE");
      const notes = [];
      if (discount) notes.push(`Plan price is with the $${discount} auto-pay discount.`);
      if (bonus) notes.push(`Includes Koodo's $${bonus.value} Tab Bonus.`);
      notes.push("Koodo has no return option.");
      if (shipping) notes.push(`$${shipping} shipping on online orders is not counted.`);
      offers.push({
        id: offerId(device.id, storage, "koodo"),
        phone: device.id,
        storage,
        kind: "carrier",
        seller: "Koodo",
        title: `${tab.description.replace(/^Smartphone\s*-\s*/i, "")}, ${termMonths} months`,
        condition: "new",
        fullPrice,
        termMonths,
        upfront,
        monthlyKeep,
        plan: { name: plan.description.replace(/\s*\(.*\)\s*$/, ""), monthly, gb, features: planFeatures(plan) },
        connectionFee: 0,
        note: notes.join(" "),
        source: source(`Koodo, ${device.name}`, `${SITE}/en/phones/${slug}`),
      });
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones, ${offers.length} storages (${phones.size} listed new)`);
    return offers;
  },
};
