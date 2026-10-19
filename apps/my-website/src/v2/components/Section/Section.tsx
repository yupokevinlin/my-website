import type { ComponentType, ReactNode } from "react";
import clsx from "clsx";
import { Reveal } from "../Reveal/Reveal";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { SectionIcon } from "../SectionIcon/SectionIcon";
import type { IconProps } from "../icons/Icon/Icon";

export interface SectionProps {
  id: string;
  // The small label above the title
  label: string;
  // The line icon that stands for the section, shown before the label
  icon: ComponentType<IconProps>;
  title: string;
  lead?: string;
  // The season's stronger background, to set alternate sections apart
  wash?: boolean;
  children: ReactNode;
}

// A home page section: its icon and label, the h2 title and an
// optional lead line
export const Section = ({ id, label, icon, title, lead, wash, children }: SectionProps): ReactNode => (
  <section id={id} aria-labelledby={`${id}-title`} className={clsx("py-20 md:py-28", wash && "bg-[var(--v2-wash)]")}>
    <div className="mx-auto max-w-[1200px] px-4 md:px-8">
      <Reveal>
        <Eyebrow large icon={<SectionIcon glyph={icon}/>}>{label}</Eyebrow>
        <h2 id={`${id}-title`} className="mt-3 text-[40px] font-bold leading-tight tracking-[-0.025em] text-[var(--v2-ink)] md:text-[56px]">{title}</h2>
        {lead ? <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-[var(--v2-muted)] md:text-[17px]">{lead}</p> : null}
      </Reveal>
      <div className="mt-10 md:mt-14">{children}</div>
    </div>
  </section>
);
