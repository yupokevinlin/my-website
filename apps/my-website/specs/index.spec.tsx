import React from "react";
import { fireEvent, render, within } from "@testing-library/react";
import Page from "../pages/index";
import V1Page from "../pages/v1";
import { homeJsonLd, homeSeo, profile } from "../src/data/profile";
import { earlyExperience, experience } from "../src/data/experience";
import { formatDuration, monthsBetween, parseMonth } from "../src/v2/time";

// jsdom has neither of these; the scroll animations, top bar and seasonal art use them
beforeAll(() => {
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: () => [],
  })) as unknown as typeof IntersectionObserver;
  window.scrollTo = jest.fn();
});

describe("Home page", () => {
  it("has one h1 with Kevin's name and an h2 per section", () => {
    const { container } = render(<Page/>);
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(profile.name);
    const h2s = Array.from(container.querySelectorAll("h2"), (h) => h.textContent);
    expect(h2s).toEqual(["A bit about me", "Where I've worked", "Things I've built", "What I work with", "Get in touch"]);
  });

  it("gives every company, project and skill group an h3, and every role an h4", () => {
    const { container } = render(<Page/>);
    const h3s = Array.from(container.querySelectorAll("h3"), (h) => h.textContent);
    expect(h3s).toEqual(expect.arrayContaining(["ForteCare", "Best Buy Canada", "ServiceLink", "Protrade Asia Limited", "Relativistic Ray Tracing", "My Website, version 1", "COVID-19 Tracker", "Frontend", "LinkedIn"]));
    const h4s = Array.from(container.querySelectorAll("h4"), (h) => h.textContent);
    expect(h4s).toEqual(expect.arrayContaining(["Chief Technology Officer & Co-Founder", "Senior Software Engineer", "Special Assistant"]));
  });

  it("uses real links that search engines can follow", () => {
    const { container } = render(<Page/>);
    const hrefs = Array.from(container.querySelectorAll("a[href]"), (a) => a.getAttribute("href"));
    expect(hrefs).toEqual(expect.arrayContaining(["/ray-tracing", "/v1", "https://fortecare.ai/", profile.linkedIn, profile.gitHub, `mailto:${profile.email}`]));
    expect(container.querySelectorAll("[role=link]")).toHaveLength(0);
    const meLinks = Array.from(container.querySelectorAll("a[rel~=me]"), (a) => a.getAttribute("href"));
    expect(meLinks).toEqual(expect.arrayContaining([profile.linkedIn, profile.gitHub]));
  });

  it("switches the season from the top bar, in calendar order", () => {
    const { getByRole } = render(<Page/>);
    const group = getByRole("group", { name: "Season" });
    expect(within(group).getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(["Spring theme", "Summer theme", "Autumn theme", "Winter theme"]);
    const spring = getByRole("button", { name: "Spring theme" });
    fireEvent.click(spring);
    expect(document.documentElement.dataset.season).toBe("spring");
    expect(spring.getAttribute("aria-pressed")).toBe("true");
    expect(getByRole("button", { name: "Winter theme" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("keeps folded achievements in the page and opens them on request", () => {
    const { container, getAllByRole } = render(<Page/>);
    // Search engines read folded text too
    expect(container.textContent).toContain("mentored several back-end engineers");
    expect(container.textContent).toContain("Special Assistant");
    const more = getAllByRole("button", { name: "Show 2 more" })[0];
    const region = document.getElementById(more.getAttribute("aria-controls") ?? "");
    expect(region?.hasAttribute("inert")).toBe(true);
    fireEvent.click(more);
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(more.textContent).toContain("Show less");
    expect(region?.hasAttribute("inert")).toBe(false);
  });

  it("shows every result of a current role, with no Show more", () => {
    const { getByText } = render(<Page/>);
    // A Best Buy Canada result from `more`, outside any folded region
    expect(getByText(/mentored several back-end engineers/).closest("[inert]")).toBeNull();
  });

  it("names every button for screen readers", () => {
    const { container } = render(<Page/>);
    container.querySelectorAll("button").forEach((button) => {
      expect(button.getAttribute("aria-label") || button.textContent?.trim()).toBeTruthy();
    });
  });

  it("describes every image", () => {
    const { container } = render(<Page/>);
    container.querySelectorAll("img:not([aria-hidden=true])").forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
    });
    container.querySelectorAll("img").forEach((img) => {
      expect(img.getAttribute("alt")).not.toMatch(/^Slide \d/);
    });
  });
});

describe("Experience data", () => {
  const roles = [...experience, ...earlyExperience].flatMap((company) => company.roles.map((role) => ({ company: company.name, ...role })));

  it("has valid dates, each role starting before it ends", () => {
    for (const role of roles) {
      expect(monthsBetween(parseMonth(role.start), parseMonth(role.end))).toBeGreaterThanOrEqual(0);
    }
  });

  it("lists the current jobs first, Best Buy Canada before ForteCare", () => {
    expect(experience.slice(0, 2).map((company) => [company.name, company.roles[0].end])).toEqual([["Best Buy Canada", "Present"], ["ForteCare", "Present"]]);
  });

  it("formats durations like LinkedIn", () => {
    expect([1, 5, 12, 31, 62].map(formatDuration)).toEqual(["1 mo", "5 mos", "1 yr", "2 yrs 7 mos", "5 yrs 2 mos"]);
    expect(() => parseMonth("March 2024")).toThrow();
  });
});

describe("Previous version (/v1)", () => {
  it("still renders the original design", () => {
    const { container } = render(<V1Page/>);
    expect(container.querySelector("h1")?.textContent).toBe(profile.name);
    expect(container.textContent).toContain("Adaptive");
  });
});

describe("Home page metadata", () => {
  it("fits search result limits", () => {
    expect(homeSeo.title.length).toBeLessThanOrEqual(60);
    expect(homeSeo.title.startsWith(profile.name)).toBe(true);
    expect(homeSeo.description.length).toBeGreaterThanOrEqual(120);
    expect(homeSeo.description.length).toBeLessThanOrEqual(160);
  });

  it("ties the Person to Kevin's profiles, his job and his start-up", () => {
    const person = homeJsonLd["@graph"].find((node) => node["@type"] === "Person");
    expect(person).toMatchObject({
      name: profile.name,
      jobTitle: profile.jobTitle,
      worksFor: expect.arrayContaining([
        expect.objectContaining({ name: profile.employer.name }),
        expect.objectContaining({ name: profile.startup.name }),
      ]),
      sameAs: expect.arrayContaining([profile.linkedIn, profile.gitHub]),
    });
  });
});
