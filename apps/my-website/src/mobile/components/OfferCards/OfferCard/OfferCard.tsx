import type { ReactNode } from "react";
import clsx from "clsx";
import { useDetails } from "../../../hooks/useDetails";
import { money } from "../../../tco";
import type { CostRow, Scenario } from "../../../types";
import { DataMeter } from "../../DataMeter/DataMeter";
import { DetailsPanel } from "../../DetailsPanel/DetailsPanel";
import { LowestBadge } from "../../LowestBadge/LowestBadge";

export interface OfferCardProps {
  row: CostRow;
  maxGb: number;
  bestKeep: boolean;
  bestReturn: boolean;
  badge: string;
}

// One outcome's box: the total, the average month, the device and plan
// payments, in the table's two tints
const Outcome = ({ title, scenario, best, badge, tint }: { title: string; scenario?: Scenario; best: boolean; badge: string; tint: string }): ReactNode => (
  <div className={clsx("rounded-xl px-3 py-2.5", tint)}>
    <p className="text-[13px] font-semibold text-slate-900">{title}</p>
    {scenario ? (
      <>
        <p className="mt-1 text-[19px] font-semibold leading-tight text-slate-900">{money(scenario.total)}</p>
        <p className="text-[12.5px] text-slate-700">{money(scenario.perMonth)}/mo, plan included</p>
        <p className="mt-1 text-[12.5px] text-slate-700">
          Device {money(scenario.deviceMonthly)}/mo
          {scenario.dueAtEnd ? `, ${money(scenario.dueAtEnd)} at the end` : ""}
        </p>
        {best ? <LowestBadge label={badge}/> : null}
      </>
    ) : (
      <p className="mt-1 text-[13px] text-slate-600">No return program</p>
    )}
  </div>
);

// One plan tier of a seller's monthly deal, on phones; the parent is a <ul>
export const OfferCard = ({ row, maxGb, bestKeep, bestReturn, badge }: OfferCardProps): ReactNode => {
  const { offer, months, keep, returned } = row;
  const details = useDetails();
  const plan = offer.kind === "carrier" ? offer.plan : undefined;
  const subject = plan ? `${offer.seller}, ${plan.name}` : `${offer.seller}, your own plan`;
  return (
    <li className="border-t border-blue-100 px-4 py-4 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-slate-900">{plan ? plan.name : "Your own plan"}</p>
          <p className="text-[13px] text-slate-600">
            Plan {money(keep.planMonthly)}/mo · {money(keep.dueToday)} today · {months} months
          </p>
        </div>
        {plan ? (
          <div className="w-24 shrink-0">
            <DataMeter gb={plan.gb} maxGb={maxGb}/>
          </div>
        ) : null}
      </div>
      {offer.kind === "carrier" && offer.credit ? <span className="mt-2 block w-fit rounded-md bg-emerald-50 px-1.5 py-0.5 text-[12px] font-semibold text-emerald-900">{offer.credit.label}</span> : null}
      {plan?.features.length ? (
        <ul className="mt-2 flex flex-wrap gap-1">
          {plan.features.map((feature) => (
            <li key={feature} className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[12px] leading-snug text-slate-800">
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Outcome title="Return it" scenario={returned} best={bestReturn} badge={badge} tint="bg-violet-100"/>
        <Outcome title="Keep it" scenario={keep} best={bestKeep} badge={badge} tint="bg-sky-100"/>
      </div>
      <div className="mt-1 -ml-2">{details.button(subject)}</div>
      <div id={details.id} hidden={!details.open} className="mt-2 rounded-xl bg-slate-50 p-3">
        <DetailsPanel row={row}/>
      </div>
    </li>
  );
};
