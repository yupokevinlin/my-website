import React from "react";
import clsx from "clsx";

export interface IconButtonProps {
  className?: string;
  style?: React.CSSProperties;
  edge?: "start" | "end" | false;
  color?: "inherit" | "primary" | "secondary" | "default";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ className, style, onClick, children }) => (
  <button
    type="button"
    className={clsx("btn-base btn-ghost btn-ghost-rounded", className)}
    style={{
      appearance: "none",
      WebkitAppearance: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "transparent",
      ...style,
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

export default IconButton;

