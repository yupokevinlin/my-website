import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { ColumnHead } from "../ColumnHead/ColumnHead";
import { OutrightRow } from "./OutrightRow/OutrightRow";

export interface OutrightTableProps {
  caption: string;
  // Phones paid in full, cheapest first
  rows: CostRow[];
}

// Unlocked phones bought outright: the price is paid today, the phone is
// yours, and the plan is whichever one you bring
// The box is relative so hidden screen-reader text in the table is placed
// against it, not the page: otherwise the page itself scrolled sideways.
export const OutrightTable = ({ caption, rows }: OutrightTableProps): ReactNode => (
  <div className="relative overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100 [scrollbar-width:thin]" tabIndex={0} role="region" aria-label={caption}>
    <table className="w-full min-w-[40rem] border-collapse tabular-nums">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-blue-200">
          <ColumnHead title="Seller" align="center" className="sticky left-0 z-10 w-[9rem] border-r border-blue-100 bg-white"/>
          <ColumnHead title="Phone" unit="due today"/>
          <ColumnHead title="Plan" unit="per month"/>
          <ColumnHead title="Total" unit="plan included"/>
          <th scope="col" className="px-3 py-2">
            <span className="sr-only">Details</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <OutrightRow key={row.offer.id} row={row} best={index === 0}/>
        ))}
      </tbody>
    </table>
  </div>
);
