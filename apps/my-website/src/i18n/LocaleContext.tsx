import { createContext, type ReactNode, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import type { Messages } from "./messages/en";
import type { GuideText } from "./messages/guide/en";
import type { HomeContent } from "./content/home/en";
import type { RayTracingContent } from "./content/rayTracing/en";
import type { SimulationsText } from "./content/simulations/en";

// The page's language, from the page's props (pages/[locale]/...) via _app.
// The router can't say: static exports don't support Next.js's i18n routing.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export const LocaleProvider = ({ locale, children }: LocaleProviderProps): ReactNode => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useLocale = (): Locale => useContext(LocaleContext);

// The text a page shows, in its language: the interface text and the home
// page's content, or the guide's text and content. Each page's file imports
// its pack (src/i18n/packs/withText.tsx), so English pages never download the
// other languages, and no page downloads the other kind of page's text.
export interface TextPack {
  messages: Messages;
  home?: HomeContent;
  guide?: {
    text: GuideText;
    content: RayTracingContent;
    simulations: SimulationsText;
  };
}

const TextContext = createContext<TextPack | null>(null);

export interface TextProviderProps {
  pack: TextPack;
  children: ReactNode;
}

export const TextProvider = ({ pack, children }: TextProviderProps): ReactNode => (
  <TextContext.Provider value={pack}>{children}</TextContext.Provider>
);

export const useTextPack = (): TextPack => {
  const pack = useContext(TextContext);
  if (!pack) throw new Error("This page has no text: wrap it with withText (src/i18n/packs/withText.tsx)");
  return pack;
};

// The interface text in the page's language
export const useMessages = (): Messages => useTextPack().messages;
