import type { ReactNode } from "react";

export interface FactProps {
  label: string;
  children: ReactNode;
}

// One row of the About card: a small label over its value, inside a <dl>
export const Fact = ({ label, children }: FactProps): ReactNode => (
  <div className="py-4">
    <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-accent)]">{label}</dt>
    <dd className="mt-1.5 text-[15.5px] leading-snug text-[var(--v2-ink)]">{children}</dd>
  </div>
);
