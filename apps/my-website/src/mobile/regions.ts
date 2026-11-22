import bc from "./data/bc.json";
import type { RegionData } from "./types";

// Prices, taxes, fees and carriers' offers differ by province, so each region
// has its own data file. Only British Columbia so far: to add one, add its
// file under data/ and its entry here.
export const regions = { bc: bc as RegionData } satisfies Record<string, RegionData>;

export const DEFAULT_REGION: keyof typeof regions = "bc";
