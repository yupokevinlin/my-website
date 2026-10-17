import type { ReactNode } from "react";
import type { Company } from "../../../../data/experience";
import { Chip } from "../../Chip/Chip";
import { CompanyHeader } from "../CompanyHeader/CompanyHeader";
import { ExperienceCard } from "../ExperienceCard/ExperienceCard";
import { RoleTimeline } from "../RoleTimeline/RoleTimeline";

export interface CompanyCardProps {
  company: Company;
  // Position in the list, for unique ids
  index: number;
}

// A company: its header, its roles on a timeline, and its main tools
export const CompanyCard = ({ company, index }: CompanyCardProps): ReactNode => (
  <ExperienceCard>
    <CompanyHeader
      company={company}
      title={
        <a href={company.url} target="_blank" rel="noopener" className="rounded-sm hover:text-[var(--v2-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]">
          {company.name}
        </a>
      }
    />
    <RoleTimeline roles={company.roles} idPrefix={`role-more-${index}`}/>
    {company.stack?.length ? (
      <ul aria-label={`${company.name} stack`} className="mt-6 flex flex-wrap gap-2 border-t border-[var(--v2-line)] pt-5">
        {company.stack.map((tool) => <Chip key={tool}>{tool}</Chip>)}
      </ul>
    ) : null}
  </ExperienceCard>
);
