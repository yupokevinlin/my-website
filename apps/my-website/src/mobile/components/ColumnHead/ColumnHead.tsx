import type { ReactNode } from "react";
import clsx from "clsx";

export interface ColumnHeadProps {
  title: string;
  // What the column's figures are in, on the line below the title
  unit?: string;
  align?: "left" | "right" | "center";
  rowSpan?: number;
  className?: string;
}

// A table column's heading: the title on top, its unit underneath, so every
// heading is two lines and the titles line up
export const ColumnHead = ({ title, unit, align = "right", rowSpan, className }: ColumnHeadProps): ReactNode => (
  <th
    scope="col"
    rowSpan={rowSpan}
    className={clsx(
      "whitespace-nowrap px-2 py-2 align-bottom text-[13px] font-semibold text-slate-900",
      align === "left" && "text-left",
      align === "right" && "text-right",
      align === "center" && "text-center",
      className,
    )}
  >
    {title}
    {/* Without a unit, a blank line keeps the title level with the others */}
    <span className="block text-[12px] font-normal text-slate-600" aria-hidden={unit ? undefined : true}>
      {unit ?? " "}
    </span>
  </th>
);
