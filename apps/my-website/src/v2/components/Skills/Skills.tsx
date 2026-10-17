import type { ReactNode } from "react";
import { skillGroups } from "../../../data/skills";
import { Chip } from "../Chip/Chip";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";

export const Skills = (): ReactNode => (
  <Section id="skills" label="Skills" title="What I work with" wash>
    <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
      {skillGroups.map((group, i) => (
        <Reveal key={group.name} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
          <div className="rounded-2xl border border-[var(--v2-line)] bg-white p-5 md:p-6">
            <h3 className="text-[17px] font-bold text-[var(--v2-ink)]">{group.name}</h3>
            <ul aria-label={group.name} className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Chip key={skill.name} logo={skill.logo ? `/resources/images/skills/${skill.logo}` : undefined}>{skill.name}</Chip>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
