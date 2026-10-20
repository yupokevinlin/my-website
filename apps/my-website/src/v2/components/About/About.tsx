import type { ReactNode } from "react";
import { profile } from "../../../data/profile";
import { useMessages } from "../../../i18n/LocaleContext";
import { yearsSince } from "../../time";
import { useHomeContent } from "../../hooks/useHomeContent";
import { Chip } from "../Chip/Chip";
import { Reveal } from "../Reveal/Reveal";
import { Section } from "../Section/Section";
import { UserIcon } from "../icons/UserIcon/UserIcon";
import { Fact } from "./Fact/Fact";

export const About = (): ReactNode => {
  const { about } = useHomeContent();
  const text = useMessages().home.about;
  const years = yearsSince(profile.careerStart);
  return (
    <Section id="about" label={text.label} icon={UserIcon} title={text.title}>
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-14">
        <Reveal className="space-y-5 text-[17px] leading-[1.75] text-[var(--v2-body)]">
          {about.paragraphs.map((paragraph, i) => <p key={i}>{typeof paragraph === "function" ? paragraph(years) : paragraph}</p>)}
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-[var(--v2-line)] rounded-2xl border border-[var(--v2-line)] bg-white px-6 py-2 shadow-[0_18px_40px_-30px_var(--v2-deep)]">
            <Fact label={text.basedIn}>{about.location}</Fact>
            <Fact label={text.languages}>
              <ul aria-label={text.languages} className="mt-0.5 flex flex-wrap gap-2">
                {about.languages.map((language) => (
                  <Chip key={language.name}>
                    <span className="font-medium text-[var(--v2-ink)]">{language.name}</span>
                    <span className="text-[var(--v2-muted)]">{language.level}</span>
                  </Chip>
                ))}
              </ul>
            </Fact>
            <Fact label={text.education}>
              <span className="mt-0.5 flex items-center gap-3">
                <img src={about.education.logo} alt="" aria-hidden="true" loading="lazy" width={40} height={40} className="h-10 w-10 shrink-0 object-contain"/>
                <span>
                  {text.degreeAt(about.education.degree, about.education.school)}
                  <span className="mt-0.5 block text-[14px] text-[var(--v2-muted)]">{about.education.award}</span>
                </span>
              </span>
            </Fact>
            <Fact label={text.now}>{about.now}</Fact>
          </dl>
        </Reveal>
      </div>
    </Section>
  );
};
