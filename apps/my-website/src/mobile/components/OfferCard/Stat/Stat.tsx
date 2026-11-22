import type { ReactNode } from "react";

export interface StatProps {
  label: string;
  value: string;
}

// One labelled figure in an offer's summary; the parent is a <dl>
export const Stat = ({ label, value }: StatProps): ReactNode => (
  <div>
    <dt className="text-[12.5px] text-slate-600">{label}</dt>
    <dd className="mt-0.5 text-[15px] font-medium tabular-nums text-slate-900">{value}</dd>
  </div>
);
