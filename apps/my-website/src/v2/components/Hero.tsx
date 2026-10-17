import React from "react";
import clsx from "clsx";
import { m } from "framer-motion";
import { EASE } from "../motion";
import { yearsSince } from "../time";
import { SEASONS, SEASON_LABEL } from "../season";
import { ArrowRight, ChevronDown, buttonPrimary, buttonSecondary, eyebrowBase } from "../ui";
import { profile } from "../../data/profile";
import SeasonScene from "./SeasonScene";

// The text is visible from the first frame (before the page's JavaScript
// loads) and only settles a few pixels, so it never delays the first paint.
const settle = {
  hidden: { y: 14 },
  show: { y: 0, transition: { duration: 0.7, ease: EASE } },
};

// The season's picture fills the screen; who Kevin is and how to reach him
// sits on a frosted card over the sky. The card is opaque enough, and its
// text dark enough (accent-strong, not accent), for 4.5:1 over any scene.
const Hero: React.FC = () => (
  <section id="top" aria-labelledby="v2-name" className="relative isolate -mt-16 flex min-h-[100svh] flex-col overflow-hidden">
    <SeasonScene className="absolute inset-0 -z-10"/>

    <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-center px-4 pb-28 pt-24 md:px-8 md:pt-28">
      <m.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        initial="hidden"
        animate="show"
        className="w-full max-w-[600px] rounded-[28px] border border-white/70 bg-white/[0.86] p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-9 md:p-11"
      >
        <m.p variants={settle} className={clsx(eyebrowBase, "text-[var(--v2-accent-strong)]")}>
          {profile.title} · {profile.location.city}, {profile.location.region}
        </m.p>
        <m.h1 variants={settle} id="v2-name" className="mt-3 text-[48px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--v2-ink)] sm:text-[60px] md:text-[68px]">
          {profile.name}
        </m.h1>
        <m.p variants={settle} className="mt-5 text-[17px] leading-relaxed text-[var(--v2-body)] md:text-[19px]">
          {profile.pitch}
        </m.p>
        <m.div variants={settle} className="mt-7 flex flex-wrap items-center gap-3">
          <a href="#projects" className={buttonPrimary}>See my work</a>
          <a href={profile.resume} target="_blank" rel="noopener" className={buttonSecondary}>Resume</a>
          <a href="#contact" className="inline-flex items-center gap-1.5 rounded-sm px-1 py-3 text-[15px] font-semibold text-[var(--v2-accent-strong)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]">
            Get in touch <ArrowRight width={16} height={16}/>
          </a>
        </m.div>
        <m.p variants={settle} className="mt-6 border-t border-[var(--v2-line)] pt-5 text-[14px] text-[var(--v2-body)]">
          <span className="font-semibold text-[var(--v2-ink)]">{yearsSince(profile.careerStart)} years</span> building software · {profile.heroSkills.join(" · ")}
        </m.p>
      </m.div>
    </div>

    <m.a
      href="#about"
      aria-label="Scroll to About"
      className="absolute bottom-6 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/70 bg-white/80 text-[var(--v2-ink)] shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
    >
      <ChevronDown width={20} height={20}/>
    </m.a>

    <p aria-hidden="true" className="absolute bottom-7 right-4 hidden rounded-full bg-white/80 px-3 py-1.5 text-[12.5px] font-medium text-[var(--v2-ink)] backdrop-blur-md sm:block md:right-8">
      {SEASONS.map((s) => <span key={s} data-season={s} className="v2-season-label">{SEASON_LABEL[s]} in Vancouver</span>)}
    </p>
  </section>
);

export default Hero;
