import React from "react";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useDiagramClock } from "../motion";
import { C, LABEL } from "./shared";
import { useGuideText } from "../useGuide";

// Lesson 10: tidal stretching. The same astronaut falls into a black hole of
// 10 Suns (stretched long before the horizon) and into Sagittarius A*
// (crosses the horizon intact, since tides there are ~10¹¹ times weaker).

const PERIOD = 4.6;
const FALL = 0.82;

const Astronaut: React.FC<{ t: MotionValue<number>; cx: number; y0: number; y1: number; stretch: boolean }> = ({ t, cx, y0, y1, stretch }) => {
  const k = useTransform(t, (s) => Math.min(1, (s % PERIOD) / (PERIOD * FALL)));
  const y = useTransform(k, (v) => y0 + (y1 - y0) * v * v);
  const e = useTransform(k, (v) => (stretch ? v ** 3 : 0));
  const scaleY = useTransform(e, (v) => 1 + 2.6 * v);
  const scaleX = useTransform(e, (v) => 1 - 0.55 * v);
  const opacity = useTransform(t, (s) => {
    const p = (s % PERIOD) / PERIOD;
    return Math.min(1, p * 12, (1 - p) * 12);
  });
  // Tidal arrows: outward along the fall, inward across it.
  const half = useTransform(scaleY, (v) => 24 * v);
  const up = useTransform([y, half, e], ([yy, h, v]: Array<number>) => `M${cx} ${yy - h - 4}L${cx} ${yy - h - 10 - 26 * v}`);
  const down = useTransform([y, half, e], ([yy, h, v]: Array<number>) => `M${cx} ${yy + h + 4}L${cx} ${yy + h + 10 + 30 * v}`);
  const sides = useTransform([y, e], ([yy, v]: Array<number>) => {
    const w = 9 * (1 - 0.55 * v) + 4;
    const l = 8 + 12 * v;
    return `M${cx - w - l} ${yy}L${cx - w} ${yy}M${cx + w + l} ${yy}L${cx + w} ${yy}`;
  });
  return (
    <motion.g style={{ opacity }}>
      <motion.g style={{ y, scaleX, scaleY }}>
        <circle cx={cx} cy={-15} r="6" fill="#dfe4f2"/>
        <rect x={cx - 8} y={-8} width="16" height="30" rx="7" fill="#dfe4f2"/>
      </motion.g>
      {stretch && (
        <g stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <motion.path d={up}/>
          <motion.path d={down}/>
          <motion.path d={sides} strokeOpacity="0.8"/>
        </g>
      )}
    </motion.g>
  );
};

const TidesDiagram: React.FC = () => {
  const text = useGuideText().diagrams.tides;
  const { ref, t } = useDiagramClock();
  return (
    <svg ref={ref} viewBox="0 0 640 330" className="w-full h-auto" role="img" aria-label={text.aria}>
      <defs>
        <radialGradient id="td-small" cx="160" cy="330" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor={C.accent} stopOpacity="0.45"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="td-big" x1="0" x2="0" y1="250" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.accent} stopOpacity="0"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0.35"/>
        </linearGradient>
      </defs>
      <line x1="320" x2="320" y1="20" y2="310" stroke="rgba(255,255,255,0.08)"/>

      <text x="160" y="22" textAnchor="middle" className={LABEL} fontSize="12" fill={C.text}>{text.small}</text>
      <text x="160" y="39" textAnchor="middle" className={LABEL} fontSize="10" fill={C.muted}>{text.smallHorizon}</text>
      <Astronaut t={t} cx={160} y0={70} y1={262} stretch/>
      <circle cx="160" cy="330" r="80" fill="url(#td-small)"/>
      <circle cx="160" cy="330" r="46" fill="#000" stroke={C.hot} strokeOpacity="0.6"/>

      <text x="480" y="22" textAnchor="middle" className={LABEL} fontSize="12" fill={C.text}>{text.large}</text>
      <text x="480" y="39" textAnchor="middle" className={LABEL} fontSize="10" fill={C.muted}>{text.largeHorizon}</text>
      <Astronaut t={t} cx={480} y0={70} y1={300} stretch={false}/>
      <rect x="330" y="250" width="300" height="40" fill="url(#td-big)"/>
      <rect x="330" y="288" width="300" height="42" fill="#000"/>
      <line x1="330" x2="630" y1="288" y2="288" stroke={C.hot} strokeOpacity="0.6"/>    </svg>
  );
};

export default TidesDiagram;
