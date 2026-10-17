import React from "react";
import clsx from "clsx";
import { MONO, SERIF } from "../fonts";
import { yearsSince } from "../time";
import { profile } from "../../data/profile";
import SeasonScene from "./SeasonScene";

// Who, what and how to reach him, in the first five seconds.
const Hero: React.FC = () => (
  <section id="top" aria-labelledby="v2-name" className="bg-[radial-gradient(1100px_420px_at_0%_0%,var(--v2-tint),transparent_70%)]">
    <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[1.05fr_1fr] md:gap-12 md:px-7 md:pb-20 md:pt-16">
      <div>
        <p className={clsx(MONO, "text-[12px] uppercase tracking-[0.14em] text-[var(--v2-accent)]")}>
          {profile.title} · {profile.location.city}, {profile.location.region}
        </p>
        <h1 id="v2-name" className={clsx(SERIF, "mt-3 text-[56px] font-semibold leading-none tracking-[-0.01em] md:text-[80px]")}>{profile.name}</h1>
        <p className="mt-5 max-w-[34ch] text-[17px] leading-relaxed text-[var(--v2-body)] md:text-[19px]">{profile.pitch}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href="#projects" className="rounded-[10px] bg-[var(--v2-accent-strong)] px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90">See my work</a>
          <a href={profile.resume} target="_blank" rel="noopener" className="rounded-[10px] border-[1.5px] border-[#d5dbe2] px-5 py-3 text-[15px] font-medium text-[var(--v2-ink)] transition-colors hover:border-[var(--v2-accent)]">Resume</a>
          <a href="#contact" className="px-1 py-3 text-[15px] font-medium text-[var(--v2-accent)] hover:underline">Get in touch <span aria-hidden="true">→</span></a>
        </div>
        <p className="mt-6 text-[14px] text-[var(--v2-muted)]">
          {yearsSince(profile.careerStart)} years building software · {profile.heroSkills.join(" · ")}
        </p>
      </div>
      <SeasonScene/>
    </div>
  </section>
);

export default Hero;
