import type { CarrierOffer, CostLine, CostRow, Offer, OutrightOffer, PlanData, Region, RankBy, Scenario, Settings, SortBy, SubscriptionOffer } from "./types";

// Total cost of ownership: everything paid for a phone and its plan over the
// term, tax included. Each offer is worked out two ways, side by side:
//   Return it: the phone goes back under the seller's own return program
//              (Bell's Device Return Option, Rogers' Save & Return, Telus's
//              Bring-It-Back, Freedom's TradeUp, Best Buy's subscription).
//              Sellers without a program have no return figure.
//   Keep it:   the phone is still yours when the term ends, however it was
//              paid for: in full, financed, or by paying off a return program.
// No resale value is guessed at: the figures are what is actually paid.

// A phone bought in full has no term, so it is costed over the carriers' usual one
export const OUTRIGHT_MONTHS = 24;

const cents = (amount: number): number => Math.round(amount * 100) / 100;

interface Parts {
  how: string;
  months: number;
  dueToday: number;
  // The device payment each month, as billed
  deviceMonthly: number;
  // The plan each month, before tax
  plan: number;
  dueAtEnd: number;
  credit?: number;
  lines: CostLine[];
}

const scenario = ({ how, months, dueToday, deviceMonthly, plan, dueAtEnd, credit = 0, lines }: Parts, region: Region): Scenario => {
  const planMonthly = plan * (1 + region.taxRate);
  const planPaid = cents(planMonthly * months);
  const total = cents(dueToday + deviceMonthly * months + planPaid + dueAtEnd - credit);
  return {
    how,
    dueToday: cents(dueToday),
    deviceMonthly: cents(deviceMonthly),
    planMonthly: cents(planMonthly),
    dueAtEnd: cents(dueAtEnd),
    total,
    perMonth: cents(total / months),
    lines: [...lines, { label: `Plan, ${months} × $${planMonthly.toFixed(2)} with tax`, amount: planPaid }, { label: `Total over ${months} months`, amount: total }],
  };
};

const outright = (offer: OutrightOffer, region: Region, settings: Settings): CostRow => {
  const tax = (offer.price + offer.ehf) * region.taxRate;
  return {
    offer,
    months: OUTRIGHT_MONTHS,
    keep: scenario(
      {
        how: "Paid in full",
        months: OUTRIGHT_MONTHS,
        dueToday: offer.price + offer.ehf + tax,
        deviceMonthly: 0,
        plan: settings.byodMonthly,
        dueAtEnd: 0,
        lines: [
          { label: "Phone", amount: offer.price },
          ...(offer.ehf ? [{ label: "Environmental handling fee", amount: offer.ehf }] : []),
          { label: region.taxLabel, amount: cents(tax) },
        ],
      },
      region,
    ),
  };
};

// Best Buy's own arithmetic (its Sidekick quote tool): tax is charged on each
// payment, so on the price less the keep amount, plus the fees.
const subscription = (offer: SubscriptionOffer, region: Region, settings: Settings): CostRow => {
  const financed = offer.price + offer.ehf - offer.keepAmount + offer.adminFee;
  const tax = financed * region.taxRate;
  const keepWithTax = offer.keepAmount * (1 + region.taxRate);
  const shared = { months: offer.termMonths, dueToday: 0, deviceMonthly: (financed + tax) / offer.termMonths, plan: settings.byodMonthly };
  const lines: CostLine[] = [
    { label: "Phone", amount: offer.price },
    ...(offer.ehf ? [{ label: "Environmental handling fee", amount: offer.ehf }] : []),
    { label: "Keep amount, left out of the payments", amount: -offer.keepAmount },
    { label: "Admin fee", amount: offer.adminFee },
    { label: region.taxLabel, amount: cents(tax) },
  ];
  return {
    offer,
    months: offer.termMonths,
    returned: scenario({ ...shared, how: "Monthly Subscription", dueAtEnd: 0, lines }, region),
    keep: scenario({ ...shared, how: "Keep amount paid at the end", dueAtEnd: keepWithTax, lines: [...lines, { label: "Keep amount with tax, paid at the end", amount: cents(keepWithTax) }] }, region),
  };
};

