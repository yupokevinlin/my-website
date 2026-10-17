import React from "react";
import clsx from "clsx";
import { Reveal } from "../motion";
import { ArrowRight, ArrowUpRight, buttonPrimary, chip, eyebrow, textLink } from "../ui";
import { FeaturedProject, ProjectLink, earlierProjects, featuredProjects } from "../../data/projects";
import Section from "./Section";

const isExternal = (href: string) => /^https?:/.test(href);

// Site paths stay in the tab; other sites open in a new one
const ProjectAction: React.FC<{ link: ProjectLink; primary?: boolean }> = ({ link, primary }) => {
  const external = isExternal(link.href);
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={link.href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={primary ? buttonPrimary : clsx(textLink, "inline-flex items-center gap-1.5 py-3 text-[15px]")}
    >
      {link.label} <Arrow width={16} height={16}/>
    </a>
  );
};

const FeaturedCard: React.FC<{ project: FeaturedProject }> = ({ project }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.35)]">
    <div className="aspect-[16/9] overflow-hidden border-b border-[var(--v2-line)] bg-[#0b0d12]">
      <img
        src={project.image.src}
        alt={project.image.alt}
        width={project.image.width}
        height={project.image.height}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <p className={eyebrow}>{project.kicker}</p>
      <h3 className="mt-2 text-[26px] font-bold tracking-[-0.02em] text-[var(--v2-ink)]">{project.name}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-[var(--v2-body)]">{project.description}</p>
      <ul aria-label={`${project.name} tools`} className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => <li key={tag} className={chip}>{tag}</li>)}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-7">
        {project.links.map((link, i) => <ProjectAction key={link.href} link={link} primary={i === 0}/>)}
      </div>
    </div>
  </article>
);

const Projects: React.FC = () => (
  <Section id="projects" label="Projects" title="Things I've built" lead="A healthcare platform I co-founded and a physics simulation I built for fun, then some earlier work.">
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {featuredProjects.map((project, i) => (
        <Reveal key={project.name} delay={i * 0.08}><FeaturedCard project={project}/></Reveal>
      ))}
    </div>

    <Reveal className="mt-16">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--v2-muted)]">Earlier projects</p>
    </Reveal>
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {earlierProjects.map((project, i) => (
        <Reveal as="li" key={project.name} delay={i * 0.06}>
          <a
            href={project.href}
            target="_blank"
            rel="noopener"
            className="group flex h-full items-start gap-4 rounded-2xl border border-[var(--v2-line)] bg-white p-5 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--v2-accent)] hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]"
          >
            <img src={project.icon} alt="" aria-hidden="true" loading="lazy" className="h-11 w-11 shrink-0 object-contain"/>
            <div className="min-w-0 flex-1">
              <h3 className="text-[16.5px] font-semibold text-[var(--v2-ink)]">{project.name}</h3>
              <p className="mt-1 text-[14.5px] leading-snug text-[var(--v2-body)]">{project.description}</p>
              <p className="mt-2 text-[13px] text-[var(--v2-muted)]">
                {project.tags.join(" · ")} · {project.year}{project.archived ? " · Archived" : ""}
              </p>
            </div>
            <ArrowUpRight width={18} height={18} className="shrink-0 text-[var(--v2-muted)] transition-colors group-hover:text-[var(--v2-accent)]"/>
          </a>
        </Reveal>
      ))}
    </ul>
  </Section>
);

export default Projects;
