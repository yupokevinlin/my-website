import React, { useState } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { ACCENTS, MONO, SANS, SERIF, SimAccentId, fontVars, themeVars } from "../theme";
import { HomeIcon, MenuBookIcon, MenuIcon } from "../SimulationIcons/SimulationIcons";

const NAV: Array<{ id: SimAccentId | "home"; numeral: string; label: string; href: string; Icon?: typeof HomeIcon }> = [
  { id: "home", numeral: "", label: "Home", href: "/", Icon: HomeIcon },
  { id: "overview", numeral: "", label: "Overview", href: "/ray-tracing", Icon: MenuBookIcon },
  { id: "blackhole", numeral: "I", label: "Black Hole", href: "/ray-tracing/blackhole" },
  { id: "infall", numeral: "II", label: "Falling In", href: "/ray-tracing/infall" },
  { id: "wormhole", numeral: "III", label: "Wormhole", href: "/ray-tracing/wormhole" },
  { id: "lightspeed", numeral: "IV", label: "Light Speed", href: "/ray-tracing/lightspeed" },
  { id: "neutron", numeral: "V", label: "Neutron Star", href: "/ray-tracing/neutron" },
];

export interface SimulationsLayoutProps {
  active: SimAccentId;
  /** Let the page scroll under a transparent navigation bar (overview). */
  overlayNav?: boolean;
  /** Hide the navigation bar (full-bleed view). */
  hideChrome?: boolean;
  children?: React.ReactNode;
}

// Dark frame for the /ray-tracing pages: a slim navigation bar with the
// section title, a link back to the main site and the five simulations.
const SimulationsLayout: React.FC<SimulationsLayoutProps> = (props) => {
  const { active, overlayNav, hideChrome, children } = props;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const link = (item: (typeof NAV)[number], mobile: boolean) => {
    const isActive = item.id === active;
    const accent = item.id === "home" ? "var(--sim-text)" : ACCENTS[item.id];
    return (
      <NextLink
        key={item.id}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        className={clsx(
          "link-base group relative flex items-center gap-[6px] transition-colors duration-200",
          mobile ? "px-[20px] py-[12px] text-[15px]" : "px-[2px] py-[6px] text-[13px] tracking-[0.04em]",
          SANS,
        )}
        style={{ color: isActive ? "var(--sim-text)" : "var(--sim-muted)", textDecoration: "none" }}
      >
        {item.Icon && <item.Icon className="!h-[16px] !w-[16px] group-hover:text-[var(--sim-text)]"/>}
        {item.numeral && (
          <span className={clsx(MONO, "text-[10px]")} style={{ color: isActive ? accent : "var(--sim-faint)" }}>{item.numeral}</span>
        )}
        <span className="group-hover:text-[var(--sim-text)]">{item.label}</span>
        {!mobile && (
          <span
            className="absolute left-0 right-0 -bottom-[3px] h-[1px] transition-opacity duration-200"
            style={{ backgroundColor: accent, opacity: isActive ? 1 : 0 }}
          />
        )}
      </NextLink>
    );
  };

  return (
    <div
      className={clsx(fontVars, "relative h-full w-full flex flex-col overflow-hidden")}
      style={{ ...themeVars(active), backgroundColor: "var(--sim-bg)", color: "var(--sim-text)" }}
    >
      {!hideChrome && (
        <header
          className={clsx(
            "z-20 flex w-full shrink-0 flex-row items-center justify-between h-[56px] px-[16px] sm:px-[28px]",
            overlayNav ? "absolute top-0 left-0 backdrop-blur-md" : "relative",
          )}
          style={{
            background: overlayNav ? "rgba(5,5,8,0.72)" : "var(--sim-bg)",
            borderBottom: "1px solid var(--sim-border)",
          }}
        >
          <NextLink
            href="/ray-tracing"
            className={clsx("link-base min-w-0 truncate text-[20px] sm:text-[22px] leading-[1.4]", SERIF)}
            style={{ color: "var(--sim-text)", textDecoration: "none" }}
          >
            Relativistic Ray Tracing
          </NextLink>
          <nav className="hidden lg:flex flex-row items-center gap-[26px]">{NAV.map((n) => link(n, false))}</nav>
          <button
            type="button"
            className="btn-base lg:hidden flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full"
            style={{ border: "none", background: "transparent", color: "var(--sim-text)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <MenuIcon className="!h-[22px] !w-[22px]"/>
          </button>
          {menuOpen && (
            <nav
              className="lg:hidden absolute top-[56px] right-[12px] flex flex-col py-[6px] rounded-[10px] backdrop-blur-md"
              style={{ backgroundColor: "var(--sim-surface)", border: "1px solid var(--sim-border)" }}
            >
              {NAV.map((n) => link(n, true))}
            </nav>
          )}
        </header>
      )}
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
};

export default SimulationsLayout;
