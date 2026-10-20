import { createContext, type ReactNode, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { MESSAGES, type Messages } from "./messages";

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

// The interface text in the page's language
export const useMessages = (): Messages => MESSAGES[useLocale()];
