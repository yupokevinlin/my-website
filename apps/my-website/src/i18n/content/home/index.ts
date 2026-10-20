import type { Locale } from "../../locales";
import { localize } from "../../translation";
import { EN_HOME, HOME_SKIP, type HomeContent, type HomeTranslation } from "./en";
import { HOME_FR } from "./fr";
import { HOME_JA } from "./ja";
import { HOME_ZH_CN } from "./zhCn";
import { HOME_ZH_TW } from "./zhTw";

export { EN_HOME, HOME_SKIP, type HomeContent, type HomeTranslation };

export const HOME_TRANSLATIONS: Record<Exclude<Locale, "en">, HomeTranslation> = {
  fr: HOME_FR,
  "zh-cn": HOME_ZH_CN,
  "zh-tw": HOME_ZH_TW,
  ja: HOME_JA,
};

const cache = new Map<Locale, HomeContent>();

// The home page's content in a language: English with that language's text
export const getHomeContent = (locale: Locale): HomeContent => {
  if (locale === "en") return EN_HOME;
  let content = cache.get(locale);
  if (!content) {
    const overlay = HOME_TRANSLATIONS[locale];
    content = Object.fromEntries(
      (Object.keys(EN_HOME) as Array<keyof HomeContent>).map((key) => [key, localize(EN_HOME[key], overlay[key], HOME_SKIP[key])]),
    ) as HomeContent;
    cache.set(locale, content);
  }
  return content;
};
