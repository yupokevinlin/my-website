import React from "react";

// A tiled field of faint stars drawn with CSS gradients (no image download).
// Deterministic, so server and client render the same markup.
const makeLayer = (count: number, seed: number, tile: number, maxSize: number, maxAlpha: number): string => {
  let s = seed;
  const rnd = (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const dots: Array<string> = [];
  for (let i = 0; i < count; i++) {
    const x = (rnd() * tile).toFixed(1);
    const y = (rnd() * tile).toFixed(1);
    const r = (0.4 + rnd() * maxSize).toFixed(2);
    const a = (0.25 + rnd() * maxAlpha).toFixed(2);
    const warm = rnd() < 0.25;
    const color = warm ? `rgba(255,214,170,${a})` : `rgba(220,230,255,${a})`;
    dots.push(`radial-gradient(${r}px ${r}px at ${x}px ${y}px, ${color}, transparent)`);
  }
  return dots.join(",");
};

const SMALL = makeLayer(70, 7, 420, 0.7, 0.45);
const LARGE = makeLayer(14, 99, 900, 1.3, 0.7);

export interface StarfieldProps {
  className?: string;
  /** Soft coloured glow behind the stars, e.g. "rgba(242,166,90,0.08)". */
  glow?: string;
}

const Starfield: React.FC<StarfieldProps> = ({ className, glow }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    style={{
      backgroundImage: `${LARGE},${SMALL}${glow ? `,radial-gradient(60% 50% at 70% 30%, ${glow}, transparent)` : ""}`,
      backgroundSize: `900px 900px, 420px 420px${glow ? ", 100% 100%" : ""}`,
    }}
  />
);

export default Starfield;
