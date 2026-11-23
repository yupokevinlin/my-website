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
  // Equal columns, so every colour's button is the same size whatever its name
  <div role="group" aria-label="Colour" className="grid grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] gap-2">
    {colours.map((colour) => {
      const chosen = colour.name === value;
      return (
        <button
          key={colour.name}
          type="button"
          aria-pressed={chosen}
          onClick={() => onChange(colour.name)}
          className={clsx(
            "flex h-full items-center gap-2.5 rounded-2xl text-left border-2 bg-white py-1.5 pl-1.5 pr-4 text-[15px] font-medium text-slate-800",
            chosen ? "border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#2563eb,#7c3aed)_border-box]" : "border-blue-100 hover:border-violet-300",
          )}
        >
          {/* Decorative: the name beside it says which colour. The whole
              picture shows (contain, no round crop), since it's a phone, not a dot */}
          <img src={colour.image} alt="" aria-hidden="true" width={56} height={56} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-14 w-14 rounded-lg bg-white object-contain"/>
          {colour.name}
        </button>
      );
    })}
  </div>
);
