import type { CarrierOffer, CostLine, CostRow, EndState, Offer, OutrightOffer, Region, Settings, SubscriptionOffer } from "./types";

// Total cost of ownership: everything paid for a phone and its plan over the
// months it is used, tax included, less what the phone is worth at the end.
// A returned phone is worth nothing to its buyer, a kept one its resale value,
// so "return it" and "keep it" deals can be compared on one number: the net
// cost per month.

const cents = (amount: number): number => Math.round(amount * 100) / 100;

export const resaleAfter = (months: number, settings: Settings): number => (months >= 36 ? settings.resale36 : settings.resale24);

interface Parts {
  offer: Offer;
  end: EndState;
  option: string;
  months: number;
  dueToday: number;
  // The device payment each month, tax included
  deviceMonthly: number;
  // The plan each month, before tax
  planMonthly: number;
  dueAtEnd: number;
  credit: number;
  lines: CostLine[];
  // Tells apart two rows of one offer that end the same way
  variant?: string;
}

const row = ({ offer, end, option, months, dueToday, deviceMonthly, planMonthly, dueAtEnd, credit, lines, variant }: Parts, region: Region, settings: Settings): CostRow => {
  const plan = settings.includePlan ? planMonthly * (1 + region.taxRate) : 0;
  const devicePaid = cents(dueToday + deviceMonthly * months + dueAtEnd - credit);
  const planPaid = cents(plan * months);
  const totalPaid = cents(devicePaid + planPaid);
  const resale = end === "return" ? 0 : resaleAfter(months, settings);
  const netCost = cents(totalPaid - resale);
  return {
    id: `${offer.id}:${variant ?? end}`,
    offer,
    end,
    option,
    months,
    dueToday: cents(dueToday),
    monthly: cents(deviceMonthly + plan),
    dueAtEnd: cents(dueAtEnd),
    devicePaid,
    planPaid,
    totalPaid,
    resale,
    netCost,
    netPerMonth: cents(netCost / months),
    lines: [
      ...lines,
      ...(settings.includePlan ? [{ label: `Plan, ${months} months with tax`, amount: planPaid }] : []),
      { label: "Total paid", amount: totalPaid },
      ...(end === "return" ? [] : [{ label: `Phone's resale value after ${months} months`, amount: -resale }]),
      { label: "Net cost", amount: netCost },
    ],
  };
};

const outright = (offer: OutrightOffer, region: Region, settings: Settings): CostRow[] => {
  const tax = (offer.price + offer.ehf) * region.taxRate;
  return [
    row(
      {
        offer,
        end: "own",
        option: "Pay in full",
        months: settings.horizonMonths,
        dueToday: offer.price + offer.ehf + tax,
        deviceMonthly: 0,
        planMonthly: settings.byodMonthly,
        dueAtEnd: 0,
        credit: 0,
        lines: [
          { label: "Phone", amount: offer.price },
          ...(offer.ehf ? [{ label: "Environmental handling fee", amount: offer.ehf }] : []),
          { label: region.taxLabel, amount: cents(tax) },
        ],
      },
      region,
      settings,
    ),
  ];
};

// Best Buy's own arithmetic (its Sidekick quote tool): tax is charged on each
// payment, so on the price less the keep amount, plus the fees.
const subscription = (offer: SubscriptionOffer, region: Region, settings: Settings): CostRow[] => {
  const financed = offer.price + offer.ehf - offer.keepAmount + offer.adminFee;
  const tax = financed * region.taxRate;
  const keepWithTax = offer.keepAmount * (1 + region.taxRate);
  const shared = {
    offer,
    months: offer.termMonths,
    dueToday: 0,
    deviceMonthly: (financed + tax) / offer.termMonths,
    planMonthly: settings.byodMonthly,
    credit: 0,
  };
  const lines: CostLine[] = [
    { label: "Phone", amount: offer.price },
    ...(offer.ehf ? [{ label: "Environmental handling fee", amount: offer.ehf }] : []),
    { label: "Keep amount, left out of the payments", amount: -offer.keepAmount },
    { label: "Admin fee", amount: offer.adminFee },
    { label: region.taxLabel, amount: cents(tax) },
  ];
  return [
    row({ ...shared, end: "return", option: "Return it", dueAtEnd: 0, lines }, region, settings),
    row({ ...shared, end: "keep", option: "Keep it", dueAtEnd: keepWithTax, lines: [...lines, { label: "Keep amount with tax, paid at the end", amount: cents(keepWithTax) }] }, region, settings),
  ];
};

// Carriers charge the tax on the phone's full price on day one, whatever is
// financed or deferred, so the monthly device payments carry none.
const carrier = (offer: CarrierOffer, region: Region, settings: Settings): CostRow[] => {
  const tax = offer.fullPrice * region.taxRate;
  const fee = offer.connectionFee * (1 + region.taxRate);
  const shared = {
    offer,
    months: offer.termMonths,
    dueToday: offer.upfront + tax + fee,
    planMonthly: offer.plan.monthly,
    credit: offer.credit?.amount ?? 0,
  };
  const before: CostLine[] = [
    ...(offer.upfront ? [{ label: "Paid for the phone up front", amount: offer.upfront }] : []),
    { label: `${region.taxLabel} on the full $${offer.fullPrice.toFixed(2)}`, amount: cents(tax) },
    ...(offer.connectionFee ? [{ label: "Connection fee with tax", amount: cents(fee) }] : []),
  ];
  const after: CostLine[] = offer.credit ? [{ label: offer.credit.label, amount: -offer.credit.amount }] : [];
  const payments = (monthly: number): CostLine => ({ label: `Device payments, ${offer.termMonths} × $${monthly.toFixed(2)}`, amount: cents(monthly * offer.termMonths) });
  const rows = [row({ ...shared, end: "keep", option: "Keep it", dueAtEnd: 0, deviceMonthly: offer.monthlyKeep, lines: [...before, payments(offer.monthlyKeep), ...after] }, region, settings)];
  if (offer.returnOption) {
    // The return program can also end with the phone kept, by paying the
    // deferred amount (untaxed: the tax was paid on day one). Some carriers
    // discount the program, so this can beat plain financing.
    const { name, monthly, deferred } = offer.returnOption;
    const lines = [...before, payments(monthly), ...after];
    rows.unshift(
      row({ ...shared, end: "return", option: `Return it (${name})`, dueAtEnd: 0, deviceMonthly: monthly, lines }, region, settings),
      row(
        { ...shared, end: "keep", variant: "buyout", option: `Keep it (${name}, paid off at the end)`, deviceMonthly: monthly, dueAtEnd: deferred, lines: [...lines, { label: `${name} amount, paid at the end`, amount: deferred }] },
        region,
        settings,
      ),
    );
  }
  return rows;
};

export const costRows = (offers: Offer[], region: Region, settings: Settings): CostRow[] =>
  offers
    .flatMap((offer) => {
      if (offer.kind === "outright") return outright(offer, region, settings);
      if (offer.kind === "subscription") return subscription(offer, region, settings);
      return carrier(offer, region, settings);
    })
    .sort((a, b) => a.netPerMonth - b.netPerMonth || a.totalPaid - b.totalPaid);

export const money = (amount: number, digits = 2): string =>
  `${amount < 0 ? "−" : ""}$${Math.abs(amount).toLocaleString("en-CA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
