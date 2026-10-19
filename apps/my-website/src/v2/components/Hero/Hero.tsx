import type { ReactNode } from "react";
import { m } from "framer-motion";
import { EASE } from "../../motion";
import { yearsSince } from "../../time";
import { SEASONS, SEASON_LABEL } from "../../season";
import { profile } from "../../../data/profile";
import { ButtonLink } from "../ButtonLink/ButtonLink";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { ArrowRightIcon } from "../icons/ArrowRightIcon/ArrowRightIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon/ChevronDownIcon";
import { SeasonScene } from "./SeasonScene/SeasonScene";

// The text is visible from the first frame (before the page's JavaScript
// loads) and only settles a few pixels, so it never delays the first paint.
const settle = {
  hidden: { y: 14 },
  show: { y: 0, transition: { duration: 0.7, ease: EASE } },
};

// The season's picture fills the screen; who Kevin is and how to reach him
// sits on a frosted card over the sky. On phones the card sits at the top,
// so the house, trees and river show beneath it, and the scene is at least
// 46rem tall, so short phones see it too as they scroll. The blur evens out
// the scene behind the card, and the text is dark enough (accent-strong, not
// accent) for 4.5:1.
export const Hero = (): ReactNode => (
  <section id="top" aria-labelledby="v2-name" className="relative isolate -mt-16 flex min-h-[max(100svh,46rem)] flex-col overflow-hidden">
    <SeasonScene className="absolute inset-0 -z-10"/>

    <div className="mx-auto flex w-full max-w-[1200px] flex-1 items-start px-4 pb-28 pt-20 sm:items-center sm:pt-24 md:px-8 md:pt-28">
      <m.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        initial="hidden"
        animate="show"
        className="w-full max-w-[600px] rounded-[28px] border border-white/70 bg-white/[0.72] p-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-9 md:p-11"
      >
        <m.div variants={settle}>
          <Eyebrow onScene>{profile.title} · {profile.location.city}, {profile.location.region}</Eyebrow>
        </m.div>
        <m.h1 variants={settle} id="v2-name" className="mt-2 text-[42px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--v2-ink)] sm:text-[60px] md:text-[68px]">
          {profile.name}
        </m.h1>
        <m.p variants={settle} className="mt-3 text-[16px] leading-relaxed text-[var(--v2-body)] sm:mt-5 sm:text-[17px] md:text-[19px]">
          {profile.pitch(yearsSince(profile.careerStart))}
        </m.p>
        <m.div variants={settle} className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
          <ButtonLink href="#projects">See my work</ButtonLink>
          <ButtonLink href={profile.resume} variant="secondary">Resume</ButtonLink>
          <ButtonLink href="#contact" variant="text">Get in touch <ArrowRightIcon width={16} height={16}/></ButtonLink>
        </m.div>
      </m.div>
    </div>

    <m.a
      href="#about"
      aria-label="Scroll to About"
      className="absolute bottom-6 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/60 bg-white/60 text-[var(--v2-ink)] shadow-lg backdrop-blur-md focus-visible:outline-white"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
    >
      <ChevronDownIcon width={20} height={20}/>
    </m.a>

    <p aria-hidden="true" className="absolute bottom-7 right-4 hidden rounded-full bg-white/60 px-3 py-1.5 text-[12.5px] font-medium text-[var(--v2-ink)] backdrop-blur-md sm:block md:right-8">
      {SEASONS.map((season) => <span key={season} data-season={season} className="v2-season-only">{SEASON_LABEL[season]} in Vancouver</span>)}
    </p>
  </section>
);
