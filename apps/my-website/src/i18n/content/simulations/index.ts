import type { Locale } from "../../locales";
import type { ParamDef } from "../../../simulations/sims/types";
import { localize } from "../../translation";
import { EN_SIMULATIONS, type ParamText, type SimulationsText, type SimulationsTranslation } from "./en";
import { SIMULATIONS_FR } from "./fr";
import { SIMULATIONS_JA } from "./ja";
import { SIMULATIONS_ZH_CN } from "./zhCn";
import { SIMULATIONS_ZH_TW } from "./zhTw";

export { EN_SIMULATIONS, type SimulationsText, type SimulationsTranslation };

export const SIMULATIONS_TRANSLATIONS: Record<Exclude<Locale, "en">, SimulationsTranslation> = {
  fr: SIMULATIONS_FR,
  "zh-cn": SIMULATIONS_ZH_CN,
  "zh-tw": SIMULATIONS_ZH_TW,
  ja: SIMULATIONS_JA,
};

const cache = new Map<Locale, SimulationsText>();

// The simulations' settings text in a language
export const getSimulationsText = (locale: Locale): SimulationsText => {
  if (locale === "en") return EN_SIMULATIONS;
  let text = cache.get(locale);
  if (!text) {
    text = localize(EN_SIMULATIONS, SIMULATIONS_TRANSLATIONS[locale]);
    cache.set(locale, text);
  }
  return text;
};

// Settings with their label, tooltip, unit and choices in the page's language
export const localizeParams = (defs: Array<ParamDef>, text: Record<string, ParamText>): Array<ParamDef> =>
  defs.map((def) => {
    const t = text[def.key];
    if (!t) return def;
    return {
      ...def,
      label: t.label,
      hint: t.hint ?? def.hint,
      unit: t.unit ?? def.unit,
      options: def.options?.map((o) => ({ ...o, label: t.options?.[o.value] ?? o.label })),
    };
  });
