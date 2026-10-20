import React, { useCallback, useRef } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { MotionConfig, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ScrollValues } from "@/components/Scrollbars";
import SimulationsLayout from "../../components/Simulations/SimulationsLayout/SimulationsLayout";
import DarkScrollbars from "../../components/Simulations/DarkScrollbars/DarkScrollbars";
import Starfield from "../../components/Simulations/Starfield/Starfield";
import RayDiagram from "../../components/Simulations/RayDiagram/RayDiagram";
import Formula from "../../components/Simulations/Formula/Formula";
import LessonSection, { WRAP } from "../../components/Simulations/LessonSection/LessonSection";
import { Chapter, presetHref } from "../../components/Simulations/content";
import type { LessonId } from "../../components/Simulations/lessons";
import { useGuideContent, useGuideText } from "../../components/Simulations/useGuide";
import { EASE, Reveal, Stagger, item } from "../../components/Simulations/motion";
import { ACCENTS, MONO, SANS, SERIF } from "../../components/Simulations/theme";
import CurvedSpaceDiagram from "../../components/Simulations/Diagrams/CurvedSpaceDiagram";
import SqueezeDiagram from "../../components/Simulations/Diagrams/SqueezeDiagram";
import CollapseDiagram from "../../components/Simulations/Diagrams/CollapseDiagram";
import RiverDiagram from "../../components/Simulations/Diagrams/RiverDiagram";
import PhotonSphereDiagram from "../../components/Simulations/Diagrams/PhotonSphereDiagram";
import AccretionDiagram from "../../components/Simulations/Diagrams/AccretionDiagram";
import LensingDiagram from "../../components/Simulations/Diagrams/LensingDiagram";
import SpinDiagram from "../../components/Simulations/Diagrams/SpinDiagram";
import TidesDiagram from "../../components/Simulations/Diagrams/TidesDiagram";
import HawkingDiagram from "../../components/Simulations/Diagrams/HawkingDiagram";
import { useLocale } from "../../../i18n/LocaleContext";
import { localePath } from "../../../i18n/locales";

const kicker = clsx(MONO, "text-[10.5px] sm:text-[11px] tracking-[0.24em] uppercase");
const body = clsx(SANS, "text-[16px] sm:text-[17px] leading-[28px] sm:leading-[30px] font-light");
const h2 = clsx(SERIF, "font-light text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px]");

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <div className={kicker} style={{ color: color ?? "var(--sim-accent)" }}>{children}</div>
);

const DopplerImage: React.FC = () => (
  <img className="block w-full aspect-video object-cover" src="/ray-tracing/images/blackhole-doppler.webp" alt={useGuideText().overview.dopplerAlt} loading="lazy"/>
);

const DIAGRAMS: Record<LessonId, React.ReactNode> = {
  gravity: <CurvedSpaceDiagram/>,
  escape: <SqueezeDiagram/>,
  birth: <CollapseDiagram/>,
  horizon: <RiverDiagram/>,
  "photon-sphere": <PhotonSphereDiagram/>,
  accretion: <AccretionDiagram/>,
  lensing: <LensingDiagram/>,
  doppler: <DopplerImage/>,
  spin: <SpinDiagram/>,
  tides: <TidesDiagram/>,
  hawking: <HawkingDiagram/>,
};

// The three parts' anchors; their names and introductions are in the dictionary
const PART_IDS = ["how-black-holes-work", "tracing-light", "simulations"];

