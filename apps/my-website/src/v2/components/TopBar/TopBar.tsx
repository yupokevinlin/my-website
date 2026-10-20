import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { EASE } from "../../motion";
import { useActiveSection } from "../../hooks/useActiveSection";
import { profile } from "../../../data/profile";
import { CloseIcon } from "../icons/CloseIcon/CloseIcon";
import { MenuIcon } from "../icons/MenuIcon/MenuIcon";
import { SeasonSwitch } from "./SeasonSwitch/SeasonSwitch";
import { LanguageSwitcher } from "./LanguageSwitcher/LanguageSwitcher";
import { LanguageLinks } from "./LanguageLinks/LanguageLinks";
import { useMessages } from "../../../i18n/LocaleContext";

// The sections in the top bar, by id; their names are in the dictionary
export const NAV_LINKS = ["experience", "projects", "skills", "contact"] as const;

// Sections the reader can be in; only NAV_LINKS ones get the underline
const TRACKED = ["top", "about", ...NAV_LINKS];

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const linkClass = "rounded-md text-[15px] font-medium text-[var(--v2-body)] transition-colors hover:text-[var(--v2-ink)]";

// Sticky, slim and frosted in the season's colour over the full-screen scene.
// On phones the section links (and Resume, which the hero repeats) fold into
// a menu; the season switch stays in the bar. The language switcher sits in
// the bar from 600px; on phones the languages are at the end of the menu.
export const TopBar = (): ReactNode => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [underline, setUnderline] = useState<{ x: number; width: number } | null>(null);
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const active = useActiveSection(TRACKED);
  const { nav } = useMessages().home;
  const { common } = useMessages();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the underline under the link for the section being read
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const link = listRef.current?.querySelector<HTMLElement>(`a[href="#${active}"]`);
      setUnderline(link ? { x: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e: PointerEvent) => barRef.current && !barRef.current.contains(e.target as Node) && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <header
      ref={barRef}
      className={clsx(
        "sticky top-0 z-40 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-[var(--v2-line)] bg-[color-mix(in_srgb,var(--v2-page)_92%,transparent)] shadow-[0_6px_24px_-18px_var(--v2-deep)]"
          : "border-transparent bg-[color-mix(in_srgb,var(--v2-page)_80%,transparent)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:gap-5 md:px-8">
        <a href="#top" className="mr-auto rounded-md text-[19px] font-bold tracking-[-0.02em] text-[var(--v2-accent-strong)]">{profile.name}</a>
        <nav aria-label={nav.sections} className="hidden md:block">
          <ul ref={listRef} className="relative flex items-center gap-7">
            {NAV_LINKS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? "true" : undefined} className={clsx(linkClass, "block py-2", active === id && "text-[var(--v2-ink)]")}>{nav[id]}</a>
              </li>
            ))}
            <m.span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-full bg-[var(--v2-accent-strong)]"
              initial={false}
              animate={underline ? { x: underline.x, width: underline.width, opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          </ul>
        </nav>
        <SeasonSwitch/>
        <LanguageSwitcher path="/" className="hidden sm:block"/>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="hidden rounded-xl bg-[var(--v2-accent-strong)] px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
        >
          {nav.resume}
        </a>
        <button
          type="button"
          aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? "v2-menu" : undefined}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-[var(--v2-ink)] hover:bg-[var(--v2-tint)] md:hidden"
        >
          {menuOpen ? <CloseIcon width={22} height={22}/> : <MenuIcon width={22} height={22}/>}
        </button>
      </div>
      {/* The menu floats over the page and fades rather than growing: an
          animation to height "auto" makes framer-motion restore the scroll
          position, which would undo a link's jump to its section. */}
      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="v2-menu"
            aria-label={nav.sections}
            className="absolute inset-x-0 top-full overflow-hidden border-y border-[var(--v2-line)] bg-[var(--v2-page)] shadow-[0_18px_30px_-22px_var(--v2-deep)] md:hidden"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <ul className="flex flex-col px-4 pb-3 pt-1">
              {NAV_LINKS.map((id) => (
                <li key={id}><a href={`#${id}`} onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>{nav[id]}</a></li>
              ))}
              <li><a href={profile.resume} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>{nav.resume}</a></li>
            </ul>
            <div className="border-t border-[var(--v2-line)] px-4 pb-3 pt-3 sm:hidden">
              <p className="pb-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-muted)]">{common.language}</p>
              <LanguageLinks path="/" onPick={() => setMenuOpen(false)} className="grid grid-cols-2 gap-x-4" linkClassName={clsx(linkClass, "py-2.5 aria-[current=true]:text-[var(--v2-accent-strong)]")}/>
            </div>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
