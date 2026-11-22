import type { ReactNode } from "react";
import clsx from "clsx";
import { useDetails } from "../../../hooks/useDetails";
import { dataLabel, money } from "../../../tco";
import type { CostRow, Scenario } from "../../../types";
import { DataMeter } from "../../DataMeter/DataMeter";
import { DetailsRow } from "../../DetailsRow/DetailsRow";
import { SellerLogo } from "../../SellerLogo/SellerLogo";

export interface OfferRowProps {
  row: CostRow;
  // On the seller's first (cheapest) tier: how many tiers the seller has. That
  // row carries the seller's logo, in one cell at the top beside all of its tiers.
  groupSize?: number;
  // The biggest measured data plan in the table, for the data bars
  maxGb: number;
  // This row has the lowest monthly cost of the table for that outcome
  bestKeep: boolean;
  bestReturn: boolean;
}

const CELL = "border-slate-200 px-3 py-3 text-right align-top text-[15px] text-slate-900";
const SMALL = "mt-0.5 block text-[12.5px] font-normal text-slate-600";

const total = (scenario: Scenario, months: number, best: boolean, className: string): ReactNode => (
  <td className={clsx(className, "font-semibold")}>
    {money(scenario.total)}
    <span className={SMALL}>
      {money(scenario.perMonth)} a month × {months}
    </span>
    {best ? <span className="mt-1 inline-block rounded-full bg-emerald-700 px-2 py-0.5 text-[12px] font-semibold text-white">Lowest</span> : null}
  </td>
);

// One plan tier of a seller's monthly deal: what it costs returned and kept.
// "Details" opens the arithmetic, the fine print and the source.
export const OfferRow = ({ row, groupSize, maxGb, bestKeep, bestReturn }: OfferRowProps): ReactNode => {
  const { offer, months, keep, returned } = row;
  const details = useDetails();
  // A line between a seller's tiers; the line between sellers is the tbody's
  const cell = clsx(CELL, !groupSize && "border-t");
  const plan = offer.kind === "carrier" ? offer.plan : undefined;
  const subject = plan ? `${offer.seller}, ${plan.name}, ${dataLabel(plan.gb)}` : `${offer.seller}, your own plan`;
  return (
    <>
      <tr>
        {groupSize ? (
          // Spans every tier of the seller: each tier is two rows, itself and its details
          <th scope="rowgroup" rowSpan={groupSize * 2} className="sticky left-0 z-10 border-r border-slate-200 bg-white px-3 py-3 text-center align-top font-normal">
            <span className="flex justify-center">
              <SellerLogo seller={offer.seller} centred/>
            </span>
            <span className="mt-1.5 block text-[13px] text-slate-600">{offer.title}</span>
          </th>
        ) : null}
        <th scope="row" className={clsx("border-slate-200 px-3 py-3 text-left align-top text-[14px] font-medium text-slate-900", !groupSize && "border-t")}>
          {plan ? plan.name : "Your own plan"}
          {plan ? (
            plan.features.length ? (
              <ul className="mt-1.5 flex flex-wrap gap-1 font-normal">
                {plan.features.map((feature) => (
                  <li key={feature} className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] text-slate-800">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null
          ) : (
            <span className={SMALL}>The phone is unlocked</span>
          )}
        </th>
        <td className={clsx("border-slate-200 px-3 py-3 text-left align-top", !groupSize && "border-t")}>{plan ? <DataMeter gb={plan.gb} maxGb={maxGb}/> : <span className="text-[14px] text-slate-600">As your plan</span>}</td>
        <td className={cell}>{money(keep.dueToday)}</td>
        {returned ? (
          <>
            <td className={cell}>
              {money(returned.deviceMonthly)}
              <span className={SMALL}>{returned.how}</span>
            </td>
            <td className={cell}>{money(returned.planMonthly)}</td>
            {total(returned, months, bestReturn, cell)}
          </>
        ) : (
          <td colSpan={3} className={clsx("border-slate-200 px-3 py-3 text-center align-top text-[14px] text-slate-600", !groupSize && "border-t")}>
            No return program
          </td>
        )}
        <td className={cell}>
          {money(keep.deviceMonthly)}
          <span className={SMALL}>{keep.how}</span>
        </td>
        <td className={cell}>{money(keep.planMonthly)}</td>
        <td className={cell}>{money(keep.dueAtEnd)}</td>
        {total(keep, months, bestKeep, cell)}
        <td className={clsx("border-slate-200 px-3 py-2 text-right align-top", !groupSize && "border-t")}>{details.button(subject)}</td>
      </tr>
      <DetailsRow id={details.id} open={details.open} colSpan={11} row={row}/>
    </>
  );
};
