import { type ReactNode, useMemo, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import { sans } from "../v2/fonts";
import { DEFAULT_REGION, regions } from "./regions";
import { OUTRIGHT_MONTHS, costRows } from "./tco";
import type { SortBy } from "./types";
import { Choice } from "./components/Choice/Choice";
import { NumberField } from "./components/NumberField/NumberField";
import { OfferTable } from "./components/OfferTable/OfferTable";

const SORTS: { value: SortBy; label: string }[] = [
  { value: "keep", label: "Keep it" },
  { value: "returned", label: "Return it" },
];

// /mobile: what a phone really costs in one province, from every place that
// sells it, in one table: returned under the seller's program beside kept,
// with the plan counted in both. A private tool: not in the sitemap, not
// linked, noindex. The prices are a snapshot (data/*.json), re-read by
// scripts/mobile-prices/update.mjs.
export const MobilePage = (): ReactNode => {
  const data = regions[DEFAULT_REGION];
  const { region } = data;
  const [phoneId, setPhoneId] = useState(data.phones[0].id);
  const [sortBy, setSortBy] = useState<SortBy>("keep");
  const [byodMonthly, setByodMonthly] = useState(data.byodPlan.monthly);

  const phone = data.phones.find((candidate) => candidate.id === phoneId) ?? data.phones[0];
  const rows = useMemo(
    () =>
      costRows(
        data.offers.filter((offer) => offer.phone === phone.id),
        region,
        { byodMonthly },
        sortBy,
      ),
    [data.offers, phone.id, region, byodMonthly, sortBy],
  );

  return (
    <>
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <title>{`Phone prices in ${region.name}`}</title>
        <meta name="robots" content="noindex, nofollow"/>
      </Head>
      {/* #__next doesn't scroll (globals.css), so the page scrolls in here */}
      <div className={clsx(sans.variable, "h-full overflow-y-auto bg-slate-50 font-[family-name:var(--font-v2-sans),system-ui,sans-serif] text-slate-900")}>
        <main className="mx-auto w-full max-w-[84rem] px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          <p className="text-[14px] font-medium text-slate-700">
            {region.name} · {region.taxLabel} · prices checked {region.checked}
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight sm:text-[38px]">What a phone really costs</h1>
          <p className="mt-3 max-w-[46rem] text-[16px] leading-relaxed text-slate-700">
            Every way to get the phone in {region.name}, by total cost of ownership: the device and the plan, with tax, over the whole term. Each seller is shown two ways, side by side: returning the phone under the seller's own return
            program, and keeping it.
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
            <section aria-labelledby="mobile-phone">
              <h2 id="mobile-phone" className="mb-2 text-[14px] font-medium">
                Phone
              </h2>
              <Choice label="Phone" options={data.phones.map((item) => ({ value: item.id, label: `${item.name} ${item.storage}` }))} value={phone.id} onChange={setPhoneId}/>
            </section>
            <section aria-labelledby="mobile-sort">
              <h2 id="mobile-sort" className="mb-2 text-[14px] font-medium">
                Cheapest first for
              </h2>
              <Choice label="Cheapest first for" options={SORTS} value={sortBy} onChange={setSortBy}/>
            </section>
            <div className="w-full max-w-[19rem]">
              <NumberField label="Your own plan, per month before tax" hint={`For phones bought unlocked. Starts at ${data.byodPlan.name}.`} value={byodMonthly} onChange={setByodMonthly}/>
            </div>
          </div>

          <section aria-labelledby="mobile-options" className="mt-8">
            <h2 id="mobile-options" className="text-[20px] font-semibold">
              {phone.name} {phone.storage}: {rows.length} offers
            </h2>
            <p className="mt-1 text-[14px] text-slate-700 md:hidden">The table is wider than this screen: scroll it sideways.</p>
            <div className="mt-4">
              <OfferTable caption={`${phone.name} ${phone.storage} in ${region.name}: each offer returned and kept`} rows={rows}/>
            </div>
          </section>

          <section aria-labelledby="mobile-method" className="mt-12 max-w-[46rem] text-[15px] leading-relaxed text-slate-700">
            <h2 id="mobile-method" className="text-[20px] font-semibold text-slate-900">
              How this is worked out
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Total, plan included</strong> is everything paid over the term with {region.taxLabel}: what is due today, the device payments, the plan, and anything due at the end. Below it is the same amount per month, which is
                what offers of different lengths compare on.
              </li>
              <li>
                <strong>Return it</strong> is only filled in when the seller has its own return program: Bell's Device Return Option, Rogers' Save &amp; Return, Telus's Bring-It-Back, Freedom's TradeUp and Best Buy's Monthly Subscription.
                The phone goes back in good working order when the term ends. No resale value is assumed anywhere.
              </li>
              <li>
                <strong>Keep it</strong> is any way the phone is still yours after the term: paid in full, financed, or a return program paid off at the end. Where a carrier has two ways, the cheaper one is shown and named.
              </li>
              <li>
                A carrier deal comes with the plan it requires. A phone bought unlocked uses your own plan, above, over {OUTRIGHT_MONTHS} months. Device payments are as billed; plan prices are shown with tax.
              </li>
              <li>Carriers charge the tax on the phone's full price on day one. Best Buy's monthly program charges it on each payment.</li>
              <li>Trade-ins, student and employee discounts and in-store-only offers are not counted. Prices are a snapshot from the date above: open the source before buying.</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};
