import { useLocale, useMessages } from "../../../i18n/LocaleContext";
import { getRayTracingContent, type RayTracingContent } from "../../../i18n/content/rayTracing";
import type { Messages } from "../../../i18n/messages";
import type { Chapter, SimId } from "./content";

// The guide's text in the page's language: the lessons, chapters, glossary
// and credits (content overlays), and its labels and prose (the dictionary)
export const useGuideContent = (): RayTracingContent => getRayTracingContent(useLocale());

export const useGuideText = (): Messages["rayTracing"] => useMessages().rayTracing;

// A simulation's chapter in the page's language
export const useChapter = (id: SimId): Chapter => {
  const { chapters } = useGuideContent();
  return chapters.find((c) => c.id === id) ?? chapters[0];
};
