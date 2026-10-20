import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MotionValue, motion, useInView, useSpring, useTransform } from "framer-motion";
import { SANS } from "../theme";
import { C, LABEL, f1 } from "./shared";
import { useGuideText } from "../useGuide";

// Lesson 7: a thin disc around a black hole seen almost edge-on, without and
// with the bending of light. With gravity, the image of the far half of the
// disc rises into an arch over the shadow, a second image appears beneath it,
// and the shadow grows from the horizon's size to 2.6 times it.

const CX = 300;
const CY = 150;
const RS = 22;

const LANES = [100, 128, 156, 184, 212, 240].map((rx, i) => ({
  rx,
  ry: rx * 0.12,
  arch: 62 + i * 12,
  color: i < 2 ? C.hot : i < 4 ? "#f6c48a" : "#d98a4a",
  opacity: 0.95 - i * 0.11,
}));

type Lane = (typeof LANES)[number];

/** Point and derivative of a lane at angle θ, with the lensing lift scaled by g. */
const lanePoint = (lane: Lane, th: number, g: number): [number, number, number, number] => {
  const s = Math.sin(th);
  const c = Math.cos(th);
  const lift = g * (lane.arch - lane.ry);
  const far = s > 0 ? 1 : 0;
  return [
    CX + lane.rx * c,
    CY - lane.ry * s - far * lift * s ** 4,
    -lane.rx * s,
    -lane.ry * c - far * lift * 4 * s ** 3 * c,
  ];
};

/** Cubic Bézier path along θ from a to b, in n Hermite segments. */
const lanePath = (lane: Lane, a: number, b: number, g: number, n = 8): string => {
  const h = (b - a) / n;
  let [x0, y0, dx0, dy0] = lanePoint(lane, a, g);
  let d = `M${f1(x0)} ${f1(y0)}`;
  for (let i = 1; i <= n; i++) {
    const [x1, y1, dx1, dy1] = lanePoint(lane, a + i * h, g);
    d += `C${f1(x0 + (h / 3) * dx0)} ${f1(y0 + (h / 3) * dy0)} ${f1(x1 - (h / 3) * dx1)} ${f1(y1 - (h / 3) * dy1)} ${f1(x1)} ${f1(y1)}`;
    [x0, y0, dx0, dy0] = [x1, y1, dx1, dy1];
  }
  return d;
};

const FarLane: React.FC<{ lane: Lane; g: MotionValue<number> }> = ({ lane, g }) => {
  const d = useTransform(g, (v) => lanePath(lane, Math.PI, 0, v));
  return <motion.path d={d} fill="none" stroke={lane.color} strokeOpacity={lane.opacity} strokeWidth="8" strokeLinecap="round"/>;
};

const NearLane: React.FC<{ lane: Lane }> = ({ lane }) => (
  <path d={lanePath(lane, Math.PI, 2 * Math.PI, 0)} fill="none" stroke={lane.color} strokeOpacity={lane.opacity} strokeWidth="8" strokeLinecap="round"/>
);

const LensingDiagram: React.FC = () => {
  const text = useGuideText().diagrams.lensing;
  const [gravity, setGravity] = useState<boolean>(false);
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const g = useSpring(0, { stiffness: 40, damping: 14 });

  useEffect(() => {
    if (!inView) return undefined;
    const id = window.setTimeout(() => setGravity(true), 900);
    return () => window.clearTimeout(id);
  }, [inView]);

  useEffect(() => {
    g.set(gravity ? 1 : 0);
  }, [gravity, g]);

  const shadowR = useTransform(g, (v) => RS + v * (2.6 * RS - RS));
  const ringR = useTransform(shadowR, (r) => r + 1.5);
  const extra = useTransform(g, (v) => Math.max(0, Math.min(1, (v - 0.4) / 0.6)));
  const lowerD = useTransform(g, (v) => {
    const r = 2.6 * RS + 5;
    const span = 0.25 + 0.55 * v;
    const a0 = Math.PI / 2 - span;
    const a1 = Math.PI / 2 + span;
    return `M${f1(CX + r * Math.cos(a1))} ${f1(CY + r * Math.sin(a1))}A${r} ${r} 0 0 0 ${f1(CX + r * Math.cos(a0))} ${f1(CY + r * Math.sin(a0))}`;
  });

  const button = "btn-base rounded-full px-[14px] py-[6px] text-[12.5px] cursor-pointer transition-colors";
  const toggle = (on: boolean) => (
    <button
      type="button"
      className={clsx(button, SANS)}
      style={{
        border: `1px solid ${gravity === on ? C.accent : "var(--sim-border)"}`,
        background: gravity === on ? "rgba(242,166,90,0.12)" : "transparent",
        color: gravity === on ? C.text : C.muted,
      }}
      onClick={() => setGravity(on)}
    >
      {on ? text.withGravity : text.withoutGravity}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-[8px] mb-[8px]">
        {toggle(false)}
        {toggle(true)}
      </div>
      <svg ref={ref} viewBox="0 0 600 270" className="w-full h-auto" role="img" aria-label={text.aria}>
        <defs>
          <radialGradient id="ln-glow" cx={CX} cy={CY} r="220" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.accent} stopOpacity="0.22"/>
            <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx={CX} cy={CY} rx="280" ry="120" fill="url(#ln-glow)"/>
        {LANES.map((lane) => (
          <FarLane key={lane.rx} lane={lane} g={g}/>
        ))}
        <motion.path d={lowerD} fill="none" stroke={C.hot} strokeWidth="3" strokeLinecap="round" style={{ opacity: extra }}/>
        <motion.circle cx={CX} cy={CY} r={shadowR} fill="#000"/>
        <motion.circle cx={CX} cy={CY} r={ringR} fill="none" stroke="#fff6e6" strokeWidth="1.2" style={{ opacity: extra }}/>
        {LANES.map((lane) => (
          <NearLane key={lane.rx} lane={lane}/>
        ))}
        <motion.g style={{ opacity: extra }}>
          <text x="592" y="24" textAnchor="end" className={LABEL} fontSize="11" fill={C.muted}>{text.farSide1}</text>
          <text x="592" y="39" textAnchor="end" className={LABEL} fontSize="11" fill={C.muted}>{text.farSide2}</text>
          <text x={CX + 80} y={CY + 100} className={LABEL} fontSize="11" fill={C.muted}>{text.below}</text>
          <line x1={CX + 76} y1={CY + 95} x2={CX + 40} y2={CY + 66} stroke={C.muted} strokeOpacity="0.5"/>
        </motion.g>
      </svg>
    </div>
  );
};

export default LensingDiagram;
