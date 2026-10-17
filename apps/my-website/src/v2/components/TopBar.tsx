import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { SERIF } from "../fonts";
import { profile } from "../../data/profile";
import SeasonSwitch from "./SeasonSwitch";

export const NAV_LINKS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const linkClass = "text-[15px] text-[var(--v2-body)] transition-colors hover:text-[var(--v2-accent)]";

// Sticky and slim. On phones the section links (and Resume, which the hero
// repeats) fold into a menu; the season switch stays in the bar.
const TopBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

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
    <header ref={barRef} className="sticky top-0 z-40 border-b border-[var(--v2-line)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-4 sm:gap-5 md:px-7">
        <a href="#top" className={clsx(SERIF, "mr-auto text-[24px] font-semibold leading-none text-[var(--v2-ink)]")}>{profile.name}</a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => <li key={link.id}><a href={`#${link.id}`} className={linkClass}>{link.label}</a></li>)}
          </ul>
        </nav>
        <SeasonSwitch/>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="hidden rounded-lg bg-[var(--v2-accent-strong)] px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
        >
          Resume
        </a>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="v2-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[var(--v2-body)] hover:bg-[var(--v2-tint)] md:hidden"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
          </svg>
        </button>
      </div>
      {menuOpen ? (
        <nav id="v2-menu" aria-label="Sections" className="border-t border-[var(--v2-line)] bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.id}><a href={`#${link.id}`} onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>{link.label}</a></li>
            ))}
            <li><a href={profile.resume} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)} className={clsx(linkClass, "block py-3")}>Resume</a></li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
};

export default TopBar;
