import React from "react";
import { motion, useInView, useTransform } from "framer-motion";
import { EASE, useDiagramClock } from "../motion";
import { CRITICAL_B, schwarzschildRay } from "./geodesic";
import { C, LABEL, f1, polyline } from "./shared";

// Lesson 5: real light paths around a Schwarzschild black hole. Rays aimed
// inside the critical impact parameter b = √27 M are captured; one that just
// misses loops around the photon sphere first. A flash of light circles the
// photon sphere itself.

const CX = 430;
const CY = 200;
const S = 19;
const toScreen = (pts: Array<[number, number]>): Array<[number, number]> => pts.map(([x, y]) => [CX + x * S, CY - y * S]);

// Escaping rays are blue, the looping one amber, captured ones white.
const RAYS = [
  { b: 8.5, color: C.light },
  { b: 5.3, color: C.accent },
  { b: 5.1, color: C.text },
  { b: -6.4, color: C.light },
  { b: -3.6, color: C.text },
].map((r) => {
  const ray = schwarzschildRay(r.b, -23, 30);
  return { ...r, captured: ray.captured, d: polyline(toScreen(ray.points)) };
});

const PERIOD = 2.8;
const R_PH = 3 * S;

const PhotonSphereDiagram: React.FC = () => {
  const { ref, t } = useDiagramClock();
  // The rays run far outside the frame, so watch the figure, not the rays.
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const angle = useTransform(t, (s) => (2 * Math.PI * s) / PERIOD);
  const dotX = useTransform(angle, (a) => CX + R_PH * Math.cos(a));
  const dotY = useTransform(angle, (a) => CY - R_PH * Math.sin(a));
  const trail = useTransform(angle, (a) => {
    let d = "";
    for (let i = 0; i <= 24; i++) {
      const b = a - (i / 24) * 1.9;
      d += `${i === 0 ? "M" : "L"}${f1(CX + R_PH * Math.cos(b))} ${f1(CY - R_PH * Math.sin(b))}`;
    }
    return d;
  });
  const bc = CRITICAL_B * S;

  return (
    <svg ref={ref} viewBox="0 0 720 400" className="w-full h-auto" role="img" aria-label="Light rays bending around a black hole; some are captured, one loops around it">
      <defs>
        <radialGradient id="ps-glow" cx={CX} cy={CY} r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor={C.accent} stopOpacity="0.16"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="ps-trail" x1="0" x2="1">
          <stop offset="0" stopColor={C.hot}/>
          <stop offset="1" stopColor={C.hot} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <circle cx={CX} cy={CY} r="150" fill="url(#ps-glow)"/>

      {[-1, 1].map((s) => (
        <line key={s} x1="10" x2={CX} y1={CY - s * bc} y2={CY - s * bc} stroke={C.muted} strokeOpacity="0.45" strokeDasharray="2 6"/>
      ))}
      <text x="14" y={CY - bc - 8} className={LABEL} fontSize="11" fill={C.muted}>critical distance · 2.6 <tspan style={{ textTransform: "none" }}>rₛ</tspan></text>

      <motion.g initial="hidden" animate={seen ? "show" : "hidden"}>
        {RAYS.map((r, i) => (
          <motion.path
            key={r.b}
            d={r.d}
            fill="none"
            stroke={r.color}
            strokeOpacity={r.captured ? 0.6 : 0.9}
            strokeWidth="1.6"
            strokeLinecap="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2.4, ease: EASE, delay: 0.2 + i * 0.25 } } }}
          />
        ))}
      </motion.g>

      <circle cx={CX} cy={CY} r={R_PH} fill="none" stroke={C.muted} strokeOpacity="0.6" strokeDasharray="3 5"/>
      <circle cx={CX} cy={CY} r={2 * S} fill="#000" stroke={C.accent} strokeOpacity="0.4"/>
      <motion.path d={trail} fill="none" stroke={C.hot} strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round"/>
      <motion.circle cx={dotX} cy={dotY} r="4" fill={C.hot}/>

      <text x="14" y="24" className={LABEL} fontSize="11" fill={C.light}>light from far away →</text>
      <text x={CX + 62} y={CY + 152} className={LABEL} fontSize="11" fill={C.muted}>photon sphere · 1.5 <tspan style={{ textTransform: "none" }}>rₛ</tspan></text>
      <line x1={CX + R_PH * 0.64} y1={CY + R_PH * 0.77} x2={CX + 58} y2={CY + 140} stroke={C.muted} strokeOpacity="0.5"/>
      <text x={CX} y={CY + 4} textAnchor="middle" className={LABEL} fontSize="10" fill={C.faint}>horizon</text>
      <text x="706" y="390" textAnchor="end" className={LABEL} fontSize="11" fill={C.muted}>
        rays: <tspan fill={C.light}>escape</tspan> · <tspan fill={C.accent}>loop</tspan> · <tspan fill={C.text}>captured</tspan>
      </text>
    </svg>
  );
};

export default PhotonSphereDiagram;
