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

// Earlier roles, folded away. The company name is the button. While closed,
// its ::after covers the whole card, so a click anywhere opens the roles;
// once open it covers only the header, so the roles can be selected.
export const EarlyExperience = ({ company }: EarlyExperienceProps): ReactNode => {
  const [open, setOpen] = useState(false);
  const id = `early-${company.name.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <ExperienceCard quiet>
      <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-muted)]">Earlier experience</p>
      <CompanyHeader
        company={company}
        className={clsx(open && "relative")}
        title={
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((value) => !value)}
            className={clsx("cursor-pointer text-left after:absolute after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-dashed focus-visible:after:outline-[var(--v2-accent)]", open ? "after:-inset-2 after:rounded-xl" : "after:inset-0 after:rounded-2xl")}
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
