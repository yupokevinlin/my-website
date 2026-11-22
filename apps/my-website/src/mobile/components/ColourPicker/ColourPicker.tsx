import type { ReactNode } from "react";
import clsx from "clsx";
import type { Colour } from "../../types";

export interface ColourPickerProps {
  colours: Colour[];
  value: string;
  onChange: (name: string) => void;
}

// The phone's colours, each shown as Best Buy's picture of it with its name,
// as Best Buy's own pages do. Choosing one shows that colour in the card; the
// prices are the same for every colour.
export const ColourPicker = ({ colours, value, onChange }: ColourPickerProps): ReactNode => (
  <div role="group" aria-label="Colour" className="flex flex-wrap gap-2">
    {colours.map((colour) => {
      const chosen = colour.name === value;
      return (
        <button
          key={colour.name}
          type="button"
          aria-pressed={chosen}
          onClick={() => onChange(colour.name)}
          className={clsx(
            "flex min-h-11 items-center gap-2 rounded-full border-2 bg-white py-1 pl-1 pr-3 text-[14px] font-medium text-slate-800",
            chosen ? "border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#2563eb,#7c3aed)_border-box]" : "border-blue-100 hover:border-violet-300",
          )}
        >
          {/* Decorative: the name beside it says which colour */}
          <img src={colour.image} alt="" aria-hidden="true" width={32} height={32} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full bg-white object-contain"/>
          {colour.name}
        </button>
      );
    })}
  </div>
);
