import React, { useEffect } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { EASE, useDiagramClock } from "../motion";
import { C, LABEL, f1 } from "./shared";
import { useGuideText } from "../useGuide";

// Lesson 1: the rubber-sheet picture. A grid sags into a well around a mass
// (the dent deepens when the figure scrolls into view) and a moon circles it.

const N = 15;
const SAMPLES = 48;
const CX = 300;
const CY = 150;

const depthAt = (u: number, v: number): number => {
  const r = Math.hypot(u, v);
  return Math.max(0, 0.055 * (1 / Math.sqrt(r * r + 0.012) - 1 / Math.sqrt(1.012)));
};

/** Sheet coordinates (u, v in −1..1, v = −1 far) to screen, with the dent scaled by k. */
const project = (u: number, v: number, k: number): [number, number] => {
  const persp = 0.7 + 0.3 * ((v + 1) / 2);
  return [CX + u * 270 * persp, CY + v * 95 + depthAt(u, v) * 190 * k];
};

const gridPath = (k: number, alongU: boolean): string => {
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = -1 + (2 * i) / (N - 1);
    for (let j = 0; j <= SAMPLES; j++) {
      const b = -1 + (2 * j) / SAMPLES;
      const [x, y] = alongU ? project(b, a, k) : project(a, b, k);
      d += `${j === 0 ? "M" : "L"}${f1(x)} ${f1(y)}`;
    }
  }
  return d;
};

const ORBIT = 0.42;
const PERIOD = 6;

const CurvedSpaceDiagram: React.FC = () => {
  const text = useGuideText().diagrams.curvedSpace;
  const { ref, t } = useDiagramClock();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const dent = useMotionValue(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(dent, 1, { duration: 2.4, ease: EASE, delay: 0.3 });
    return () => controls.stop();
  }, [inView, dent]);

  const rows = useTransform(dent, (k) => gridPath(k, true));
  const cols = useTransform(dent, (k) => gridPath(k, false));
  const massY = useTransform(dent, (k) => project(0, 0, k)[1] - 14);
  const massR = useTransform(dent, (k) => 8 + 10 * k);
  const glowR = useTransform(massR, (r) => r * 3.2);
  const angle = (s: number): number => (2 * Math.PI * s) / PERIOD;
  const moonX = useTransform([t, dent], ([s, k]: Array<number>) => project(ORBIT * Math.cos(angle(s)), ORBIT * Math.sin(angle(s)), k)[0]);
  const moonY = useTransform([t, dent], ([s, k]: Array<number>) => project(ORBIT * Math.cos(angle(s)), ORBIT * Math.sin(angle(s)), k)[1] - 6);
  const orbit = useTransform(dent, (k) => {
    let d = "";
    for (let j = 0; j <= 64; j++) {
      const a = (2 * Math.PI * j) / 64;
      const [x, y] = project(ORBIT * Math.cos(a), ORBIT * Math.sin(a), k);
      d += `${j === 0 ? "M" : "L"}${f1(x)} ${f1(y - 6)}`;
    }
    return d;
  });

  return (
    <svg ref={ref} viewBox="0 0 600 330" className="w-full h-auto" role="img" aria-label={text.aria}>
      <defs>
        <radialGradient id="cs-mass" cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff4e0"/>
          <stop offset="0.5" stopColor={C.accent}/>
          <stop offset="1" stopColor="#7a3d12"/>
        </radialGradient>
        <radialGradient id="cs-glow">
          <stop offset="0" stopColor={C.accent} stopOpacity="0.35"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <motion.path d={cols} fill="none" stroke="#8f9bd6" strokeOpacity="0.32" strokeWidth="1"/>
      <motion.path d={rows} fill="none" stroke="#8f9bd6" strokeOpacity="0.32" strokeWidth="1"/>
      <motion.path d={orbit} fill="none" stroke={C.muted} strokeOpacity="0.55" strokeDasharray="3 5"/>
      <motion.circle cx={CX} cy={massY} r={glowR} fill="url(#cs-glow)"/>
      <motion.circle cx={CX} cy={massY} r={massR} fill="url(#cs-mass)"/>
      <motion.circle cx={moonX} cy={moonY} r="6" fill="#cfd6ee"/>
      <text x="300" y="318" textAnchor="middle" className={LABEL} fontSize="12" fill={C.muted}>{text.caption}</text>
    </svg>
  );
};

export default CurvedSpaceDiagram;
