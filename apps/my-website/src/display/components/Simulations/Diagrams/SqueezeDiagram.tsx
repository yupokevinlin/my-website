import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { MONO, SANS } from "../theme";
import { C, LABEL } from "./shared";

// Lesson 2: the Schwarzschild radius of familiar objects. Ordinary bodies are
// squeezed (on a log scale) down to their Schwarzschild radius; the real
// black holes are drawn to scale against an orbit in our Solar System.

interface Body {
  id: string;
  name: string;
  mass: string;
  /** Radius in km: the body's real radius, or the orbit it is compared with. */
  radius: number;
  /** Schwarzschild radius in km. */
  rs: number;
  mode: "squeeze" | "compare";
  colors: [string, string];
  compareLabel?: string;
  verdict: string;
}

const BODIES: Array<Body> = [
  { id: "earth", name: "Earth", mass: "1 Earth", radius: 6371, rs: 8.87e-6, mode: "squeeze", colors: ["#8fd3ff", "#1f4f8a"], verdict: "The whole Earth squeezed to the size of a marble." },
  { id: "sun", name: "Sun", mass: "1 Sun", radius: 696000, rs: 2.95, mode: "squeeze", colors: ["#fff1c9", "#e07b24"], verdict: "The Sun squeezed into a ball 6 km across, about the size of a small town." },
  { id: "sgr", name: "Sagittarius A*", mass: "4.3 million Suns", radius: 5.79e7, rs: 1.27e7, mode: "compare", colors: ["#fff1c9", "#e07b24"], compareLabel: "Mercury's orbit", verdict: "The black hole at the centre of the Milky Way would fit well inside Mercury's orbit." },
  { id: "m87", name: "M87*", mass: "6.5 billion Suns", radius: 5.9e9, rs: 1.92e10, mode: "compare", colors: ["#fff1c9", "#e07b24"], compareLabel: "Pluto's orbit", verdict: "The first black hole ever photographed: its horizon is three times wider than Pluto's orbit." },
];

const R_MAX = 120;
const CX = 300;
const CY = 140;

const group3 = (n: number): string => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Human-readable length from km, from millimetres to billions of km. */
const formatKm = (km: number): string => {
  if (km >= 1e9) return `${(km / 1e9).toFixed(1)} billion km`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)} million km`;
  if (km >= 100) return `${group3(km)} km`;
  if (km >= 1) return `${km.toFixed(2)} km`;
  if (km >= 1e-3) return `${(km * 1e3).toFixed(1)} m`;
  return `${(km * 1e6).toFixed(1)} mm`;
};

const BodyView: React.FC<{ body: Body; run: number }> = ({ body, run }) => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // 0 = real size, 1 = squeezed to the Schwarzschild radius (log scale).
  const squeeze = useMotionValue(0);

  useEffect(() => {
    if (!inView) return undefined;
    squeeze.set(0);
    const controls = animate(squeeze, 1, { duration: body.mode === "squeeze" ? 2.6 : 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.4 });
    return () => controls.stop();
  }, [inView, run, squeeze, body.mode]);

  const squeezing = body.mode === "squeeze";
  const ratio = body.rs / body.radius;
  const scale = R_MAX / Math.max(body.rs, body.radius);
  const bodyR = useTransform(squeeze, (s) => Math.max(2.5, R_MAX * Math.pow(ratio, s)));
  const bodyOpacity = useTransform(squeeze, (s) => 1 - Math.max(0, (s - 0.85) / 0.15));
  const holeR = useTransform(squeeze, (s) => (squeezing ? (s > 0.98 ? 3 : 0) : body.rs * scale * s));
  const ringR = useTransform(holeR, (r) => r + 2.5);
  const ringOpacity = useTransform(holeR, (r) => (r > 0 ? 0.9 : 0));
  const glowR = useTransform(holeR, (r) => (r > 0 ? Math.max(14, r * 1.8) : 0));
  const shown = useTransform(squeeze, (s) => formatKm(squeezing ? body.radius * Math.pow(ratio, s) : body.rs));

  return (
    <>
      <svg ref={ref} viewBox="0 0 600 280" className="w-full h-auto" role="img" aria-label={`${body.name} compared with its Schwarzschild radius`}>
        <defs>
          <radialGradient id={`sq-body-${body.id}`} cx="0.35" cy="0.32" r="0.75">
            <stop offset="0" stopColor={body.colors[0]}/>
            <stop offset="1" stopColor={body.colors[1]}/>
          </radialGradient>
          <radialGradient id="sq-glow">
            <stop offset="0.3" stopColor={C.accent} stopOpacity="0.55"/>
            <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
          </radialGradient>
        </defs>
        {squeezing ? (
          <>
            <circle cx={CX} cy={CY} r={R_MAX} fill="none" stroke={C.muted} strokeOpacity="0.45" strokeDasharray="3 6"/>
            <text x={CX} y={CY - R_MAX - 8} textAnchor="middle" className={LABEL} fontSize="11" fill={C.muted}>{`${body.name}'s real size`}</text>
            <motion.circle cx={CX} cy={CY} r={bodyR} fill={`url(#sq-body-${body.id})`} style={{ opacity: bodyOpacity }}/>
          </>
        ) : (
          <>
            <circle cx={CX} cy={CY} r={body.radius * scale} fill="none" stroke={C.light} strokeOpacity="0.7" strokeDasharray="4 5"/>
            <text x={CX} y={CY - body.radius * scale - 8} textAnchor="middle" className={LABEL} fontSize="12" fill={C.light}>{body.compareLabel}</text>
          </>
        )}
        <motion.circle cx={CX} cy={CY} r={glowR} fill="url(#sq-glow)"/>
        <motion.circle cx={CX} cy={CY} r={ringR} fill="none" stroke={C.hot} strokeWidth="1.5" style={{ opacity: ringOpacity }}/>
        <motion.circle cx={CX} cy={CY} r={holeR} fill="#000"/>
        <text x={CX} y="274" textAnchor="middle" className={LABEL} fontSize="12" fill={C.muted}>
          {squeezing ? "radius, squeezed on a log scale" : "event horizon, to scale"}
        </text>
      </svg>
      <div className="mt-[6px] flex flex-wrap items-baseline justify-between gap-x-[18px] gap-y-[6px]">
        <div className={clsx(MONO, "text-[13px]")} style={{ color: C.muted }}>
          {body.name} · {body.mass}
        </div>
        <motion.div className={clsx(MONO, "text-[18px] tabular-nums")} style={{ color: C.accent }}>{shown}</motion.div>
      </div>
      <p className={clsx(SANS, "mt-[6px] text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>{body.verdict}</p>
    </>
  );
};

const SqueezeDiagram: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [run, setRun] = useState<number>(0);
  const tab = "btn-base rounded-full px-[12px] py-[6px] text-[12px] cursor-pointer transition-colors";
  return (
    <div>
      <div className="flex flex-wrap items-center gap-[8px] mb-[12px]">
        {BODIES.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className={clsx(tab, SANS)}
            style={{
              border: `1px solid ${i === index ? C.accent : "var(--sim-border)"}`,
              background: i === index ? "rgba(242,166,90,0.12)" : "transparent",
              color: i === index ? C.text : C.muted,
            }}
            onClick={() => (i === index ? setRun((r) => r + 1) : setIndex(i))}
          >
            {b.name}
          </button>
        ))}
      </div>
      <BodyView key={BODIES[index].id} body={BODIES[index]} run={run}/>
    </div>
  );
};

export default SqueezeDiagram;
