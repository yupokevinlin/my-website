import type { ReactNode } from "react";

export interface ChipProps {
  children: ReactNode;
  // A small logo before the name (decorative: the name says what it is)
  logo?: string;
  // Or a line icon, for something that has no logo
  icon?: ReactNode;
}

// One tool or skill in a list of them; the parent is a <ul>
export const Chip = ({ children, logo, icon }: ChipProps): ReactNode => (
  <li className="inline-flex items-center gap-1.5 rounded-full border border-[var(--v2-line)] bg-[var(--v2-chip)] px-3 py-1.5 text-[13.5px] leading-none text-[var(--v2-body)]">
    {logo ? <img src={logo} alt="" aria-hidden="true" loading="lazy" width={18} height={18} className="h-[18px] w-[18px] shrink-0 object-contain"/> : null}
    {icon ? <span aria-hidden="true" className="shrink-0 text-[var(--v2-accent)]">{icon}</span> : null}
    {children}
  </li>
);
