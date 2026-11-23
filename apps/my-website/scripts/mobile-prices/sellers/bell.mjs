// Bell: each phone at every storage it sells new in BC, on Bell SmartPay
// over 24 months, with the Flex Option (return the phone or pay the deferred
// amount) where the phone has it.
//
// Bell prices a phone by plan tier: an Ultra plan can give lower Flex payments
// than a Select plan. Those prices come only from the order builder behind a
// phone page's "Pair it with a plan", "I'm new to Bell", which starts an
// anonymous order (nothing is submitted) and calls a GraphQL API with a token
// of its own. So for each phone the module clicks through to the builder, the
// way a visitor would, and reads the replies the builder's scripts get:
//   listing   https://www.bell.ca/Mobility/Smartphones_and_mobile_internet_devices
//             (server-rendered; links to each phone page)
//   variants  GET  apigate.bell.ca/uxpcommon/UXP.Services/Common/PDM/<id>/ProductVariants
//             each colour and storage: bmc code, memory, full price
//   catalog   POST apigate.bell.ca/channelbellcaext/dofbffselfserveapi, DeviceCatalog
//             each variant's pricing by tier: <bmc>_<TIER>_<months> (Fixed Option) and
//             ..._DRO (Flex Option), with the monthly payment, net price and credit
//   tiers     same endpoint, DeviceTierQuery: the tiers the builder offers and each
//             tier's cheapest plan price (with the $10 autopay credit)
// The Flex Option's deferred amount is the net price less the monthly payments,
// which is what the builder shows ("Includes $120 agreement credit and $996.84
// deferred amount"); the module checks it against Bell's own figure for paying
// it back after the term.
//
// The builder's catalog lists every colour and storage of the phone with its
// tier prices, so one click-through per phone prices all its storages.
//
// One offer per distinct device price on the tier's cheapest plan, for each
// storage. A tier whose cheapest plan isn't in PLANS below (Bell's Basic talk
// plan on the LOW tier) is left out, and so is the MID tier some colours list,
// since the builder doesn't offer it for the phone it opens with.
import { cents, matchDevice, offerId, parseStorage, storageGb } from "../lib.mjs";

const SITE = "https://www.bell.ca";
const LISTING = `${SITE}/Mobility/Smartphones_and_mobile_internet_devices`;
const API = "apigate.bell.ca/channelbellcaext/dofbffselfserveapi";

// Bell's plans by their price with the $10 autopay credit: the facts the API
// doesn't give. Read 2026-11-21 and 2026-11-22 in the order builder ("Choose your
// plan") from https://www.bell.ca/Mobility/Products/iPhone-17-Pro
const PLANS = {
  85: { name: "Select 60 GB", gb: 60, features: [] },
  90: { name: "Select 100 GB with US roaming", gb: 100, features: ["US roaming"] },
  105: { name: "Ultra Unlimited US/Mexico", gb: "unlimited", features: ["US and Mexico roaming", "50 GB hotspot", "Crave with ads"] },
  115: { name: "Ultra Unlimited international", gb: "unlimited", features: ["Roaming in 83 countries", "50 GB hotspot", "Crave with ads", "Priority network access"] },
};

const operation = (response) => {
  try {
    return JSON.parse(response.request().postData() ?? "{}").operationName;
  } catch {
    return undefined;
  }
};

// The builder's replies for one phone page
const readBuilder = async (open, url) => {
  const page = await open(url);
  try {
    const wait = (test) => page.waitForResponse(test, { timeout: 60_000 });
    const qualification = wait((r) => r.url().includes(API) && operation(r) === "QualificationMutation");
    const variants = wait((r) => /\/PDM\/[^/]+\/ProductVariants/.test(r.url()));
    const catalog = wait((r) => r.url().includes(API) && operation(r) === "DeviceCatalog");
    const tiers = wait((r) => r.url().includes(API) && operation(r) === "DeviceTierQuery");
    // Keep a failed wait from surfacing as an unhandled rejection
    for (const promise of [qualification, variants, catalog, tiers]) promise.catch(() => undefined);

    await page.getByRole("button", { name: "Pair it with a plan" }).first().click();
    await page.getByText(/I.m new to Bell/i).first().click({ timeout: 20_000 });

    const province = JSON.parse((await qualification).request().postData()).variables.input.province;
    if (province !== "BC") throw new Error(`the builder priced for ${province}, not BC`);
    return {
      variants: (await (await variants).json()).products,
      offerings: (await (await catalog).json()).data.productCatalogQuery.lineOfBusinessOfferingGroups[0].subscriberOfferingGroups[0].categoryOfferingGroups[0].offerings,
      tiers: (await (await tiers).json()).data.deviceTierQuery,
    };
  } finally {
    await page.close().catch(() => undefined);
  }
};

const alterations = (detail) => Object.fromEntries((detail?.priceAlterations ?? []).map((item) => [item.priceAlterationType, item.value]));

