import type { NextPage } from "next";
import { MobilePage } from "../src/mobile/MobilePage";

// Phone prices in British Columbia, compared by total cost of ownership. A
// private tool: English only, noindex, not in the sitemap and not linked from
// any page, so it has no copy under pages/[locale]/.
const Mobile: NextPage = () => <MobilePage/>;

export default Mobile;
