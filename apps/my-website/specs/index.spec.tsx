import React from "react";
import { render } from "@testing-library/react";
import Page from "../pages/index";
import { homeJsonLd, homeSeo, profile } from "../src/data/profile";

// jsdom has neither of these; the scroll navigation and seasonal art use them
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
    expect(h2s).toEqual(["About", "Experience", "Projects", "Skills", "Languages", "Education", "Contact"]);
  });

  it("uses real links that search engines can follow", () => {
    const { container } = render(<Page/>);
    const hrefs = Array.from(container.querySelectorAll("a[href]"), (a) => a.getAttribute("href"));
    expect(hrefs).toEqual(expect.arrayContaining(["/ray-tracing", profile.linkedIn, profile.gitHub, `mailto:${profile.email}`]));
    expect(container.querySelectorAll("[role=link]")).toHaveLength(0);
    const meLinks = Array.from(container.querySelectorAll("a[rel~=me]"), (a) => a.getAttribute("href"));
    expect(meLinks).toEqual(expect.arrayContaining([profile.linkedIn, profile.gitHub]));
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

describe("Home page metadata", () => {
  it("fits search result limits", () => {
    expect(homeSeo.title.length).toBeLessThanOrEqual(60);
    expect(homeSeo.title.startsWith(profile.name)).toBe(true);
    expect(homeSeo.description.length).toBeGreaterThanOrEqual(120);
    expect(homeSeo.description.length).toBeLessThanOrEqual(160);
  });

  it("ties the Person to Kevin's profiles and current job", () => {
    const person = homeJsonLd["@graph"].find((node) => node["@type"] === "Person");
    expect(person).toMatchObject({
      name: profile.name,
      jobTitle: profile.jobTitle,
      worksFor: { name: profile.employer.name },
      sameAs: expect.arrayContaining([profile.linkedIn, profile.gitHub]),
    });
  });
});
