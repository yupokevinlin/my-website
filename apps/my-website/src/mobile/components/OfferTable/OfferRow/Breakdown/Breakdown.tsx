import type { ReactNode } from "react";
import clsx from "clsx";
import { money } from "../../../../tco";
import type { CostLine } from "../../../../types";

export interface BreakdownProps {
  title: string;
  lines: CostLine[];
}

// How one outcome's total adds up, line by line; the last line is the total
export const Breakdown = ({ title, lines }: BreakdownProps): ReactNode => (
  <div>
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <dl className="mt-1 tabular-nums">
      {lines.map((line, index) => (
        <div key={line.label} className={clsx("flex justify-between gap-4 border-t border-slate-200 py-1.5", index === lines.length - 1 && "font-semibold")}>
          <dt className="text-slate-700">{line.label}</dt>
          <dd className="text-slate-900">{money(line.amount)}</dd>
        </div>
      ))}
    </dl>
  </div>
);
