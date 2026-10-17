import React from "react";
import clsx from "clsx";
import Anchor from "./Anchor";

export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
  /** Renders a link styled as a button. Use it for anything that navigates. */
  href?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, style, color, href, rel, onClick, children }) => {
  const isPrimary = color === "primary";
  const buttonClassName = clsx("btn-base", isPrimary ? "btn-primary" : "btn-solid", className);
  const buttonStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  if (href) {
    return (
      <Anchor href={href} rel={rel} className={buttonClassName} style={{ textDecoration: "none", ...buttonStyle }} onClick={onClick}>
        {children}
      </Anchor>
    );
  }

  return (
    <button type="button" className={buttonClassName} style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
