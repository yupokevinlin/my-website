import { type ReactNode, useId } from "react";

export interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

// A dollar amount the visitor can change
export const NumberField = ({ label, hint, value, onChange, step = 1 }: NumberFieldProps): ReactNode => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-slate-900">
        {label}
      </label>
      <div className="mt-1 flex items-center rounded-lg border border-blue-200 bg-white focus-within:border-violet-600 focus-within:shadow-[0_0_0_1px_#7c3aed]">
        <span aria-hidden="true" className="pl-3 text-slate-600">
          $
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(event) => onChange(Math.max(0, event.target.valueAsNumber || 0))}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-11 w-full min-w-0 bg-transparent px-2 text-[16px] tabular-nums text-slate-900 outline-none"
        />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[13px] text-slate-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
