// Best Buy Mobile: each carrier's monthly deal as Best Buy sells it, with the
// gift card Best Buy adds on some activations. The page shows these as their
// own group under each carrier ("from Best Buy"), beside the carrier's own deal.
//
// Endpoints (no sign-in; requested from inside a bestbuy.ca page):
//   search  GET /api/v2/json/search?query=...&categoryid=696304   Carrier Phones: one
//           listing per carrier, storage and colour ("Rogers Apple iPhone 18 Pro
//           256GB - Black - Monthly Financing")
//   offers  GET /api/offers/v1/products/<sku>/offers   the device payments: carrier,
//           and carrierPurchasePlans, a KEEPIT and (with a return program) a
//           RETURNIT entry per tier, with full price, monthly, down payment and
//           the amount deferred on return (residualValue)
// Best Buy lists only the device payments; the plan is charged on top. Each
// tier is the carrier's own plan tier, so it is paired with the carrier's
// cheapest plan (read by the carrier's own module) that has the same device
// payment. The gift cards are only on Best Buy's phone deals page, a tile per
// phone naming the amount and which carriers qualify ("$250 gift card with
// activation. TELUS."): each counts as a credit on that phone's deals with
// those carriers, at every storage.
import { matchDevice, offerId, parseStorage } from "../lib.mjs";

const SITE = "https://www.bestbuy.ca";
const DEALS = `${SITE}/en-ca/collection/save-on-cell-phones-and-plans/263117`;
// The page the requests are made from: the one the Best Buy module opens too
const PAGE = `${SITE}/en-ca/category/unlocked-mobile-phones/743355`;
const CARRIER_PHONES = "696304";
// Best Buy's carrier codes and the names the page uses
const CARRIERS = { rogers: "Rogers", bell: "Bell", telus: "Telus", fido: "Fido", koodo: "Koodo", freedom: "Freedom Mobile", virgin: "Virgin Plus" };
const PREFIX = /^(TELUS|Rogers|Bell|Fido|Koodo|Freedom Mobile|Virgin Plus)\s+/i;
const carrierNamed = (text) => Object.values(CARRIERS).find((name) => name.toLowerCase() === String(text).trim().toLowerCase());
// Monthly payments are rounded to the cent, so allow a cent between them
const near = (a, b) => Math.abs(a - b) < 0.015;

export default {
  seller: "Best Buy (carriers)",
  // Runs after the carriers' own modules, whose plans it pairs with
  after: true,
  async offers({ devices, open, json, source, offersOf, log }) {
    const giftCards = await readGiftCards(await open(PAGE), devices);
    // The deals page has always had some; none means it didn't draw them, and
    // saving the deals without their gift cards would make them look dearer
    if (!giftCards.length) throw new Error(`no gift cards read on ${DEALS}`);
    log(`gift cards: ${giftCards.map((card) => `${card.device} $${card.amount} (${[...card.carriers].join(", ")})`).join("; ") || "none"}`);

    const offers = [];
    for (const device of devices) {
      const listings = [];
      for (let page = 1; page <= 5; page += 1) {
        const reply = await json(PAGE, { url: `${SITE}/api/v2/json/search?query=${encodeURIComponent(`${device.brand} ${device.name}`)}&categoryid=${CARRIER_PHONES}&pageSize=100&page=${page}&lang=en-CA` });
        listings.push(...(reply.products ?? []));
        if (page >= (reply.totalPages ?? 1)) break;
      }
      // One listing per carrier and storage: the colours cost the same
      const chosen = new Map();
      for (const product of listings) {
        if (product.isMarketplace || !PREFIX.test(product.name)) continue;
        if (matchDevice(devices, product.name.replace(PREFIX, ""))?.id !== device.id) continue;
        const storage = parseStorage(product.name);
        const key = `${product.name.match(PREFIX)[1].toLowerCase()} ${storage}`;
        if (storage && !chosen.has(key)) chosen.set(key, { product, storage });
      }

      for (const { product, storage } of chosen.values()) {
        const [listing] = await json(PAGE, { url: `${SITE}/api/offers/v1/products/${product.sku}/offers` });
        if (!listing || listing.sellerId !== "bbyca") continue;
        const seller = CARRIERS[listing.carrier];
        if (!seller) {
          log(`unknown carrier "${listing.carrier}" on ${product.name}`);
          continue;
        }
        const direct = offersOf(seller).filter((offer) => offer.kind === "carrier" && !offer.via && offer.phone === device.id && offer.storage === storage);
        const tiers = new Map();
        for (const plan of listing.carrierPurchasePlans ?? []) tiers.set(plan.tier, { ...tiers.get(plan.tier), [plan.creditType]: plan });

        for (const [tier, { KEEPIT: keep, RETURNIT: ret }] of tiers) {
          if (!keep) continue;
          // The carrier's plan with the same device payment: the return
          // program's when there is one, else financing's; the cheapest
          const byPayment = (pick) => direct.filter(pick).sort((a, b) => a.plan.monthly - b.plan.monthly)[0];
          const matched = (ret && byPayment((offer) => offer.returnOption && near(offer.returnOption.monthly, ret.instalment.amount))) ?? byPayment((offer) => near(offer.monthlyKeep, keep.instalment.amount));
          // When Best Buy's payment differs from the carrier's own (a Best Buy
          // price, or a storage the carrier doesn't sell), the plan by the tier's name
          const pair = matched ?? planByTier(offersOf(seller), device.id, tier);
          if (!pair) {
            log(`no ${seller} plan for the ${device.name} ${storage} (Best Buy's ${tier} tier): left out`);
            continue;
          }
          const card = giftCards.find((candidate) => candidate.device === device.id && candidate.carriers.has(seller));
          const program = pair.title.replace(/,\s*\d+ months$/, "");
          const notes = [
            matched
              ? `Best Buy lists the device payments; the plan is ${seller}'s own for this tier (${tier}), charged on top.`
              : `Best Buy lists the device payments; the plan, charged on top, is ${seller}'s ${pair.plan.name}, taken from the tier's name (${tier}): ${seller}'s own site has no deal with the same payment.`,
          ];
          if (card) notes.push(`Best Buy adds a $${card.amount} gift card with activation (its phone deals page; "select" plans, terms apply).`);
          if (pair.connectionFee) notes.push(`${seller}'s $${pair.connectionFee} connection fee is counted, as on its own site.`);
          notes.push("Activated in store, with two pieces of ID and a credit check.");
          offers.push({
            id: offerId(device.id, storage, "bestbuy", seller, tiers.size > 1 ? tier : ""),
            phone: device.id,
            storage,
            kind: "carrier",
            seller,
            via: "Best Buy",
            title: `${program}, ${keep.instalment.periodLength} months`,
            condition: "new",
            fullPrice: keep.purchasePrice,
            termMonths: keep.instalment.periodLength,
            upfront: keep.instalment.downPayment ?? 0,
            monthlyKeep: keep.instalment.amount,
            ...(ret && ret.residualValue > 0 ? { returnOption: { name: pair.returnOption?.name ?? "Return It", monthly: ret.instalment.amount, deferred: ret.residualValue } } : {}),
            plan: pair.plan,
            connectionFee: pair.connectionFee,
            ...(card ? { credit: { amount: card.amount, label: `$${card.amount} Best Buy gift card` } } : {}),
            note: notes.join(" "),
            source: source(`Best Buy, ${product.name}`, `${SITE}${product.productUrl}`),
          });
        }
      }
    }
    log(`priced ${new Set(offers.map((offer) => offer.phone)).size} of ${devices.length} phones, ${offers.length} offers`);
    return offers;
  },
};

