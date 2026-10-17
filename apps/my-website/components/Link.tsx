import React from "react";
import clsx from "clsx";
import Anchor from "./Anchor";

export interface LinkProps {
  href: string;
  /** Extra rel values, e.g. "me" on links to Kevin's own profiles. */
  rel?: string;
  className?: string;
  style?: React.CSSProperties;
  underline?: "always" | "hover" | "none";
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, rel, className, style, underline = "always", children }) => {
  const handleMouseEnter = underline === "hover"
    ? (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.textDecoration = "underline"; }
    : undefined;
  const handleMouseLeave = underline === "hover"
    ? (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.textDecoration = "none"; }
    : undefined;

  return (
    <Anchor
      href={href}
      rel={rel}
      className={clsx("link-base transition-colors hover:bg-black/10 active:bg-black/20", className)}
      style={{
        textDecoration: underline === "always" ? "underline" : "none",
        cursor: "pointer",
        display: "inline-block",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Anchor>
  );
};

export default Link;
