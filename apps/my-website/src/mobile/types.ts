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
}

export interface CostLine {
  label: string;
  amount: number;
}

// One way an offer can end, with the plan counted and tax in every amount
export interface Scenario {
  // How it gets there: "Financing", "Bring-It-Back", "Pay in full"...
  how: string;
  dueToday: number;
  deviceMonthly: number;
  planMonthly: number;
  // Paid when the term ends to keep the phone; 0 when it goes back
  dueAtEnd: number;
  total: number;
  // total over the months: the number offers of different lengths compare on
  perMonth: number;
  lines: CostLine[];
}

export interface CostRow {
  offer: Offer;
  months: number;
  // The phone is still yours after the term, however it was paid for
  keep: Scenario;
  // The phone goes back under the seller's own return program, if it has one
  returned?: Scenario;
}

export type SortBy = "keep" | "returned";
