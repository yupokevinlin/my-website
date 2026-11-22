// Helpers shared by the runner (update.mjs) and the seller modules (sellers/).

export const cents = (amount) => Math.round(amount * 100) / 100;

// A price written any way ("$1,749.99", "1749.9900", 1749.99) as a number
export const toNumber = (value) => (typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d.]/g, "")));

export const slug = (text) =>
  String(text)
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// A phone's name reduced to what tells models apart, so sellers' spellings
// meet: "Samsung Galaxy S25+ (Plus) 5G", "Galaxy S25 Plus" and "galaxy-s25-plus"
// all become "galaxys25+", and "Galaxy S26FE" matches "Galaxy S26 FE".
export const normalizeName = (name) =>
  String(name)
    .toLowerCase()
    .replace(/\b(apple|samsung|google)\b/g, " ")
    .replace(/\(plus\)/g, " ")
    .replace(/\bplus\b/g, "+")
    .replace(/\b5g\b/g, " ")
    .replace(/[^a-z0-9+]/g, "")
    .replace(/\++/g, "+");

// "256 GB", "256gb", "1 TB" -> "256GB", "1TB"; the first size in the text
export const parseStorage = (text) => {
  const match = String(text).match(/(\d+)\s*(GB|TB)\b/i);
  return match ? `${match[1]}${match[2].toUpperCase()}` : undefined;
};

// The catalog device a seller's product name is, or undefined. Pass the
// model's name without colour or storage ("Apple iPhone 18 Pro Max"), or a
// full listing title: the storage, colour and anything after " - " is cut off.
export const matchDevice = (devices, name) => {
  const model = String(name)
    .replace(/\s+-\s+.*$/, "")
    .replace(/\s*\b\d+\s*(GB|TB)\b.*$/i, "");
  const wanted = normalizeName(model);
  return devices.find((device) => normalizeName(device.name) === wanted);
};

const finite = (value) => typeof value === "number" && Number.isFinite(value);
const positive = (value) => finite(value) && value > 0;
const notNegative = (value) => finite(value) && value >= 0;

// What is wrong with an offer a seller module returned, or [] when nothing.
// The runner drops an offer with problems and says why.
export const offerProblems = (offer, deviceIds) => {
  const problems = [];
  const need = (ok, what) => {
    if (!ok) problems.push(what);
  };
  need(typeof offer.id === "string" && /^[a-z0-9-]+$/.test(offer.id), "id: lowercase letters, digits and dashes");
  need(deviceIds.has(offer.phone), `phone: not in devices.json (${offer.phone})`);
  need(typeof offer.seller === "string" && offer.seller, "seller");
  need(typeof offer.title === "string" && offer.title, "title");
  need(["new", "open-box", "refurbished"].includes(offer.condition), "condition");
  need(offer.source && /^https:\/\//.test(offer.source.url) && offer.source.label && /^\d{4}-\d{2}-\d{2}$/.test(offer.source.checked), "source: label, https url, checked date");
  if (offer.kind === "outright") {
    need(positive(offer.price), "price");
    need(notNegative(offer.ehf), "ehf");
  } else if (offer.kind === "subscription") {
    for (const key of ["price", "adminFee", "keepAmount", "termMonths"]) need(positive(offer[key]), key);
    need(notNegative(offer.ehf), "ehf");
    need(offer.keepAmount < offer.price, "keepAmount below price");
  } else if (offer.kind === "carrier") {
    for (const key of ["fullPrice", "termMonths"]) need(positive(offer[key]), key);
    // A promotion can cover the whole phone, so $0 a month is real
    for (const key of ["upfront", "connectionFee", "monthlyKeep"]) need(notNegative(offer[key]), key);
    // Financing pays for the phone, give or take a promotion's discount
    need(offer.upfront + offer.monthlyKeep * offer.termMonths <= offer.fullPrice + 1, "upfront + monthlyKeep × term at most fullPrice");
    if (offer.returnOption) {
      const { name, monthly, deferred } = offer.returnOption;
      need(typeof name === "string" && name && notNegative(monthly) && positive(deferred), "returnOption: name, monthly (can be 0), deferred");
      need(monthly < offer.monthlyKeep + 0.01, "returnOption.monthly at most monthlyKeep");
    }
    const { plan } = offer;
    need(plan && typeof plan.name === "string" && plan.name, "plan.name");
    need(plan && positive(plan.monthly), "plan.monthly");
    need(plan && (plan.gb === "unlimited" || positive(plan.gb)), "plan.gb: a number or \"unlimited\"");
    need(plan && Array.isArray(plan.features) && plan.features.every((feature) => typeof feature === "string"), "plan.features: strings");
    if (offer.credit) need(positive(offer.credit.amount) && offer.credit.label, "credit: amount and label");
  } else {
    problems.push(`kind: outright, subscription or carrier (${offer.kind})`);
  }
  return problems;
};
