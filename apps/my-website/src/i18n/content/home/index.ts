import type { Locale } from "../../locales";
import { EN_HOME, HOME_SKIP, type HomeContent, type HomeTranslation, localizeHome } from "./en";
import { HOME_FR } from "./fr";
import { HOME_JA } from "./ja";
import { HOME_ZH_CN } from "./zhCn";
import { HOME_ZH_TW } from "./zhTw";

export { EN_HOME, HOME_SKIP, type HomeContent, type HomeTranslation, localizeHome };

// Every language's home page content at once, for the tests. Pages load one
// language through its text pack (src/i18n/packs/), never through this file.
export const HOME_TRANSLATIONS: Record<Exclude<Locale, "en">, HomeTranslation> = {
  fr: HOME_FR,
  "zh-cn": HOME_ZH_CN,
  "zh-tw": HOME_ZH_TW,
  ja: HOME_JA,
};

export const getHomeContent = (locale: Locale): HomeContent => (locale === "en" ? EN_HOME : localizeHome(HOME_TRANSLATIONS[locale]));
