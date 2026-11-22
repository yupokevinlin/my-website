import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import MobilePage from "../pages/mobile";
import { regions } from "../src/mobile/regions";
import { costRows } from "../src/mobile/tco";
import type { CarrierOffer, Offer, Region, Settings, SubscriptionOffer } from "../src/mobile/types";

const region: Region = { code: "BC", name: "British Columbia", taxRate: 0.12, taxLabel: "12% tax", checked: "2026-11-21" };
const settings: Settings = { byodMonthly: 40, includePlan: false, horizonMonths: 24, resale24: 800, resale36: 500 };
const source = { label: "Test", url: "https://example.com/", verified: "primary" as const, checked: "2026-11-21" };
const base = { phone: "phone", seller: "Seller", title: "Title", condition: "new" as const, source };

describe("Total cost of ownership", () => {
  // The figures Best Buy's quote tool gave for the iPhone 18 Pro 256GB on
  // 2026-11-21: $42.94 a month, $1,545.80 returned, $2,105.80 kept
  it("matches Best Buy's quote for its monthly program", () => {
    const offer: SubscriptionOffer = { ...base, id: "sub", kind: "subscription", price: 1749.99, ehf: 0.2, adminFee: 129.99, keepAmount: 500, termMonths: 36 };
    const [returned, kept] = costRows([offer], region, settings);
    expect(returned.end).toBe("return");
    expect(returned.monthly).toBe(42.94);
    expect(returned.totalPaid).toBe(1545.8);
    expect(returned.netCost).toBe(1545.8);
    expect(kept.end).toBe("keep");
    expect(kept.dueAtEnd).toBe(560);
    expect(kept.totalPaid).toBe(2105.8);
    expect(kept.netCost).toBe(1605.8);
  });

  it("charges tax once on a phone paid in full and adds the visitor's plan", () => {
    const offer: Offer = { ...base, id: "out", kind: "outright", price: 1000, ehf: 0.2 };
    const [alone] = costRows([offer], region, settings);
    expect(alone.dueToday).toBe(1120.22);
    expect(alone.totalPaid).toBe(1120.22);
    expect(alone.netCost).toBe(320.22);
    const [withPlan] = costRows([offer], region, { ...settings, includePlan: true, horizonMonths: 36 });
    expect(withPlan.months).toBe(36);
    expect(withPlan.planPaid).toBe(1612.8);
    expect(withPlan.netCost).toBe(1120.22 + 1612.8 - 500);
  });

  it("gives a carrier deal keep, return and pay-it-off rows, taxed on the full price up front", () => {
    const offer: CarrierOffer = {
      ...base,
      id: "car",
      kind: "carrier",
      fullPrice: 1800,
      termMonths: 24,
      upfront: 0,
      monthlyKeep: 75,
      returnOption: { name: "Return plan", monthly: 37.5, deferred: 900 },
      plan: { name: "Plan", monthly: 50, data: "100 GB" },
      connectionFee: 80,
      credit: { amount: 100, label: "Bill credit" },
    };
    const rows = costRows([offer], region, { ...settings, includePlan: true });
    const returned = rows.find((row) => row.id === "car:return");
    const kept = rows.find((row) => row.id === "car:keep");
    const paidOff = rows.find((row) => row.id === "car:buyout");
    // 216 tax on the phone + 89.60 fee
    expect(kept?.dueToday).toBe(305.6);
    expect(kept?.monthly).toBe(131);
    expect(kept?.devicePaid).toBe(305.6 + 1800 - 100);
    expect(kept?.netCost).toBe(305.6 + 1800 - 100 + 1344 - 800);
    expect(returned?.devicePaid).toBe(305.6 + 900 - 100);
    expect(returned?.resale).toBe(0);
    // The return program, kept: the deferred amount is paid at the end, untaxed
    expect(paidOff?.end).toBe("keep");
    expect(paidOff?.dueAtEnd).toBe(900);
    expect(paidOff?.devicePaid).toBe(kept?.devicePaid);
    // Cheapest net cost per month first
    expect(rows.map((row) => row.netPerMonth)).toEqual(rows.map((row) => row.netPerMonth).sort((a, b) => a - b));
  });
});

describe("Phone price data", () => {
  it.each(Object.entries(regions))("%s has complete, sourced offers for every phone", (_code, data) => {
    expect(data.region.taxRate).toBeGreaterThan(0);
    expect(data.region.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const ids = data.offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const phone of data.phones) {
      const offers = data.offers.filter((offer) => offer.phone === phone.id);
      expect(offers.length).toBeGreaterThan(0);
      // Each phone can be bought outright, kept on a deal, or returned
      const ends = new Set(costRows(offers, data.region, settings).map((row) => row.end));
      expect([...ends].sort()).toEqual(["keep", "own", "return"]);
    }
    for (const offer of data.offers) {
      expect(data.phones.some((phone) => phone.id === offer.phone)).toBe(true);
      expect(offer.source.url).toMatch(/^https:\/\//);
      expect(offer.source.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const row of costRows([offer], data.region, settings)) {
        expect(Number.isFinite(row.netPerMonth)).toBe(true);
        expect(row.totalPaid).toBeGreaterThan(0);
      }
      // A pattern the update script can't compile would stop the whole run
      for (const pattern of Object.values(offer.check?.fields ?? {})) expect(() => new RegExp(pattern)).not.toThrow();
    }
  });
});

describe("/mobile page", () => {
  it("has one h1 and ranks the options, with every link a source link", () => {
    const { container } = render(<MobilePage/>);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    const cards = container.querySelectorAll("ol > li");
    expect(cards.length).toBeGreaterThan(3);
    expect(cards[0].textContent).toContain("Lowest net cost");
    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("shows only deals where the phone goes back when asked", () => {
    const { container, getByRole } = render(<MobilePage/>);
    fireEvent.click(getByRole("button", { name: "Return the phone" }));
    const cards = Array.from(container.querySelectorAll("ol > li"));
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(card.textContent).toContain("Goes back at the end");
  });

  it("is not in the sitemap or linked from robots.txt", () => {
    for (const file of ["sitemap.xml", "robots.txt"]) {
      expect(readFileSync(join(__dirname, "../public", file), "utf8")).not.toContain("/mobile");
    }
  });
});
