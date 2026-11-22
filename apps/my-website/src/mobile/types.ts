// The shapes of the phone price data (data/*.json) and of the rows the page
// shows. Every dollar amount in the data is before tax; tco.ts adds the tax.

export interface Region {
  code: string;
  name: string;
  // Sales tax as a fraction (BC: 5% GST + 7% PST)
  taxRate: number;
  taxLabel: string;
  // The day the prices were last looked at, "YYYY-MM-DD"
  checked: string;
}

export interface Phone {
  id: string;
  name: string;
  storage: string;
  // What the phone is likely worth used, for the "keep it" options. The
  // defaults come from what the sellers themselves say it will be worth.
  resale: { months24: number; months36: number; basis: string };
}

export interface Source {
  label: string;
  url: string;
  // "primary": read on the seller's own page. "secondary": from a price
  // comparison or news site, because the seller's page couldn't be read.
  verified: "primary" | "secondary";
  checked: string;
}

// How scripts/mobile-prices/update.mjs re-reads an offer's numbers: it opens
// `url` and reads each field with its pattern (the first capture group).
export interface PriceCheck {
  url: string;
  fields: Record<string, string>;
}

interface OfferBase {
  id: string;
  phone: string;
  seller: string;
  title: string;
  condition: "new" | "open-box" | "refurbished";
  note?: string;
  source: Source;
  check?: PriceCheck;
}

// Pay the whole price today and bring the phone to any plan
export interface OutrightOffer extends OfferBase {
  kind: "outright";
  price: number;
  ehf: number;
}

// A store's monthly program (Best Buy's Monthly Subscription): the price less
// the keep amount, plus a fee, spread over the term. At the end, return the
// phone or pay the keep amount.
export interface SubscriptionOffer extends OfferBase {
  kind: "subscription";
  price: number;
  ehf: number;
  adminFee: number;
  keepAmount: number;
  termMonths: number;
}

// A carrier's financing on a term, with the plan it requires
export interface CarrierOffer extends OfferBase {
  kind: "carrier";
  fullPrice: number;
  termMonths: number;
  // Paid for the phone on day one, before tax
  upfront: number;
  // The device payment each month when the phone is yours at the end; tax on
  // the phone is charged up front, so these have none
  monthlyKeep: number;
  // The carrier's return program: lower payments, and at the end the phone
  // goes back or the deferred amount is paid
  returnOption?: { name: string; monthly: number; deferred: number };
  plan: { name: string; monthly: number; data: string };
  connectionFee: number;
  // One-time extras worth cash (a gift card, a bill credit), taken off the total
  credit?: { amount: number; label: string };
}

export type Offer = OutrightOffer | SubscriptionOffer | CarrierOffer;

export interface RegionData {
  region: Region;
  // The cheapest bring-your-own-phone plan found, used for unlocked phones
  // until the visitor types their own
  byodPlan: { name: string; monthly: number; data: string; source: Source };
  phones: Phone[];
  offers: Offer[];
}

export interface Settings {
  // The visitor's own plan, before tax, for phones bought unlocked
  byodMonthly: number;
  // Count the plan in the totals. Off compares the phones alone.
  includePlan: boolean;
  // How long an unlocked phone is kept before it is sold or replaced
  horizonMonths: 24 | 36;
  resale24: number;
  resale36: number;
}

export type EndState = "own" | "keep" | "return";

export interface CostLine {
  label: string;
  amount: number;
}

export interface CostRow {
  id: string;
  offer: Offer;
  end: EndState;
  // What the row is called beside the seller ("Return it", "Keep it"...)
  option: string;
  months: number;
  dueToday: number;
  monthly: number;
  // Paid when the term ends (the keep amount), tax included
  dueAtEnd: number;
  devicePaid: number;
  planPaid: number;
  totalPaid: number;
  // What the phone is worth at the end, or 0 if it went back
  resale: number;
  // totalPaid less resale: what the months of use really cost
  netCost: number;
  netPerMonth: number;
  lines: CostLine[];
}
