import type { ReactNode } from "react";
import { dataLabel } from "../../tco";
import type { PlanData } from "../../types";

export interface DataMeterProps {
  gb: PlanData;
  // The biggest measured plan in the table: its bar is full, the others in proportion
  maxGb: number;
}

// A plan's data each month, as a figure and a bar that compares it with the
// other plans in the table. An unlimited plan fills the bar, in another colour.
export const DataMeter = ({ gb, maxGb }: DataMeterProps): ReactNode => {
  const unlimited = gb === "unlimited";
  const share = unlimited ? 1 : Math.min(1, gb / maxGb);
  return (
    <>
      <span className="block text-[16px] font-semibold text-slate-900">{dataLabel(gb)}</span>
      {/* Decoration: the figure above says the same thing */}
      <span aria-hidden="true" className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-blue-100">
        <span className={unlimited ? "block h-full bg-linear-to-r from-violet-500 to-fuchsia-500" : "block h-full bg-linear-to-r from-blue-500 to-violet-500"} style={{ width: `${Math.max(4, share * 100)}%` }}/>
      </span>
    </>
  );
};
