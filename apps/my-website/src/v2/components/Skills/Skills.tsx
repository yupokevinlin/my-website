import type { ReactNode } from "react";
import { useMessages } from "../../../i18n/LocaleContext";
import { useHomeContent } from "../../hooks/useHomeContent";
import { Chip } from "../Chip/Chip";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { SkillIcon } from "../icons/SkillIcon/SkillIcon";
import { WrenchIcon } from "../icons/WrenchIcon/WrenchIcon";

const logoPath = (file: string) => `/resources/images/skills/${file}`;

export const Skills = (): ReactNode => {
  const { skillGroups } = useHomeContent();
  const text = useMessages().home.skills;
  return (
    <Section id="skills" label={text.label} icon={WrenchIcon} title={text.title} wash>
      {/* Columns like a masonry wall. Each card is an inline-block, which the
          columns can't split, so the browser lays them out in one pass:
          break-inside-avoid made it lay out every card again and again while
          balancing the columns, the slowest thing on the page. */}
      <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {skillGroups.map((group, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06} className="mb-5 inline-block w-full align-top">
            <div className="rounded-2xl border border-[var(--v2-line)] bg-white p-5 md:p-6">
              <h3 className="text-[17px] font-bold text-[var(--v2-ink)]">{group.name}</h3>
              {group.rows.map((row) => (
                <div key={row.label ?? "main"} className="mt-4">
                  {row.label ? <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--v2-muted)]">{row.label}</p> : null}
                  <ul aria-label={row.label ? `${group.name}: ${row.label}` : group.name} className="flex flex-wrap gap-2">
                    {row.skills.map((skill) => (
                      <Chip
                        key={skill.name}
                        logo={skill.logo ? logoPath(skill.logo) : undefined}
                        icon={skill.icon ? <SkillIcon name={skill.icon} width={16} height={16}/> : undefined}
                      >
                        {skill.name}
                      </Chip>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
