import { type ReactNode, useId, useMemo, useState } from "react";
import { searchPhones } from "../../search";
import type { Phone } from "../../types";
import { Choice } from "../Choice/Choice";
import { PhoneCard } from "./PhoneCard/PhoneCard";

export interface DevicePickerProps {
  phones: Phone[];
  selected: string;
  onSelect: (id: string) => void;
}

const ALL = "All";

// Choosing the phone: a forgiving search box ("s26u", "pixle 10 pro"), the
// brands, and the matching phones as cards with their pictures, newest first
export const DevicePicker = ({ phones, selected, onSelect }: DevicePickerProps): ReactNode => {
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
            aria-controls={`${id}-results`}
            className="mt-1 h-11 w-full rounded-lg border border-slate-400 bg-white px-3 text-[16px] text-slate-900 outline-none placeholder:text-slate-500 focus:border-sky-700 focus:shadow-[0_0_0_1px_#0369a1]"
          />
        </div>
        <Choice label="Brand" options={brands.map((name) => ({ value: name, label: name }))} value={brand} onChange={setBrand}/>
      </div>
      <p id={`${id}-count`} className="mt-3 text-[13px] text-slate-600" aria-live="polite">
        {shown.length ? `${shown.length} ${shown.length === 1 ? "phone" : "phones"}` : `No phone matches “${query}”`}
      </p>
      <ul id={`${id}-results`} aria-describedby={`${id}-count`} className="mt-2 grid max-h-[26rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {shown.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} selected={phone.id === selected} onSelect={() => onSelect(phone.id)}/>
        ))}
      </ul>
    </div>
  );
};
