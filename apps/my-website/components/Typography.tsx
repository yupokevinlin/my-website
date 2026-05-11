import React from "react";

export interface TypographyProps {
  className?: string;
  style?: React.CSSProperties;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  variant?: string;
  children?: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ className, style, align, children }) => (
  <p
    className={className}
    style={{
      margin: 0,
      fontFamily: "Roboto, sans-serif",
      ...(align ? { textAlign: align } : {}),
      ...style,
    }}
  >
    {children}
  </p>
);

export default Typography;

