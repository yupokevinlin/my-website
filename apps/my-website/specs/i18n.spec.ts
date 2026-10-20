import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EN_HOME, HOME_SKIP, HOME_TRANSLATIONS } from "../src/i18n/content/home";
import { EN_RAY_TRACING, RAY_TRACING_SKIP, RAY_TRACING_TRANSLATIONS } from "../src/i18n/content/rayTracing";
import { EN_SIMULATIONS, SIMULATIONS_TRANSLATIONS } from "../src/i18n/content/simulations";
import { EN_MESSAGES } from "../src/i18n/messages/en";
import { EN_GUIDE_TEXT } from "../src/i18n/messages/guide/en";
import { GUIDE_TEXTS, MESSAGES } from "../src/i18n/messages";
import { LOCALE_SCRIPT } from "../src/i18n/localeScript";
import { LOCALES, PREFIXED_LOCALES, localeHref, localePath, stripLocale } from "../src/i18n/locales";
import { localize, missingTranslations } from "../src/i18n/translation";
import { SEASON_SCRIPT } from "../src/v2/season";

// Every string that holds words, with its path, from English or a translation
const texts = (value: unknown, path = ""): Array<[string, string]> => {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => texts(item, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => texts(v, path ? `${path}.${k}` : k));
  return [];
};

// English sentences left untranslated: long strings with spaces, the same as
// the English at the same place (names and short labels may match on purpose)
const untranslated = (english: unknown, translated: unknown): string[] => {
  const en = new Map(texts(english));
  return texts(translated).filter(([path, text]) => text.length > 40 && text.includes(" ") && en.get(path) === text).map(([path]) => path);
};

describe("Translations", () => {
  for (const locale of PREFIXED_LOCALES) {
    describe(locale, () => {
      it("translate every part of the home page, in the English shape", () => {
        for (const key of Object.keys(EN_HOME) as Array<keyof typeof EN_HOME>) {
          expect(missingTranslations(EN_HOME[key], HOME_TRANSLATIONS[locale][key], HOME_SKIP[key])).toEqual([]);
          expect(untranslated(EN_HOME[key], HOME_TRANSLATIONS[locale][key])).toEqual([]);
        }
      });

      it("translate every part of the ray-tracing guide, in the English shape", () => {
        for (const key of Object.keys(EN_RAY_TRACING) as Array<keyof typeof EN_RAY_TRACING>) {
          expect(missingTranslations(EN_RAY_TRACING[key], RAY_TRACING_TRANSLATIONS[locale][key], RAY_TRACING_SKIP[key])).toEqual([]);
          expect(untranslated(EN_RAY_TRACING[key], RAY_TRACING_TRANSLATIONS[locale][key])).toEqual([]);
        }
      });

      it("translate every simulation setting, by key", () => {
        expect(missingTranslations(EN_SIMULATIONS, SIMULATIONS_TRANSLATIONS[locale])).toEqual([]);
        const settings = (text: typeof EN_SIMULATIONS) => Object.values(text).flatMap((sim) => Object.keys(sim.params)).sort();
        expect(settings(localize(EN_SIMULATIONS, SIMULATIONS_TRANSLATIONS[locale]))).toEqual(settings(EN_SIMULATIONS));
      });

      it("translate the interface, with the same placeholders", () => {
        expect(missingTranslations(EN_MESSAGES, MESSAGES[locale])).toEqual([]);
        expect(untranslated(EN_MESSAGES, MESSAGES[locale])).toEqual([]);
        // Functions still take the same arguments and return text
        expect(MESSAGES[locale].home.experience.duration(2, 7)).toMatch(/2/);
        expect(MESSAGES[locale].home.experience.showMore(3)).toMatch(/3/);
      });

      it("translate the guide's interface, with the same placeholders", () => {
        expect(missingTranslations(EN_GUIDE_TEXT, GUIDE_TEXTS[locale])).toEqual([]);
        expect(untranslated(EN_GUIDE_TEXT, GUIDE_TEXTS[locale])).toEqual([]);
        expect(GUIDE_TEXTS[locale].readouts.blackhole.tracing("42")).toMatch(/42/);
      });

      it("keep the settings' groups keyed by their English id", () => {
        expect(Object.keys(GUIDE_TEXTS[locale].controls.groups).sort()).toEqual(Object.keys(EN_GUIDE_TEXT.controls.groups).sort());
      });
    });
  }
});

