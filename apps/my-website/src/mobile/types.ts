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

// How scripts/mobile-prices/update.mjs re-reads an offer's numbers (the script
// describes both ways). It opens `url`, a page on the seller's site. With
// `api`, it requests that endpoint from inside the page and reads each field
// with a path into the JSON; without, each field is a pattern matched against
// the page's text (the first capture group).
export interface PriceCheck {
  url: string;
  api?: { url: string; method?: string; headers?: Record<string, string>; body?: unknown; cookies?: Record<string, string> };
  // A path can come with arithmetic, for a response that isn't what the data
  // stores: a plan less its autopay discount, an amount with its tax
  fields: Record<string, string | { path: string; add?: number; times?: number }>;
}

interface OfferBase {
  id: string;
  phone: string;
  seller: string;
  title: string;
  condition: "new" | "open-box" | "refurbished";
  note?: string;
  source: Source;
  // One check, or several when an offer's numbers come from different places
  check?: PriceCheck | PriceCheck[];
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

// Data each month, in GB, or "unlimited" as the carrier calls it (carriers slow
// an unlimited plan down past some amount)
export type PlanData = number | "unlimited";

export interface Plan {
  name: string;
  // Each month before tax, with the carrier's autopay discount
  monthly: number;
  gb: PlanData;
  // What else the carrier lists for the plan: network, roaming, extras. Only
  // what was read on its page, so an empty list means nothing was noted.
  features: string[];
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
  plan: Plan;
  connectionFee: number;
  // One-time extras worth cash (a gift card, a bill credit), taken off the total
  credit?: { amount: number; label: string };
}

export type Offer = OutrightOffer | SubscriptionOffer | CarrierOffer;

export interface RegionData {
  region: Region;
  // The cheapest bring-your-own-phone plan found, used for unlocked phones
  // until the visitor types their own
  byodPlan: { name: string; monthly: number; gb: PlanData; source: Source };
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
