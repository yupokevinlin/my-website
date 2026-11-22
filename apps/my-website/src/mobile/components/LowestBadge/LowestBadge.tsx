import type { ReactNode } from "react";

// Marks the cheapest option in a table
export const LowestBadge = (): ReactNode => <span className="mt-1 inline-block rounded-full bg-linear-to-r from-blue-600 to-violet-600 px-2 py-0.5 text-[12px] font-semibold text-white">Lowest</span>;
