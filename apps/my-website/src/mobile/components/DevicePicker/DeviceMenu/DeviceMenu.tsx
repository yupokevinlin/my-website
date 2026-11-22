import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { Phone } from "../../../types";
import { PhonePicture } from "../../PhonePicture/PhonePicture";
import { PhoneFinder } from "../PhoneFinder/PhoneFinder";

export interface DeviceMenuProps {
  phones: Phone[];
  selected: string;
  onSelect: (id: string) => void;
  // The chosen colour's picture, and the storage and colour line
  picture?: string;
  detail?: string;
}

// On phones: the chosen phone as one button, which opens a full-screen menu
// with the search, the brands and the phones, one a line. Picking one closes
// it. A native <dialog>, so focus stays inside and Escape closes it.
export const DeviceMenu = ({ phones, selected, onSelect, picture, detail }: DeviceMenuProps): ReactNode => {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const current = phones.find((phone) => phone.id === selected);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    // jsdom has no showModal; the menu is for real phones
    if (open && !element.open) element.showModal?.();
    if (!open && element.open) element.close?.();
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Change phone, now ${current?.brand ?? ""} ${current?.name ?? ""}`}
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-blue-200 bg-white py-2 pl-2 pr-4 text-left shadow-sm shadow-blue-100"
      >
        <PhonePicture src={picture ?? current?.image} size={72}/>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] text-slate-600">{current?.brand}</span>
          <span className="block text-[19px] font-semibold leading-snug text-slate-900">{current?.name}</span>
          {detail ? <span className="block text-[14px] text-slate-700">{detail}</span> : null}
        </span>
        <span className="text-[15px] font-medium text-violet-800">
          Change
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        onClose={() => setOpen(false)}
        className="m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden bg-white p-0 text-slate-900 backdrop:bg-slate-900/40"
      >
        {open ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-blue-100 py-2 pl-4 pr-2">
              <h2 id={`${id}-title`} className="text-[18px] font-semibold">
                Choose a phone
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-lg px-3 text-[15px] font-medium text-violet-800">
                Done
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-3">
              <PhoneFinder
                phones={phones}
                selected={selected}
                onSelect={(phone) => {
                  onSelect(phone);
                  setOpen(false);
                }}
                layout="list"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
};
