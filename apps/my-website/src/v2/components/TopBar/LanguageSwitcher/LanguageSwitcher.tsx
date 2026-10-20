import { type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { EASE } from "../../../motion";
import { useLocale, useMessages } from "../../../../i18n/LocaleContext";
import { LOCALE_LABELS } from "../../../../i18n/locales";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon/ChevronDownIcon";
import { LanguageLinks } from "../LanguageLinks/LanguageLinks";

export interface LanguageSwitcherProps {
  // The page's path without a language prefix
  path: string;
  className?: string;
}

// A button named after the page's language that opens the list of languages,
// below the top bar's right edge. Escape or a click outside closes it.
export const LanguageSwitcher = ({ path, className }: LanguageSwitcherProps): ReactNode => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const { common } = useMessages();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        aria-label={`${LOCALE_LABELS[locale]} – ${common.changeLanguage}`}
        aria-expanded={open}
        aria-controls={open ? "v2-languages" : undefined}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-xl px-2.5 text-[14px] font-semibold text-[var(--v2-body)] transition-colors hover:bg-[var(--v2-tint)] hover:text-[var(--v2-ink)]"
      >
        <span>{LOCALE_LABELS[locale]}</span>
        <ChevronDownIcon width={14} height={14} className={clsx("transition-transform duration-300", open && "rotate-180")}/>
      </button>
      <AnimatePresence>
        {open ? (
          <m.nav
            id="v2-languages"
            aria-label={common.language}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-page)] p-1.5 shadow-[0_18px_40px_-20px_var(--v2-deep)]"
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <LanguageLinks
              path={path}
              onPick={() => setOpen(false)}
              linkClassName="rounded-xl px-3 py-2.5 text-[15px] text-[var(--v2-body)] transition-colors hover:bg-[var(--v2-tint)] hover:text-[var(--v2-ink)] aria-[current=true]:font-semibold aria-[current=true]:text-[var(--v2-accent-strong)]"
            />
          </m.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
