import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { Breakdown } from "../DetailsRow/Breakdown/Breakdown";

export interface DetailsPanelProps {
  row: CostRow;
}

// How an offer's totals add up, its fine print and where the numbers are
// from: under a table row (DetailsRow) or inside a card on phones
export const DetailsPanel = ({ row }: DetailsPanelProps): ReactNode => {
  const { offer, keep, returned } = row;
  return (
    <div className="grid gap-6 text-[14px] sm:grid-cols-2">
      {returned ? <Breakdown title={`Return it: ${returned.how}`} lines={returned.lines}/> : null}
      <Breakdown title={`Keep it: ${keep.how}`} lines={keep.lines}/>
      <div className="text-slate-700 sm:col-span-2">
        {offer.note ? <p>{offer.note}</p> : null}
        <p className="mt-2">
          Source:{" "}
          <a href={offer.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-800 underline">
            {offer.source.label}
          </a>
          , checked {offer.source.checked}.{offer.source.verified === "secondary" ? " Not read on the seller's own page." : ""}
        </p>
      </div>
    </div>
  );
};
