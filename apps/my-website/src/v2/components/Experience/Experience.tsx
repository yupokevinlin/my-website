import type { ReactNode } from "react";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { CompanyCard } from "./CompanyCard/CompanyCard";
import { EarlyExperience } from "./EarlyExperience/EarlyExperience";
import { BriefcaseIcon } from "../icons/BriefcaseIcon/BriefcaseIcon";
import { useMessages } from "../../../i18n/LocaleContext";
import { useHomeContent } from "../../hooks/useHomeContent";

export const Experience = (): ReactNode => {
  const { experience, earlyExperience } = useHomeContent();
  const text = useMessages().home.experience;
  return (
    <Section id="experience" label={text.label} icon={BriefcaseIcon} title={text.title} wash>
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
};
