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
        "relative flex h-full w-full flex-col items-center gap-2 rounded-xl border-2 px-2 pb-3 pt-2 text-center",
        // White inside either way, since the pictures have white backgrounds.
        // The chosen card's border is the blue-to-purple gradient: white over
        // the padding, the gradient under the border.
        selected
          ? "border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#2563eb,#7c3aed)_border-box] shadow-md shadow-violet-200"
          : "border-blue-100 bg-white hover:border-violet-300",
      )}
    >
      {selected ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-violet-600 text-white">
          <CheckIcon width={12} height={12} strokeWidth={3}/>
        </span>
      ) : null}
      <PhonePicture src={phone.image} size={84}/>
      <span className="text-[13.5px] font-medium leading-snug text-slate-900">
        <span className="sr-only">{phone.brand} </span>
        {phone.name}
      </span>
      {/* Its storage sizes, smallest to largest */}
      <span className="text-[12px] text-slate-600">{phone.storages.length > 1 ? `${phone.storages[0]} – ${phone.storages[phone.storages.length - 1]}` : phone.storages[0]}</span>
    </button>
  </li>
);
