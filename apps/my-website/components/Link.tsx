import React from "react";
import clsx from "clsx";

export interface LinkProps {
  className?: string;
  style?: React.CSSProperties;
  underline?: "always" | "hover" | "none";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ className, style, underline = "always", onClick, children }) => {
  const handleMouseEnter = underline === "hover"
    ? (e: React.MouseEvent<HTMLSpanElement>) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }
    : undefined;
  const handleMouseLeave = underline === "hover"
    ? (e: React.MouseEvent<HTMLSpanElement>) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }
    : undefined;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent);
    }
  };

  return (
    <span
      role="link"
      tabIndex={0}
      className={clsx("link-base transition-colors hover:bg-black/10 active:bg-black/20", className)}
      style={{
        textDecoration: underline === "always" ? "underline" : "none",
        cursor: "pointer",
        display: "inline-block",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </span>
  );
};

export default Link;

