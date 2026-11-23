// Rogers and Fido run the same buy flow, so rogers.mjs and fido.mjs share
// this reader. (The runner skips files starting with "_".)
//
// Endpoints (no sign-in; requested from inside the site's /phones page, with
// the headers the page sends: province, lang, applicationId and so on):
//   listing  GET  /api/catalogds/v1/local/devices/search?activityType=nac
//                 every device on the phones page: name, slug, product id, condition
//   device   GET  /api/catalogds/v1/productOffering/devices/<slug>?activityType=nac
//                 its colours and storage sizes (SKUs) and their service groups
//   pricing  POST /api/catalogds/v1/local/device/productPricing/<product id>
//                 one row per price tier code and program: NOTERM (full price),
//                 FINANCING or TIEREDHARDWARE (keep it), UPFRONTEDGE or
//                 TIEREDHARDWAREUPFRONTEDGE (Rogers' Save & Return)
//   plans    POST /api/catalogds/v2/local/plans/search?searchValue=<tier codes>&deviceExternalId=<sku>
//                 the plans the build-plan step offers, each with the price tier
//                 code it unlocks (planTierCode) and its price after the autopay
//                 credit and any limited-time discount (rawData.price; autopay: true)
//
// A plan unlocks the device price rows with its tier code. Rogers, 2026-11-22:
// 5G+ Lite and Essentials are EDGEFIN2TAB, Popular RFIN3HIGH, Ultimate
// RFIN3_ULTI; RFIN3LOW has no plan in BC, so its rows are skipped. Tier codes
// whose rows have the same numbers make one price tier, and its offer takes the
// cheapest plan that unlocks any of them. Each storage size on sale is priced
// this way on its own (one SKU per size; its colours share the prices).
import { cents, matchDevice, offerId, parseStorage } from "../lib.mjs";

const headersFor = (config) => ({
  Accept: "application/json, text/plain, */*",
  lang: "en",
  province: config.province,
  applicationId: config.applicationId,
  accountType: "Consumer",
  accountSubType: "Regular",
  activityType: "NAC",
});

const KEEP_TIERS = ["FINANCING", "TIEREDHARDWARE"];
const RETURN_TIERS = ["UPFRONTEDGE", "TIEREDHARDWAREUPFRONTEDGE"];

const planData = ({ dataUsage, dataUnit }) => {
  const amount = Number(dataUsage);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  if (amount >= 999999) return "unlimited";
  return /^MB$/i.test(dataUnit) ? amount / 1000 : amount;
};

