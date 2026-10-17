import React from "react";
import clsx from "clsx";
import { Reveal } from "../motion";
import { eyebrow } from "../ui";

export interface SectionProps {
  id: string;
  // The small label above the title
  label: string;
  title: string;
  lead?: string;
  // Light grey background, to set alternate sections apart
  wash?: boolean;
  children: React.ReactNode;
}

// A home page section: label, h2 title and an optional lead line
const Section: React.FC<SectionProps> = ({ id, label, title, lead, wash, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className={clsx("py-20 md:py-28", wash && "bg-[var(--v2-wash)]")}>
    <div className="mx-auto max-w-[1200px] px-4 md:px-8">
      <Reveal>
        <p className={eyebrow}>{label}</p>
        <h2 id={`${id}-title`} className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.025em] text-[var(--v2-ink)] md:text-[44px]">{title}</h2>
        {lead ? <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-[var(--v2-muted)] md:text-[17px]">{lead}</p> : null}
      </Reveal>
      <div className="mt-10 md:mt-14">{children}</div>
    </div>
  </section>
);

export default Section;
