import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { horizonRadius, iscoRadius } from "../../../../simulations/sims/kerr";
import { presetHref } from "../content";
import { useGuideText } from "../useGuide";
import { useLocale } from "../../../../i18n/LocaleContext";
import { MONO, SANS } from "../theme";
import { useDiagramClock } from "../motion";
import { C, LABEL, f1 } from "./shared";

// Lesson 9: a slice through a Kerr black hole (G = c = M = 1). The slider sets
// the spin a; the horizon r₊, the ergosphere r_E(θ) = 1 + √(1 − a²cos²θ) and
// the inner edges (ISCO) of discs orbiting with and against the spin follow,
// using the same formulas as the simulation.

const CX = 320;
const CY = 150;
const S = 26;
const R_OUT = 11.2;

const ergoPath = (a: number): string => {
  let d = "";
  for (let i = 0; i <= 72; i++) {
    const th = (2 * Math.PI * i) / 72;
    const r = 1 + Math.sqrt(Math.max(0, 1 - a * a * Math.cos(th) ** 2));
    d += `${i === 0 ? "M" : "L"}${f1(CX + r * Math.sin(th) * S)} ${f1(CY - r * Math.cos(th) * S)}`;
  }
  return `${d}Z`;
};

/** Fraction of rest mass radiated by gas reaching the ISCO: 1 − √(1 − 2/(3 r_isco)). */
const efficiency = (r: number): number => 1 - Math.sqrt(1 - 2 / (3 * r));

const SpinDiagram: React.FC = () => {
  const text = useGuideText().diagrams.spin;
  const locale = useLocale();
  const [spin, setSpin] = useState<number>(0.215);
  const { ref, t } = useDiagramClock();
  const a = useSpring(spin, { stiffness: 120, damping: 22 });
  useEffect(() => {
    a.set(spin);
  }, [spin, a]);

  const horizon = useTransform(a, (v) => horizonRadius(v) * S);
  const ergo = useTransform(a, ergoPath);
  const proEdge = useTransform(a, (v) => CX + iscoRadius(v, 1) * S);
  const proWidth = useTransform(proEdge, (x) => CX + R_OUT * S - x);
  const retroEdge = useTransform(a, (v) => CX - iscoRadius(v, -1) * S);
  const retroWidth = useTransform(retroEdge, (x) => x - (CX - R_OUT * S));
  // Frame dragging, drawn as dots carried around the hole faster with more spin.
  const drag = useTransform([t, a], ([s, v]: Array<number>) => s * v * 2.4);
  const dots = [0, 1, 2, 3, 4, 5].map((i) => i * (Math.PI / 3));

  const proIsco = iscoRadius(spin, 1);
  const stats: Array<[string, string]> = [
    [text.horizon, `${horizonRadius(spin).toFixed(3)} M`],
    [text.iscoWith, `${proIsco.toFixed(2)} M`],
    [text.iscoAgainst, `${iscoRadius(spin, -1).toFixed(2)} M`],
    [text.efficiency, `${(efficiency(proIsco) * 100).toFixed(1)}%`],
  ];

  return (
    <div>
      <label className={clsx(SANS, "flex flex-wrap items-center gap-x-[14px] gap-y-[6px] text-[13px]")} style={{ color: C.muted }}>
        <span>{text.spin}</span>
        <input
          type="range"
          min={0}
          max={0.998}
          step={0.001}
          value={spin}
          onChange={(e) => setSpin(Number(e.target.value))}
          className="flex-1 min-w-[160px] cursor-pointer"
          style={{ accentColor: C.accent }}
          aria-label={text.spinAria}
        />
        <span className={clsx(MONO, "w-[52px] text-right tabular-nums text-[15px]")} style={{ color: C.accent }}>{spin.toFixed(3)}</span>
      </label>
      <svg ref={ref} viewBox="0 0 640 300" className="mt-[10px] w-full h-auto" role="img" aria-label={text.aria}>
        <defs>
          <linearGradient id="sp-pro" x1="0" x2="1">
            <stop offset="0" stopColor={C.hot}/>
            <stop offset="1" stopColor={C.ember} stopOpacity="0.5"/>
          </linearGradient>
          <linearGradient id="sp-retro" x1="1" x2="0">
            <stop offset="0" stopColor={C.hot}/>
            <stop offset="1" stopColor={C.ember} stopOpacity="0.5"/>
          </linearGradient>
        </defs>
        <line x1="20" x2="620" y1={CY} y2={CY} stroke="rgba(255,255,255,0.1)"/>
        <line x1={CX} x2={CX} y1="22" y2="278" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 5"/>

        <motion.rect x={proEdge} y={CY - 4} width={proWidth} height="8" rx="4" fill="url(#sp-pro)"/>
        <motion.rect x={CX - R_OUT * S} y={CY - 4} width={retroWidth} height="8" rx="4" fill="url(#sp-retro)"/>

        <motion.path d={ergo} fill={C.accent} fillOpacity="0.1" stroke={C.accent} strokeOpacity="0.7" strokeDasharray="4 4"/>
        <motion.circle cx={CX} cy={CY} r={horizon} fill="#000" stroke={C.hot} strokeOpacity="0.5"/>
        {dots.map((phase) => (
          <DragDot key={phase} drag={drag} phase={phase}/>
        ))}

        <text x="620" y={CY - 16} textAnchor="end" className={LABEL} fontSize="11" fill={C.text}>{text.withSpin}</text>
        <text x="20" y={CY - 16} className={LABEL} fontSize="11" fill={C.text}>{text.againstSpin}</text>
        <motion.text x={proEdge} y={CY + 28} textAnchor="middle" className={LABEL} fontSize="10" fill={C.light}>{text.isco}</motion.text>
        <motion.text x={retroEdge} y={CY + 28} textAnchor="middle" className={LABEL} fontSize="10" fill={C.light}>{text.isco}</motion.text>
        <text x={CX} y="290" textAnchor="middle" className={LABEL} fontSize="11" fill={C.accent}>{text.legend}</text>
        <text x={CX} y="16" textAnchor="middle" className={LABEL} fontSize="10" fill={C.faint}>{text.axis}</text>
      </svg>
      <dl className="mt-[8px] grid grid-cols-2 gap-x-[18px] gap-y-[6px] sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt className={clsx(SANS, "text-[11.5px] font-light")} style={{ color: C.muted }}>{k}</dt>
            <dd className={clsx(MONO, "text-[14px] tabular-nums")} style={{ color: C.text }}>{v}</dd>
          </div>
        ))}
      </dl>
      <a
        href={presetHref("blackhole", { spin: Number(spin.toFixed(3)) }, locale)}
        className={clsx(SANS, "link-base mt-[12px] inline-block text-[13.5px] underline underline-offset-[3px]")}
        style={{ color: C.accent }}
      >
        {text.open(spin.toFixed(3))}
      </a>
    </div>
  );
};

const DragDot: React.FC<{ drag: MotionValue<number>; phase: number }> = ({ drag, phase }) => {
  const x = useTransform(drag, (s) => CX + 2.6 * S * Math.cos(s + phase));
  const opacity = useTransform(drag, (s) => 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s + phase)));
  return <motion.circle cx={x} cy={CY} r="2.6" fill={C.hot} style={{ opacity }}/>;
};

export default SpinDiagram;
