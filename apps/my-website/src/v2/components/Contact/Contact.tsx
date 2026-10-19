import type { ReactNode } from "react";
import { profile } from "../../../data/profile";
import { ButtonLink } from "../ButtonLink/ButtonLink";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { Reveal } from "../Reveal/Reveal";
import { SceneLayers } from "../SceneLayers/SceneLayers";
import { FileIcon } from "../icons/FileIcon/FileIcon";
import { GitHubIcon } from "../icons/GitHubIcon/GitHubIcon";
import { LinkedInIcon } from "../icons/LinkedInIcon/LinkedInIcon";
import { MailIcon } from "../icons/MailIcon/MailIcon";
import { ContactMethod } from "./ContactMethod/ContactMethod";

// The page ends where it began, in the season's landscape: the lower part of
// the scene rises out of the Skills section's colour, with a frosted panel
// over it. Text on the panel follows the hero card's contrast rules.
export const Contact = (): ReactNode => (
  <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pb-28 md:pt-48">
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <SceneLayers/>
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(to_bottom,var(--v2-wash),transparent)] md:h-64"/>
    </div>
    <Reveal className="mx-auto max-w-[1060px] rounded-[32px] border border-white/70 bg-white/[0.86] px-6 py-12 text-center shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl md:px-12 md:py-16">
      <Eyebrow onScene className="justify-center">Contact</Eyebrow>
      <h2 id="contact-title" className="mt-2 text-[36px] font-bold leading-tight tracking-[-0.025em] text-[var(--v2-ink)] md:text-[52px]">Get in touch</h2>
      <p className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-[var(--v2-body)]">
        Email is the fastest way to reach me. I'm in Vancouver, on Pacific time.
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href={`mailto:${profile.email}`} className="px-6 py-4 text-[16px]"><MailIcon/> {profile.email}</ButtonLink>
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-3">
        <li><ContactMethod label="LinkedIn" detail="linkedin.com/in/kevinyupolin" href={profile.linkedIn} icon={<LinkedInIcon/>} me/></li>
        <li><ContactMethod label="GitHub" detail="github.com/yupokevinlin" href={profile.gitHub} icon={<GitHubIcon/>} me/></li>
        <li><ContactMethod label="Resume" detail="Click here to download" href={profile.resume} icon={<FileIcon/>}/></li>
      </ul>
    </Reveal>
  </section>
);
