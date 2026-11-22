// Fido: each phone it sells new at the catalog storage, on its 24-month
// Payment Program (no return option), once per device price tier with the
// cheapest plan that gets it. Same platform as Rogers: the endpoints and how
// plans meet price tiers are in _rogers-platform.mjs.
import { slug } from "../lib.mjs";
import { platformOffers } from "./_rogers-platform.mjs";

export default {
  seller: "Fido",
  offers: (helpers) =>
    platformOffers(
      {
        seller: "Fido",
        site: "https://www.fido.ca",
        province: helpers.region.code,
        applicationId: "Fido.ca",
        deviceTradeIn: false,
        returnProgram: undefined,
        title: (months) => `Payment Program, ${months} months`,
        // "60GB, Talk & Text - Entry" -> "60gb-entry"
        planId: (plan) => slug(plan.planDisplayName.replace(/talk\s*&\s*text/i, "")),
        features: (plan) => {
          const text = plan.feature ?? "";
          return [/5G\b/.test(text) ? "5G" : "", /capped at ([\d.]+ ?[MG]bps)/i.test(text) ? `Speeds capped at ${text.match(/capped at ([\d.]+ ?[MG]bps)/i)[1]}` : ""].filter(Boolean);
        },
        notes: ({ autopay, discount, credit, months }) =>
          [
            autopay > 0 ? `Plan price is with the $${autopay} autopay credit${discount > 0 ? ` and a $${discount}/mo plan discount` : ""}.` : "",
            credit ? `The device payments count a $${credit}/mo bill credit for ${months} months.` : "",
            "No return option. No setup charge when bought online.",
          ]
            .filter(Boolean)
            .join(" "),
      },
      helpers,
    ),
};
