import React from "react";

export interface PaperProps {
  className?: string;
  style?: React.CSSProperties;
  elevation?: number;
  square?: boolean;
  children?: React.ReactNode;
}

const shadows: Record<number, string> = {
  0: "none",
  1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
  2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
  3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
};

const Paper: React.FC<PaperProps> = ({ className, style, elevation = 1, square = false, children }) => (
  <div
    className={className}
    style={{
      backgroundColor: "var(--bg-paper)",
      boxShadow: shadows[elevation] ?? shadows[1],
      borderRadius: square ? 0 : "4px",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Paper;

