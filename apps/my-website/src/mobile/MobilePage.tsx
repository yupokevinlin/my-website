import { type ReactNode, useMemo, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import { sans } from "../v2/fonts";
import { DEFAULT_REGION, regions } from "./regions";
import { costRows } from "./tco";
import type { EndState, Settings } from "./types";
import { Choice } from "./components/Choice/Choice";
import { NumberField } from "./components/NumberField/NumberField";
import { OfferCard } from "./components/OfferCard/OfferCard";

type Filter = "all" | "keep" | "return";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All options" },
  { value: "keep", label: "Keep the phone" },
  { value: "return", label: "Return the phone" },
];
const KEPT: EndState[] = ["own", "keep"];

// /mobile: what a phone really costs in one province, from every place that
// sells it, whether it is bought outright, financed and kept, or returned at
// the end. A private tool: not in the sitemap, not linked, noindex. The prices
// are a snapshot (data/*.json), re-read by scripts/mobile-prices/update.mjs.
export const MobilePage = (): ReactNode => {
  const data = regions[DEFAULT_REGION];
  const { region } = data;
  const [phoneId, setPhoneId] = useState(data.phones[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [byodMonthly, setByodMonthly] = useState(data.byodPlan.monthly);
  const [includePlan, setIncludePlan] = useState(true);
  const [horizonMonths, setHorizonMonths] = useState<24 | 36>(24);
  // Resale values the visitor typed, per phone; the rest come from the data
  const [resale, setResale] = useState<Record<string, { months24?: number; months36?: number }>>({});

  const phone = data.phones.find((candidate) => candidate.id === phoneId) ?? data.phones[0];
  const settings: Settings = {
    byodMonthly,
    includePlan,
    horizonMonths,
    resale24: resale[phone.id]?.months24 ?? phone.resale.months24,
    resale36: resale[phone.id]?.months36 ?? phone.resale.months36,
  };
  const { byodMonthly: plan, resale24, resale36 } = settings;
  const rows = useMemo(
    () =>
      costRows(
        data.offers.filter((offer) => offer.phone === phone.id),
        region,
        { byodMonthly: plan, includePlan, horizonMonths, resale24, resale36 },
      ),
    [data.offers, phone.id, region, plan, includePlan, horizonMonths, resale24, resale36],
  );
  const shown = rows.filter((row) => filter === "all" || (filter === "return" ? row.end === "return" : KEPT.includes(row.end)));
  const setPhoneResale = (key: "months24" | "months36") => (value: number) => setResale((current) => ({ ...current, [phone.id]: { ...current[phone.id], [key]: value } }));

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
        <main className="mx-auto w-full max-w-[60rem] px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          <p className="text-[14px] font-medium text-slate-700">
            {region.name} · {region.taxLabel} · prices checked {region.checked}
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight sm:text-[38px]">What a phone really costs</h1>
          <p className="mt-3 max-w-[44rem] text-[16px] leading-relaxed text-slate-700">
            Every way to get the phone in {region.name}, ranked by total cost of ownership: all the payments for the phone and its plan, with tax, less what the phone is worth when the term ends. A phone that goes back is worth nothing
            to you, so “return it” and “keep it” deals compare on one number.
          </p>

          <section aria-labelledby="mobile-phone" className="mt-8">
            <h2 id="mobile-phone" className="text-[20px] font-semibold">
              Phone
            </h2>
            <div className="mt-3">
              <Choice label="Phone" options={data.phones.map((item) => ({ value: item.id, label: `${item.name} ${item.storage}` }))} value={phone.id} onChange={setPhoneId}/>
            </div>
          </section>

          <section aria-labelledby="mobile-numbers" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 id="mobile-numbers" className="text-[20px] font-semibold">
              Your numbers
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <NumberField label="Your own plan, per month" hint={`Used for unlocked phones. Starts at ${data.byodPlan.name} (${data.byodPlan.data}).`} value={byodMonthly} onChange={setByodMonthly}/>
              <NumberField label="Resale value after 24 months" hint={phone.resale.basis} value={settings.resale24} onChange={setPhoneResale("months24")} step={10}/>
              <NumberField label="Resale value after 36 months" value={settings.resale36} onChange={setPhoneResale("months36")} step={10}/>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p className="mb-2 text-[14px] font-medium">An unlocked phone is kept for</p>
                <Choice
                  label="An unlocked phone is kept for"
                  options={[
                    { value: 24, label: "24 months" },
                    { value: 36, label: "36 months" },
                  ]}
                  value={horizonMonths}
                  onChange={setHorizonMonths}
                />
              </div>
              <label className="flex min-h-11 items-center gap-2.5 text-[15px]">
                <input type="checkbox" checked={includePlan} onChange={(event) => setIncludePlan(event.target.checked)} className="h-5 w-5 accent-slate-900"/>
                Count the plan in the totals
              </label>
            </div>
          </section>

          <section aria-labelledby="mobile-options" className="mt-10">
            <h2 id="mobile-options" className="text-[20px] font-semibold">
              {phone.name} {phone.storage}: {shown.length} options, cheapest first
            </h2>
            <div className="mt-3">
              <Choice label="Show" options={FILTERS} value={filter} onChange={setFilter}/>
            </div>
            <ol className="mt-5 grid grid-cols-1 gap-4">
              {shown.map((row, index) => (
                <OfferCard key={row.id} row={row} rank={index + 1} best={index === 0}/>
              ))}
            </ol>
          </section>

          <section aria-labelledby="mobile-method" className="mt-12 max-w-[44rem] text-[15px] leading-relaxed text-slate-700">
            <h2 id="mobile-method" className="text-[20px] font-semibold text-slate-900">
              How this is worked out
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Net cost</strong> is everything paid over the term, with {region.taxLabel}, less the phone's resale value if it is still yours at the end. <strong>Net per month</strong> divides that by the months, so a 24-month
                carrier deal and a 36-month store program compare fairly.
              </li>
              <li>
                <strong>Return it</strong> deals have lower payments because part of the price is left out. At the end the phone goes back in good working order, or that amount is paid to keep it. A damaged phone can cost a fee.
              </li>
              <li>A carrier deal comes with the plan it requires. An unlocked phone uses your own plan, above. Untick the plan to compare the phones alone.</li>
              <li>Carriers charge the tax on the phone's full price on day one. Best Buy's monthly program charges it on each payment.</li>
              <li>Trade-ins, student and employee discounts and in-store-only offers are not counted. Prices are a snapshot from the date above: open the source before buying.</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};
