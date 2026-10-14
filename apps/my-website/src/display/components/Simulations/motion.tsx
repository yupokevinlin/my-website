import React, { useRef, useSyncExternalStore } from "react";
import { MotionValue, Variants, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";

// Shared framer-motion pieces for the /ray-tracing pages.

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fades and lifts its children in the first time they scroll into view. */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number; y?: number }> = ({ children, className, delay = 0, y = 26 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.9, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
export const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** A container whose `item` children appear one after another. */
export const Stagger: React.FC<{ children: React.ReactNode; className?: string; as?: "div" | "ol" | "ul" | "dl" }> = ({ children, className, as = "div" }) => {
  const Component = motion[as];
  return (
    <Component className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </Component>
  );
};

const noSubscribe = () => () => undefined;

/**
 * Renders its children only in the browser. The animated diagrams compute
 * coordinates with Math.pow and friends, whose last digits can differ between
 * Node and the browser, so they are not server-rendered.
 */
export const ClientOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const client = useSyncExternalStore(noSubscribe, () => true, () => false);
  return <>{client ? children : fallback}</>;
};

/**
 * Seconds of animation time for a diagram. The clock only runs while the
 * diagram is on screen, and stays at zero for visitors who prefer reduced
 * motion, so every animated figure is a pure function of `t`.
 */
export const useDiagramClock = (): { ref: React.RefObject<SVGSVGElement | null>; t: MotionValue<number>; active: boolean } => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  const reduced = useReducedMotion();
  const t = useMotionValue(0);
  const active = inView && !reduced;
  useAnimationFrame((_, delta) => {
    if (active) t.set(t.get() + Math.min(delta, 100) / 1000);
  });
  return { ref, t, active };
};
