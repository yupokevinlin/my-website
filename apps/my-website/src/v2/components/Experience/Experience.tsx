import type { ReactNode } from "react";
import { earlyExperience, experience } from "../../../data/experience";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { CompanyCard } from "./CompanyCard/CompanyCard";
import { EarlyExperience } from "./EarlyExperience/EarlyExperience";

export const Experience = (): ReactNode => (
  <Section id="experience" label="Experience" title="Where I've worked" lead="The strongest results for each role are up front; the rest are a click away." wash>
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
