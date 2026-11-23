import type { ReactNode } from "react";
import type { CostRow } from "../../types";
import { OutrightCard } from "./OutrightCard/OutrightCard";

export interface OutrightCardsProps {
  caption: string;
  // Phones paid in full, cheapest first
  rows: CostRow[];
}

// The paid-in-full table on phones: a card per seller, cheapest first
export const OutrightCards = ({ caption, rows }: OutrightCardsProps): ReactNode => (
  <ul aria-label={caption} className="grid gap-3">
    {rows.map((row, index) => (
      <OutrightCard key={row.offer.id} row={row} best={index === 0}/>
    ))}
  </ul>
);
