import type { ReactNode } from "react";
import { money } from "../../../tco";
import type { CostRow } from "../../../types";
import { DetailsRow } from "../../DetailsRow/DetailsRow";
import { useDetails } from "../../../hooks/useDetails";
import { LowestBadge } from "../../LowestBadge/LowestBadge";
import { SellerLogo } from "../../SellerLogo/SellerLogo";

export interface OutrightRowProps {
  row: CostRow;
  best: boolean;
}

const CONDITION_LABEL = { new: null, "open-box": "Open box", refurbished: "Refurbished" } as const;
const CELL = "px-3 py-3 text-right align-top text-[15px] text-slate-900";

// One seller's price for the unlocked phone
export const OutrightRow = ({ row, best }: OutrightRowProps): ReactNode => {
  const { offer, months, keep } = row;
  const details = useDetails();
  const condition = CONDITION_LABEL[offer.condition];
  return (
    <>
      <tr className="border-t border-blue-100">
        <th scope="row" className="sticky left-0 z-10 bg-white px-3 py-3 text-left align-top font-normal">
          <SellerLogo seller={offer.seller}/>
          <span className="mt-1.5 block text-[14px] text-slate-900">{offer.title}</span>
          {condition ? <span className="mt-0.5 block text-[12.5px] text-slate-600">{condition}</span> : null}
        </th>
        <td className={CELL}>{money(keep.dueToday)}</td>
        <td className={CELL}>{money(keep.planMonthly)}</td>
        <td className={`${CELL} font-semibold`}>
          {money(keep.total)}
          <span className="mt-0.5 block text-[12.5px] font-normal text-slate-600">
            {money(keep.perMonth)} a month × {months}
          </span>
          {best ? <LowestBadge/> : null}
        </td>
        <td className="px-3 py-2 text-right align-top">{details.button(`${offer.seller}, ${offer.title}`)}</td>
      </tr>
      <DetailsRow id={details.id} open={details.open} colSpan={5} row={row}/>
    </>
  );
};
