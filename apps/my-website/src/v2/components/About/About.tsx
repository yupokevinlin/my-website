import type { ReactNode } from "react";
import { about } from "../../../data/about";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";

export const About = (): ReactNode => (
  <Section id="about" label="About" title="A bit about me">
    <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-14">
      <Reveal className="space-y-5 text-[17px] leading-[1.75] text-[var(--v2-body)]">
        {about.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
      </Reveal>
      <Reveal delay={0.1}>
        <dl className="divide-y divide-[var(--v2-line)] rounded-2xl border border-[var(--v2-line)] bg-white px-6 py-2 shadow-[0_18px_40px_-30px_var(--v2-deep)]">
          {about.facts.map((fact) => (
            <div key={fact.label} className="py-4">
              <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-accent)]">{fact.label}</dt>
              <dd className="mt-1 text-[15.5px] leading-snug text-[var(--v2-ink)]">
                {fact.value}
                {fact.detail ? <span className="mt-0.5 block text-[14px] text-[var(--v2-muted)]">{fact.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </Section>
);
