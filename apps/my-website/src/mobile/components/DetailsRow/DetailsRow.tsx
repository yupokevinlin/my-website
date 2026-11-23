import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { DetailsPanel } from "../DetailsPanel/DetailsPanel";

export interface DetailsRowProps {
  id: string;
  open: boolean;
  // The width of the table it sits in
  colSpan: number;
  row: CostRow;
}

// The row under an offer that shows how its totals add up, the fine print and
// where the numbers are from. Stays in the page while closed.
export const DetailsRow = ({ id, open, colSpan, row }: DetailsRowProps): ReactNode => (
  <tr id={id} hidden={!open} className="border-t border-blue-100 bg-slate-50">
    <td colSpan={colSpan} className="px-3 py-4">
      <div className="sticky left-3 max-w-[56rem]">
        <DetailsPanel row={row}/>
      </div>
    </td>
  </tr>
);
