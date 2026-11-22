import type { ReactNode } from "react";
import clsx from "clsx";
import type { Phone } from "../../../types";
import { PhonePicture } from "../../PhonePicture/PhonePicture";

export interface PhoneCardProps {
  phone: Phone;
  selected: boolean;
  onSelect: () => void;
}

// One phone to pick, with its picture; the parent is a <ul>
export const PhoneCard = ({ phone, selected, onSelect }: PhoneCardProps): ReactNode => (
  <li>
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={clsx(
        "flex h-full w-full flex-col items-center gap-2 rounded-xl border bg-white px-2 pb-3 pt-2 text-center",
        selected ? "border-slate-900 shadow-[0_0_0_1px_#0f172a]" : "border-slate-200 hover:border-slate-500",
      )}
    >
      <PhonePicture src={phone.image} size={84}/>
      <span className="text-[13.5px] font-medium leading-snug text-slate-900">
        <span className="sr-only">{phone.brand} </span>
        {phone.name}
      </span>
      <span className="text-[12px] text-slate-600">{phone.storage}</span>
    </button>
  </li>
);
