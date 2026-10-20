import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useLocale, useMessages } from "../../../../i18n/LocaleContext";
import { LOCALE_LABELS } from "../../../../i18n/locales";
import { LanguageLinks } from "../../../../v2/components/TopBar/LanguageLinks/LanguageLinks";
import { SANS } from "../theme";
import { ExpandMoreIcon } from "../SimulationIcons/SimulationIcons";

export interface LanguageMenuProps {
  // The page's path without a language prefix
  path: string;
}

// The guide's language switcher: a button named after the page's language, in
// the dark top bar, that opens the page in every language (real links, as on the home page). Escape or a
// click outside closes it.
const LanguageMenu: React.FC<LanguageMenuProps> = ({ path }) => {
  const [open, setOpen] = useState<boolean>(false);
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label={`${LOCALE_LABELS[locale]} – ${common.changeLanguage}`}
        aria-expanded={open}
        aria-controls={open ? "sim-languages" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={clsx(SANS, "btn-base flex h-[40px] items-center gap-[6px] rounded-full px-[10px] text-[13px] cursor-pointer transition-colors hover:bg-white/5")}
        style={{ border: "none", background: "transparent", color: "var(--sim-muted)" }}
      >
        <span>{LOCALE_LABELS[locale]}</span>
        <ExpandMoreIcon className="!h-[16px] !w-[16px]" style={{ transform: open ? "rotate(180deg)" : "none" }}/>
      </button>
      {open && (
        <nav
          id="sim-languages"
          aria-label={common.language}
          className="absolute right-0 top-[48px] z-30 w-[180px] rounded-[10px] py-[6px] backdrop-blur-md"
          style={{ backgroundColor: "var(--sim-surface)", border: "1px solid var(--sim-border)" }}
        >
          <LanguageLinks
            path={path}
            onPick={() => setOpen(false)}
            linkClassName={clsx(SANS, "link-base px-[16px] py-[9px] text-[14px] text-[var(--sim-muted)] hover:text-[var(--sim-text)] aria-[current=true]:text-[var(--sim-accent)]")}
          />
        </nav>
      )}
    </div>
  );
};

export default LanguageMenu;
