import type { ReactNode } from "react";
import { type SellerGroup, lowestOf } from "../../tco";
import type { RankBy } from "../../types";
import { OfferCard } from "./OfferCard/OfferCard";
import { SellerLogo } from "../SellerLogo/SellerLogo";

export interface OfferCardsProps {
  // What the list is, for screen readers
  caption: string;
  groups: SellerGroup[];
  rankBy: RankBy;
}

// The monthly table on phones: a card per seller, cheapest first, holding
// each of its plan tiers with Return it and Keep it side by side
export const OfferCards = ({ caption, groups, rankBy }: OfferCardsProps): ReactNode => {
  const rows = groups.flatMap((group) => group.rows);
  const best = lowestOf(rows, rankBy);
  const badge = rankBy === "total" ? "Lowest" : "Lowest per month";
  const maxGb = Math.max(1, ...rows.map(({ offer }) => (offer.kind === "carrier" && offer.plan.gb !== "unlimited" ? offer.plan.gb : 0)));
  return (
    <ul aria-label={caption} className="grid gap-4">
      {groups.map((group) => (
        <li key={group.key} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-blue-100 px-4 py-3">
            <SellerLogo seller={group.seller}/>
            {group.via ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-900">from {group.via}</span> : null}
            <span className="w-full text-[13px] text-slate-600">{group.rows[0].offer.title}</span>
          </div>
          <ul>
            {group.rows.map((row) => (
              <OfferCard key={row.offer.id} row={row} maxGb={maxGb} bestKeep={row.keep[rankBy] === best.keep} bestReturn={row.returned?.[rankBy] === best.returned} badge={badge}/>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
