import { SITE_URL } from "../data/profile";
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS, localePath, type Locale } from "./locales";

// The full URL of a site path in a language: canonical links, og:url, hreflang
export const localeUrl = (locale: Locale, path: string): string => {
  const localized = localePath(locale, path);
  return `${SITE_URL}${localized === "/" ? "/" : localized}`;
};

// <link rel="alternate" hreflang> for every language of a page, plus
// x-default (the English page), so search engines show each visitor the
// version in their language
export const alternateLinks = (path: string): Array<{ hrefLang: string; href: string }> => [
  ...LOCALES.map((locale) => ({ hrefLang: LOCALE_TAGS[locale], href: localeUrl(locale, path) })),
  { hrefLang: "x-default", href: localeUrl(DEFAULT_LOCALE, path) },
];
