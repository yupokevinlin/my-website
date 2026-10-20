import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { MONO, SANS } from "../theme";
import { C, LABEL } from "./shared";
import { useGuideText } from "../useGuide";
import { useLocale } from "../../../../i18n/LocaleContext";
import { LOCALE_TAGS } from "../../../../i18n/locales";
import type { GuideText } from "../../../../i18n/messages/guide/en";

// Lesson 2: the Schwarzschild radius of familiar objects. Ordinary bodies are
// squeezed (on a log scale) down to their Schwarzschild radius; the real
// black holes are drawn to scale against an orbit in our Solar System.

// Each body's name, mass, comparison and verdict are in the dictionary
// (diagrams.squeeze.bodies), by id
interface Body {
  id: "earth" | "sun" | "sgr" | "m87";
  /** Radius in km: the body's real radius, or the orbit it is compared with. */
  radius: number;
  /** Schwarzschild radius in km. */
  rs: number;
  mode: "squeeze" | "compare";
  colors: [string, string];
}

const BODIES: Array<Body> = [
  { id: "earth", radius: 6371, rs: 8.87e-6, mode: "squeeze", colors: ["#8fd3ff", "#1f4f8a"] },
  { id: "sun", radius: 696000, rs: 2.95, mode: "squeeze", colors: ["#fff1c9", "#e07b24"] },
  { id: "sgr", radius: 5.79e7, rs: 1.27e7, mode: "compare", colors: ["#fff1c9", "#e07b24"] },
  { id: "m87", radius: 5.9e9, rs: 1.92e10, mode: "compare", colors: ["#fff1c9", "#e07b24"] },
];

const R_MAX = 120;
const CX = 300;
const CY = 140;

type SqueezeText = GuideText["diagrams"]["squeeze"];

/** Human-readable length from km, in the page's language: the dictionary
 * picks the units, and numbers are written the way the language writes them
 * (12,742 / 12 742). */
const formatKm = (km: number, text: SqueezeText, tag: string): string =>
  text.length(km, (value, digits) => new Intl.NumberFormat(tag, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value));

const BodyView: React.FC<{ body: Body; run: number }> = ({ body, run }) => {
  const text = useGuideText().diagrams.squeeze;
  const tag = LOCALE_TAGS[useLocale()];
  const words = text.bodies[body.id];
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
  const shown = useTransform(squeeze, (s) => formatKm(squeezing ? body.radius * Math.pow(ratio, s) : body.rs, text, tag));

  return (
    <>
      <svg ref={ref} viewBox="0 0 600 280" className="w-full h-auto" role="img" aria-label={text.aria(words.name)}>
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
            <text x={CX} y={CY - R_MAX - 8} textAnchor="middle" className={LABEL} fontSize="11" fill={C.muted}>{text.realSize(words.name)}</text>
            <motion.circle cx={CX} cy={CY} r={bodyR} fill={`url(#sq-body-${body.id})`} style={{ opacity: bodyOpacity }}/>
          </>
        ) : (
          <>
            <circle cx={CX} cy={CY} r={body.radius * scale} fill="none" stroke={C.light} strokeOpacity="0.7" strokeDasharray="4 5"/>
            <text x={CX} y={CY - body.radius * scale - 8} textAnchor="middle" className={LABEL} fontSize="12" fill={C.light}>{"compareLabel" in words ? words.compareLabel : ""}</text>
          </>
        )}
        <motion.circle cx={CX} cy={CY} r={glowR} fill="url(#sq-glow)"/>
        <motion.circle cx={CX} cy={CY} r={ringR} fill="none" stroke={C.hot} strokeWidth="1.5" style={{ opacity: ringOpacity }}/>
        <motion.circle cx={CX} cy={CY} r={holeR} fill="#000"/>
        <text x={CX} y="274" textAnchor="middle" className={LABEL} fontSize="12" fill={C.muted}>
          {squeezing ? text.squeezed : text.toScale}
        </text>
      </svg>
      <div className="mt-[6px] flex flex-wrap items-baseline justify-between gap-x-[18px] gap-y-[6px]">
        <div className={clsx(MONO, "text-[13px]")} style={{ color: C.muted }}>
          {words.name} · {words.mass}
        </div>
        <motion.div className={clsx(MONO, "text-[18px] tabular-nums")} style={{ color: C.accent }}>{shown}</motion.div>
      </div>
      <p className={clsx(SANS, "mt-[6px] text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>{words.verdict}</p>
    </>
  );
};

const SqueezeDiagram: React.FC = () => {
  const { bodies } = useGuideText().diagrams.squeeze;
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
            {bodies[b.id].name}
          </button>
        ))}
      </div>
      <BodyView key={BODIES[index].id} body={BODIES[index]} run={run}/>
    </div>
  );
};

export default SqueezeDiagram;
