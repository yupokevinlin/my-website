import type { ReactNode } from "react";
import clsx from "clsx";

export interface ChoiceOption<T extends string | number> {
  value: T;
  label: string;
  // A one-colour mark shown in place of the label (which screen readers
  // still get), drawn in the button's text colour: its file, and its size in px
  icon?: { src: string; width: number; height: number };
}

export interface ChoiceProps<T extends string | number> {
  // Names the group for screen readers
  label: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// A row of buttons where one is chosen: the brand, the storage, the order.
// Every button in a row is as wide as the widest (equal grid columns); on a
// narrow screen they shrink together, and a mark shrinks with its button.
// Rows hold four buttons at most, so they never need to wrap.
export const Choice = <T extends string | number>({ label, options, value, onChange }: ChoiceProps<T>): ReactNode => (
  <div role="group" aria-label={label} className="inline-grid max-w-full grid-flow-col auto-cols-[minmax(0,1fr)] gap-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
        className={clsx(
          "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border px-3 text-[15px] font-medium sm:px-4",
          option.value === value ? "border-transparent bg-linear-to-r from-blue-600 to-violet-600 text-white shadow-sm shadow-violet-200" : "border-blue-200 bg-white text-slate-800 hover:border-violet-400",
        )}
      >
        {option.icon ? (
          <>
            {/* The mark as a mask over the text colour, so it turns white when chosen */}
            <span
              aria-hidden="true"
              className="block bg-current"
              style={{
                width: option.icon.width,
                maxWidth: "100%",
                aspectRatio: `${option.icon.width} / ${option.icon.height}`,
                maskImage: `url(${option.icon.src})`,
                WebkitMaskImage: `url(${option.icon.src})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
            <span className="sr-only">{option.label}</span>
          </>
        ) : (
          option.label
        )}
      </button>
    ))}
  </div>
);
