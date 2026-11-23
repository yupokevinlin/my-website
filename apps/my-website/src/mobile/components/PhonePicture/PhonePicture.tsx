import type { ReactNode } from "react";
import clsx from "clsx";

export interface PhonePictureProps {
  // Best Buy's picture of the phone, if it has one
  src?: string;
  // The box the picture fits in, in px
  size: number;
  className?: string;
}

// A phone's picture. It always sits beside the phone's name, so it is
// decorative; without a picture, a plain phone outline holds its place.
export const PhonePicture = ({ src, size, className }: PhonePictureProps): ReactNode => (
  <span aria-hidden="true" className={clsx("flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white", className)} style={{ width: size, height: size }}>
    {src ? (
      <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-contain"/>
    ) : (
      <span className="block rounded-[22%] border-2 border-blue-200" style={{ width: size * 0.4, height: size * 0.75 }}/>
    )}
  </span>
);