export default {
  seller: "Bell",
  async offers({ devices, open, source, log }) {
    const listing = await open(LISTING);
    const links = await listing.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/Mobility/Products/"]')].map((a) => a.href.split(/[#?]/)[0]))]);
    // Phone pages by catalog device; pre-owned pages say so in their address
    const pages = new Map();
    for (const link of links) {
      const name = decodeURIComponent(link.split("/Mobility/Products/")[1] ?? "").replace(/-/g, " ");
      if (/pre owned|occasion|refurb/i.test(name)) continue;
      const device = matchDevice(devices, name);
      if (device && !pages.has(device.id)) pages.set(device.id, link);
    }

    const offers = [];
    for (const device of devices) {
      const url = pages.get(device.id);
      if (!url) continue;
      let builder;
      try {
        builder = await readBuilder(open, url);
      } catch (error) {
        log(`${device.name}: ${String(error?.message ?? error).split("\n")[0]}`);
        continue;
      }
      const { variants, offerings, tiers } = builder;

      // The builder's catalog carries every colour and storage of the phone, so
      // one click-through prices them all. For each storage, the variant the
      // builder opened with if it's that size, else the cheapest colour in stock
      // online, else the cheapest
      const storageOf = new Map(variants.map((variant) => [variant.bmc, parseStorage(variant.memory)]));
      const fresh = offerings.filter((offering) => offering.condition === "NEW" && storageOf.get(offering.id));
      const storages = [...new Set(fresh.map((offering) => storageOf.get(offering.id)))].sort((a, b) => storageGb(a) - storageGb(b));
      if (!storages.length) {
        log(`${device.name}: no new variant in the builder`);
        continue;
      }
      const selected = (offering) => offering.pricingDetails.some((detail) => detail.isSelected);
      for (const storage of storages) {
        const candidates = fresh.filter((offering) => storageOf.get(offering.id) === storage).sort((a, b) => a.price.value - b.price.value);
        const offering = candidates.find(selected) ?? candidates.find((item) => item.availability === "IN_STOCK") ?? candidates[0];
        offers.push(...priceVariant({ device, url, storage, offering, tiers, source, log }));
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones`);
    return offers;
  },
};

// Bell's offers for one variant (a colour at one storage): one per distinct
// device price, on the cheapest plan that gets it
const priceVariant = ({ device, url, storage, offering, tiers, source, log }) => {
  const fullPrice = cents(offering.price.value);
  const found = [];
  for (const tier of tiers) {
    const planPrice = tier.priceAlterations.find((item) => item.priceAlterationType === "RATE_PLAN_STARTING_PRICE")?.value;
    const facts = PLANS[planPrice];
    if (!facts) {
      log(`${device.name} ${storage}: ${tier.type} tier's cheapest plan ($${planPrice}) isn't in PLANS, left out`);
      continue;
    }
    const fixedDetail = offering.pricingDetails.find((detail) => new RegExp(`^${offering.id}_${tier.type}_\\d+$`).test(detail.id));
    if (!fixedDetail) continue;
    const termMonths = Number(fixedDetail.id.match(/_(\d+)$/)[1]);
    const fixed = alterations(fixedDetail);
    const flex = alterations(offering.pricingDetails.find((detail) => detail.id === `${fixedDetail.id}_DRO`));
    let returnOption;
    if (flex.MONTHLY_INSTALLMENT > 0) {
      const deferred = cents(flex.NET_PRICE - flex.MONTHLY_INSTALLMENT * termMonths);
      // Bell spreads the deferred amount over 24 or 12 months after the term
      const payback = flex.DEVICE_RETURN_MONTHLY_AMOUNT;
      if (!(payback > 0) || ![24, 12].some((months) => Math.abs(payback * months - deferred) <= 1)) {
        log(`${device.name} ${storage}: ${tier.type} Flex deferred amount ${deferred} doesn't match Bell's $${payback}/mo. payback, left out`);
        continue;
      }
      returnOption = { name: "Flex Option", monthly: cents(flex.MONTHLY_INSTALLMENT), deferred };
    }
    found.push({
      tier: tier.type,
      termMonths,
      upfront: cents(fixed.DOWN_PAYMENT ?? 0),
      monthlyKeep: cents(fixed.MONTHLY_INSTALLMENT),
      credit: cents(fixed.AGREEMENT_CREDIT ?? 0),
      returnOption,
      plan: { name: facts.name, monthly: planPrice, gb: facts.gb, features: facts.features },
    });
  }

  found.sort((a, b) => a.plan.monthly - b.plan.monthly);
  const seen = new Set();
  const offers = [];
  for (const tier of found) {
    const key = JSON.stringify([tier.upfront, tier.monthlyKeep, tier.returnOption]);
    if (seen.has(key)) continue;
    seen.add(key);
    const credit = tier.credit > 0 ? ` The monthly payment includes Bell's $${tier.credit} agreement credit.` : "";
    const flexNote = tier.returnOption ? " If the phone is kept, Bell spreads the deferred amount over the following months." : " This phone has no Flex Option.";
    offers.push({
      id: offerId(device.id, storage, "bell", tier.plan.gb === "unlimited" ? "unlimited" : String(tier.plan.gb)),
      phone: device.id,
      storage,
      kind: "carrier",
      seller: "Bell",
      title: `SmartPay, ${tier.termMonths} months`,
      condition: "new",
      fullPrice,
      termMonths: tier.termMonths,
      upfront: tier.upfront,
      monthlyKeep: tier.monthlyKeep,
      ...(tier.returnOption ? { returnOption: tier.returnOption } : {}),
      plan: tier.plan,
      connectionFee: 40,
      note: `Plan price is with the $10 autopay credit.${credit} The $40 device handling charge is counted as the one-time fee.${flexNote}`,
      source: source(`Bell, ${device.name} (plans in “Pair it with a plan”)`, url),
    });
  }
  return offers;
};
