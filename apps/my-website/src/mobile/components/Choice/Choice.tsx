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
          option.value === value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-400 bg-white text-slate-800 hover:border-slate-900",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
