import React from "react";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useDiagramClock } from "../motion";
import { C, LABEL, seeded } from "./shared";
import { useGuideText } from "../useGuide";

// Lesson 6: an accretion disc seen from above at a slight tilt. Each ring
// turns at its Keplerian rate (period ∝ r^1.5); inside the ISCO, gas spirals
// into the horizon.

const CX = 320;
const CY = 165;
const TILT = 0.45;
const RS = 24;
const ISCO = 3 * RS;
const T_ISCO = 2.6;

const rnd = seeded(5);
const RINGS = Array.from({ length: 15 }, (_, i) => {
  const r = ISCO + 6 + i * 14;
  const k = i / 14;
  // hot white-yellow inside, deep orange outside
  const color = `rgb(${255}, ${Math.round(238 - 120 * k)}, ${Math.round(200 - 170 * k)})`;
  const dash = Array.from({ length: 6 }, () => Math.round(6 + rnd() * 40)).join(" ");
  return { r, color, dash, opacity: 0.95 - 0.6 * k, width: 4.5 - 2 * k, phase: rnd() * 360 };
});

const Ring: React.FC<{ t: MotionValue<number>; ring: (typeof RINGS)[number] }> = ({ t, ring }) => {
  const period = T_ISCO * Math.pow(ring.r / ISCO, 1.5);
  const rotate = useTransform(t, (s) => ring.phase - (360 * s) / period);
  return (
    <motion.circle
      cx="0"
      cy="0"
      r={ring.r}
      fill="none"
      stroke={ring.color}
      strokeOpacity={ring.opacity}
      strokeWidth={ring.width}
      strokeDasharray={ring.dash}
      style={{ rotate }}
    />
  );
};

// One clump of gas plunging from the ISCO to the horizon, then repeating.
const PLUNGE = 3.2;
const Plunge: React.FC<{ t: MotionValue<number>; delay: number }> = ({ t, delay }) => {
  const k = useTransform(t, (s) => ((s + delay) % PLUNGE) / PLUNGE);
  const r = useTransform(k, (v) => ISCO - (ISCO - RS) * Math.pow(v, 1.6));
  const a = useTransform(k, (v) => -(v * 2.2 * Math.PI + v * v * 3 * Math.PI) + delay);
  const cx = useTransform([r, a], ([rr, aa]: Array<number>) => rr * Math.cos(aa));
  const cy = useTransform([r, a], ([rr, aa]: Array<number>) => rr * Math.sin(aa));
  const opacity = useTransform(k, (v) => Math.min(1, v * 6) * (1 - Math.pow(v, 6)));
  return <motion.circle cx={cx} cy={cy} r="3.2" fill={C.hot} style={{ opacity }}/>;
};

const AccretionDiagram: React.FC = () => {
  const text = useGuideText().diagrams.accretion;
  const { ref, t } = useDiagramClock();
  return (
    <svg ref={ref} viewBox="0 0 640 330" className="w-full h-auto" role="img" aria-label={text.aria}>
      <defs>
        <radialGradient id="ac-glow" cx={CX} cy={CY} r="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.accent} stopOpacity="0.28"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx={CX} cy={CY} rx="300" ry={300 * TILT} fill="url(#ac-glow)"/>
      <g transform={`translate(${CX} ${CY}) scale(1 ${TILT})`}>
        {RINGS.map((ring) => (
          <Ring key={ring.r} t={t} ring={ring}/>
        ))}
        <circle cx="0" cy="0" r={ISCO} fill="none" stroke={C.light} strokeOpacity="0.8" strokeDasharray="4 5" vectorEffect="non-scaling-stroke"/>
        <Plunge t={t} delay={0}/>
        <Plunge t={t} delay={1.1}/>
        <Plunge t={t} delay={2.2}/>
      </g>
      <circle cx={CX} cy={CY} r={RS} fill="#000" stroke={C.accent} strokeOpacity="0.4"/>

      <line x1={CX + ISCO * 0.55} y1={CY - ISCO * TILT * 0.84} x2={CX + 70} y2="62" stroke={C.light} strokeOpacity="0.6"/>
      <text x={CX + 74} y="58" className={LABEL} fontSize="11" fill={C.light}>{text.isco} <tspan style={{ textTransform: "none" }}>rₛ</tspan></text>
      <text x="22" y="40" className={LABEL} fontSize="11" fill={C.muted}>{text.outer}</text>
      <text x="618" y="300" textAnchor="end" className={LABEL} fontSize="11" fill={C.hot}>{text.inner}</text>    </svg>
  );
};

export default AccretionDiagram;
