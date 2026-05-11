import React from "react";

export interface CircularProgressProps {
  className?: string;
  style?: React.CSSProperties;
  disableShrink?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ className, style }) => (
  <div
    className={className}
    style={{
      borderRadius: "50%",
      border: "3px solid rgba(0,0,0,0.1)",
      borderTopColor: "var(--primary-main)",
      animation: "circular-progress-spin 0.8s linear infinite",
      boxSizing: "border-box",
      ...style,
    }}
  />
);

export default CircularProgress;

