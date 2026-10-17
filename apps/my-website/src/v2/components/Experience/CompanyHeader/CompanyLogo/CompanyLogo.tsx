import type { ReactNode } from "react";

export interface CompanyLogoProps {
  src: string;
}

// The company's square mark on a white tile (decorative: the name is next to it)
export const CompanyLogo = ({ src }: CompanyLogoProps): ReactNode => (
  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--v2-line)] bg-white p-1.5 md:h-14 md:w-14 md:rounded-2xl md:p-2">
    <img src={src} alt="" aria-hidden="true" loading="lazy" className="max-h-full max-w-full object-contain"/>
  </div>
);
