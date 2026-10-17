import React from "react";
import { m } from "framer-motion";

// The site's one easing curve: quick out, gentle settle
export const EASE = [0.22, 1, 0.36, 1] as const;

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  // Seconds, for staggering items in a row
  delay?: number;
  as?: "div" | "li";
}

// Fades its children up the first time they scroll into view. Without
// JavaScript, the <noscript> style in _document.tsx shows them in place.
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, as = "div" }) => {
  const Tag = as === "li" ? m.li : m.div;
  return (
    <Tag
      className={className ? `v2-reveal ${className}` : "v2-reveal"}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
};
