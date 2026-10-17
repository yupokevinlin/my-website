import { Inter } from "next/font/google";
import { mono, serif } from "../display/components/Simulations/theme";

// Inter for reading; the ray-tracing guide's Cormorant Garamond and IBM Plex
// Mono for headings and small labels, so the whole site reads as one.
export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-sans",
});

export const fontVars = `${sans.variable} ${serif.variable} ${mono.variable}`;

// Tailwind arbitrary-property helpers
export const SERIF = "[font-family:var(--font-sim-serif),Georgia,serif]";
export const MONO = "[font-family:var(--font-sim-mono),ui-monospace,monospace]";
