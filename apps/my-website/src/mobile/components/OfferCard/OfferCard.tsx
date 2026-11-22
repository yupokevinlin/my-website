import type { ReactNode } from "react";
import clsx from "clsx";
import { money } from "../../tco";
import type { CostRow } from "../../types";
import { Stat } from "./Stat/Stat";

export interface OfferCardProps {
  row: CostRow;
  rank: number;
  // The cheapest option on the list gets the highlight
  best: boolean;
}

const END_LABEL = { own: "Yours from day one", keep: "Yours at the end", return: "Goes back at the end" } as const;
const CONDITION_LABEL = { new: null, "open-box": "Open box", refurbished: "Refurbished" } as const;

// One way to get the phone, with what it costs and where the numbers are from
export const OfferCard = ({ row, rank, best }: OfferCardProps): ReactNode => {
  const { offer } = row;
  const condition = CONDITION_LABEL[offer.condition];
  return (
    <li className={clsx("rounded-2xl border bg-white p-4 sm:p-5", best ? "border-emerald-600 shadow-[0_0_0_1px_#059669]" : "border-slate-200")}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-600">
            #{rank}
            {best ? <span className="ml-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[12px] font-semibold text-white">Lowest net cost</span> : null}
          </p>
          <h3 className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
            {offer.seller} <span className="font-normal text-slate-700">· {row.option}</span>
          </h3>
          <p className="mt-0.5 text-[14px] text-slate-700">{offer.title}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5 text-[12.5px]">
            <li className={clsx("rounded-full px-2.5 py-1 font-medium", row.end === "return" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900")}>{END_LABEL[row.end]}</li>
            <li className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-800">{row.months} months</li>
            {condition ? <li className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-900">{condition}</li> : null}
            {offer.kind === "carrier" ? (
              <li className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-800">
                {offer.plan.name}, {offer.plan.data}
              </li>
            ) : null}
            {offer.source.verified === "secondary" ? <li className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-900">Not from the seller's page</li> : null}
          </ul>
        </div>
        <p className="shrink-0 text-right">
          <span className="block text-[26px] font-semibold leading-none tabular-nums text-slate-900">{money(row.netPerMonth)}</span>
          <span className="mt-1 block text-[13px] text-slate-600">net per month</span>
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-200 pt-4 sm:grid-cols-4">
        <Stat label="Due today" value={money(row.dueToday)}/>
        <Stat label="Each month" value={money(row.monthly)}/>
        <Stat label={row.end === "return" ? "At the end" : "Due at the end"} value={row.end === "return" ? "Return the phone" : money(row.dueAtEnd)}/>
        <Stat label={`Total paid, ${row.months} mo.`} value={money(row.totalPaid)}/>
      </dl>

      <details className="mt-3 text-[14px]">
        <summary className="cursor-pointer py-2 font-medium text-sky-800">How it's calculated</summary>
        <table className="mt-1 w-full tabular-nums">
          <tbody>
            {row.lines.map((line) => (
              <tr key={line.label} className={clsx("border-t border-slate-100", line.label === "Total paid" || line.label === "Net cost" ? "[&>*]:font-semibold" : "[&>*]:font-normal")}>
                <th scope="row" className="py-1.5 pr-3 text-left text-slate-700">
                  {line.label}
                </th>
                <td className="py-1.5 text-right text-slate-900">{money(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {offer.note ? <p className="mt-3 text-slate-700">{offer.note}</p> : null}
        <p className="mt-3 text-slate-700">
          Source:{" "}
          <a href={offer.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-800 underline">
            {offer.source.label}
          </a>
          , checked {offer.source.checked}.
        </p>
      </details>
    </li>
  );
};
