import type { ReactNode } from "react";
import { useLocale } from "../../LocaleContext";
import type { Locale } from "../../locales";
import type { TextPackComponent } from "../withText";
import GuideTextFr from "./fr";
import GuideTextJa from "./ja";
import GuideTextZhCn from "./zhCn";
import GuideTextZhTw from "./zhTw";

const PACKS: Record<Exclude<Locale, "en">, TextPackComponent> = {
  fr: GuideTextFr,
  "zh-cn": GuideTextZhCn,
  "zh-tw": GuideTextZhTw,
  ja: GuideTextJa,
};

// The guide's text for pages/[locale]/ray-tracing/..., which serve every
// language but English: the page's language, from _app
const GuideTextOthers = ({ children }: { children: ReactNode }): ReactNode => {
  const locale = useLocale();
  if (locale === "en") throw new Error("English pages use packs/guide/en");
  const Pack = PACKS[locale];
  return <Pack>{children}</Pack>;
};

export default GuideTextOthers;