const PartHeader: React.FC<{ index: number; children?: React.ReactNode }> = ({ index, children }) => {
  const part = useGuideText().overview.parts[index];
  return (
    <section id={PART_IDS[index]} className="relative pt-[100px] sm:pt-[140px] pb-[20px] scroll-mt-[56px]" style={{ borderTop: "1px solid var(--sim-border)" }}>
      <Starfield/>
      <div className={WRAP}>
        <Reveal>
          <Kicker>{part.label}</Kicker>
          <h2 className={clsx(SERIF, "mt-[14px] font-light text-[48px] leading-[50px] sm:text-[76px] sm:leading-[76px]")}>{part.title}</h2>
          <p className={clsx(body, "mt-[22px] max-w-[720px]")} style={{ color: "var(--sim-body)" }}>{part.intro}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
};

const ChapterSection: React.FC<{ chapter: Chapter; reverse: boolean }> = ({ chapter, reverse }) => {
  const locale = useLocale();
  const text = useGuideText().overview.chapter;
  const accent = ACCENTS[chapter.id];
  const href = localePath(locale, `/ray-tracing/${chapter.id}`);
  return (
    <section
      id={chapter.id}
      className="relative py-[80px] sm:py-[120px] scroll-mt-[56px]"
      style={{ "--sim-accent": accent, "--sim-glow": `${accent}55` } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(50% 40% at ${reverse ? "25%" : "75%"} 35%, ${accent}14, transparent 70%)` }}
      />
      <div className={WRAP}>
        <div className="relative grid grid-cols-1 gap-[40px] lg:grid-cols-2 lg:gap-[64px] items-center">
          <Reveal className={clsx(reverse && "lg:order-2")}>
            <figure className="w-full">
              <div className="relative overflow-hidden rounded-[14px]" style={{ border: "1px solid var(--sim-border)", boxShadow: "0 30px 80px -30px var(--sim-glow, rgba(0,0,0,0.8))" }}>
                <motion.img
                  className="block w-full aspect-video object-cover"
                  src={chapter.image}
                  alt={chapter.title}
                  loading="lazy"
                  initial={{ scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.6, ease: EASE }}
                />
              </div>
              <figcaption className={clsx(SANS, "mt-[10px] text-[13px] leading-[19px] font-light italic")} style={{ color: "var(--sim-muted)" }}>{chapter.imageCaption}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>{text.kicker(chapter.numeral, chapter.field)}</Kicker>
            <div className="mt-[16px] flex items-stretch gap-[18px] sm:gap-[22px]">
              <span
                className={clsx(SERIF, "font-normal text-[44px] leading-[48px] sm:text-[60px] sm:leading-[62px]")}
                style={{ color: accent, textShadow: `0 0 28px ${accent}66` }}
              >
                {chapter.numeral}
              </span>
              <span aria-hidden className="w-[1px] shrink-0" style={{ background: `linear-gradient(to bottom, transparent, ${accent}aa, transparent)` }}/>
              <h2 className={h2}>{chapter.title}</h2>
            </div>
            <p className={clsx(SERIF, "mt-[16px] text-[22px] leading-[30px] sm:text-[25px] sm:leading-[34px] italic")} style={{ color: "var(--sim-accent)" }}>{chapter.subtitle}</p>
            {chapter.paragraphs.map((p, i) => (
              <p key={i} className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>{p}</p>
            ))}
            <NextLink
              href={href}
              className={clsx(MONO, "link-base mt-[30px] inline-flex items-center gap-[10px] rounded-full px-[22px] py-[12px] text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white/5")}
              style={{ border: `1px solid ${accent}`, color: accent, textDecoration: "none" }}
            >
              {text.open} <span aria-hidden>→</span>
            </NextLink>
          </Reveal>
        </div>

        <div className="relative mt-[70px] grid grid-cols-1 gap-[44px] md:grid-cols-12">
          <div className="md:col-span-5">
            <Kicker color="var(--sim-muted)">{text.seeing}</Kicker>
            <Stagger as="dl" className="mt-[18px] flex flex-col gap-[18px]">
              {chapter.features.map((f, i) => (
                <motion.div key={i} variants={item} className="pl-[16px]" style={{ borderLeft: `1px solid ${accent}66` }}>
                  <dt className={clsx(SERIF, "text-[21px] leading-[26px]")} style={{ color: "var(--sim-text)" }}>{f.title}</dt>
                  <dd className={clsx(SANS, "mt-[4px] text-[14.5px] leading-[24px] font-light")} style={{ color: "var(--sim-body)" }}>{f.text}</dd>
                </motion.div>
              ))}
            </Stagger>
          </div>
          <div className="md:col-span-4">
            <Kicker color="var(--sim-muted)">{text.physics}</Kicker>
            <Stagger className="mt-[18px] flex flex-col gap-[12px]">
              {chapter.equations.map((eq, i) => (
                <motion.div key={i} variants={item} className="rounded-[12px] px-[16px] py-[14px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.025)" }}>
                  <div className={clsx(SANS, "text-[12.5px] font-light")} style={{ color: "var(--sim-muted)" }}>{eq.name}</div>
                  <div className={clsx(MONO, "my-[8px] text-[14px] leading-[22px] break-words")} style={{ color: "var(--sim-text)" }}><Formula text={eq.formula}/></div>
                  <div className={clsx(SANS, "text-[12.5px] leading-[19px] font-light")} style={{ color: "var(--sim-faint)" }}>{eq.note}</div>
                </motion.div>
              ))}
            </Stagger>
          </div>
          <div className="md:col-span-3">
            <Kicker color="var(--sim-muted)">{text.tryThis}</Kicker>
            <Stagger className="mt-[18px] flex flex-col gap-[10px]">
              {chapter.presets.map((p, i) => (
                <motion.a
                  key={i}
                  variants={item}
                  href={presetHref(chapter.id, p.params, locale)}
                  className="link-base group block rounded-[10px] px-[14px] py-[11px] transition-colors hover:bg-white/[0.05]"
                  style={{ border: "1px solid var(--sim-border)", textDecoration: "none" }}
                >
                  <span className={clsx(SANS, "block text-[14px]")} style={{ color: accent }}>
                    {p.label} <span className="inline-block transition-transform group-hover:translate-x-[3px]">→</span>
                  </span>
                  <span className={clsx(SANS, "mt-[2px] block text-[12.5px] leading-[18px] font-light")} style={{ color: "var(--sim-muted)" }}>{p.description}</span>
                </motion.a>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
};

const SimulationsPage: React.FC = () => {
  const locale = useLocale();
  const { lessons, chapters, glossary, credits } = useGuideContent();
  const text = useGuideText().overview;
  const heroRef = useRef<HTMLElement>(null);
  // Scroll-linked motion is driven by the custom scrollbar's frame callback:
  // overall progress for the bar under the header, and how far the hero has
  // scrolled out of view for its parallax.
  const scrollProgress = useMotionValue(0);
  const heroProgress = useMotionValue(0);
  const progress = useSpring(scrollProgress, { stiffness: 200, damping: 40 });
  const handleScrollFrame = useCallback((v: ScrollValues): void => {
    scrollProgress.set(Number.isFinite(v.top) ? v.top : 0);
    heroProgress.set(Math.min(1, v.scrollTop / (heroRef.current?.offsetHeight || 1)));
  }, [scrollProgress, heroProgress]);
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1.04, 1.16]);
  const heroFade = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <SimulationsLayout active="overview" overlayNav>
        <div className="relative h-full w-full" style={{ colorScheme: "dark" }}>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[56px] z-30 h-[2px] origin-left"
            style={{ scaleX: progress, background: "linear-gradient(to right, #f2a65a, #b394ff, #6cc8ff)" }}
          />
          <DarkScrollbars onScrollFrame={handleScrollFrame}>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section ref={heroRef} className="relative flex min-h-[100vh] items-end overflow-hidden">
              <motion.img
                className="absolute inset-0 h-full w-full object-cover"
                src="/ray-tracing/images/hero.webp"
                alt=""
                fetchPriority="high"
                style={{ y: heroY, scale: heroScale }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--sim-bg) 2%, rgba(5,5,8,0.55) 38%, rgba(5,5,8,0.1) 70%), linear-gradient(to right, rgba(5,5,8,0.75), rgba(5,5,8,0) 60%)" }}/>
              <motion.div className={clsx(WRAP, "pb-[70px] sm:pb-[96px] pt-[120px]")} style={{ opacity: heroFade }}>
                <Stagger>
                  <motion.div variants={item}><Kicker>{text.hero.kicker}</Kicker></motion.div>
                  <motion.h1 variants={item} className={clsx(SERIF, "mt-[18px] max-w-[900px] font-light text-[54px] leading-[54px] sm:text-[84px] sm:leading-[82px] lg:text-[104px] lg:leading-[98px]")}>
                    {text.hero.titleBefore}<em className="italic" style={{ color: "var(--sim-accent)" }}>{text.hero.titleEmphasis}</em>{text.hero.titleAfter}
                  </motion.h1>
                  <motion.p variants={item} className={clsx(body, "mt-[26px] max-w-[640px]")} style={{ color: "var(--sim-body)" }}>
                    {text.hero.text}
                  </motion.p>
                  <motion.div variants={item} className="mt-[34px] flex flex-wrap items-center gap-[14px]">
                    <a
                      href="#how-black-holes-work"
                      className={clsx(MONO, "link-base rounded-full px-[24px] py-[13px] text-[11px] tracking-[0.2em] uppercase transition-[filter] hover:brightness-110")}
                      style={{ backgroundColor: "var(--sim-accent)", color: "#140c04", textDecoration: "none" }}
                    >
                      {text.hero.startLearning}
                    </a>
                    <NextLink
                      href={localePath(locale, "/ray-tracing/blackhole")}
                      className={clsx(MONO, "link-base rounded-full px-[24px] py-[13px] text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white/5")}
                      style={{ border: "1px solid var(--sim-border)", color: "var(--sim-text)", textDecoration: "none" }}
                    >
                      {text.hero.openBlackHole}
                    </NextLink>
                  </motion.div>
                  <motion.div variants={item} className="mt-[56px] hidden sm:flex flex-row gap-[40px]">
                    {text.parts.map((p, i) => (
                      <a key={PART_IDS[i]} href={`#${PART_IDS[i]}`} className="link-base group" style={{ textDecoration: "none" }}>
                        <div className={clsx(MONO, "text-[10px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-accent)" }}>{p.label}</div>
                        <div className={clsx(SERIF, "text-[22px] transition-colors group-hover:text-[var(--sim-text)]")} style={{ color: "var(--sim-body)" }}>{p.title}</div>
                      </a>
                    ))}
                  </motion.div>
                </Stagger>
              </motion.div>
            </section>

            {/* ── Part One: how black holes work ───────────────── */}
            <PartHeader index={0}>
              <Stagger as="ol" className="mt-[44px] grid grid-cols-1 gap-x-[28px] gap-y-[2px] sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((l) => (
                  <motion.li key={l.id} variants={item}>
                    <a
                      href={`#${l.id}`}
                      className="link-base group flex items-baseline gap-[14px] py-[11px] transition-colors"
                      style={{ borderBottom: "1px solid var(--sim-border)", textDecoration: "none" }}
                    >
                      <span className={clsx(MONO, "text-[11px] tracking-[0.12em]")} style={{ color: "var(--sim-accent)" }}>{l.number}</span>
                      <span className={clsx(SERIF, "text-[20px] leading-[24px] transition-colors group-hover:text-[var(--sim-text)]")} style={{ color: "var(--sim-body)" }}>{l.title}</span>
                    </a>
                  </motion.li>
                ))}
              </Stagger>
            </PartHeader>

            {lessons.map((l, i) => (
              <LessonSection key={l.id} lesson={l} total={lessons.length} flip={i % 2 === 1} bare={l.id === "doppler"}>
                {DIAGRAMS[l.id]}
              </LessonSection>
            ))}

            {/* ── Part Two: tracing light ──────────────────────── */}
            <PartHeader index={1}/>
            <section className="relative pb-[90px] sm:pb-[120px]">
              <div className={clsx(WRAP, "grid grid-cols-1 gap-[48px] lg:grid-cols-12 items-center pt-[30px]")}>
                <Reveal className="lg:col-span-5">
                  <h3 className={clsx(SERIF, "font-light text-[34px] leading-[40px]")}>{text.tracing.title}</h3>
                  {text.tracing.paragraphs.map((p, i) => (
                    <p key={i} className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>{p}</p>
                  ))}
                </Reveal>
                <Reveal className="lg:col-span-7" delay={0.1}>
                  <div className="rounded-[16px] p-[18px] sm:p-[26px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.02)" }}>
                    <RayDiagram/>
                  </div>
                  <p className={clsx(SANS, "mt-[10px] text-[13px] italic font-light")} style={{ color: "var(--sim-muted)" }}>
                    {text.tracing.caption}
                  </p>
                </Reveal>
              </div>

              <div className={clsx(WRAP, "mt-[80px]")}>
                <Reveal>
                  <h3 className={clsx(SERIF, "font-light text-[34px] leading-[40px]")}>{text.realTime.title}</h3>
                  <p className={clsx(body, "mt-[14px] max-w-[720px]")} style={{ color: "var(--sim-body)" }}>
                    {text.realTime.text}
                  </p>
                </Reveal>
                <Stagger as="ol" className="mt-[36px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
                  {text.realTime.steps.map((s, i) => (
                    <motion.li key={i} variants={item} className="rounded-[14px] p-[22px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.025)" }}>
                      <div className={clsx(MONO, "text-[11px] tracking-[0.2em]")} style={{ color: "var(--sim-accent)" }}>{String(i + 1).padStart(2, "0")}</div>
                      <div className={clsx(SERIF, "mt-[8px] text-[28px]")} style={{ color: "var(--sim-text)" }}>{s.title}</div>
                      <p className={clsx(SANS, "mt-[8px] text-[14px] leading-[23px] font-light")} style={{ color: "var(--sim-body)" }}>{s.text}</p>
                    </motion.li>
                  ))}
                </Stagger>
              </div>
            </section>

            {/* ── Part Three: the simulations ──────────────────── */}
            <PartHeader index={2}/>
            {chapters.map((c, i) => (
              <ChapterSection key={c.id} chapter={c} reverse={i % 2 === 1}/>
            ))}

            {/* ── Glossary ─────────────────────────────────────── */}
            <section className="relative py-[90px] sm:py-[120px]" style={{ borderTop: "1px solid var(--sim-border)" }}>
              <div className={WRAP}>
                <Reveal>
                  <Kicker>{text.glossary.kicker}</Kicker>
                  <h2 className={clsx(h2, "mt-[14px]")}>{text.glossary.title}</h2>
                </Reveal>
                <Stagger as="dl" className="mt-[44px] grid grid-cols-1 gap-x-[56px] gap-y-[26px] md:grid-cols-2">
                  {glossary.map((g, i) => (
                    <motion.div key={i} variants={item} className="pb-[22px]" style={{ borderBottom: "1px solid var(--sim-border)" }}>
                      <dt className={clsx(SERIF, "text-[24px]")} style={{ color: "var(--sim-text)" }}>{g.title}</dt>
                      <dd className={clsx(SANS, "mt-[6px] text-[15px] leading-[25px] font-light")} style={{ color: "var(--sim-body)" }}>{g.text}</dd>
                    </motion.div>
                  ))}
                </Stagger>
              </div>
            </section>

            {/* ── Credits ──────────────────────────────────────── */}
            <footer className="relative py-[70px]" style={{ borderTop: "1px solid var(--sim-border)" }}>
              <div className={clsx(WRAP, "grid grid-cols-1 gap-[40px] md:grid-cols-12")}>
                <div className="md:col-span-7">
                  <Kicker color="var(--sim-muted)">{text.credits}</Kicker>
                  <ul className="mt-[16px] flex flex-col gap-[10px]">
                    {credits.map((c) => (
                      <li key={c.url} className={clsx(SANS, "text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>
                        {c.text}
                        <a href={c.url} target="_blank" rel="noopener noreferrer" lang="en" className="link-base underline underline-offset-[3px]" style={{ color: "var(--sim-accent)" }}>{c.link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-5">
                  <Kicker color="var(--sim-muted)">{text.requirements.title}</Kicker>
                  <p className={clsx(SANS, "mt-[16px] text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>
                    {text.requirements.text}
                  </p>
                  <NextLink href={localePath(locale, "/")} className={clsx(MONO, "link-base mt-[26px] inline-block text-[11px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-muted)", textDecoration: "none" }}>
                    {text.back}
                  </NextLink>
                </div>
              </div>
            </footer>
          </DarkScrollbars>
        </div>
      </SimulationsLayout>
    </MotionConfig>
  );
};

export default SimulationsPage;
