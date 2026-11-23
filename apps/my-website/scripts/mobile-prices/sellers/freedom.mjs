// Freedom Mobile: each phone on MyTab (24-month financing) with TradeUp, its
// return option, in BC, at every storage sold new (each on its cheapest
// colour). The device payments depend on the plan, so each storage gets one
// offer for each distinct set of payments (upfront, MyTab, TradeUp), on the
// cheapest plan that gets it. The cheapest plans allow MyTab but not
// TradeUp, so their offers have no return option.
//
// Pages and endpoints (no sign-in; requested from inside shop.freedommobile.ca
// with the "region" cookie set to BC):
//   /en-CA/plans                       the plan cards (data, Roam Beyond data, price
//                                      with the Digital Discount, 5G+, extras); the
//                                      page loads the plan list from Contentful
//                                      (content_type=planList), read here as the page
//                                      receives it, for each postpaid plan's SKU
//   /en-CA/devices                     links to every device page, /devices/<Brand>/<Model>
//   POST api.freedommobile.ca/api/v1/shop/devices/model {planSku, serviceType: "", deviceSku}
//                                      planPrice (before the Digital Discount) and, for each
//                                      colour and storage, devicePrice and smartTab
//                                      (monthlyTabCharge: MyTab on that plan)
//   POST api.freedommobile.ca/api/v1/devices/tradeupdetails {deviceSku}
//                                      for each plan that allows TradeUp: rvAmount (the
//                                      TradeUp amount) and smartTab.monthlyPayment
// Freedom charges tax on the TradeUp amount when it is paid to keep the phone,
// so `deferred` includes BC's tax. Freedom has no connection fee.
import { cents, matchDevice, offerId, parseStorage } from "../lib.mjs";

const SHOP = "https://shop.freedommobile.ca";
const API = "https://api.freedommobile.ca/api/v1";
const PLANS = `${SHOP}/en-CA/plans`;
const DEVICES = `${SHOP}/en-CA/devices`;
const COOKIES = { region: "BC" };

// "Total Freedom 250GB + Roam Beyond 10GB Select" -> { gb: 250, roam: 10 }
const planData = (name) => {
  const match = String(name).match(/(\d+)\s*GB\s*\+\s*Roam Beyond\s*(\d+)\s*GB/i);
  return match ? { gb: Number(match[1]), roam: Number(match[2]) } : undefined;
};

// The plan cards on the plans page, as shown in BC
const readCards = (text) =>
  text
    .split(/Total Freedom plan/)
    .slice(1)
    .map((card) => {
      const gb = card.match(/^\s*(\d+)\s*GB/);
      const price = card.match(/\$\s*(\d+(?:\.\d+)?)\s*\/\s*mo\./);
      const roam = card.match(/(\d+)\s*GB data in [^\n]*Roam Beyond/);
      if (!gb || !price || !roam) return undefined;
      const features = [];
      if (/^\s*\d+\s*GB\s*5G\+/.test(card)) features.push("5G+");
      if (/data in Canada-U\.S\.-Mexico/.test(card)) features.push("Canada, US and Mexico data");
      features.push(`Roam Beyond ${roam[1]} GB`);
      // Extras the card lists ("Watch plan included >")
      for (const extra of card.matchAll(/^([^\n]*\bincluded)\s*>/gm)) features.push(extra[1].trim());
      return { gb: Number(gb[1]), roam: Number(roam[1]), monthly: Number(price[1]), features };
    })
    .filter(Boolean);

