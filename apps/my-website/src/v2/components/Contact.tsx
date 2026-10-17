import React from "react";
import { Reveal } from "../motion";
import { ArrowUpRight, FileIcon, GitHubIcon, LinkedInIcon, MailIcon, buttonPrimary, eyebrow } from "../ui";
import { profile } from "../../data/profile";

const methods = [
  { label: "LinkedIn", detail: "linkedin.com/in/kevinyupolin", href: profile.linkedIn, icon: LinkedInIcon, me: true },
  { label: "GitHub", detail: "github.com/yupokevinlin", href: profile.gitHub, icon: GitHubIcon, me: true },
  { label: "Resume", detail: "PDF, one page", href: profile.resume, icon: FileIcon, me: false },
];

const Contact: React.FC = () => (
  <section id="contact" aria-labelledby="contact-title" className="px-4 py-20 md:px-8 md:py-28">
    <Reveal className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-[var(--v2-tint)] px-6 py-14 text-center md:px-16 md:py-20">
      <p className={eyebrow}>Contact</p>
      <h2 id="contact-title" className="mt-2 text-[36px] font-bold leading-tight tracking-[-0.025em] text-[var(--v2-ink)] md:text-[52px]">Get in touch</h2>
      <p className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-[var(--v2-body)]">
        Email is the fastest way to reach me. I'm in Vancouver, on Pacific time.
      </p>
      <div className="mt-8 flex justify-center">
        <a href={`mailto:${profile.email}`} className={`${buttonPrimary} px-6 py-4 text-[16px]`}>
          <MailIcon/> {profile.email}
        </a>
      </div>
      <ul className="mx-auto mt-10 grid max-w-[900px] gap-3 sm:grid-cols-3">
        {methods.map(({ label, detail, href, icon: Icon, me }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel={me ? "me noopener" : "noopener"}
              className="group flex h-full items-center gap-3 rounded-2xl border border-white bg-white/80 p-4 text-left transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--v2-tint)] text-[var(--v2-accent)]"><Icon/></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15.5px] font-semibold text-[var(--v2-ink)]">{label}</h3>
                <p className="truncate text-[13px] text-[var(--v2-muted)]">{detail}</p>
              </div>
              <ArrowUpRight width={16} height={16} className="shrink-0 text-[var(--v2-muted)] group-hover:text-[var(--v2-accent)]"/>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  </section>
);

export default Contact;
