// Telus: each phone it sells new, at every storage it sells (each on its first
// colour not on pre-order), on TELUS Easy Payment (24 months), with
// Bring-It-Back as the return option. One offer per storage and device price
// tier: the cheapest plan that gets that tier's payments.
//
// Endpoints (no sign-in; requested from inside telus.com/en/mobility/phones):
//   phones   the listing page's own data (window.__NEXT_DATA__, products.all):
//            names, condition, page slugs
//   storage  GET /site-builder-2/api/pep-memory-and-color?sku=<slug>&locale=en&isBusiness=false
//            the storage sizes and colour SKUs a phone page offers
//   offers   GET /mobility/configure/backend/offering-bundles?sku=<SKU>&prov=BC&...
//            one offering per plan: the plan (price, pre-authorized payment
//            discount, data, included services, display name) and the device
//            offer (full price, upfront, Easy Payment and Bring-It-Back
//            monthly, Bring-It-Back deferred amount, shipping). A plan can come
//            twice, with a premium and a basic device offer; the better one counts.
// Prices: BASE_PRICE is the phone's full price and DISCOUNTED_PRICE what is
// paid upfront. OFFER_PRICE is not upfront: it repeats PROMOTIONAL_DISCOUNT,
// the device sale already taken off the monthly payments.
import { cents, matchDevice, offerId, parseStorage } from "../lib.mjs";

const SITE = "https://www.telus.com";
const PAGE = `${SITE}/en/mobility/phones`;

const price = (item, type) => {
  const found = item?.prices?.find((entry) => entry.type === type);
  return found === undefined ? undefined : Number(found.amount);
};
const attribute = (item, property) => item?.specification?.flatMap((spec) => spec.attributes ?? []).find((entry) => entry.property === property)?.value;

// Data each month, from the plan's content, else its "60GB non-shareable data" service
const planData = (plan) => {
  const { content = {} } = plan;
  if (/unlimited/i.test(content.dataSize ?? "")) return "unlimited";
  if (/^gb$/i.test(content.dataSize ?? "") && Number(content.data) > 0) return Number(content.data);
  const services = plan.dependencies?.included?.map((service) => service.description) ?? [];
  if (services.some((text) => /^unlimited .*data/i.test(text))) return "unlimited";
  const gb = services.map((text) => text.match(/^(\d+)\s*GB .*data/i)).find(Boolean);
  return gb ? Number(gb[1]) : undefined;
};

// What the plan's included services say about network, coverage, hotspot and price lock
const planFeatures = (plan) => {
  const services = plan.dependencies?.included?.map((service) => service.description ?? "") ?? [];
  const features = [];
  const speed = services.map((text) => text.match(/^(5G\+?) Speed/i)).find(Boolean);
  if (speed) features.push(speed[1].toUpperCase());
  const coverage = services.map((text) => text.match(/^Plan Coverage in (.+)$/i)).find(Boolean);
  if (coverage) features.push(`${coverage[1].replace(/\s*&\s*/g, " and ")} roaming`);
  else if (services.some((text) => /nationwide/i.test(text))) features.push("Canada-wide");
  const hotspot = services.map((text) => text.match(/^Hotspot (?:up )?to (\d+\s*GB)/i)).find(Boolean);
  if (hotspot) features.push(`${hotspot[1].replace(/\s+/g, "")} hotspot`);
  if (services.some((text) => /5-Year Rate Plan Price Lock/i.test(text))) features.push("5-year price lock");
  return features;
};

const planName = (plan, gb) => {
  const title = plan.content?.planTitle?.displayName;
  if (!title) return plan.description.replace(/\s*\(.*\)\s*$/, "");
  return `${title} ${gb === "unlimited" ? "Unlimited" : `${gb}GB`}`;
};

