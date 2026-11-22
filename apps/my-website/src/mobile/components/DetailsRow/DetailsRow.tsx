import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { Breakdown } from "./Breakdown/Breakdown";

export interface DetailsRowProps {
  id: string;
  open: boolean;
  // The width of the table it sits in
  colSpan: number;
  row: CostRow;
}

// The row under an offer that shows how its totals add up, the fine print and
// where the numbers are from. Stays in the page while closed.
export const DetailsRow = ({ id, open, colSpan, row }: DetailsRowProps): ReactNode => {
  const { offer, keep, returned } = row;
  return (
    <tr id={id} hidden={!open} className="border-t border-slate-100 bg-slate-50">
      <td colSpan={colSpan} className="px-3 py-4">
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
  );
};
