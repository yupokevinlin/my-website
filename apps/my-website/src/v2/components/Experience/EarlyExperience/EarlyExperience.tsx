import { type ReactNode, useState } from "react";
import clsx from "clsx";
import type { Company } from "../../../../data/experience";
import { Collapse } from "../../Collapse/Collapse";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon/ChevronDownIcon";
import { CompanyHeader } from "../CompanyHeader/CompanyHeader";
import { ExperienceCard } from "../ExperienceCard/ExperienceCard";
import { RoleTimeline } from "../RoleTimeline/RoleTimeline";

export interface EarlyExperienceProps {
  company: Company;
}

// Early roles, folded away. The company name is the button; its ::after
// covers the whole header, so a click anywhere on it opens the roles.
export const EarlyExperience = ({ company }: EarlyExperienceProps): ReactNode => {
  const [open, setOpen] = useState(false);
  const id = `early-${company.name.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <ExperienceCard quiet>
      <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-muted)]">Early experience</p>
      <CompanyHeader
        company={company}
        className="relative"
        title={
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((value) => !value)}
            className="cursor-pointer text-left after:absolute after:-inset-2 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-[var(--v2-accent)]"
          >
            {company.name}
          </button>
        }
      >
        <ChevronDownIcon width={22} height={22} className={clsx("mt-3 shrink-0 text-[var(--v2-accent)] transition-transform duration-300", open && "rotate-180")}/>
      </CompanyHeader>
      <Collapse id={id} open={open}>
        <RoleTimeline roles={company.roles} idPrefix={`${id}-more`}/>
      </Collapse>
    </ExperienceCard>
  );
};