describe("Language paths", () => {
  it("prefix every language but English", () => {
    expect(localePath("en", "/ray-tracing")).toBe("/ray-tracing");
    expect(localePath("fr", "/")).toBe("/fr");
    expect(localePath("fr", "/#about")).toBe("/fr#about");
    expect(localePath("zh-tw", "/ray-tracing/wormhole#throat=2")).toBe("/zh-tw/ray-tracing/wormhole#throat=2");
    expect(stripLocale("/ja/ray-tracing/infall")).toBe("/ray-tracing/infall");
    expect(stripLocale("/zh-cn")).toBe("/");
    expect(stripLocale("/ray-tracing")).toBe("/ray-tracing");
  });

  it("leave pages that exist only in English alone", () => {
    expect(localeHref("ja", "/v1")).toBe("/v1");
    expect(localeHref("ja", "/resources/resume/kevin-lin-resume.pdf")).toBe("/resources/resume/kevin-lin-resume.pdf");
    expect(localeHref("ja", "https://fortecare.ai/")).toBe("https://fortecare.ai/");
    expect(localeHref("ja", "/ray-tracing/blackhole")).toBe("/ja/ray-tracing/blackhole");
  });
});

describe("Remembered language", () => {
  const run = (saved: string | null, pathname: string, hash = "") => {
    const replace = jest.fn();
    const storage = { getItem: () => saved };
    new Function("localStorage", "location", LOCALE_SCRIPT)(storage, { pathname, search: "", hash, replace });
    return replace.mock.calls[0]?.[0];
  };

  it("moves a visitor from an English page to the same page in their language", () => {
    expect(run("fr", "/")).toBe("/fr");
    expect(run("ja", "/ray-tracing/blackhole", "#spin=0.9")).toBe("/ja/ray-tracing/blackhole#spin=0.9");
  });

  it("stays put for English, no choice, /v1, or a page already in a language", () => {
    expect(run("en", "/")).toBeUndefined();
    expect(run(null, "/")).toBeUndefined();
    expect(run("fr", "/v1")).toBeUndefined();
    expect(run("fr", "/zh-cn")).toBeUndefined();
  });
});

describe("Head scripts", () => {
  it("preload the season's picture on every language's home page", () => {
    for (const pathname of ["/", "/fr", "/zh-tw/"]) {
      const appended: unknown[] = [];
      const documentStub = {
        documentElement: { setAttribute: () => undefined },
        createElement: () => ({}),
        head: { appendChild: (el: unknown) => appended.push(el) },
        getElementById: () => null,
      };
      new Function("document", "location", SEASON_SCRIPT)(documentStub, { pathname });
      expect([pathname, appended.length]).toEqual([pathname, 1]);
    }
  });
});

describe("Sitemap", () => {
  it("lists every page in every language, each with all its alternates", () => {
    const xml = readFileSync(join(__dirname, "../public/sitemap.xml"), "utf8");
    const pages = ["/", "/ray-tracing", "/ray-tracing/blackhole", "/ray-tracing/infall", "/ray-tracing/wormhole", "/ray-tracing/lightspeed"];
    for (const page of pages) {
      for (const locale of LOCALES) {
        const path = localePath(locale, page);
        expect(xml).toContain(`<loc>https://kevinyupolin.dev${path}</loc>`);
      }
    }
    expect(xml.match(/<url>/g)?.length).toBe(pages.length * LOCALES.length);
    expect(xml.match(/hreflang="x-default"/g)?.length).toBe(pages.length * LOCALES.length);
  });
});
