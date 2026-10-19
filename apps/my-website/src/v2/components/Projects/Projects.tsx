import type { ReactNode } from "react";
import { earlierProjects, featuredProjects } from "../../../data/projects";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { EarlierCard } from "./EarlierCard/EarlierCard";
import { FeaturedCard } from "./FeaturedCard/FeaturedCard";
import { CodeIcon } from "../icons/CodeIcon/CodeIcon";

export const Projects = (): ReactNode => (
  <Section id="projects" label="Projects" icon={CodeIcon} title="Things I've built" lead="A healthcare platform I co-founded and a physics simulation I built for fun, then some earlier work.">
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {featuredProjects.map((project, i) => (
        <Reveal key={project.name} delay={i * 0.08}><FeaturedCard project={project}/></Reveal>
      ))}
    </div>

    <Reveal className="mt-16">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--v2-muted)]">Earlier projects</p>
    </Reveal>
    <ul className="mt-5 grid gap-4 md:grid-cols-2">
      {earlierProjects.map((project, i) => (
        <Reveal as="li" key={project.name} delay={(i % 2) * 0.06}><EarlierCard project={project}/></Reveal>
      ))}
    </ul>
  </Section>
);
