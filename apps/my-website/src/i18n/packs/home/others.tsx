import type { ReactNode } from "react";
import { useLocale } from "../../LocaleContext";
import type { Locale } from "../../locales";
import type { TextPackComponent } from "../withText";
import HomeTextFr from "./fr";
import HomeTextJa from "./ja";
import HomeTextZhCn from "./zhCn";
import HomeTextZhTw from "./zhTw";

const PACKS: Record<Exclude<Locale, "en">, TextPackComponent> = {
  fr: HomeTextFr,
  "zh-cn": HomeTextZhCn,
  "zh-tw": HomeTextZhTw,
  ja: HomeTextJa,
};

// The home page's text for pages/[locale]/index.tsx, which serves every
// language but English: the page's language, from _app
const HomeTextOthers = ({ children }: { children: ReactNode }): ReactNode => {
  const locale = useLocale();
  if (locale === "en") throw new Error("English pages use packs/home/en");
  const Pack = PACKS[locale];
  return <Pack>{children}</Pack>;
};

export default HomeTextOthers;
