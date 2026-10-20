import type { Locale } from "../../locales";
import { localize } from "../../translation";
import { EN_RAY_TRACING, RAY_TRACING_SKIP, type RayTracingContent, type RayTracingTranslation } from "./en";
import { RAY_TRACING_FR } from "./fr";
import { RAY_TRACING_JA } from "./ja";
import { RAY_TRACING_ZH_CN } from "./zhCn";
import { RAY_TRACING_ZH_TW } from "./zhTw";

export { EN_RAY_TRACING, RAY_TRACING_SKIP, type RayTracingContent, type RayTracingTranslation };

export const RAY_TRACING_TRANSLATIONS: Record<Exclude<Locale, "en">, RayTracingTranslation> = {
  fr: RAY_TRACING_FR,
  "zh-cn": RAY_TRACING_ZH_CN,
  "zh-tw": RAY_TRACING_ZH_TW,
  ja: RAY_TRACING_JA,
};

const cache = new Map<Locale, RayTracingContent>();

// The guide's lessons, chapters, glossary and credits in a language
export const getRayTracingContent = (locale: Locale): RayTracingContent => {
  if (locale === "en") return EN_RAY_TRACING;
  let content = cache.get(locale);
  if (!content) {
    const overlay = RAY_TRACING_TRANSLATIONS[locale];
    content = Object.fromEntries(
      (Object.keys(EN_RAY_TRACING) as Array<keyof RayTracingContent>).map((key) => [key, localize(EN_RAY_TRACING[key], overlay[key], RAY_TRACING_SKIP[key])]),
    ) as RayTracingContent;
    cache.set(locale, content);
  }
  return content;
};
