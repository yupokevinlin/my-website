import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

// A 24-unit line icon. Hidden from screen readers: the text next to it, or
// its button's aria-label, says what it means.
export const Icon = ({ children, ...props }: IconProps & { children: ReactNode }): ReactNode => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);
