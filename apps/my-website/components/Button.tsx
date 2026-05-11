import React from "react";
import clsx from "clsx";

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, style, color, onClick, children }) => {
  const isPrimary = color === "primary";
  return (
    <button
      type="button"
      className={clsx("btn-base", isPrimary ? "btn-primary" : "btn-solid", className)}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

