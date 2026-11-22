import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { OutrightRow } from "./OutrightRow/OutrightRow";

export interface OutrightTableProps {
  caption: string;
  // Phones paid in full, cheapest first
  rows: CostRow[];
}

const HEAD = "px-3 py-2 text-left align-bottom text-[12.5px] font-semibold text-slate-700";
const NUMBER_HEAD = `${HEAD} text-right`;

// Unlocked phones bought outright: the price is paid today, the phone is
// yours, and the plan is whichever one you bring
export const OutrightTable = ({ caption, rows }: OutrightTableProps): ReactNode => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label={caption}>
    <table className="w-full min-w-[40rem] border-collapse tabular-nums">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-slate-300">
          <th scope="col" className={`${HEAD} sticky left-0 z-10 w-[15rem] bg-white`}>
            Seller
          </th>
          <th scope="col" className={NUMBER_HEAD}>
            Phone, due today
          </th>
          <th scope="col" className={NUMBER_HEAD}>
            Plan / month
          </th>
          <th scope="col" className={NUMBER_HEAD}>
            Total, plan included
          </th>
          <th scope="col" className={HEAD}>
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
