import type { ReactNode } from "react";
import clsx from "clsx";
import { SeasonIcon } from "../SeasonIcon/SeasonIcon";

export interface EyebrowProps {
  children: ReactNode;
  // Over a scene the darker accent keeps 4.5:1 contrast
  onScene?: boolean;
  // Lead with the current season's icon
  icon?: boolean;
  className?: string;
}

// The small capitals line above a title
export const Eyebrow = ({ children, onScene, icon, className }: EyebrowProps): ReactNode => (
  <p className={clsx("flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]", onScene ? "text-[var(--v2-accent-strong)]" : "text-[var(--v2-accent)]", className)}>
    {icon ? <SeasonIcon/> : null}
    <span>{children}</span>
  </p>
);
