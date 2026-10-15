import type React from "react";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";

// Dark, editorial theme for the /simulations pages: a display serif for
// titles, the site's Roboto for reading, a mono for numbers and equations.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sim-serif",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-sim-mono",
});

export type SimAccentId = "overview" | "blackhole" | "infall" | "wormhole" | "lightspeed" | "flyby";

export const ACCENTS: Record<SimAccentId, string> = {
  overview: "#f2a65a",
  blackhole: "#f2a65a",
  wormhole: "#b394ff",
  lightspeed: "#6cc8ff",
  flyby: "#62d68f",
  infall: "#ff7468",
};

/** CSS custom properties for the dark theme, set on each page's root element. */
export const themeVars = (accent: SimAccentId): React.CSSProperties =>
  ({
    "--sim-bg": "#050508",
    "--sim-surface": "rgba(15, 16, 24, 0.78)",
    "--sim-surface-solid": "#0c0d14",
    "--sim-border": "rgba(255, 255, 255, 0.09)",
    "--sim-text": "#ece8e1",
    "--sim-body": "#c9c5cd",
    "--sim-muted": "#9a98a3",
    "--sim-faint": "#64636e",
    "--sim-accent": ACCENTS[accent],
  }) as React.CSSProperties;

export const fontVars = `${serif.variable} ${mono.variable}`;

// Tailwind arbitrary-property helpers
export const SERIF = "[font-family:var(--font-sim-serif),Georgia,serif]";
export const MONO = "[font-family:var(--font-sim-mono),ui-monospace,monospace]";
export const SANS = "[font-family:var(--font-roboto),Roboto,sans-serif]";