export default {
  seller: "Telus",
  async offers({ devices, json, open, source, log }) {
    const tab = await open(PAGE);
    const listed = await tab.evaluate(() =>
      (window.__NEXT_DATA__?.props?.pageProps?.initialState?.products?.all ?? []).map((product) => ({
        type: product.type,
        name: product.name,
        condition: product.condition,
        url: product.variants?.[0]?.redirectionUrl ?? "",
      })),
    );
    if (!listed.length) throw new Error("no phones in the listing page's data");

    // New phones on /mobility/phones/<slug> pages, matched to the catalog
    const phones = new Map();
    for (const product of listed) {
      if (product.type !== "device" || product.condition !== "NEW") continue;
      const page = product.url.match(/^\/mobility\/phones\/([a-z0-9-]+)/);
      const device = matchDevice(devices, product.name);
      if (page && device && !phones.has(device.id)) phones.set(device.id, { device, page: page[1] });
    }

    // Each storage a phone page offers ("256-GB"), on its first colour not on pre-order
    const variants = [];
    for (const { device, page } of phones.values()) {
      const memory = await json(PAGE, { url: `${SITE}/site-builder-2/api/pep-memory-and-color?sku=${page}&locale=en&isBusiness=false` });
      for (const [key, size] of Object.entries(memory.storageColours ?? {})) {
        const storage = parseStorage(key.replace("-", ""));
        const colour = size?.find((entry) => !entry.isPreOrder) ?? size?.[0];
        if (storage && colour?.productCode) variants.push({ device, page, storage, sku: colour.productCode });
      }
    }

    const offers = [];
    for (const { device, page, storage, sku } of variants) {

      const bundles = await json(PAGE, {
        url: `${SITE}/mobility/configure/backend/offering-bundles?sku=${sku}&prov=BC&accountType=I&accountSubType=R&orderType=ACTIVATION&portIn=false&deviceType=PHONE&productType=phones&lang=en`,
      });
      const choices = [];
      for (const offering of bundles.offerings ?? []) {
        const plan = offering.items?.find((item) => item.category === "mobility-plan");
        const offer = offering.items?.find((item) => item.category === "mobility-offer");
        if (!plan || !offer || attribute(offer, "financeType") !== "FINANCE") continue;
        const monthlyKeep = price(offer, "MONTHLY_INSTALLMENT");
        const fullPrice = price(offer, "BASE_PRICE");
        const planBase = price(plan, "BASE_PRICE");
        if (!(monthlyKeep > 0 && fullPrice > 0 && planBase > 0)) continue;
        const pad = attribute(plan, "isPapDiscountEligible") === "false" ? 0 : (price(plan, "PAD_DISCOUNT") ?? 0);
        const bibMonthly = price(offer, "BIB_MONTHLY_INSTALLMENT");
        const bibAmount = price(offer, "BIB_AMOUNT");
        const gb = planData(plan);
        // A talk-only plan has no data amount and isn't a phone plan to compare
        if (gb === undefined) continue;
        choices.push({
          plan,
          gb,
          fullPrice,
          monthlyKeep,
          upfront: price(offer, "DISCOUNTED_PRICE") ?? 0,
          termMonths: Number(attribute(offer, "deviceTerm") ?? attribute(offer, "term")),
          shipping: price(offer, "SHIPPING_FEE") ?? 0,
          pad,
          planMonthly: cents(planBase - pad),
          returnOption: bibMonthly >= 0 && bibAmount > 0 ? { name: "Bring-It-Back", monthly: bibMonthly, deferred: bibAmount } : undefined,
        });
      }

      // Each plan's best device offer, then one offer per price tier, on the
      // cheapest plan that gets it
      const cost = (choice) => choice.upfront + choice.monthlyKeep * choice.termMonths;
      const best = new Map();
      for (const choice of choices) {
        const held = best.get(choice.plan.id);
        if (!held || cost(choice) < cost(held) || (cost(choice) === cost(held) && (choice.returnOption?.monthly ?? Infinity) < (held.returnOption?.monthly ?? Infinity))) best.set(choice.plan.id, choice);
      }
      const tiers = new Map();
      for (const choice of [...best.values()].sort((a, b) => a.planMonthly - b.planMonthly)) {
        const key = [choice.fullPrice, choice.upfront, choice.monthlyKeep, choice.termMonths, choice.returnOption?.monthly, choice.returnOption?.deferred].join("|");
        if (!tiers.has(key)) tiers.set(key, choice);
      }
      for (const choice of tiers.values()) {
        const { gb } = choice;
        const name = planName(choice.plan, gb);
        const bib = choice.returnOption;
        const notes = [];
        if (choice.pad) notes.push(`Plan price is with the $${choice.pad} pre-authorized payment discount.`);
        const bibTotal = choice.returnOption ? choice.returnOption.monthly * choice.termMonths + choice.returnOption.deferred : Infinity;
        if (bibTotal < choice.upfront + choice.monthlyKeep * choice.termMonths - 0.5)
          notes.push("Bring-It-Back carries its own discount, so paying it off at the end still costs less than plain financing.");
        if (choice.shipping) notes.push(`$${choice.shipping} shipping on online orders is not counted.`);
        offers.push({
          id: offerId(device.id, storage, "telus", name),
          phone: device.id,
          storage,
          kind: "carrier",
          seller: "Telus",
          title: `Easy Payment, ${choice.termMonths} months`,
          condition: "new",
          fullPrice: choice.fullPrice,
          termMonths: choice.termMonths,
          upfront: choice.upfront,
          monthlyKeep: choice.monthlyKeep,
          ...(bib ? { returnOption: bib } : {}),
          plan: { name, monthly: choice.planMonthly, gb, features: planFeatures(choice.plan) },
          connectionFee: 0,
          note: notes.join(" "),
          source: source("Telus, customize your device and plan", `${SITE}/mobility/configure?product=${page}&sku=${sku}`),
        });
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones (${phones.size} listed new)`);
    return offers;
  },
};
