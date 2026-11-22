import React from "react";
import { fireEvent, render, within } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import MobilePage from "../pages/mobile";
import catalog from "../src/mobile/data/devices.json";
import { regions } from "../src/mobile/regions";
import { searchPhones } from "../src/mobile/search";
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
  plan: { name: "Plan", monthly: 50, gb: 100, features: [] },
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

describe("Phone catalog", () => {
  it("lists iPhones, Galaxies and Pixels from the last three years, each once", () => {
    const ids = catalog.devices.map((device) => device.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const device of catalog.devices) {
      expect(device.id).toMatch(/^[a-z0-9-]+$/);
      expect(["Apple", "Samsung", "Google"]).toContain(device.brand);
      expect(device.released).toMatch(/^\d{4}-\d{2}$/);
      expect(device.released >= "2023-11").toBe(true);
    }
  });
});

describe("Phone search", () => {
  // Every catalog phone, whether or not anyone sells it now
  const phones = catalog.devices.map((device) => ({ ...device, storages: [], colours: [] }));
  const first = (query: string) => searchPhones(phones, query)[0]?.name;

  it("finds a phone by its name, a part of it, a typo or a shorthand", () => {
    expect(first("iphone 18 pro")).toBe("iPhone 18 Pro");
    expect(first("18 pro max")).toBe("iPhone 18 Pro Max");
    expect(first("iphone 18 pm")).toBe("iPhone 18 Pro Max");
    expect(first("s26 ultra")).toBe("Galaxy S26 Ultra");
    expect(first("s26u")).toBe("Galaxy S26 Ultra");
    expect(first("galaxy s25+")).toBe("Galaxy S25+");
    expect(first("pixle 10 pro")).toBe("Pixel 10 Pro");
    expect(first("fold7")).toBe("Galaxy Z Fold7");
    expect(first("17pro")).toBe("iPhone 17 Pro");
  });

  it("finds a phone by a storage size it's sold in, without ranking it lower for having more", () => {
    const sold = regions.bc.phones;
    expect(searchPhones(sold, "iphone 18 pro 1tb")[0]?.name).toBe("iPhone 18 Pro");
    expect(searchPhones(sold, "iphone 18 pro")[0]?.name).toBe("iPhone 18 Pro");
  });

  it("puts the exact name before longer ones, and lists everything newest first when empty", () => {
    expect(searchPhones(phones, "iphone 17").slice(0, 1).map((phone) => phone.name)).toEqual(["iPhone 17"]);
    expect(searchPhones(phones, "pixel").every((phone) => phone.brand === "Google")).toBe(true);
    expect(searchPhones(phones, "zzzz")).toEqual([]);
    const all = searchPhones(phones, "");
    expect(all).toHaveLength(phones.length);
    expect(all.map((phone) => phone.released)).toEqual(all.map((phone) => phone.released).sort().reverse());
  });
});

