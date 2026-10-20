import type { Locale } from "../../locales";
import { EN_RAY_TRACING, RAY_TRACING_SKIP, type RayTracingContent, type RayTracingTranslation, localizeRayTracing } from "./en";
import { RAY_TRACING_FR } from "./fr";
import { RAY_TRACING_JA } from "./ja";
import { RAY_TRACING_ZH_CN } from "./zhCn";
import { RAY_TRACING_ZH_TW } from "./zhTw";

export { EN_RAY_TRACING, RAY_TRACING_SKIP, type RayTracingContent, type RayTracingTranslation, localizeRayTracing };

// Every language's guide content at once, for the tests. Pages load one
// language through its text pack (src/i18n/packs/), never through this file.
export const RAY_TRACING_TRANSLATIONS: Record<Exclude<Locale, "en">, RayTracingTranslation> = {
  fr: RAY_TRACING_FR,
  "zh-cn": RAY_TRACING_ZH_CN,
  "zh-tw": RAY_TRACING_ZH_TW,
  ja: RAY_TRACING_JA,
};

export const getRayTracingContent = (locale: Locale): RayTracingContent =>
  locale === "en" ? EN_RAY_TRACING : localizeRayTracing(RAY_TRACING_TRANSLATIONS[locale]);
