import React from "react";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useDiagramClock } from "../motion";
import { C, LABEL, seeded } from "./shared";

// Lesson 11: the popular picture of Hawking radiation. Pairs of particles
// appear just outside the horizon; one falls in, the other escapes.

const CX = 300;
const CY = 150;
const R = 62;
const PERIOD = 5;

const rnd = seeded(23);
const PAIRS = Array.from({ length: 12 }, (_, i) => ({ angle: (i / 12) * 2 * Math.PI + rnd() * 0.4, delay: rnd() * PERIOD }));

const Pair: React.FC<{ t: MotionValue<number>; angle: number; delay: number }> = ({ t, angle, delay }) => {
  const k = useTransform(t, (s) => ((s + delay) % PERIOD) / PERIOD);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const outR = useTransform(k, (v) => R + 6 + 170 * v ** 1.3);
  const inR = useTransform(k, (v) => R + 6 - 30 * Math.min(1, v * 3));
  const outX = useTransform(outR, (r) => CX + r * cos);
  const outY = useTransform(outR, (r) => CY + r * sin);
  const inX = useTransform(inR, (r) => CX + r * cos);
  const inY = useTransform(inR, (r) => CY + r * sin);
  const outOpacity = useTransform(k, (v) => Math.min(1, v * 10) * (1 - v));
  const inOpacity = useTransform(k, (v) => Math.min(1, v * 10) * Math.max(0, 1 - v * 3));
  return (
    <>
      <motion.circle cx={inX} cy={inY} r="2.4" fill="#8f9bd6" style={{ opacity: inOpacity }}/>
      <motion.circle cx={outX} cy={outY} r="2.6" fill={C.hot} style={{ opacity: outOpacity }}/>
    </>
  );
};

const HawkingDiagram: React.FC = () => {
  const { ref, t } = useDiagramClock();
  return (
    <svg ref={ref} viewBox="0 0 600 300" className="w-full h-auto" role="img" aria-label="Particle pairs near a black hole's horizon; one of each pair escapes as Hawking radiation">
      <defs>
        <radialGradient id="hw-glow" cx={CX} cy={CY} r="140" gradientUnits="userSpaceOnUse">
          <stop offset="0.4" stopColor="#ffd9a0" stopOpacity="0.12"/>
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r="140" fill="url(#hw-glow)"/>
      {PAIRS.map((p) => (
        <Pair key={p.angle} t={t} angle={p.angle} delay={p.delay}/>
      ))}
      <circle cx={CX} cy={CY} r={R} fill="#000" stroke={C.hot} strokeOpacity="0.35"/>
      <text x="584" y="40" textAnchor="end" className={LABEL} fontSize="11" fill={C.hot}>escapes · Hawking radiation</text>
      <text x="16" y="284" className={LABEL} fontSize="11" fill="#8f9bd6">falls in · the hole loses mass</text>
    </svg>
  );
};

export default HawkingDiagram;
