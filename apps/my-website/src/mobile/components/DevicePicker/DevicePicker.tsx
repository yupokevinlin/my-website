import type { ReactNode } from "react";
import type { Phone } from "../../types";
import { DeviceMenu } from "./DeviceMenu/DeviceMenu";
import { PhoneFinder } from "./PhoneFinder/PhoneFinder";

export interface DevicePickerProps {
  phones: Phone[];
  selected: string;
  onSelect: (id: string) => void;
  // On phones, the menu's button stands for the chosen phone: the chosen
  // colour's picture, and its storage and colour ("256GB · Night Sky")
  picture?: string;
  detail?: string;
}

// Choosing the phone. Wider screens get the search, the brands and a grid of
// cards in the page; phones get one button that opens them as a menu.
export const DevicePicker = ({ phones, selected, onSelect, picture, detail }: DevicePickerProps): ReactNode => (
  <>
    <div className="sm:hidden">
      <DeviceMenu phones={phones} selected={selected} onSelect={onSelect} picture={picture} detail={detail}/>
    </div>
    <div className="hidden sm:block">
      <PhoneFinder phones={phones} selected={selected} onSelect={onSelect} layout="grid"/>
    </div>
  </>
);
