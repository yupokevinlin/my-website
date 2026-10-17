import type { ReactNode } from "react";
import clsx from "clsx";

export interface ExperienceCardProps {
  // Dashed and lighter, for the folded early roles
  quiet?: boolean;
  children: ReactNode;
}

// The white card each company sits on
export const ExperienceCard = ({ quiet, children }: ExperienceCardProps): ReactNode => (
  <article
    className={clsx(
      "rounded-2xl border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_22px_44px_-28px_var(--v2-deep)] md:p-7",
      quiet ? "border-dashed border-[var(--v2-line)] bg-white/70" : "border-[var(--v2-line)] bg-white",
    )}
  >
    {children}
  </article>
);
