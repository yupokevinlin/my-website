import React from "react";

export interface TypographyProps {
  /** The element to render. Use a heading where one belongs; it looks the same. */
  component?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
  className?: string;
  style?: React.CSSProperties;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  variant?: string;
  children?: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ component: Tag = "p", className, style, align, children }) => (
  <Tag
    className={className}
    style={{
      margin: 0,
      fontFamily: "var(--font-roboto), Roboto, sans-serif",
      ...(align ? { textAlign: align } : {}),
      ...style,
    }}
  >
    {children}
  </Tag>
);

export default Typography;
