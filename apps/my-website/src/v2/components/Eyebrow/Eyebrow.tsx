import type { ReactNode } from "react";
import clsx from "clsx";

export interface EyebrowProps {
  children: ReactNode;
  // Over a scene the darker accent keeps 4.5:1 contrast
  onScene?: boolean;
  // The bigger size above section titles
  large?: boolean;
  // An icon to lead with
  icon?: ReactNode;
  className?: string;
}

// The small capitals line above a title
export const Eyebrow = ({ children, onScene, large, icon, className }: EyebrowProps): ReactNode => (
  <p className={clsx("flex items-center font-semibold uppercase tracking-[0.14em]", large ? "gap-2.5 text-[15px] md:text-[17px]" : "gap-2 text-[13px]", onScene ? "text-[var(--v2-accent-strong)]" : "text-[var(--v2-accent)]", className)}>
    {icon}
    <span>{children}</span>
  </p>
);