// The carrier's own deal whose plan Best Buy's tier stands for, by its name:
// Freedom's "$60" is its $60 plan; an "Ultra" tier is the carrier's top plan
// with a return program; any other (Koodo's Tab Plus, Fido's Plus, Virgin's
// Sweet Pay: financing on any plan) is the carrier's cheapest. This phone's
// deals first, then any phone's, since plans are the same for every phone.
function planByTier(carrierOffers, phone, tier) {
  const own = carrierOffers.filter((offer) => offer.kind === "carrier" && !offer.via);
  const pick = (offers) => {
    const amount = String(tier).match(/^\$(\d+)$/)?.[1];
    if (amount) return offers.find((offer) => offer.plan.monthly === Number(amount));
    if (/ultra/i.test(tier)) return offers.filter((offer) => offer.returnOption).sort((a, b) => b.plan.monthly - a.plan.monthly)[0];
    return [...offers].sort((a, b) => a.plan.monthly - b.plan.monthly)[0];
  };
  return pick(own.filter((offer) => offer.phone === phone)) ?? pick(own);
}

// The deals page's tiles: "iPhone 18 Pro 256GB … $250 gift card with
// activation. TELUS. Terms apply. Browse phones", as [{ device, amount, carriers }].
// The page's HTML is fetched from inside another Best Buy page and parsed
// there: Best Buy's bot shield turns a script's window away from the deals
// page itself after a few visits, but not from its HTML.
async function readGiftCards(page, devices) {
  const tiles = await page.evaluate(async (url) => {
    const html = await (await fetch(url, { credentials: "include" })).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Each piece of text in the tile, in order: the lines a visitor reads
    const lines = (element) => {
      const out = [];
      const walker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text && !node.parentElement.closest("script,style")) out.push(text);
      }
      return out;
    };
    const found = new Set();
    for (const element of doc.body.querySelectorAll("*")) {
      if (element.closest("script,style") || !/gift card with activation/i.test(element.textContent ?? "")) continue;
      // The innermost element with the words, then the tile around it
      if ([...element.children].some((child) => /gift card with activation/i.test(child.textContent ?? ""))) continue;
      let tile = element;
      while (tile && !/Browse phones/.test(tile.textContent ?? "")) tile = tile.parentElement;
      if (tile && tile !== doc.body) found.add(tile);
    }
    return [...found].map(lines);
  }, DEALS);
  const cards = [];
  for (const lines of tiles) {
    const device = matchDevice(devices, lines[0] ?? "");
    const at = lines.findIndex((line) => /gift card with activation/i.test(line));
    const amount = Number(lines[at]?.match(/\$([\d,]+)\s+gift card/i)?.[1].replace(/,/g, ""));
    const carriers = new Set((lines[at + 1] ?? "").replace(/\.$/, "").split(",").map(carrierNamed).filter(Boolean));
    if (device && amount > 0 && carriers.size) cards.push({ device: device.id, amount, carriers });
  }
  return cards;
}
