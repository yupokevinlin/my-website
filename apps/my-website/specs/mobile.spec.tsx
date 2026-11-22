import React from "react";
import { fireEvent, render, within } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import MobilePage from "../pages/mobile";
import { regions } from "../src/mobile/regions";
import { sellerLogo } from "../src/mobile/sellers";
import { costRows } from "../src/mobile/tco";
import type { CarrierOffer, Offer, Region, Settings, SubscriptionOffer } from "../src/mobile/types";

const region: Region = { code: "BC", name: "British Columbia", taxRate: 0.12, taxLabel: "12% tax", checked: "2026-11-21" };
const noPlan: Settings = { byodMonthly: 0 };
const source = { label: "Test", url: "https://example.com/", verified: "primary" as const, checked: "2026-11-21" };
const base = { phone: "phone", seller: "Seller", title: "Title", condition: "new" as const, source };
const carrierOffer: CarrierOffer = {
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

describe("Total cost of ownership", () => {
  // The figures Best Buy's quote tool gave for the iPhone 18 Pro 256GB on
  // 2026-11-21: $42.94 a month, $1,545.80 returned, $2,105.80 kept
  it("matches Best Buy's quote for its monthly program", () => {
    const offer: SubscriptionOffer = { ...base, id: "sub", kind: "subscription", price: 1749.99, ehf: 0.2, adminFee: 129.99, keepAmount: 500, termMonths: 36 };
    const [{ returned, keep, months }] = costRows([offer], region, noPlan);
    expect(months).toBe(36);
    expect(returned?.deviceMonthly).toBe(42.94);
    expect(returned?.total).toBe(1545.8);
    expect(returned?.dueAtEnd).toBe(0);
    expect(keep.deviceMonthly).toBe(42.94);
    expect(keep.dueAtEnd).toBe(560);
    expect(keep.total).toBe(2105.8);
  });

  it("costs a phone paid in full over 24 months of the visitor's plan, with no return figure", () => {
    const offer: Offer = { ...base, id: "out", kind: "outright", price: 1000, ehf: 0.2 };
    const [row] = costRows([offer], region, { byodMonthly: 40 });
    expect(row.returned).toBeUndefined();
    expect(row.months).toBe(24);
    expect(row.keep.dueToday).toBe(1120.22);
    expect(row.keep.deviceMonthly).toBe(0);
    expect(row.keep.planMonthly).toBe(44.8);
    expect(row.keep.total).toBe(1120.22 + 1075.2);
    expect(row.keep.perMonth).toBe(91.48);
  });

  it("taxes a carrier's phone on its full price up front and counts the plan in both outcomes", () => {
    const [{ returned, keep }] = costRows([carrierOffer], region, noPlan);
    // 216 tax on the phone + 89.60 fee
    expect(returned?.dueToday).toBe(305.6);
    expect(returned?.how).toBe("Return plan");
    expect(returned?.deviceMonthly).toBe(37.5);
    expect(returned?.planMonthly).toBe(56);
    expect(returned?.total).toBe(305.6 + 900 + 1344 - 100);
    // Financing and paying off the return plan cost the same here: financing is shown
    expect(keep.how).toBe("Financing");
    expect(keep.deviceMonthly).toBe(75);
    expect(keep.dueAtEnd).toBe(0);
    expect(keep.total).toBe(305.6 + 1800 + 1344 - 100);
  });

  it("keeps the phone the cheaper way when the return program is discounted", () => {
    const discounted: CarrierOffer = { ...carrierOffer, returnOption: { name: "Return plan", monthly: 37.5, deferred: 600 } };
    const [{ keep }] = costRows([discounted], region, noPlan);
    expect(keep.how).toBe("Return plan, paid off at the end");
    expect(keep.deviceMonthly).toBe(37.5);
    expect(keep.dueAtEnd).toBe(600);
    expect(keep.total).toBe(305.6 + 900 + 600 + 1344 - 100);
  });

  it("sorts by the chosen outcome, with sellers that can't take the phone back last", () => {
    const outright: Offer = { ...base, id: "out", kind: "outright", price: 100, ehf: 0 };
    expect(costRows([carrierOffer, outright], region, noPlan, "keep").map((row) => row.offer.id)).toEqual(["out", "car"]);
    expect(costRows([outright, carrierOffer], region, noPlan, "returned").map((row) => row.offer.id)).toEqual(["car", "out"]);
  });
});

describe("Phone price data", () => {
  it.each(Object.entries(regions))("%s has complete, sourced offers for every phone", (_code, data) => {
    expect(data.region.taxRate).toBeGreaterThan(0);
    expect(data.region.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const ids = data.offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const phone of data.phones) {
      const rows = costRows(
        data.offers.filter((offer) => offer.phone === phone.id),
        data.region,
        { byodMonthly: data.byodPlan.monthly },
      );
      // Each phone can be bought in full, financed, and returned
      expect(rows.some((row) => row.offer.kind === "outright")).toBe(true);
      expect(rows.some((row) => row.offer.kind === "carrier")).toBe(true);
      expect(rows.some((row) => row.returned)).toBe(true);
      for (const { keep, returned } of rows) {
        expect(keep.total).toBeGreaterThan(0);
        expect(Number.isFinite(keep.perMonth)).toBe(true);
        // Giving the phone back never costs more than keeping it
        if (returned) expect(returned.total).toBeLessThanOrEqual(keep.total);
      }
    }
    for (const offer of data.offers) {
      expect(data.phones.some((phone) => phone.id === offer.phone)).toBe(true);
      expect(offer.source.url).toMatch(/^https:\/\//);
      expect(offer.source.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // A pattern the update script can't compile would stop the whole run
      for (const pattern of Object.values(offer.check?.fields ?? {})) expect(() => new RegExp(pattern)).not.toThrow();
    }
  });

  it("has a logo file for every seller", () => {
    const sellers = new Set(Object.values(regions).flatMap((data) => data.offers.map((offer) => offer.seller)));
    for (const seller of sellers) {
      const logo = sellerLogo(seller);
      expect(`${seller}: ${logo}`).toMatch(/\.(svg|png)$/);
      expect(existsSync(join(__dirname, "../public", logo ?? ""))).toBe(true);
    }
  });
});

describe("/mobile page", () => {
  const dataRows = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>("tbody tr:not([hidden])"));

  it("has one h1 and one table, with each seller shown by its logo", () => {
    const { container } = render(<MobilePage/>);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelectorAll("table")).toHaveLength(1);
    const rows = dataRows(container);
    expect(rows.length).toBeGreaterThan(5);
    for (const row of rows) {
      const logo = row.querySelector("th img");
      expect(logo?.getAttribute("alt")).toBeTruthy();
      expect(logo?.getAttribute("src")).toMatch(/^\/resources\/images\/mobile\//);
    }
    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("shows the device before the plan in both outcomes, and no return figure without a program", () => {
    const { container } = render(<MobilePage/>);
    const headings = Array.from(container.querySelectorAll("thead tr:last-child th"), (th) => th.textContent);
    expect(headings).toEqual(["Device / month", "Plan / month", "Total, plan included", "Device / month", "Plan / month", "Due at the end", "Total, plan included"]);
    const rows = dataRows(container);
    const apple = rows.find((row) => row.querySelector('img[alt="Apple"]'));
    expect(apple?.textContent).toContain("No return program");
    const telus = rows.find((row) => row.querySelector('img[alt="Telus"]'));
    expect(telus?.textContent).toContain("Bring-It-Back");
    expect(telus?.textContent).not.toContain("No return program");
  });

  it("puts the return programs first when sorted by Return it, and opens an offer's details", () => {
    const { container, getByRole } = render(<MobilePage/>);
    fireEvent.click(getByRole("button", { name: "Return it" }));
    const rows = dataRows(container);
    expect(rows[0].textContent).not.toContain("No return program");
    expect(rows[rows.length - 1].textContent).toContain("No return program");
    const before = container.querySelectorAll("tbody tr[hidden]").length;
    fireEvent.click(within(rows[0]).getByRole("button"));
    expect(container.querySelectorAll("tbody tr[hidden]").length).toBe(before - 1);
  });

  it("is not in the sitemap or linked from robots.txt", () => {
    for (const file of ["sitemap.xml", "robots.txt"]) {
      expect(readFileSync(join(__dirname, "../public", file), "utf8")).not.toContain("/mobile");
    }
  });
});