// config: { seller, site, province, applicationId, deviceTradeIn, returnProgram,
//   title(months), planId(plan), features(plan), notes(context) }
export const platformOffers = async (config, { devices, json, source, log }) => {
  const page = `${config.site}/phones/`;
  const headers = headersFor(config);
  const priceHeaders = {
    ...headers,
    deviceTradeIn: String(config.deviceTradeIn),
    devicePriceTier: String(config.deviceTradeIn),
    applyTradeIn: "false",
  };
  const planHeaders = { ...headers, stm: "false", tierDiscount: "true", fetchCatalogDiscounts: "true", autopay: "true" };

  const listing = await json(page, { url: `${config.site}/api/catalogds/v1/local/devices/search?activityType=nac`, headers: priceHeaders });
  // New phones only: certified pre-owned share the names, bundles don't match a catalog name
  const models = new Map();
  for (const item of listing.devices ?? []) {
    if (item.deviceCondition !== "New" || !item.urlSlug || !item.atgProductId) continue;
    const device = matchDevice(devices, item.deviceName);
    if (device && !models.has(device.id)) models.set(device.id, { device, item });
  }
  log(`${listing.devices?.length ?? 0} listed, ${models.size} are catalog phones sold new`);

  const offers = [];
  for (const { device, item } of models.values()) {
    const product = await json(page, { url: `${config.site}/api/catalogds/v1/productOffering/devices/${item.urlSlug}?activityType=nac`, headers });
    const skus = (product.subModelList ?? []).flatMap((model) => model.childSku ?? []);
    // One SKU per storage size on sale (colours of a size share their prices)
    const bySize = new Map();
    for (const entry of skus) {
      const storage = parseStorage(entry.memory);
      if (storage && entry.availabilityOptions === "AVAILABLE_FOR_PURCHASE" && !bySize.has(storage)) bySize.set(storage, entry);
    }
    if (!bySize.size) {
      log(`${device.name}: no storage on sale (${[...new Set(skus.map((entry) => entry.memory))].join(", ")})`);
      continue;
    }

    for (const [storage, sku] of bySize) {
      const [pricing] = await json(page, {
        url: `${config.site}/api/catalogds/v1/local/device/productPricing/${product.atgProductId}`,
        headers: priceHeaders,
        body: {
          srReturn: false,
          activityType: "NAC",
          skuDetails: [{ variantExternalId: sku.atgSkuId, atgProductId: product.atgProductId }],
          getEligiblePromo: true,
          accountType: "Consumer",
          accountSubType: "Regular",
          applicationId: config.applicationId,
        },
      });
      const rows = (pricing?.prices ?? []).filter((row) => row.publiclyAvailable !== false);
      const fullPrice = rows.find((row) => row.priceTier === "NOTERM")?.regularAmount;
      const tierCodes = [...new Set(rows.map((row) => row.tierCode).filter((code) => code && code !== "NOTERM"))];
      if (!fullPrice || !tierCodes.length) {
        log(`${device.name} ${storage}: no pricing rows`);
        continue;
      }

      const plansReply = await json(page, {
        url: `${config.site}/api/catalogds/v2/local/plans/search?activityType=NAC&searchValue=${[...tierCodes, "NOTERM"].join(",")}&deviceExternalId=${sku.atgSkuId}`,
        headers: planHeaders,
        body: {
          segmentIds: [],
          sharingTypes: ["MAIN", "INDIVIDUAL"],
          getEligiblePromo: true,
          compatibleServiceGroups: sku.compatibleServiceGroups ?? [],
          deviceTradein: false,
          allowMultipleHwPromo: true,
          accountType: "Consumer",
          accountSubType: "Regular",
          applicationId: config.applicationId,
        },
      });
      const plans = (plansReply.plans ?? []).filter(
        (plan) => tierCodes.includes(plan.planTierCode) && plan.publiclyAvailable !== false && !plan.exclusivePlan && !plan.targetedPlan && plan.rawData?.price > 0 && planData(plan.rawData) !== undefined,
      );

      // Price tiers: tier codes whose keep (and return) rows have the same numbers
      const tiers = new Map();
      for (const code of tierCodes) {
        const keep = rows.find((row) => row.tierCode === code && KEEP_TIERS.includes(row.priceTier));
        if (!keep) continue;
        const back = config.returnProgram ? rows.find((row) => row.tierCode === code && RETURN_TIERS.includes(row.priceTier)) : undefined;
        const key = JSON.stringify([keep.monthlyInstallmentAmount, keep.mandatoryPaymentAmount, keep.recurringChargePeriod, back?.monthlyInstallmentAmount, back?.rvAmount]);
        if (!tiers.has(key)) tiers.set(key, { keep, back, codes: [] });
        tiers.get(key).codes.push(code);
      }

      for (const { keep, back, codes } of tiers.values()) {
        const plan = plans.filter((entry) => codes.includes(entry.planTierCode)).sort((a, b) => a.rawData.price - b.rawData.price)[0];
        if (!plan) continue; // a tier no plan in this province unlocks
        const autopay = (plan.autoDeploySocs ?? []).filter((soc) => soc.socType === "AUTOPAYMSFDISCOUNT").reduce((sum, soc) => sum + Number(soc.discountValue || 0), 0);
        const discount = cents(Number(plan.rawData.totalPlanDiscount || 0) - autopay);
        const months = keep.recurringChargePeriod;
        const credit = keep.recurringCreditAmount > 0 ? keep.recurringCreditAmount : 0;
        const offer = {
          id: offerId(device.id, storage, config.seller, config.planId(plan)),
          phone: device.id,
          storage,
          kind: "carrier",
          seller: config.seller,
          title: config.title(months),
          condition: "new",
          fullPrice: cents(fullPrice),
          termMonths: months,
          upfront: cents(keep.mandatoryPaymentAmount || 0),
          monthlyKeep: cents(keep.monthlyInstallmentAmount),
          plan: {
            name: plan.planDisplayName.trim(),
            monthly: cents(plan.rawData.price),
            gb: planData(plan.rawData),
            features: config.features(plan),
          },
          connectionFee: 0,
          note: config.notes({ autopay, discount, credit, months }),
          source: source(
            `${config.seller}, build your plan`,
            `${config.site}/phones/${item.urlSlug}/build-plan?tierType=${keep.priceTier}&upfrontEdge=false&sku=${sku.atgSkuId}&step=2&tier=${plan.planTierCode}&flowType=nac`,
          ),
        };
        if (back?.monthlyInstallmentAmount > 0 && back.rvAmount > 0) {
          offer.returnOption = { name: config.returnProgram, monthly: cents(back.monthlyInstallmentAmount), deferred: cents(back.rvAmount) };
        }
        offers.push(offer);
      }
    }
  }
  log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones`);
  return offers;
};
