import type { ReactNode } from "react";
import { useMessages } from "../../../i18n/LocaleContext";
import { useHomeContent } from "../../hooks/useHomeContent";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { EarlierCard } from "./EarlierCard/EarlierCard";
import { FeaturedCard } from "./FeaturedCard/FeaturedCard";
import { CodeIcon } from "../icons/CodeIcon/CodeIcon";

export const Projects = (): ReactNode => {
  const { featuredProjects, earlierProjects } = useHomeContent();
  const text = useMessages().home.projects;
  return (
    <Section id="projects" label={text.label} icon={CodeIcon} title={text.title} lead={text.lead}>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {featuredProjects.map((project, i) => (
          <Reveal key={i} delay={i * 0.08}><FeaturedCard project={project}/></Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--v2-muted)]">{text.earlier}</p>
      </Reveal>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {earlierProjects.map((project, i) => (
          <Reveal as="li" key={i} delay={(i % 2) * 0.06}><EarlierCard project={project}/></Reveal>
        ))}
      </ul>
    </Section>
  );
};
