import type { ReactNode } from "react";
import clsx from "clsx";

export interface BulletsProps {
  items: string[];
  className?: string;
}

// Achievements, each with a small dot in the season's bright colour
export const Bullets = ({ items, className }: BulletsProps): ReactNode => (
  <ul className={clsx("space-y-2.5 text-[15.5px] leading-relaxed text-[var(--v2-body)]", className)}>
    {items.map((item) => (
      <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.68em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--v2-bright)]">
        {item}
      </li>
    ))}
  </ul>
);
