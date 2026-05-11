import React from "react";

export interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

const Divider: React.FC<DividerProps> = ({ className, style }) => (
  <hr
    className={className}
    style={{
      margin: 0,
      border: "none",
      borderTop: "1px solid rgba(0,0,0,0.12)",
      width: "100%",
      height: 0,
      ...style,
    }}
  />
);

export default Divider;

