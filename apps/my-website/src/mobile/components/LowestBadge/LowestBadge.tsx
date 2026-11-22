import type { ReactNode } from "react";

export interface LowestBadgeProps {
  // What it is lowest by, when that isn't the total it sits on
  label?: string;
}

// Marks the cheapest option in a table
export const LowestBadge = ({ label = "Lowest" }: LowestBadgeProps): ReactNode => (
  <span className="mt-1 inline-block whitespace-nowrap rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-2 py-0.5 text-[12px] font-semibold text-white">{label}</span>
);
