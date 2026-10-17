import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { EASE } from "../motion";
import { profile } from "../../data/profile";
import SeasonSwitch from "./SeasonSwitch";

export const NAV_LINKS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Sections the reader can be in; only NAV_LINKS ones get the underline
const TRACKED = ["top", "about", ...NAV_LINKS.map((link) => link.id)];

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// The section crossing a thin band just above the middle of the screen
const useActiveSection = (): string | null => {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    for (const id of TRACKED) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  return active;
};

const linkClass = "text-[15px] font-medium text-[var(--v2-body)] transition-colors hover:text-[var(--v2-ink)]";

// Sticky, slim and frosted over the full-screen scene. On phones the section
// links (and Resume, which the hero repeats) fold into a menu; the season
// switch stays in the bar.
const TopBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [underline, setUnderline] = useState<{ x: number; width: number } | null>(null);
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const active = useActiveSection();

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
        scrolled || menuOpen ? "border-[var(--v2-line)] bg-white/90 shadow-[0_6px_24px_-18px_rgba(15,23,42,0.4)]" : "border-white/40 bg-white/75",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:gap-5 md:px-8">
        <a href="#top" className="mr-auto text-[19px] font-bold tracking-[-0.02em] text-[var(--v2-ink)]">{profile.name}</a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul ref={listRef} className="relative flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} aria-current={active === link.id ? "true" : undefined} className={clsx(linkClass, "block py-2", active === link.id && "text-[var(--v2-ink)]")}>{link.label}</a>
              </li>
            ))}
            <m.span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--v2-accent)]"
              initial={false}
              animate={underline ? { x: underline.x, width: underline.width, opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          </ul>
        </nav>
        <SeasonSwitch/>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="hidden rounded-xl bg-[var(--v2-accent-strong)] px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
        >
          Resume
        </a>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? "v2-menu" : undefined}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-[var(--v2-ink)] hover:bg-[var(--v2-tint)] md:hidden"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="v2-menu"
            aria-label="Sections"
            className="overflow-hidden border-t border-[var(--v2-line)] md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ul className="flex flex-col px-4 pb-3 pt-1">
              {NAV_LINKS.map((link) => (
                <li key={link.id}><a href={`#${link.id}`} onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>{link.label}</a></li>
              ))}
              <li><a href={profile.resume} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>Resume</a></li>
            </ul>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default TopBar;
