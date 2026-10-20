import { type TextPack, useTextPack } from "../../../i18n/LocaleContext";
import type { RayTracingContent } from "../../../i18n/content/rayTracing/en";
import type { SimulationsText } from "../../../i18n/content/simulations/en";
import type { GuideText } from "../../../i18n/messages/guide/en";
import type { Chapter, SimId } from "./content";

// The guide's text in the page's language, from the page's text pack: the
// lessons, chapters, glossary and credits (content overlays), its labels and
// prose (the dictionary) and the simulations' settings
const useGuide = (): NonNullable<TextPack["guide"]> => {
  const { guide } = useTextPack();
  if (!guide) throw new Error("The guide's text is missing from this page's text pack");
  return guide;
};

export const useGuideContent = (): RayTracingContent => useGuide().content;

export const useGuideText = (): GuideText => useGuide().text;

export const useSimulationsText = (): SimulationsText => useGuide().simulations;

// A simulation's chapter in the page's language
export const useChapter = (id: SimId): Chapter => {
  const { chapters } = useGuideContent();
  return chapters.find((c) => c.id === id) ?? chapters[0];
};
