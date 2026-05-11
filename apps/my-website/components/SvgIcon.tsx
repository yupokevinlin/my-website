import React from "react";

export interface SvgIconProps {
  className?: string;
  style?: React.CSSProperties;
  viewBox?: string;
  children?: React.ReactNode;
}

const SvgIcon: React.FC<SvgIconProps> = ({ className, style, viewBox = "0 0 24 24", children }) => (
  <svg
    className={className}
    style={{ display: "inline-block", fill: "currentColor", width: "1em", height: "1em", fontSize: "1.5rem", flexShrink: 0, userSelect: "none", ...style }}
    viewBox={viewBox}
    focusable="false"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default SvgIcon;

