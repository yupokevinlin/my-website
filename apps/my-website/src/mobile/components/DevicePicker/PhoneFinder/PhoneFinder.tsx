import { type ReactNode, useId, useMemo, useState } from "react";
import clsx from "clsx";
import { searchPhones } from "../../../search";
import type { Phone } from "../../../types";
import { Choice, type ChoiceOption } from "../../Choice/Choice";
import { PhoneCard } from "../PhoneCard/PhoneCard";

export interface PhoneFinderProps {
  phones: Phone[];
  selected: string;
  onSelect: (id: string) => void;
  // "grid": cards with big pictures (wide screens); "list": one phone a line (the phone menu)
  layout: "grid" | "list";
  autoFocus?: boolean;
}

const ALL = "All";

// Each brand's mark for its button, from public/resources/images/mobile/
// (Samsung and Google from Simple Icons, CC0); a brand without one shows its name
const BRAND_ICONS: Record<string, ChoiceOption<string>["icon"]> = {
  Apple: { src: "/resources/images/mobile/apple.svg", width: 17, height: 20 },
  Samsung: { src: "/resources/images/mobile/brand-samsung.svg", width: 78, height: 12 },
  Google: { src: "/resources/images/mobile/brand-google.svg", width: 19, height: 19 },
};

// Finding the phone: a forgiving search box ("s26u", "pixle 10 pro"), the
// brands, and the matching phones, newest first
export const PhoneFinder = ({ phones, selected, onSelect, layout, autoFocus }: PhoneFinderProps): ReactNode => {
  const id = useId();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState(ALL);
  const brands = useMemo(() => [ALL, ...new Set(phones.map((phone) => phone.brand))], [phones]);
  const shown = useMemo(() => searchPhones(phones, query).filter((phone) => brand === ALL || phone.brand === brand), [phones, query, brand]);
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="w-full max-w-[24rem]">
          <label htmlFor={`${id}-search`} className="block text-[14px] font-medium text-slate-900">
            Find a phone
          </label>
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="iPhone 18 Pro, s26 ultra, pixel 10…"
            autoComplete="off"
            // In the phone menu, typing starts at once
            autoFocus={autoFocus}
            aria-controls={`${id}-results`}
            className="mt-1 h-11 w-full rounded-lg border border-blue-200 bg-white px-3 text-[16px] text-slate-900 outline-none placeholder:text-slate-500 focus:border-violet-600 focus:shadow-[0_0_0_1px_#7c3aed]"
          />
        </div>
        <Choice label="Brand" options={brands.map((name) => ({ value: name, label: name, icon: BRAND_ICONS[name] }))} value={brand} onChange={setBrand}/>
      </div>
      <p id={`${id}-count`} className="mt-3 text-[13px] text-slate-600" aria-live="polite">
        {shown.length ? `${shown.length} ${shown.length === 1 ? "phone" : "phones"}` : `No phone matches “${query}”`}
      </p>
      <ul
        id={`${id}-results`}
        aria-describedby={`${id}-count`}
        className={clsx("mt-2 grid gap-2", layout === "grid" ? "max-h-[26rem] grid-cols-4 overflow-y-auto pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin] lg:grid-cols-6 xl:grid-cols-8" : "grid-cols-1")}
      >
        {shown.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} selected={phone.id === selected} onSelect={() => onSelect(phone.id)} layout={layout}/>
        ))}
      </ul>
    </div>
  );
};