// Carriers charge the tax on the phone's full price on day one, whatever is
// financed or deferred, so the monthly device payments carry none.
const carrier = (offer: CarrierOffer, region: Region): CostRow => {
  const tax = offer.fullPrice * region.taxRate;
  const fee = offer.connectionFee * (1 + region.taxRate);
  const shared = { months: offer.termMonths, dueToday: offer.upfront + tax + fee, plan: offer.plan.monthly, credit: offer.credit?.amount };
  const before: CostLine[] = [
    ...(offer.upfront ? [{ label: "Paid for the phone up front", amount: offer.upfront }] : []),
    { label: `${region.taxLabel} on the full $${offer.fullPrice.toFixed(2)}`, amount: cents(tax) },
    ...(offer.connectionFee ? [{ label: "One-time fee with tax", amount: cents(fee) }] : []),
  ];
  const after: CostLine[] = offer.credit ? [{ label: offer.credit.label, amount: -offer.credit.amount }] : [];
  const payments = (monthly: number): CostLine => ({ label: `Device payments, ${offer.termMonths} × $${monthly.toFixed(2)}`, amount: cents(monthly * offer.termMonths) });
  const financed = scenario({ ...shared, how: "Financing", deviceMonthly: offer.monthlyKeep, dueAtEnd: 0, lines: [...before, payments(offer.monthlyKeep), ...after] }, region);
  if (!offer.returnOption) return { offer, months: offer.termMonths, keep: financed };

  // The return program can also end with the phone kept, by paying the
  // deferred amount (untaxed: the tax was paid on day one). Some carriers
  // discount the program, so this can beat plain financing: keep whichever
  // costs less.
  const { name, monthly, deferred } = offer.returnOption;
  const lines = [...before, payments(monthly), ...after];
  const paidOff = scenario({ ...shared, how: `${name}, paid off at the end`, deviceMonthly: monthly, dueAtEnd: deferred, lines: [...lines, { label: `${name} amount, paid at the end`, amount: deferred }] }, region);
  return {
    offer,
    months: offer.termMonths,
    returned: scenario({ ...shared, how: name, deviceMonthly: monthly, dueAtEnd: 0, lines }, region),
    keep: paidOff.total < financed.total ? paidOff : financed,
  };
};

// Cheapest first for the chosen outcome, by its total or its average month;
// sellers that don't offer it (no return program) go last, in keep-it order.
export const costRows = (offers: Offer[], region: Region, settings: Settings, sortBy: SortBy = "keep", rankBy: RankBy = "total"): CostRow[] =>
  offers
    .map((offer) => {
      if (offer.kind === "outright") return outright(offer, region, settings);
      if (offer.kind === "subscription") return subscription(offer, region, settings);
      return carrier(offer, region);
    })
    .sort((a, b) => (a[sortBy]?.[rankBy] ?? Infinity) - (b[sortBy]?.[rankBy] ?? Infinity) || a.keep[rankBy] - b.keep[rankBy]);

export const money = (amount: number, digits = 2): string =>
  `${amount < 0 ? "−" : ""}$${Math.abs(amount).toLocaleString("en-CA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

// The lowest total (or month) for each outcome among the rows, for the Lowest
// badges; a row is the best when its own figure equals it
export const lowestOf = (rows: CostRow[], rankBy: RankBy): { keep: number; returned: number } => ({
  keep: Math.min(...rows.map((row) => row.keep[rankBy])),
  returned: Math.min(...rows.map((row) => row.returned?.[rankBy] ?? Infinity)),
});

export interface SellerGroup {
  // Unique in the table: the seller, and the store it's bought through
  key: string;
  seller: string;
  // The store selling the carrier's deal, as "from Best Buy"
  via?: string;
  rows: CostRow[];
}

const viaOf = (offer: Offer): string | undefined => (offer.kind === "carrier" ? offer.via : undefined);

// Rows that are already sorted, gathered by seller: a seller's plan tiers stay
// in their order, and the sellers come in the order of their cheapest tier. A
// carrier's deals through a store (Best Buy) are a group of their own.
export const groupBySeller = (rows: CostRow[]): SellerGroup[] => {
  const groups = new Map<string, SellerGroup>();
  for (const row of rows) {
    const via = viaOf(row.offer);
    const key = via ? `${row.offer.seller} from ${via}` : row.offer.seller;
    const group = groups.get(key) ?? { key, seller: row.offer.seller, via, rows: [] };
    group.rows.push(row);
    groups.set(key, group);
  }
  return [...groups.values()];
};

export const dataLabel = (gb: PlanData): string => (gb === "unlimited" ? "Unlimited" : `${gb} GB`);
