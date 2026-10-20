import { SEASON_SCRIPT, seasonForMonth } from "../src/v2/season";

// Runs the <head> script against a stub document for a given month
const runScript = (month: number, pathname = "/") => {
  const attrs: Record<string, string> = {};
  const appended: Array<{ href?: string }> = [];
  const documentStub = {
    documentElement: { setAttribute: (name: string, value: string) => { attrs[name] = value; } },
    createElement: () => ({}),
    head: { appendChild: (el: { href?: string }) => appended.push(el) },
    getElementById: () => null,
  };
  class FakeDate { getMonth() { return month; } }
  new Function("document", "Date", "location", SEASON_SCRIPT)(documentStub, FakeDate, { pathname });
  return { season: attrs["data-season"], appended };
};

describe("Season", () => {
  it("follows the Vancouver calendar", () => {
    expect([0, 1, 2, 4, 5, 7, 8, 10, 11].map(seasonForMonth)).toEqual(["winter", "winter", "spring", "spring", "summer", "summer", "autumn", "autumn", "winter"]);
  });

  it("picks the same season in the head script as in the page, every month", () => {
    for (let month = 0; month < 12; month++) expect(runScript(month).season).toBe(seasonForMonth(month));
  });

  it("preloads the season's picture on the home page only", () => {
    expect(runScript(9).appended).toEqual([expect.objectContaining({ href: "/resources/seasons/autumn.svg" })]);
    expect(runScript(9, "/ray-tracing").appended).toEqual([]);
  });
});
