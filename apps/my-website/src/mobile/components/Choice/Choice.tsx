import type { ReactNode } from "react";
import clsx from "clsx";

export interface ChoiceProps<T extends string | number> {
  // Names the group for screen readers
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

// A row of buttons where one is chosen: the phone, the filter, the months
export const Choice = <T extends string | number>({ label, options, value, onChange }: ChoiceProps<T>): ReactNode => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
        className={clsx(
          "min-h-11 rounded-full border px-4 text-[15px] font-medium",
          option.value === value ? "border-transparent bg-linear-to-r from-blue-600 to-violet-600 text-white shadow-sm shadow-violet-200" : "border-blue-200 bg-white text-slate-800 hover:border-violet-400",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
