import { getHomeContent, type HomeContent } from "../../i18n/content/home";
import { useLocale } from "../../i18n/LocaleContext";
import { localeHref } from "../../i18n/locales";

// The home page's content (profile, about, experience, projects, skills) in
// the page's language
export const useHomeContent = (): HomeContent => getHomeContent(useLocale());

// A link in the page's language: "/ray-tracing" -> "/fr/ray-tracing"; /v1,
// the resume and other sites stay as they are
export const useLocaleHref = (): ((href: string) => string) => {
  const locale = useLocale();
  return (href: string) => localeHref(locale, href);
};
