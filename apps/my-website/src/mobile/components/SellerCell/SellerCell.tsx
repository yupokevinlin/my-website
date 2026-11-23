import type { ReactNode } from "react";
import { SellerLogo } from "../SellerLogo/SellerLogo";

export interface SellerCellProps {
  seller: string;
  // What the offer is: "Unlocked", "Easy Payment, 24 months"
  title: string;
  // A second line, such as "Refurbished"
  detail?: string;
  // In the monthly table, one cell spans all of a seller's plan tiers
  rowSpan?: number;
  // The store a carrier's deal is bought through: "Best Buy"
  via?: string;
}

// The seller column of both tables: the logo centred above what the offer is,
// held in place when the table scrolls sideways
export const SellerCell = ({ seller, title, detail, rowSpan, via }: SellerCellProps): ReactNode => (
  <th scope={rowSpan ? "rowgroup" : "row"} rowSpan={rowSpan} className="sticky left-0 z-10 w-[9rem] border-r border-blue-100 bg-white px-3 py-4 text-center align-top font-normal">
    <span className="flex justify-center">
      <SellerLogo seller={seller} centred/>
    </span>
    {via ? <span className="mt-1.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-900">from {via}</span> : null}
    <span className="mt-1.5 block text-[13px] leading-snug text-slate-600">{title}</span>
    {detail ? <span className="mt-0.5 block text-[12.5px] text-slate-600">{detail}</span> : null}
  </th>
);
