import { type ReactNode, useId, useState } from "react";
import clsx from "clsx";
import { money } from "../../../tco";
import type { CostRow, Scenario } from "../../../types";
import { SellerLogo } from "../../SellerLogo/SellerLogo";
import { Breakdown } from "./Breakdown/Breakdown";

export interface OfferRowProps {
  row: CostRow;
  // This row has the lowest monthly cost of the table for that outcome
  bestKeep: boolean;
  bestReturn: boolean;
}

const CONDITION_LABEL = { new: null, "open-box": "Open box", refurbished: "Refurbished" } as const;
const CELL = "px-3 py-3 text-right align-top text-[15px] text-slate-900";
const SMALL = "mt-0.5 block text-[12.5px] font-normal text-slate-600";

const total = (scenario: Scenario, months: number, best: boolean): ReactNode => (
  <td className={clsx(CELL, "font-semibold")}>
    {money(scenario.total)}
    <span className={SMALL}>
      {money(scenario.perMonth)} a month × {months}
    </span>
    {best ? <span className="mt-1 inline-block rounded-full bg-emerald-700 px-2 py-0.5 text-[12px] font-semibold text-white">Lowest</span> : null}
  </td>
);

// One offer: who sells it and on what plan, then what it costs returned and
// kept. "Details" opens the arithmetic, the fine print and the source.
export const OfferRow = ({ row, bestKeep, bestReturn }: OfferRowProps): ReactNode => {
  const { offer, months, keep, returned } = row;
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const condition = CONDITION_LABEL[offer.condition];
  return (
    <>
      <tr className="border-t border-slate-200">
        <th scope="row" className="sticky left-0 z-10 bg-white px-3 py-3 text-left align-top font-normal">
          <SellerLogo seller={offer.seller}/>
          <span className="mt-1.5 block text-[14px] text-slate-900">{offer.title}</span>
          <span className="mt-0.5 block text-[12.5px] text-slate-600">
            {offer.kind === "carrier" ? `${offer.plan.name}, ${offer.plan.data}` : "Your own plan"}
            {condition ? ` · ${condition}` : ""}
          </span>
        </th>
        <td className={CELL}>{money(keep.dueToday)}</td>
        {returned ? (
          <>
            <td className={CELL}>
              {money(returned.deviceMonthly)}
              <span className={SMALL}>{returned.how}</span>
            </td>
            <td className={CELL}>{money(returned.planMonthly)}</td>
            {total(returned, months, bestReturn)}
          </>
        ) : (
          <td colSpan={3} className="px-3 py-3 text-center align-top text-[14px] text-slate-600">
            No return program
          </td>
        )}
        <td className={CELL}>
          {money(keep.deviceMonthly)}
          <span className={SMALL}>{keep.how}</span>
        </td>
        <td className={CELL}>{money(keep.planMonthly)}</td>
        <td className={CELL}>{money(keep.dueAtEnd)}</td>
        {total(keep, months, bestKeep)}
        <td className="px-3 py-2 text-right align-top">
          <button type="button" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((value) => !value)} className="min-h-11 rounded-lg px-2 text-[14px] font-medium text-sky-800 underline">
            {open ? "Hide" : "Details"}
            <span className="sr-only">
              {" "}
              for {offer.seller}, {offer.title}
            </span>
          </button>
        </td>
      </tr>
      <tr id={detailsId} hidden={!open} className="border-t border-slate-100 bg-slate-50">
        <td colSpan={10} className="px-3 py-4">
          <div className="sticky left-3 grid max-w-[56rem] gap-6 text-[14px] sm:grid-cols-2">
            {returned ? <Breakdown title={`Return it: ${returned.how}`} lines={returned.lines}/> : null}
            <Breakdown title={`Keep it: ${keep.how}`} lines={keep.lines}/>
            <div className="text-slate-700 sm:col-span-2">
              {offer.note ? <p>{offer.note}</p> : null}
              <p className="mt-2">
                Source:{" "}
                <a href={offer.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-800 underline">
                  {offer.source.label}
                </a>
                , checked {offer.source.checked}.{offer.source.verified === "secondary" ? " Not read on the seller's own page." : ""}
              </p>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
