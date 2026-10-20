import React from "react";
import { Variants, motion } from "framer-motion";
import { EASE } from "../motion";
import { MONO } from "../theme";
import { useGuideText } from "../useGuide";

// Line-art figure: rays leave the camera and are bent by the black hole.
// Some escape to the stars, some arch over the top, one hits the disc,
// and those aimed close to the centre are captured, forming the shadow.
// The rays draw themselves in when the figure scrolls into view.

const RAYS: Array<{ d: string; stroke: string; opacity: number }> = [
  { d: "M95 182 C 300 120, 470 40, 780 20", stroke: "#6cc8ff", opacity: 0.85 },
  { d: "M95 186 C 330 150, 520 70, 610 120 C 650 145, 640 170, 620 186", stroke: "#f2a65a", opacity: 0.95 },
  { d: "M95 192 C 300 200, 450 196, 482 191", stroke: "#ffd9a0", opacity: 0.95 },
  { d: "M95 196 C 320 220, 470 230, 528 214", stroke: "#ece8e1", opacity: 0.55 },
  { d: "M95 200 C 320 260, 560 330, 780 360", stroke: "#6cc8ff", opacity: 0.6 },
];

const draw = (i: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.8, ease: EASE, delay: 0.3 + i * 0.22 }, opacity: { duration: 0.2, delay: 0.3 + i * 0.22 } } },
});

const appear = (delay: number): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, delay } },
});

const RayDiagram: React.FC = () => {
  const text = useGuideText().diagrams.ray;
  const label = `${MONO} text-[11px] tracking-[0.12em] uppercase`;
  return (
    <figure className="w-full">
      <motion.svg
        viewBox="0 0 800 380"
        className="w-full h-auto"
        role="img"
        aria-label={text.aria}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <defs>
          <radialGradient id="rd-glow" cx="560" cy="190" r="140" gradientUnits="userSpaceOnUse">
            <stop offset="0.25" stopColor="#f2a65a" stopOpacity="0.28"/>
            <stop offset="1" stopColor="#f2a65a" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="rd-disc" x1="420" x2="700" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe3bd"/>
            <stop offset="1" stopColor="#c46e2a"/>
          </linearGradient>
        </defs>

        <circle cx="560" cy="190" r="140" fill="url(#rd-glow)"/>
        {/* photon sphere */}
        <circle cx="560" cy="190" r="62" fill="none" stroke="#9a98a3" strokeOpacity="0.5" strokeDasharray="3 5"/>
        {/* disc, edge-on */}
        <line x1="440" y1="190" x2="680" y2="190" stroke="url(#rd-disc)" strokeWidth="5" strokeLinecap="round"/>
        {/* horizon */}
        <circle cx="560" cy="190" r="40" fill="#000" stroke="#f2a65a" strokeOpacity="0.35"/>

        {/* camera */}
        <g transform="translate(70 190)">
          <rect x="-22" y="-13" width="30" height="26" rx="4" fill="none" stroke="#ece8e1" strokeWidth="1.5"/>
          <path d="M8 -7 L22 -14 L22 14 L8 7 z" fill="none" stroke="#ece8e1" strokeWidth="1.5"/>
        </g>

        {/* rays */}
        <g fill="none" strokeWidth="1.6" strokeLinecap="round">
          {RAYS.map((r, i) => (
            <motion.path key={r.d} d={r.d} stroke={r.stroke} strokeOpacity={r.opacity} variants={draw(i)}/>
          ))}
        </g>
        {/* arrowheads and hit points appear once their rays have arrived */}
        <motion.g fill="#9a98a3" variants={appear(2.1)}>
          <path d="M-7 -4 L1 0 L-7 4 z" transform="translate(780 20) rotate(-3.7)"/>
          <path d="M-7 -4 L1 0 L-7 4 z" transform="translate(780 360) rotate(7.8)"/>
        </motion.g>
        <motion.g fill="#ffd9a0" variants={appear(2.0)}>
          <circle cx="620" cy="187" r="3.5"/>
          <circle cx="482" cy="191" r="3.5"/>
        </motion.g>

        {/* labels */}
        <motion.g fill="#9a98a3" variants={appear(1.4)}>
          <text x="70" y="235" textAnchor="middle" className={label}>{text.camera}</text>
          <text x="776" y="56" textAnchor="end" className={label}>{text.escapes}</text>
          <text x="600" y="100" className={label}>{text.arches}</text>
          <text x="330" y="176" className={label}>{text.hitsDisc}</text>
          <text x="508" y="246" textAnchor="end" className={label}>{text.captured}</text>
          <text x="628" y="246" className={label}>{text.photonSphere}</text>
        </motion.g>
      </motion.svg>
    </figure>
  );
};

export default RayDiagram;
