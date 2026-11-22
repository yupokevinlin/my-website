// Virgin Plus: each phone it sells new in BC at its catalog storage, on a
// 24-month Sweet Pay plan. Virgin Plus has no return option.
//
// Endpoints (no sign-in; requested from inside a virginplus.ca page, with the
// province in the cookie province=BC):
//   phones        GET /en/catalogue/phones.json                  every product: code, model,
//                                                                colour, storage
//   installments  GET /en/catalogue/phones-installments.json     each product's financing by
//                                                                option: full price, credit,
//                                                                monthly before tax
//   plans         GET /en/catalogue/planfeed.json?handset=<code>&termgroup=INSTALMENT&financing=Y
//                                                                the plans each financing option
//                                                                allows for that phone, priced
//                                                                with the $10 autopay credit
// The financing options are separate price tiers, each with its own plans:
// FO7 Sweet Pay, FO9 Sweet Pay Lite (cheaper plans, often a dearer phone), FO8
// Sweet Pay Talk (a talk-and-text plan, not priced here since it has no data).
// One offer per tier where the phone's monthly differs, on the tier's cheapest
// data plan; a tier that costs more on both the phone and the plan is left out.
import { cents, matchDevice, parseStorage, slug } from "../lib.mjs";

const SITE = "https://www.virginplus.ca";
// phone-details.html redirects here when opened without a phone
const PAGE = `${SITE}/en/phones/phones-summary.html`;
const COOKIES = { province: "BC" };
// The financing options' names, as the phone pages show them (read 2026-11-22
// on https://www.virginplus.ca/en/phones/phone-details.html)
const FINANCING = { FO7: "Sweet Pay", FO9: "Sweet Pay Lite", FO8: "Sweet Pay Talk" };

const decode = (html) =>
  String(html ?? "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// A plan from the feed: its data, name and what it lists
const readPlan = (entry) => {
  const features = entry.planFeatures ?? {};
  const gb = Number(decode(features.RP_DATA?.Desc).match(/(\d+)\s*GB/i)?.[1] ?? 0);
  const usMexico = Boolean(features.RP_CANUSMEX_DTT);
  const listed = [];
  if (usMexico) listed.push("US and Mexico roaming");
  if (features.RP_UNL_CALLING_27CNTRS) listed.push("Unlimited calls to 27 countries");
  if (features.RP_HOTSPOT) listed.push("Hotspot");
  if (features.RP_SDVIDEO) listed.push("SD video streaming");
  return {
    name: `${gb}GB${usMexico ? " Canada-US-Mexico" : ""}`,
    monthly: Number(entry.price),
    gb,
    features: listed,
  };
};

export default {
  seller: "Virgin Plus",
  async offers({ devices, json, source, log }) {
    const get = (url) => json(PAGE, { url: `${SITE}${url}`, cookies: COOKIES });
    const catalog = await get("/en/catalogue/phones.json");
    const installments = new Map((await get("/en/catalogue/phones-installments.json")).response.products.filter((product) => product.region_id === "BC").map((product) => [product.product_id, product.installmentsummary]));

    // New phones in the catalog at their storage; certified pre-owned models
    // have codes starting "cpo"
    const products = new Map();
    for (const item of catalog) {
      if (item.category !== "Smartphone" || /^cpo/i.test(item.HS_MODEL_CODE) || /pre-?owned/i.test(item.myTitle)) continue;
      const device = matchDevice(devices, decode(item.myTitle));
      if (!device || parseStorage(item.HS_PHONE_MEMORY) !== device.storage) continue;
      const financing = installments.get(item.productCode)?.filter((option) => FINANCING[option.fid] && option.numberofmonths > 0);
      if (!financing?.length) continue;
      if (!products.has(device.id)) products.set(device.id, []);
      products.get(device.id).push({ item, financing });
    }

    const offers = [];
    for (const device of devices) {
      const colours = products.get(device.id);
      if (!colours) continue;
      // Colours share their prices; take the cheapest in case one differs
      const { item, financing } = colours.sort((a, b) => Math.min(...a.financing.map((o) => o.installmentbeforetax)) - Math.min(...b.financing.map((o) => o.installmentbeforetax)))[0];
      const feed = await get(`/en/catalogue/planfeed.json?handset=${encodeURIComponent(item.productCode)}&termgroup=INSTALMENT&financing=Y`);
      const groups = Object.assign({}, ...feed.response.products);

      const tiers = [];
      for (const option of financing) {
        const plans = (groups[option.fid] ?? []).map(readPlan).filter((plan) => plan.gb > 0 && plan.monthly > 0);
        if (!plans.length) continue;
        const plan = plans.sort((a, b) => a.monthly - b.monthly)[0];
        tiers.push({ option, plan, name: FINANCING[option.fid] });
      }
      // The cheaper phone first; keep a tier only if its plan is cheaper than
      // every tier before it (else it costs more on both)
      tiers.sort((a, b) => a.option.installmentbeforetax - b.option.installmentbeforetax || a.plan.monthly - b.plan.monthly);
      const kept = [];
      for (const tier of tiers) {
        if (kept.some((other) => other.plan.monthly <= tier.plan.monthly)) continue;
        kept.push(tier);
      }

      const memory = new URLSearchParams(decode(item.phoneURL).split("?")[1] ?? "").get("memory") ?? parseInt(item.HS_PHONE_MEMORY, 10);
      for (const { option, plan, name } of kept) {
        const credit = option.creditamount > 0 ? ` ${name} takes $${cents(option.creditamount)} off the phone, already in the monthly payment.` : "";
        offers.push({
          id: `${device.id}-virgin-${slug(name)}`,
          phone: device.id,
          kind: "carrier",
          seller: "Virgin Plus",
          title: `${name}, ${option.numberofmonths} months`,
          condition: "new",
          fullPrice: cents(option.retailprice),
          termMonths: option.numberofmonths,
          upfront: cents(option.downpayment ?? 0),
          monthlyKeep: cents(option.installmentbeforetax),
          plan,
          connectionFee: 40,
          note: `Plan price is with the $10 autopay credit.${credit} Virgin Plus has no return option. The $40 device handling charge is counted as the one-time fee.`,
          source: source(`Virgin Plus, ${device.name}`, `${SITE}/en/phones/phone-details.html#!/${item.HS_MODEL_CODE}/${item.HS_COLOUR_FILTER}/${memory}/${option.fid}`),
        });
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones`);
    return offers;
  },
};
