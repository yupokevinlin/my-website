import type { Locale } from "../../locales";
import { EN_SIMULATIONS, type SimulationsText, type SimulationsTranslation, localizeParams, localizeSimulations } from "./en";
import { SIMULATIONS_FR } from "./fr";
import { SIMULATIONS_JA } from "./ja";
import { SIMULATIONS_ZH_CN } from "./zhCn";
import { SIMULATIONS_ZH_TW } from "./zhTw";

export { EN_SIMULATIONS, type SimulationsText, type SimulationsTranslation, localizeParams, localizeSimulations };

// Every language's settings text at once, for the tests. Pages load one
// language through its text pack (src/i18n/packs/), never through this file.
export const SIMULATIONS_TRANSLATIONS: Record<Exclude<Locale, "en">, SimulationsTranslation> = {
  fr: SIMULATIONS_FR,
  "zh-cn": SIMULATIONS_ZH_CN,
  "zh-tw": SIMULATIONS_ZH_TW,
  ja: SIMULATIONS_JA,
};

export const getSimulationsText = (locale: Locale): SimulationsText =>
  locale === "en" ? EN_SIMULATIONS : localizeSimulations(SIMULATIONS_TRANSLATIONS[locale]);
