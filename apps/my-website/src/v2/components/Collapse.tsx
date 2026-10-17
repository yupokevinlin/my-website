import React from "react";
import { m } from "framer-motion";
import { EASE } from "../motion";

export interface CollapseProps {
  id: string;
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

// Expands smoothly to its natural height. Closed content stays in the page
// (search engines still read it) but can't be focused or read aloud.
const Collapse: React.FC<CollapseProps> = ({ id, open, className, children }) => (
  <m.div
    id={id}
    className={className ? `overflow-hidden ${className}` : "overflow-hidden"}
    initial={false}
    animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
    transition={{ duration: 0.45, ease: EASE }}
    inert={!open}
  >
    {children}
  </m.div>
);

export default Collapse;
