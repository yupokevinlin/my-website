import type { ReactNode } from "react";
import type { SellerGroup } from "../../tco";
import type { CostRow } from "../../types";
import { ColumnHead } from "../ColumnHead/ColumnHead";
import { OfferRow } from "./OfferRow/OfferRow";

export interface OfferTableProps {
  // What the table lists, for screen readers
  caption: string;
  // Each seller with its plan tiers, cheapest first
  groups: SellerGroup[];
}

const lowest = (rows: CostRow[], pick: (row: CostRow) => number | undefined): number => Math.min(...rows.map((row) => pick(row) ?? Infinity));

// Phones paid for by the month. Each seller appears once, its logo at the top
// beside all of its plan tiers. Every tier has its two outcomes side by side:
// returned under the seller's program, or kept. Each outcome shows the device
// payment first, then the plan, then the total. Wider than a phone's screen,
// so it scrolls sideways there with the seller column held in place.
// The box is relative so hidden screen-reader text in the table is placed
// against it, not the page: otherwise the page itself scrolled sideways.
export const OfferTable = ({ caption, groups }: OfferTableProps): ReactNode => {
  const rows = groups.flatMap((group) => group.rows);
  const bestKeep = lowest(rows, (row) => row.keep.perMonth);
  const bestReturn = lowest(rows, (row) => row.returned?.perMonth);
  const maxGb = Math.max(1, ...rows.map(({ offer }) => (offer.kind === "carrier" && offer.plan.gb !== "unlimited" ? offer.plan.gb : 0)));
  return (
    <div className="relative overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100 [scrollbar-width:thin]" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[64rem] border-collapse tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[8rem]"/>
          <col className="w-[10.5rem]"/>
          <col className="w-[6rem]"/>
          <col/>
          <col/>
          <col span={3} className="bg-violet-100"/>
          <col span={4} className="bg-sky-100"/>
          <col/>
        </colgroup>
        <thead>
          <tr>
            <ColumnHead title="Seller" align="center" rowSpan={2} className="sticky left-0 z-10 border-r border-blue-100 bg-white"/>
            <ColumnHead title="Plan" align="left" rowSpan={2}/>
            <ColumnHead title="Data" unit="per month" align="left" rowSpan={2}/>
            <ColumnHead title="Due" unit="today" rowSpan={2}/>
            <ColumnHead title="Term" unit="months" rowSpan={2}/>
            <th scope="colgroup" colSpan={3} className="px-2 pt-3 text-left text-[15px] font-semibold text-violet-900">
              Return it
              <span className="mt-0.5 block text-[12.5px] font-normal text-slate-700">Return the phone after the term</span>
            </th>
            <th scope="colgroup" colSpan={4} className="px-2 pt-3 text-left text-[15px] font-semibold text-sky-900">
              Keep it
              <span className="mt-0.5 block text-[12.5px] font-normal text-slate-700">The phone is yours after the term</span>
            </th>
            <th scope="col" rowSpan={2} className="px-2 py-2">
              <span className="sr-only">Details</span>
            </th>
          </tr>
          <tr className="border-b border-blue-200">
            <ColumnHead title="Device" unit="per month"/>
            <ColumnHead title="Plan" unit="per month"/>
            <ColumnHead title="Total" unit="plan included"/>
            <ColumnHead title="Device" unit="per month"/>
            <ColumnHead title="Plan" unit="per month"/>
            <ColumnHead title="Due" unit="at the end"/>
            <ColumnHead title="Total" unit="plan included"/>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.seller} className="border-t-2 border-blue-200 first-of-type:border-t-0">
            {group.rows.map((row, index) => (
              <OfferRow key={row.offer.id} row={row} groupSize={index === 0 ? group.rows.length : undefined} maxGb={maxGb} bestKeep={row.keep.perMonth === bestKeep} bestReturn={row.returned?.perMonth === bestReturn}/>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
};
