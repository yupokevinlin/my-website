import type { ReactNode } from "react";
import type { EarlierProject } from "../../../../data/projects";
import { ArrowRightIcon } from "../../icons/ArrowRightIcon/ArrowRightIcon";
import { ArrowUpRightIcon } from "../../icons/ArrowUpRightIcon/ArrowUpRightIcon";
import { useMessages } from "../../../../i18n/LocaleContext";
import { useLocaleHref } from "../../../hooks/useHomeContent";

export interface EarlierCardProps {
  project: EarlierProject;
}

// A compact project card; the whole card is the link
export const EarlierCard = ({ project }: EarlierCardProps): ReactNode => {
  const external = /^https?:/.test(project.href);
  const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon;
  const messages = useMessages();
  const localeHref = useLocaleHref();
  return (
    <a
      href={localeHref(project.href)}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group flex h-full items-start gap-4 rounded-2xl border border-[var(--v2-line)] bg-white p-5 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--v2-bright)] hover:shadow-[0_18px_40px_-28px_var(--v2-deep)]"
    >
      <img src={project.icon} alt="" aria-hidden="true" loading="lazy" className="h-11 w-11 shrink-0 object-contain"/>
      <div className="min-w-0 flex-1">
        <h3 className="text-[16.5px] font-semibold text-[var(--v2-ink)]">{project.name}</h3>
        <p className="mt-1 text-[14.5px] leading-snug text-[var(--v2-body)]">{project.description}</p>
        <p className="mt-2 text-[13px] text-[var(--v2-muted)]">
          {project.tags.join(" · ")} · {project.year}{project.archived ? ` · ${messages.home.projects.archived}` : ""}
        </p>
      </div>
      <Arrow width={18} height={18} className="shrink-0 text-[var(--v2-muted)] transition-colors group-hover:text-[var(--v2-accent)]"/>
    </a>
  );
};
