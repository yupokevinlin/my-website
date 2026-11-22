import type { ReactNode } from "react";
import clsx from "clsx";
import { CheckIcon } from "../../../../v2/components/icons/CheckIcon/CheckIcon";
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
        "relative flex h-full w-full flex-col items-center gap-2 rounded-xl border px-2 pb-3 pt-2 text-center",
        // White either way: the pictures have white backgrounds. An inset
        // ring, so the scrolling list can't clip it.
        selected ? "border-sky-700 bg-white ring-1 ring-inset ring-sky-700" : "border-slate-200 bg-white hover:border-slate-400",
      )}
    >
      {selected ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-700 text-white">
          <CheckIcon width={12} height={12} strokeWidth={3}/>
        </span>
      ) : null}
      <PhonePicture src={phone.image} size={84}/>
      <span className="text-[13.5px] font-medium leading-snug text-slate-900">
        <span className="sr-only">{phone.brand} </span>
        {phone.name}
      </span>
      <span className="text-[12px] text-slate-600">{phone.storage}</span>
    </button>
  </li>
);
