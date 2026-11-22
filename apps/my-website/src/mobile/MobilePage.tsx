import { type ReactNode, useMemo, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import { sans } from "../v2/fonts";
import { DEFAULT_REGION, regions } from "./regions";
import { OUTRIGHT_MONTHS, costRows, groupBySeller } from "./tco";
import type { SortBy } from "./types";
import { Choice } from "./components/Choice/Choice";
import { DevicePicker } from "./components/DevicePicker/DevicePicker";
import { PhonePicture } from "./components/PhonePicture/PhonePicture";
import { NumberField } from "./components/NumberField/NumberField";
import { OfferTable } from "./components/OfferTable/OfferTable";
import { OutrightTable } from "./components/OutrightTable/OutrightTable";

const SORTS: { value: SortBy; label: string }[] = [
  { value: "keep", label: "Keep it" },
  { value: "returned", label: "Return it" },
];

// /mobile: what a phone really costs in one province, from every place that
// sells it, in two sections: unlocked phones paid in full, and phones paid by
// the month, where each seller's plan tiers show returned under the seller's
// program beside kept. The plan is counted everywhere. A private tool: not in the sitemap, not
// linked, noindex. The prices are a snapshot (data/*.json), re-read by
// scripts/mobile-prices/update.mjs.
export const MobilePage = (): ReactNode => {
  const data = regions[DEFAULT_REGION];
  const { region } = data;
  const [phoneId, setPhoneId] = useState(data.phones[0].id);
  const [sortBy, setSortBy] = useState<SortBy>("keep");
  const [byodMonthly, setByodMonthly] = useState(data.byodPlan.monthly);

  const phone = data.phones.find((candidate) => candidate.id === phoneId) ?? data.phones[0];
  const { unlocked, monthly } = useMemo(() => {
    const offers = data.offers.filter((offer) => offer.phone === phone.id);
    const settings = { byodMonthly };
    return {
      unlocked: costRows(
        offers.filter((offer) => offer.kind === "outright"),
        region,
        settings,
      ),
      monthly: groupBySeller(
        costRows(
          offers.filter((offer) => offer.kind !== "outright"),
          region,
          settings,
          sortBy,
        ),
      ),
    };
  }, [data.offers, phone.id, region, byodMonthly, sortBy]);
  const name = `${phone.name} ${phone.storage}`;

  return (
    <>
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <title>{`Phone prices in ${region.name}`}</title>
        <meta name="robots" content="noindex, nofollow"/>
      </Head>
      {/* #__next doesn't scroll (globals.css), so the page scrolls in here.
          relative: screen-reader-only text is positioned against this box;
          without it, it stretched the document far below the page */}
      <div className={clsx(sans.variable, "relative h-full overflow-y-auto [scrollbar-gutter:stable] bg-linear-to-br from-sky-50 via-blue-50 to-violet-100 [background-attachment:local] font-[family-name:var(--font-v2-sans),system-ui,sans-serif] text-slate-900")}>
        <main className="mx-auto w-full max-w-[84rem] px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          {/* Kevin asked for no visible header; the title stays for screen readers */}
          <h1 className="sr-only">Phone prices in {region.name}</h1>

          <section aria-labelledby="mobile-phone">
            <h2 id="mobile-phone" className="w-fit bg-linear-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent text-[22px] font-semibold">
              Phone
            </h2>
            <div className="mt-3">
              <DevicePicker phones={data.phones} selected={phone.id} onSelect={setPhoneId}/>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-2xl border border-blue-100 bg-linear-to-r from-white via-blue-50 to-violet-100 p-4 shadow-sm shadow-blue-100 sm:p-5">
            <div className="flex items-center gap-4">
              <PhonePicture src={phone.image} size={112}/>
              <div>
                <p className="text-[14px] text-slate-600">{phone.brand}</p>
                <p className="text-[26px] font-semibold leading-tight">{phone.name}</p>
                <p className="text-[15px] text-slate-700">{phone.storage}</p>
              </div>
            </div>
            <div className="w-full max-w-[19rem]">
              <NumberField label="Your own plan, per month before tax" hint={`For phones bought unlocked. Starts at ${data.byodPlan.name}.`} value={byodMonthly} onChange={setByodMonthly}/>
            </div>
          </div>

          <section aria-labelledby="mobile-unlocked" className="mt-10">
            <h2 id="mobile-unlocked" className="w-fit bg-linear-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent text-[22px] font-semibold">
              Unlocked, paid in full
            </h2>
            <p className="mt-1 max-w-[46rem] text-[15px] text-slate-700">
              Buy the {name} outright and bring it to any plan. Costed over {OUTRIGHT_MONTHS} months on your own plan, cheapest first.
            </p>
            <div className="mt-4">
              {unlocked.length ? <OutrightTable caption={`${name} unlocked in ${region.name}, paid in full`} rows={unlocked}/> : <p className="rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100 p-4 text-[15px] text-slate-700">No store in the list sells the {name} unlocked and new.</p>}
            </div>
          </section>

          <section aria-labelledby="mobile-monthly" className="mt-12">
            <h2 id="mobile-monthly" className="w-fit bg-linear-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent text-[22px] font-semibold">
              Pay per month
            </h2>
            <p className="mt-1 max-w-[46rem] text-[15px] text-slate-700">
              Carrier financing with the plan it requires, and Best Buy's monthly program on your own plan. Each seller is listed once with its plan tiers beneath, cheapest first.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p id="mobile-sort" className="text-[14px] font-medium">
                Cheapest first for
              </p>
              <Choice label="Cheapest first for" options={SORTS} value={sortBy} onChange={setSortBy}/>
            </div>
            <p className="mt-3 text-[14px] text-slate-700 md:hidden">The table is wider than this screen: scroll it sideways.</p>
            <div className="mt-4">
              {monthly.length ? <OfferTable caption={`${name} in ${region.name}, paid by the month: each plan returned and kept`} groups={monthly}/> : <p className="rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100 p-4 text-[15px] text-slate-700">No carrier or store in the list sells the {name} by the month.</p>}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};
