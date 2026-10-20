import React from "react";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useDiagramClock } from "../motion";
import { C, LABEL, seeded } from "./shared";
import { useGuideText } from "../useGuide";

// Lesson 4: the river model of a black hole (Hamilton & Lisle). Space flows
// inwards at v = c·√(r_s/r), reaching c at the horizon; outward-aimed light
// moves at c − v relative to the hole. Units: r_s = 1, c = SPEED r_s/s.

const X0 = 40;
const S = 160;
const R_MAX = 3.4;
const SPEED = 0.7;
const x = (r: number): number => X0 + r * S;

// Infall from R_MAX at the local flow speed: r(τ) = (R^1.5 − 1.5τ)^(2/3).
const FALL = (2 / 3) * Math.pow(R_MAX, 1.5);
const fallRadius = (tau: number): number => Math.pow(Math.max(0, Math.pow(R_MAX, 1.5) - 1.5 * tau), 2 / 3);

const rnd = seeded(11);
const FLOW = Array.from({ length: 34 }, (_, i) => ({ y: 58 + (i % 6) * 22 + rnd() * 8, offset: rnd() * FALL }));

const FlowDot: React.FC<{ t: MotionValue<number>; y: number; offset: number }> = ({ t, y, offset }) => {
  const r = useTransform(t, (s) => fallRadius((s * SPEED + offset) % FALL));
  const x1 = useTransform(r, (v) => x(v));
  const x2 = useTransform(r, (v) => x(v) + 4 + 9 / Math.sqrt(Math.max(v, 0.15)));
  const opacity = useTransform(r, (v) => Math.min(1, (R_MAX - v) * 3) * Math.min(1, v * 4) * 0.7);
  return <motion.line x1={x1} x2={x2} y1={y} y2={y} stroke="#8f9bd6" strokeWidth="2" strokeLinecap="round" style={{ opacity }}/>;
};

// Outward-aimed light: dr/dτ = 1 − 1/√r, integrated once into a table.
const PHOTON_PERIOD = 6;
const lightTrack = (r0: number): Array<number> => {
  const out: Array<number> = [];
  let r = r0;
  for (let i = 0; i <= 600; i++) {
    out.push(r);
    const dt = (PHOTON_PERIOD * SPEED) / 600;
    r = Math.max(0, r + dt * (1 - 1 / Math.sqrt(Math.max(r, 1e-3))));
  }
  return out;
};
// Labels sit beside their photon's start, pointing away from the horizon;
// their text is in the dictionary (diagrams.river.photons), in this order.
const PHOTONS: Array<{ r0: number; anchor: "start" | "middle" | "end"; dx: number }> = [
  { r0: 2.2, anchor: "middle", dx: 0 },
  { r0: 1, anchor: "start", dx: 8 },
  { r0: 0.72, anchor: "end", dx: -8 },
];
const TRACKS = PHOTONS.map((p) => lightTrack(p.r0));

const Photon: React.FC<{ t: MotionValue<number>; track: Array<number>; photon: (typeof PHOTONS)[number]; label: string }> = ({ t, track, photon, label }) => {
  const k = useTransform(t, (s) => (s % PHOTON_PERIOD) / PHOTON_PERIOD);
  const r = useTransform(k, (v) => track[Math.min(track.length - 1, Math.floor(v * (track.length - 1)))]);
  const px = useTransform(r, (v) => x(v));
  const opacity = useTransform([k, r], ([v, rr]: Array<number>) => Math.min(1, v * 8, (1 - v) * 8, rr * 5));
  const tail = useTransform(px, (v) => v - 22);
  return (
    <>
      <motion.line x1={tail} x2={px} y1="218" y2="218" stroke={C.hot} strokeWidth="2.2" strokeLinecap="round" style={{ opacity }}/>
      <motion.path d="M-7 -5 L2 0 L-7 5 z" fill={C.hot} style={{ x: px, y: 218, opacity }}/>
      <text x={x(photon.r0) + photon.dx} y="246" textAnchor={photon.anchor} className={LABEL} fontSize="11" fill={C.muted}>{label}</text>
    </>
  );
};

const RiverDiagram: React.FC = () => {
  const text = useGuideText().diagrams.river;
  const { ref, t } = useDiagramClock();
  return (
    <svg ref={ref} viewBox="0 0 640 270" className="w-full h-auto" role="img" aria-label={text.aria}>
      <defs>
        <linearGradient id="rv-inside" x1={X0} x2={x(1)} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="1"/>
          <stop offset="1" stopColor="#000" stopOpacity="0.35"/>
        </linearGradient>
        <radialGradient id="rv-centre">
          <stop offset="0" stopColor={C.accent} stopOpacity="0.6"/>
          <stop offset="1" stopColor={C.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x={X0} y="34" width={S} height="200" fill="url(#rv-inside)"/>
      <circle cx={X0} cy="134" r="26" fill="url(#rv-centre)"/>
      <line x1={x(1)} x2={x(1)} y1="26" y2="234" stroke={C.accent} strokeDasharray="4 4"/>
      <text x={x(1)} y="18" textAnchor="middle" className={LABEL} fontSize="12" fill={C.accent}>{text.horizon}</text>

      {FLOW.map((f, i) => (
        <FlowDot key={i} t={t} y={f.y} offset={f.offset}/>
      ))}
      {PHOTONS.map((p, i) => (
        <Photon key={i} t={t} track={TRACKS[i]} photon={p} label={text.photons[i]}/>
      ))}

      <text x="600" y="48" textAnchor="end" className={LABEL} fontSize="11" fill="#8f9bd6">{text.flow}</text>
      <text x={X0 + 6} y="262" className={LABEL} fontSize="11" fill={C.faint}>{text.centre}</text>
      <text x="600" y="262" textAnchor="end" className={LABEL} fontSize="11" fill={C.faint}>{text.farAway}</text>
    </svg>
  );
};

export default RiverDiagram;
