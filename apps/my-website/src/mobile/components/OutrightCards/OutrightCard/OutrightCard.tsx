import type { ReactNode } from "react";
import { useDetails } from "../../../hooks/useDetails";
import { money } from "../../../tco";
import type { CostRow } from "../../../types";
import { DetailsPanel } from "../../DetailsPanel/DetailsPanel";
import { LowestBadge } from "../../LowestBadge/LowestBadge";
import { SellerLogo } from "../../SellerLogo/SellerLogo";

export interface OutrightCardProps {
  row: CostRow;
  best: boolean;
}

const CONDITION_LABEL = { new: null, "open-box": "Open box", refurbished: "Refurbished" } as const;

// One seller's price for the unlocked phone, on phones; the parent is a <ul>
export const OutrightCard = ({ row, best }: OutrightCardProps): ReactNode => {
  const { offer, months, keep } = row;
  const details = useDetails();
  const condition = CONDITION_LABEL[offer.condition];
  return (
    <li className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm shadow-blue-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SellerLogo seller={offer.seller}/>
          <p className="mt-1 text-[13px] text-slate-600">
            {offer.title}
            {condition ? ` · ${condition}` : ""}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[19px] font-semibold leading-tight text-slate-900">{money(keep.total)}</p>
          <p className="text-[12.5px] text-slate-600">
            {money(keep.perMonth)}/mo × {months}
          </p>
          {best ? <LowestBadge/> : null}
        </div>
      </div>
      <p className="mt-2 text-[13px] text-slate-700">
        Phone {money(keep.dueToday)} today · Plan {money(keep.planMonthly)}/mo
      </p>
      <div className="-ml-2">{details.button(`${offer.seller}, ${offer.title}`)}</div>
      <div id={details.id} hidden={!details.open} className="mt-1 rounded-xl bg-slate-50 p-3">
        <DetailsPanel row={row}/>
      </div>
    </li>
  );
};