describe("Phone price data", () => {
  it.each(Object.entries(regions))("%s has sourced offers for phones in the catalog", (_code, data) => {
    expect(data.region.taxRate).toBeGreaterThan(0);
    expect(data.region.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const catalogIds = new Set(catalog.devices.map((device) => device.id));
    const ids = data.offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    // The page lists exactly the catalog phones that have offers, newest first
    expect(data.phones.map((phone) => phone.id).sort()).toEqual([...new Set(data.offers.map((offer) => offer.phone))].sort());
    expect(data.phones.map((phone) => phone.released)).toEqual(data.phones.map((phone) => phone.released).sort().reverse());
    for (const phone of data.phones) {
      expect(catalogIds.has(phone.id)).toBe(true);
      if (phone.image) expect(phone.image).toMatch(/^https:\/\/multimedia\.bbycastatic\.ca\//);
      // Its storage sizes, smallest first, cover every size it has an offer at
      const gb = (size: string) => Number(size.replace(/\D/g, "")) * (size.endsWith("TB") ? 1024 : 1);
      expect(phone.storages.length).toBeGreaterThan(0);
      expect(phone.storages.map(gb)).toEqual(phone.storages.map(gb).sort((a, b) => a - b));
      for (const offer of data.offers.filter((candidate) => candidate.phone === phone.id)) expect(phone.storages).toContain(offer.storage);
      // Its colours are Best Buy's, each named once with Best Buy's picture
      expect(new Set(phone.colours.map((colour) => colour.name)).size).toBe(phone.colours.length);
      for (const colour of phone.colours) expect(colour.image).toMatch(/^https:\/\/multimedia\.bbycastatic\.ca\//);
      for (const { keep, returned } of costRows(
        data.offers.filter((offer) => offer.phone === phone.id),
        data.region,
        { byodMonthly: data.byodPlan.monthly },
      )) {
        expect(keep.total).toBeGreaterThan(0);
        expect(Number.isFinite(keep.perMonth)).toBe(true);
        // Giving the phone back never costs more than keeping it
        if (returned) expect(returned.total).toBeLessThanOrEqual(keep.total);
      }
    }
    for (const offer of data.offers) {
      expect(offer.storage).toMatch(/^\d+(GB|TB)$/);
      expect(offer.id.startsWith(`${offer.phone}-${offer.storage.toLowerCase()}-`)).toBe(true);
      expect(offer.source.url).toMatch(/^https:\/\//);
      expect(offer.source.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
  const data = regions.bc;
  const tables = (container: HTMLElement) => {
    const [unlocked, monthly] = Array.from(container.querySelectorAll<HTMLElement>("table"));
    return { unlocked, monthly };
  };
  const offerRows = (table: HTMLElement) => Array.from(table.querySelectorAll<HTMLElement>("tbody tr:not([hidden])"));
  const sellers = (table: HTMLElement) => Array.from(table.querySelectorAll("tbody th img"), (logo) => logo.getAttribute("alt"));
  const sellersOf = (phone: string, storage: string, monthly: boolean) => new Set(data.offers.filter((offer) => offer.phone === phone && offer.storage === storage && (offer.kind !== "outright") === monthly).map((offer) => offer.seller));
  // The iPhone 18 Pro's card: its name, then its storage sizes
  const IPHONE_18_PRO = /^Apple iPhone 18 Pro \d+(GB|TB)/;
  // The page open on the iPhone 18 Pro, picked from the phone cards
  const renderIphone18Pro = () => {
    const page = render(<MobilePage/>);
    fireEvent.click(page.getByRole("button", { name: IPHONE_18_PRO }));
    return page;
  };

  it("has one h1, a phone card with a picture for every phone, and opens on the newest", () => {
    const { container, getAllByRole } = render(<MobilePage/>);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    const cards = getAllByRole("button", { pressed: false }).concat(getAllByRole("button", { pressed: true })).filter((button) => button.closest("li") && button.querySelector("img, span[aria-hidden]"));
    expect(cards.length).toBe(data.phones.length);
    expect(getAllByRole("button", { pressed: true }).some((button) => button.textContent?.includes(data.phones[0].name))).toBe(true);
    for (const picture of container.querySelectorAll('ul img[src^="https://multimedia.bbycastatic.ca/"]')) {
      expect(picture.getAttribute("alt")).toBe("");
      expect(picture.getAttribute("loading")).toBe("lazy");
    }
  });

  it("narrows the phone cards with a forgiving search and the brand buttons", () => {
    const { getByRole, queryByRole, queryAllByRole } = render(<MobilePage/>);
    const search = getByRole("searchbox", { name: "Find a phone" });
    fireEvent.change(search, { target: { value: "pixle 10 pro" } });
    expect(getByRole("button", { name: /^Google Pixel 10 Pro \d/ })).toBeTruthy();
    expect(queryByRole("button", { name: IPHONE_18_PRO })).toBeNull();
    fireEvent.change(search, { target: { value: "" } });
    fireEvent.click(getByRole("button", { name: "Samsung" }));
    expect(queryByRole("button", { name: /^Apple iPhone/ })).toBeNull();
    expect(queryAllByRole("button", { name: /^Samsung Galaxy/ }).length).toBeGreaterThan(1);
  });

  it("shows the picked phone's sellers: unlocked, then by the month, each once", () => {
    const { container } = renderIphone18Pro();
    expect(container.querySelector("main")?.textContent).toContain("iPhone 18 Pro");
    const { unlocked, monthly } = tables(container);
    // It opens at the smallest storage
    expect(new Set(sellers(unlocked))).toEqual(sellersOf("iphone-18-pro", "256GB", false));
    const listed = sellers(monthly);
    expect(new Set(listed)).toEqual(sellersOf("iphone-18-pro", "256GB", true));
    expect(new Set(listed).size).toBe(listed.length);
    expect(monthly.querySelectorAll("tbody")).toHaveLength(listed.length);
    // Unlocked: cheapest first
    const totals = offerRows(unlocked).map((row) => Number(row.children[3].textContent?.match(/\$([\d,.]+)/)?.[1].replace(/,/g, "")));
    expect(totals).toEqual([...totals].sort((x, y) => x - y));
    for (const logo of container.querySelectorAll("tbody th img")) expect(logo.getAttribute("src")).toMatch(/^\/resources\/images\/mobile\//);
    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("shows each carrier plan's data per month and the device before the plan in both outcomes", () => {
    const { container } = renderIphone18Pro();
    const { monthly } = tables(container);
    // Each heading is its title, then its unit on a second line
    const heading = (th: Element): string => Array.from(th.childNodes, (node) => node.textContent?.trim()).filter(Boolean).join(" / ");
    expect(Array.from(monthly.querySelectorAll("thead tr:first-child th"), heading).slice(0, 5)).toEqual(["Seller", "Plan", "Data / per month", "Due / today", "Term / months"]);
    expect(Array.from(monthly.querySelectorAll("thead tr:last-child th"), heading)).toEqual(["Device / per month", "Plan / per month", "Total / plan included", "Device / per month", "Plan / per month", "Due / at the end", "Total / plan included"]);
    for (const row of offerRows(monthly)) expect(row.querySelector("td")?.textContent).toMatch(/^(\d+ GB|Unlimited|As your plan)$/);
    const telus = Array.from(monthly.querySelectorAll("tbody")).find((group) => group.querySelector('img[alt="Telus"]'));
    expect(telus?.querySelectorAll("img")).toHaveLength(1);
    expect(telus?.textContent).toContain("Bring-It-Back");
  });

  it("puts the return programs first when sorted by Return it, and opens an offer's details", () => {
    const { container, getByRole } = renderIphone18Pro();
    fireEvent.click(getByRole("button", { name: "Return it" }));
    const rows = offerRows(tables(container).monthly);
    expect(rows[0].textContent).not.toContain("No return program");
    expect(rows[rows.length - 1].textContent).toContain("No return program");
    const before = container.querySelectorAll("tbody tr[hidden]").length;
    fireEvent.click(within(rows[0]).getByRole("button"));
    expect(container.querySelectorAll("tbody tr[hidden]").length).toBe(before - 1);
  });

  it("ranks by the total by default, or by the average month", () => {
    const { container, getByRole } = renderIphone18Pro();
    // The keep-it total: the cell before Details (a missing return program spans three columns)
    const keepTotal = (row: Element) => {
      const cells = row.querySelectorAll(":scope > td");
      return Number(cells[cells.length - 2]?.textContent?.match(/^\$([\d,.]+)/)?.[1].replace(/,/g, ""));
    };
    // The sellers come in order of their cheapest tier's total
    const firsts = Array.from(tables(container).monthly.querySelectorAll("tbody"), (group) => keepTotal(group.querySelector("tr") as Element));
    expect(firsts.length).toBeGreaterThan(1);
    for (const total of firsts) expect(total).toBeGreaterThan(0);
    expect(firsts).toEqual([...firsts].sort((x, y) => x - y));
    expect(tables(container).monthly.textContent).not.toContain("Lowest per month");
    fireEvent.click(within(getByRole("group", { name: "Cheapest by" })).getByRole("button", { name: "Per month" }));
    expect(tables(container).monthly.textContent).toContain("Lowest per month");
  });

  it("prices the storage picked, and shows the colour picked", () => {
    const { container, getByRole } = renderIphone18Pro();
    const phone = data.phones.find((candidate) => candidate.id === "iphone-18-pro");
    const storages = within(getByRole("group", { name: "Storage" })).getAllByRole("button");
    expect(storages.map((button) => button.textContent)).toEqual(phone?.storages);
    fireEvent.click(within(getByRole("group", { name: "Storage" })).getByRole("button", { name: "1TB" }));
    expect(getByRole("button", { name: "1TB" }).getAttribute("aria-pressed")).toBe("true");
    const { unlocked } = tables(container);
    expect(new Set(sellers(unlocked))).toEqual(sellersOf("iphone-18-pro", "1TB", false));
    expect(unlocked.querySelector("caption")?.textContent).toContain("iPhone 18 Pro 1TB");
    // Picking a colour shows its picture
    const colours = within(getByRole("group", { name: "Colour" })).getAllByRole("button");
    expect(colours.map((button) => button.textContent)).toEqual(phone?.colours.map((colour) => colour.name));
    const last = phone?.colours[phone.colours.length - 1];
    fireEvent.click(colours[colours.length - 1]);
    expect(container.querySelector(`main img[src="${last?.image}"]`)).toBeTruthy();
  });

  it("is not in the sitemap or linked from robots.txt", () => {
    for (const file of ["sitemap.xml", "robots.txt"]) {
      expect(readFileSync(join(__dirname, "../public", file), "utf8")).not.toContain("/mobile");
    }
  });
});
