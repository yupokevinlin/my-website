import clsx from "clsx";
import { MONO } from "../theme";

// Colours and helpers shared by the lesson diagrams.

export const C = {
  accent: "#f2a65a",
  hot: "#ffe3bd",
  ember: "#c46e2a",
  light: "#6cc8ff",
  text: "#ece8e1",
  muted: "#9a98a3",
  faint: "#64636e",
};

/** SVG label style; sizes are in viewBox units. */
export const LABEL = clsx(MONO, "uppercase tracking-[0.12em]");

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
/** 0 → 1 as v goes from a to b, clamped. */
export const ramp = (v: number, a: number, b: number): number => clamp((v - a) / (b - a), 0, 1);
export const smooth = (v: number): number => v * v * (3 - 2 * v);

/** A seeded pseudo-random generator, so server and client draw the same figure. */
export const seeded = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const f1 = (v: number): string => v.toFixed(1);

/** SVG polyline path through points. */
export const polyline = (pts: Array<[number, number]>): string =>
  pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${f1(x)} ${f1(y)}`).join("");
