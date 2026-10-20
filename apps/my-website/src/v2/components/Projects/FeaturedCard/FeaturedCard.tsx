import type { ReactNode } from "react";
import type { FeaturedProject } from "../../../../data/projects";
import { ButtonLink } from "../../ButtonLink/ButtonLink";
import { Chip } from "../../Chip/Chip";
import { Eyebrow } from "../../Eyebrow/Eyebrow";
import { ArrowRightIcon } from "../../icons/ArrowRightIcon/ArrowRightIcon";
import { ArrowUpRightIcon } from "../../icons/ArrowUpRightIcon/ArrowUpRightIcon";
import { useMessages } from "../../../../i18n/LocaleContext";

export interface FeaturedCardProps {
  project: FeaturedProject;
}

// A large project card: screenshot, name, what it does, its tools and links.
// The first link is the main button.
export const FeaturedCard = ({ project }: FeaturedCardProps): ReactNode => {
  const { tools } = useMessages().home.projects;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_var(--v2-deep)]">
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
        <Eyebrow>{project.kicker}</Eyebrow>
        <h3 className="mt-2 text-[26px] font-bold tracking-[-0.02em] text-[var(--v2-ink)]">{project.name}</h3>
        <p className="mt-3 text-[16px] leading-relaxed text-[var(--v2-body)]">{project.description}</p>
        <ul aria-label={tools(project.name)} className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-7">
          {project.links.map((link, i) => {
            const Arrow = /^https?:/.test(link.href) ? ArrowUpRightIcon : ArrowRightIcon;
            return (
              <ButtonLink key={link.href} href={link.href} variant={i === 0 ? "primary" : "text"}>
                {link.label} <Arrow width={16} height={16}/>
              </ButtonLink>
            );
          })}
        </div>
      </div>
    </article>
  );
};