export default {
  seller: "Freedom Mobile",
  async offers({ devices, region, open, json, source, log }) {
    // The plans: the postpaid plan list the plans page loads, kept to the plans
    // its cards show
    const plansPage = await open(PLANS, { cookies: COOKIES });
    const listReply = plansPage.waitForResponse((response) => response.url().includes("content_type=planList"), { timeout: 45_000 });
    await plansPage.reload({ waitUntil: "domcontentloaded" });
    const list = await (await listReply).json();
    await plansPage.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
    const cards = readCards(await plansPage.evaluate(() => document.body.innerText));
    if (!cards.length) throw new Error(`no plan cards on ${PLANS}`);
    const entries = new Map((list.includes?.Entry ?? []).map((entry) => [entry.sys.id, entry]));
    const skus = new Set(
      list.items
        .filter((item) => /postpaid/i.test(item.fields.listCategory ?? ""))
        .flatMap((item) => item.fields.plans ?? [])
        .map((link) => entries.get(link.sys.id)?.fields.sku)
        .filter(Boolean),
    );
    const plans = [...skus]
      .map((sku) => {
        const data = planData(sku);
        const card = data && cards.find((candidate) => candidate.gb === data.gb && candidate.roam === data.roam);
        return card ? { sku, ...card } : undefined;
      })
      .filter(Boolean)
      .sort((a, b) => a.monthly - b.monthly);
    if (!plans.length) throw new Error("no postpaid plan matches a plan card");
    // An id part for each plan: its data, and its Roam Beyond data when a
    // cheaper plan has the same data
    for (const plan of plans) {
      const first = plans.find((other) => other.gb === plan.gb);
      plan.key = first === plan ? `${plan.gb}` : `${plan.gb}-rb${plan.roam}`;
    }
    log(`plans: ${plans.map((plan) => `$${plan.monthly} ${plan.gb}GB+RB${plan.roam}GB`).join(", ")}`);

    // The phones: device pages of models in the catalog (not pre-owned)
    const devicesPage = await open(DEVICES, { cookies: COOKIES });
    const links = await devicesPage.evaluate(() => [
      ...new Set([...document.querySelectorAll('a[href*="/en-CA/devices/"]')].map((link) => link.href)),
    ]);
    const models = new Map();
    for (const href of links) {
      const link = new URL(href);
      const [, brand, model] = link.pathname.match(/\/devices\/([^/]+)\/([^/]+)$/) ?? [];
      if (!model || /^CPO-/i.test(model)) continue;
      const device = matchDevice(devices, `${brand} ${model.replace(/-/g, " ")}`);
      if (device && !models.has(device.id)) models.set(device.id, { device, listedSku: link.searchParams.get("sku") });
    }

    // The listing's SKU is one colour and storage; the model endpoint lists
    // them all, so the first request finds every storage sold new, each priced
    // on its cheapest colour
    const sizes = [];
    for (const { device, listedSku } of models.values()) {
      const first = await json(DEVICES, { url: `${API}/shop/devices/model`, body: { planSku: plans[0].sku, serviceType: "", deviceSku: listedSku ?? "" }, cookies: COOKIES }).catch((error) => {
        log(`${device.name}: ${error.message}`);
        return undefined;
      });
      const cheapest = new Map();
      for (const variant of first?.device?.variants ?? []) {
        const storage = parseStorage(variant.memory ?? "");
        if (!storage || !variant.available || variant.deviceCondition) continue;
        if (!cheapest.has(storage) || variant.devicePrice < cheapest.get(storage).devicePrice) cheapest.set(storage, variant);
      }
      if (!cheapest.size) {
        const sold = [...new Set((first?.device?.variants ?? []).map((variant) => `${variant.memory}${variant.available ? "" : " (unavailable)"}`))];
        log(`${device.name}: not sold new (${sold.join(", ") || "no variants"})`);
        continue;
      }
      for (const [storage, variant] of cheapest) sizes.push({ device, listedSku, first, storage, variantSku: variant.sku });
    }

    const offers = [];
    for (const { device, listedSku, first, storage, variantSku } of sizes) {
      // Each plan's quote for that SKU
      const quotes = [];
      for (const plan of plans) {
        const reply = plan === plans[0] && listedSku === variantSku ? first : await json(DEVICES, { url: `${API}/shop/devices/model`, body: { planSku: plan.sku, serviceType: "", deviceSku: variantSku }, cookies: COOKIES }).catch(() => undefined);
        const variant = reply?.device?.variants?.find((candidate) => candidate.sku === variantSku);
        if (variant?.smartTab?.monthlyTabCharge > 0) quotes.push({ plan, planPrice: Number(reply.planPrice), variant });
      }
      const tradeUps = (await json(DEVICES, { url: `${API}/devices/tradeupdetails`, body: { deviceSku: variantSku }, cookies: COOKIES }).catch(() => ({})))[variantSku] ?? [];

      const seen = new Set();
      for (const { plan, planPrice, variant } of quotes) {
        const tab = variant.smartTab;
        const tradeUp = tradeUps.find((option) => option.ratePlanName === plan.sku);
        const tier = `${tab.requiredUpfrontPayment ?? 0}|${tab.monthlyTabCharge}|${tradeUp?.smartTab?.monthlyPayment ?? "-"}`;
        if (seen.has(tier)) continue;
        seen.add(tier);
        const discount = cents(planPrice - plan.monthly);
        const returnOption = tradeUp?.rvAmount > 0 && tradeUp.smartTab?.monthlyPayment > 0
          ? { name: "TradeUp", monthly: cents(tradeUp.smartTab.monthlyPayment), deferred: cents(tradeUp.rvAmount * (1 + region.taxRate)) }
          : undefined;
        const notes = [
          discount > 0 ? `Plan price is with the $${discount} digital discount (autopay).` : "",
          "The device price depends on the plan.",
          returnOption ? `Keeping a TradeUp phone costs the $${tradeUp.rvAmount} TradeUp amount plus tax, shown here with the tax.` : "This plan has MyTab only, no TradeUp.",
          "Freedom's own network covers less of BC than the big three's.",
        ];
        offers.push({
          id: offerId(device.id, storage, "freedom", plan.key),
          phone: device.id,
          storage,
          kind: "carrier",
          seller: "Freedom Mobile",
          title: `MyTab, ${tab.payOffPeriod} months`,
          condition: "new",
          fullPrice: variant.devicePrice,
          termMonths: tab.payOffPeriod,
          upfront: tab.requiredUpfrontPayment ?? 0,
          monthlyKeep: cents(tab.monthlyTabCharge),
          ...(returnOption ? { returnOption } : {}),
          plan: { name: `$${plan.monthly} plan`, monthly: plan.monthly, gb: plan.gb, features: plan.features },
          connectionFee: 0,
          note: notes.filter(Boolean).join(" "),
          source: source("Freedom Mobile, plans for this phone", `${PLANS}?sku=${variantSku}&deviceOption=${returnOption ? "TradeUp" : "MyTab"}`),
        });
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${models.size} catalog phones listed`);
    return offers;
  },
};
