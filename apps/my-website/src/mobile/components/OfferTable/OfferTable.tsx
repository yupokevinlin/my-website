import type { ReactNode } from "react";
import type { SellerGroup } from "../../tco";
import type { CostRow } from "../../types";
import { OfferRow } from "./OfferRow/OfferRow";

export interface OfferTableProps {
  // What the table lists, for screen readers
  caption: string;
  // Each seller with its plan tiers, cheapest first
  groups: SellerGroup[];
}

const HEAD = "px-3 py-2 text-left align-bottom text-[12.5px] font-semibold text-slate-700";
const NUMBER_HEAD = `${HEAD} text-right`;

const lowest = (rows: CostRow[], pick: (row: CostRow) => number | undefined): number => Math.min(...rows.map((row) => pick(row) ?? Infinity));

// Phones paid for by the month. Each seller appears once, its logo at the top
// beside all of its plan tiers. Every tier has its two outcomes side by side:
// returned under the seller's program, or kept. Each outcome shows the device
// payment first, then the plan, then the total. Wider than a phone's screen,
// so it scrolls sideways there with the seller column held in place.
export const OfferTable = ({ caption, groups }: OfferTableProps): ReactNode => {
  const rows = groups.flatMap((group) => group.rows);
  const bestKeep = lowest(rows, (row) => row.keep.perMonth);
  const bestReturn = lowest(rows, (row) => row.returned?.perMonth);
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[72rem] border-collapse tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[10rem]"/>
          <col className="w-[11rem]"/>
          <col/>
          <col span={3} className="bg-amber-50/60"/>
          <col span={4} className="bg-sky-50/60"/>
          <col/>
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200">
            <th scope="col" rowSpan={2} className={`${HEAD} sticky left-0 z-10 border-r border-slate-200 bg-white text-center`}>
              Seller
            </th>
            <th scope="col" rowSpan={2} className={HEAD}>
              Plan
            </th>
            <th scope="col" rowSpan={2} className={NUMBER_HEAD}>
              Due today
            </th>
            <th scope="colgroup" colSpan={3} className="px-3 pt-3 text-left text-[15px] font-semibold text-amber-950">
              Return it <span className="font-normal text-slate-700">· the seller's own return program</span>
            </th>
            <th scope="colgroup" colSpan={4} className="px-3 pt-3 text-left text-[15px] font-semibold text-sky-950">
              Keep it <span className="font-normal text-slate-700">· the phone is yours after the term</span>
            </th>
            <th scope="col" rowSpan={2} className={HEAD}>
              <span className="sr-only">Details</span>
            </th>
          </tr>
          <tr className="border-b border-slate-300">
            <th scope="col" className={NUMBER_HEAD}>
              Device / month
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Plan / month
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Total, plan included
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Device / month
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Plan / month
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Due at the end
            </th>
            <th scope="col" className={NUMBER_HEAD}>
              Total, plan included
            </th>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.seller} className="border-t-2 border-slate-300 first-of-type:border-t-0">
            {group.rows.map((row, index) => (
              <OfferRow key={row.offer.id} row={row} groupSize={index === 0 ? group.rows.length : undefined} bestKeep={row.keep.perMonth === bestKeep} bestReturn={row.returned?.perMonth === bestReturn}/>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
};
