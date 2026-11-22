// Rogers: each phone it sells new at the catalog storage, on 24-month
// financing, with Save & Return, once per device price tier with the cheapest
// plan that gets it. The endpoints and how plans meet price tiers are in
// _rogers-platform.mjs, which Fido shares.
import { slug } from "../lib.mjs";
import { platformOffers } from "./_rogers-platform.mjs";

export default {
  seller: "Rogers",
  offers: (helpers) =>
    platformOffers(
      {
        seller: "Rogers",
        site: "https://www.rogers.com",
        province: helpers.region.code,
        applicationId: "Rogers.com",
        deviceTradeIn: true,
        returnProgram: "Save & Return",
        title: (months) => `Financing, ${months} months`,
        // "5G+ Lite" -> "lite", "Ultimate Plan 5-YR Price Guar." -> "ultimate"
        planId: (plan) => slug(plan.planDisplayName.replace(/5G\+/i, "")).split("-")[0],
        features: (plan) => (/5G\+/.test(plan.feature ?? "") ? ["5G+"] : []),
        notes: ({ autopay, discount, credit, months }) =>
          [
            `Plan price is with the $${autopay} autopay credit${discount > 0 ? ` and a $${discount}/mo plan discount` : ""}.`,
            credit ? `The device payments count a $${credit}/mo bill credit for ${months} months.` : "",
            "No setup charge when bought online.",
          ]
            .filter(Boolean)
            .join(" "),
      },
      helpers,
    ),
};
