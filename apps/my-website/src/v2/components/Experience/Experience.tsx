import type { ReactNode } from "react";
import { earlyExperience, experience } from "../../../data/experience";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { CompanyCard } from "./CompanyCard/CompanyCard";
import { EarlyExperience } from "./EarlyExperience/EarlyExperience";
import { BriefcaseIcon } from "../icons/BriefcaseIcon/BriefcaseIcon";

export const Experience = (): ReactNode => (
  <Section id="experience" label="Experience" icon={BriefcaseIcon} title="Where I've worked" wash>
    <ol className="space-y-6">
      {experience.map((company, i) => (
        <Reveal as="li" key={company.name}><CompanyCard company={company} index={i}/></Reveal>
      ))}
      {earlyExperience.map((company) => (
        <Reveal as="li" key={company.name}><EarlyExperience company={company}/></Reveal>
      ))}
    </ol>
  </Section>
);
