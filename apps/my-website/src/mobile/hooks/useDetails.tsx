import { type ReactNode, useId, useState } from "react";

export interface Details {
  id: string;
  open: boolean;
  // The "Details" button for the offer's row; `subject` names the offer for screen readers
  button: (subject: string) => ReactNode;
}

// Opens and closes an offer's DetailsRow from a button in its row
export const useDetails = (): Details => {
  const id = useId();
  const [open, setOpen] = useState(false);
  return {
    id,
    open,
    button: (subject) => (
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} className="min-h-11 rounded-lg px-2 text-[14px] font-medium text-sky-800 underline">
        {open ? "Hide" : "Details"}
        <span className="sr-only"> for {subject}</span>
      </button>
    ),
  };
};
