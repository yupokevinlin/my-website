import type { ReactNode } from "react";
import clsx from "clsx";
import type { Company } from "../../../../data/experience";
import { useLocale, useMessages } from "../../../../i18n/LocaleContext";
import { companySpan } from "../dates";
import { CompanyLogo } from "./CompanyLogo/CompanyLogo";

export interface CompanyHeaderProps {
  company: Company;
  // The company name inside the h3: a link to its site, or the button that
  // opens folded roles
  title: ReactNode;
  className?: string;
  // Anything at the end of the row, such as a chevron
  children?: ReactNode;
}

// Logo, name, dates and what the company does
export const CompanyHeader = ({ company, title, className, children }: CompanyHeaderProps): ReactNode => {
  const { range, duration } = companySpan(company, useLocale(), useMessages());
  return (
    <div className={clsx("flex items-start gap-4", className)}>
      <CompanyLogo src={company.logo}/>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
          <h3 className="text-[21px] font-bold tracking-[-0.015em] text-[var(--v2-ink)]">{title}</h3>
          <p className="text-[14px] font-medium text-[var(--v2-muted)]">{range} · {duration}</p>
        </div>
        <p className="mt-0.5 text-[14.5px] text-[var(--v2-muted)]">{company.about}</p>
      </div>
      {children}
    </div>
  );
};
