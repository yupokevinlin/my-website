import React from "react";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useDiagramClock } from "../motion";
import { C, LABEL, ramp, smooth } from "./shared";

// Lesson 3: a massive star, its core collapse, the supernova and the black
// hole left behind, as a looping sequence driven by the diagram clock.

const PERIOD = 10;
const CX = 300;
const CY = 135;

const STAGES: Array<{ label: string; from: number; to: number }> = [
  { label: "Massive star", from: 0, to: 0.3 },
  { label: "Core collapse", from: 0.3, to: 0.42 },
  { label: "Supernova", from: 0.42, to: 0.62 },
  { label: "Black hole", from: 0.62, to: 1 },
];

const Stage: React.FC<{ p: MotionValue<number>; index: number }> = ({ p, index }) => {
  const s = STAGES[index];
  const opacity = useTransform(p, (v) => (v >= s.from && v < s.to ? 1 : 0.32));
  return (
    <motion.text x={75 + index * 150} y="282" textAnchor="middle" className={LABEL} fontSize="12" fill={C.text} style={{ opacity }}>
      {s.label}
    </motion.text>
  );
};

const CollapseDiagram: React.FC = () => {
  const { ref, t } = useDiagramClock();
  const p = useTransform(t, (s) => (s % PERIOD) / PERIOD);

  const starR = useTransform([p, t], ([v, s]: Array<number>) => {
    if (v < 0.3) return 92 + 3 * Math.sin(s * 2.4);
    if (v < 0.42) return 6 + 86 * Math.pow(1 - ramp(v, 0.3, 0.42), 2);
    return 6;
  });
  const starOpacity = useTransform(p, (v) => 1 - ramp(v, 0.42, 0.47));
  const starHue = useTransform(p, (v) => (v < 0.3 ? 0 : ramp(v, 0.3, 0.42)));
  const coreOpacity = useTransform(starHue, (k) => k);
  const flashR = useTransform(p, (v) => 8 + 270 * smooth(ramp(v, 0.42, 0.7)));
  const flashOpacity = useTransform(p, (v) => (v < 0.42 ? 0 : 1 - ramp(v, 0.42, 0.72)));
  const burstR = useTransform(p, (v) => 60 * Math.sin(Math.PI * ramp(v, 0.42, 0.52)));
  const nebulaR = useTransform(p, (v) => 120 + 90 * ramp(v, 0.5, 1));
  const nebulaOpacity = useTransform(p, (v) => 0.5 * ramp(v, 0.5, 0.62) * (1 - ramp(v, 0.92, 1)));
  const holeOpacity = useTransform(p, (v) => ramp(v, 0.55, 0.65) * (1 - ramp(v, 0.95, 1)));

  return (
    <svg ref={ref} viewBox="0 0 600 300" className="w-full h-auto" role="img" aria-label="A massive star collapses, explodes as a supernova and leaves a black hole">
      <defs>
        <radialGradient id="cl-star" cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fffaf0"/>
          <stop offset="0.45" stopColor="#ffd59a"/>
          <stop offset="1" stopColor="#e0702a"/>
        </radialGradient>
        <radialGradient id="cl-core">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset="1" stopColor="#9fd4ff"/>
        </radialGradient>
        <radialGradient id="cl-burst">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="0.4" stopColor="#bfe3ff" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#6cc8ff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cl-glow">
          <stop offset="0.25" stopColor={C.accent} stopOpacity="0.5"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>

      <motion.circle cx={CX} cy={CY} r={nebulaR} fill="none" stroke="#b394ff" strokeWidth="18" strokeOpacity="0.25" style={{ opacity: nebulaOpacity }}/>
      <motion.circle cx={CX} cy={CY} r={starR} fill="url(#cl-star)" style={{ opacity: starOpacity }}/>
      <motion.circle cx={CX} cy={CY} r={starR} fill="url(#cl-core)" style={{ opacity: coreOpacity }}/>
      <motion.circle cx={CX} cy={CY} r={flashR} fill="none" stroke="#cfe9ff" strokeWidth="3" style={{ opacity: flashOpacity }}/>
      <motion.circle cx={CX} cy={CY} r={burstR} fill="url(#cl-burst)"/>
      <motion.g style={{ opacity: holeOpacity }}>
        <circle cx={CX} cy={CY} r="44" fill="url(#cl-glow)"/>
        <circle cx={CX} cy={CY} r="17" fill="none" stroke={C.hot} strokeWidth="1.5"/>
        <circle cx={CX} cy={CY} r="15" fill="#000"/>
      </motion.g>

      <line x1="40" x2="560" y1="258" y2="258" stroke="rgba(255,255,255,0.12)"/>
      {STAGES.map((s, i) => (
        <Stage key={s.label} p={p} index={i}/>
      ))}
    </svg>
  );
};

export default CollapseDiagram;
