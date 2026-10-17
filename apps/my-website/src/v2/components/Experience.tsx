import React, { useState } from "react";
import clsx from "clsx";
import { Reveal } from "../motion";
import { ChevronDown, chip } from "../ui";
import { formatDuration, monthsBetween, parseMonth } from "../time";
import { Company, Role, earlyExperience, experience } from "../../data/experience";
import Collapse from "./Collapse";
import Section from "./Section";

const dash = " – ";

// Earliest start to latest end, and the time actually worked (gaps between
// roles at the same company don't count)
export const companySpan = (company: Company): { range: string; duration: string } => {
  const starts = company.roles.map((role) => role.start);
  const ends = company.roles.map((role) => role.end);
  const byDate = (a: string, b: string) => monthsBetween(parseMonth(b), parseMonth(a));
  const first = [...starts].sort(byDate)[0];
  const last = ends.includes("Present") ? "Present" : [...ends].sort(byDate)[ends.length - 1];
  const months = company.roles.reduce((sum, role) => sum + monthsBetween(parseMonth(role.start), parseMonth(role.end)), 0);
  return { range: `${first}${dash}${last}`, duration: formatDuration(months) };
};

const bullet = "relative pl-5 before:absolute before:left-0 before:top-[0.68em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--v2-accent)]";

const Bullets: React.FC<{ items: string[]; className?: string }> = ({ items, className }) => (
  <ul className={clsx("space-y-2.5 text-[15.5px] leading-relaxed text-[var(--v2-body)]", className)}>
    {items.map((item) => <li key={item} className={bullet}>{item}</li>)}
  </ul>
);

const RoleBlock: React.FC<{ role: Role; id: string; showDates: boolean }> = ({ role, id, showDates }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h4 className="text-[17px] font-semibold text-[var(--v2-ink)]">{role.title}</h4>
      <p className="mt-0.5 text-[14px] text-[var(--v2-muted)]">
        {showDates ? `${role.start}${dash}${role.end} · ` : null}{role.location}
      </p>
      <Bullets items={role.highlights} className="mt-3"/>
      {role.more?.length ? (
        <>
          <Collapse id={id} open={open}><Bullets items={role.more} className="pt-2.5"/></Collapse>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((value) => !value)}
            className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-md text-[14px] font-semibold text-[var(--v2-accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]"
          >
            {open ? "Show less" : `Show ${role.more.length} more`}
            <ChevronDown width={16} height={16} className={clsx("transition-transform duration-300", open && "rotate-180")}/>
          </button>
        </>
      ) : null}
    </div>
  );
};

const CompanyCard: React.FC<{ company: Company; index: number }> = ({ company, index }) => {
  const { range, duration } = companySpan(company);
  const multiRole = company.roles.length > 1;
  return (
    <article className="rounded-2xl border border-[var(--v2-line)] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.25)] md:p-7">
      <header className="flex items-start gap-3">
        <Logo company={company} className="sm:hidden"/>
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-[21px] font-bold tracking-[-0.015em] text-[var(--v2-ink)]">
            <a href={company.url} target="_blank" rel="noopener" className="rounded-sm hover:text-[var(--v2-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]">{company.name}</a>
          </h3>
          <p className="text-[14px] font-medium text-[var(--v2-muted)]">{range} · {duration}</p>
        </div>
      </header>
      <p className="mt-1 text-[14.5px] text-[var(--v2-muted)]">{company.about}</p>
      <div className="mt-5 space-y-6">
        {company.roles.map((role, j) => (
          <div key={role.title} className={clsx(j > 0 && "border-t border-[var(--v2-line)] pt-6")}>
            <RoleBlock role={role} id={`role-more-${index}-${j}`} showDates={multiRole}/>
          </div>
        ))}
      </div>
      {company.stack?.length ? (
        <ul aria-label={`${company.name} stack`} className="mt-6 flex flex-wrap gap-2">
          {company.stack.map((tool) => <li key={tool} className={chip}>{tool}</li>)}
        </ul>
      ) : null}
    </article>
  );
};

const Logo: React.FC<{ company: Company; className?: string }> = ({ company, className }) => (
  <span className={clsx("grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--v2-line)] bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:h-14 md:w-14 md:rounded-2xl md:p-2", className)}>
    <img src={company.logo} alt="" aria-hidden="true" loading="lazy" className="max-h-full max-w-full object-contain"/>
  </span>
);

// One timeline row: logo and line on the left, the card on the right. Phones
// drop the left column and show the logo in the card instead.
const TimelineRow: React.FC<{ company: Company; last?: boolean; children: React.ReactNode }> = ({ company, last, children }) => (
  <div className={clsx("sm:grid sm:grid-cols-[2.75rem_1fr] sm:gap-4 md:grid-cols-[3.5rem_1fr] md:gap-6", !last && "pb-5 sm:pb-6")}>
    <div className="hidden flex-col items-center sm:flex">
      <Logo company={company}/>
      {!last ? <span aria-hidden="true" className="mt-3 w-0.5 flex-1 rounded-full bg-[linear-gradient(var(--v2-accent),var(--v2-line))] opacity-60"/> : null}
    </div>
    <div className="min-w-0">{children}</div>
  </div>
);

const EarlyExperience: React.FC = () => {
  const [open, setOpen] = useState(false);
  const company = earlyExperience[0];
  const { range } = companySpan(company);
  return (
    <TimelineRow company={company} last>
      <div className="rounded-2xl border border-dashed border-[#cfd6de] bg-white/70">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="early-experience"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)] md:px-7"
        >
          <span className="flex items-center gap-3">
            <Logo company={company} className="sm:hidden"/>
            <span>
              <span className="block text-[16px] font-semibold text-[var(--v2-ink)]">Early experience</span>
              <span className="mt-0.5 block text-[14px] text-[var(--v2-muted)]">{company.name} · {range} · {company.roles.length} roles</span>
            </span>
          </span>
          <ChevronDown width={20} height={20} className={clsx("shrink-0 text-[var(--v2-accent)] transition-transform duration-300", open && "rotate-180")}/>
        </button>
        <Collapse id="early-experience" open={open}>
          <div className="px-5 pb-6 md:px-7">
            <h3 className="text-[18px] font-bold text-[var(--v2-ink)]">
              <a href={company.url} target="_blank" rel="noopener" className="hover:text-[var(--v2-accent)]">{company.name}</a>
            </h3>
            <p className="mt-1 text-[14.5px] text-[var(--v2-muted)]">{company.about}</p>
            <div className="mt-5 space-y-6">
              {company.roles.map((role, j) => (
                <div key={role.title} className={clsx(j > 0 && "border-t border-[var(--v2-line)] pt-6")}>
                  <RoleBlock role={role} id={`early-more-${j}`} showDates/>
                </div>
              ))}
            </div>
          </div>
        </Collapse>
      </div>
    </TimelineRow>
  );
};

const Experience: React.FC = () => (
  <Section id="experience" label="Experience" title="Where I've worked" lead="Newest first. The strongest results for each role are up front; the rest are a click away." wash>
    <ol>
      {experience.map((company, i) => (
        <Reveal as="li" key={company.name}>
          <TimelineRow company={company}>
            <CompanyCard company={company} index={i}/>
          </TimelineRow>
        </Reveal>
      ))}
      <Reveal as="li"><EarlyExperience/></Reveal>
    </ol>
  </Section>
);

export default Experience;
