import React from "react";
import { Reveal } from "../motion";
import { chip } from "../ui";
import { skillGroups } from "../../data/skills";
import Section from "./Section";

const Skills: React.FC = () => (
  <Section id="skills" label="Skills" title="What I work with" wash>
    <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
      {skillGroups.map((group, i) => (
        <Reveal key={group.name} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
          <div className="rounded-2xl border border-[var(--v2-line)] bg-white p-5 md:p-6">
            <h3 className="text-[17px] font-bold text-[var(--v2-ink)]">{group.name}</h3>
            <ul aria-label={group.name} className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className={chip}>
                  {skill.logo ? (
                    <img src={`/resources/images/skills/${skill.logo}`} alt="" aria-hidden="true" loading="lazy" width={18} height={18} className="h-[18px] w-[18px] object-contain"/>
                  ) : null}
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);

export default Skills;
