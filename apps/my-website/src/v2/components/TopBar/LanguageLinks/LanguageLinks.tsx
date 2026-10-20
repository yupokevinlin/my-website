import type { ReactNode } from "react";
import clsx from "clsx";
import { useLocale } from "../../../../i18n/LocaleContext";
import { LOCALE_LABELS, LOCALE_TAGS, SWITCHER_ORDER, localePath, rememberLocale } from "../../../../i18n/locales";
import { CheckIcon } from "../../icons/CheckIcon/CheckIcon";

export interface LanguageLinksProps {
  // The page's path without a language prefix ("/", "/ray-tracing/wormhole")
  path: string;
  // Called after a language is picked (to close a menu)
  onPick?: () => void;
  className?: string;
  linkClassName?: string;
}

// The page in every language, as real links (search engines follow them), each
// in its own language and named in it. Picking one remembers the choice.
export const LanguageLinks = ({ path, onPick, className, linkClassName }: LanguageLinksProps): ReactNode => {
  const current = useLocale();
  return (
    <ul className={className}>
      {SWITCHER_ORDER.map((locale) => (
        <li key={locale}>
          <a
            href={localePath(locale, path)}
            hrefLang={LOCALE_TAGS[locale]}
            lang={LOCALE_TAGS[locale]}
            aria-current={locale === current ? "true" : undefined}
            onClick={() => {
              rememberLocale(locale);
              onPick?.();
            }}
            className={clsx("flex items-center gap-2", linkClassName)}
          >
            {LOCALE_LABELS[locale]}
            {locale === current ? <CheckIcon width={16} height={16} className="shrink-0"/> : null}
          </a>
        </li>
      ))}
    </ul>
  );
};
