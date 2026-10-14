import React, { useRef } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { MotionConfig, motion, useScroll, useSpring, useTransform } from "framer-motion";
import SimulationsLayout from "../../components/Simulations/SimulationsLayout/SimulationsLayout";
import Starfield from "../../components/Simulations/Starfield/Starfield";
import RayDiagram from "../../components/Simulations/RayDiagram/RayDiagram";
import Formula from "../../components/Simulations/Formula/Formula";
import LessonSection, { WRAP } from "../../components/Simulations/LessonSection/LessonSection";
import { CHAPTERS, CREDITS, Chapter, GLOSSARY, presetHref } from "../../components/Simulations/content";
import { LESSONS, LessonId } from "../../components/Simulations/lessons";
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

const kicker = clsx(MONO, "text-[10.5px] sm:text-[11px] tracking-[0.24em] uppercase");
const body = clsx(SANS, "text-[16px] sm:text-[17px] leading-[28px] sm:leading-[30px] font-light");
const h2 = clsx(SERIF, "font-light text-[40px] leading-[44px] sm:text-[56px] sm:leading-[60px]");

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <div className={kicker} style={{ color: color ?? "var(--sim-accent)" }}>{children}</div>
);

const DIAGRAMS: Record<LessonId, React.ReactNode> = {
  gravity: <CurvedSpaceDiagram/>,
  escape: <SqueezeDiagram/>,
  birth: <CollapseDiagram/>,
  horizon: <RiverDiagram/>,
  "photon-sphere": <PhotonSphereDiagram/>,
  accretion: <AccretionDiagram/>,
  lensing: <LensingDiagram/>,
  doppler: <img className="block w-full aspect-video object-cover" src="/ray-tracing/images/blackhole-doppler.jpg" alt="A black hole in true colours, brighter and bluer on the left" loading="lazy"/>,
  spin: <SpinDiagram/>,
  tides: <TidesDiagram/>,
  hawking: <HawkingDiagram/>,
};

const PARTS: Array<{ id: string; label: string; title: string }> = [
  { id: "how-black-holes-work", label: "Part One", title: "How black holes work" },
  { id: "tracing-light", label: "Part Two", title: "Tracing light" },
  { id: "simulations", label: "Part Three", title: "The simulations" },
];

const PartHeader: React.FC<{ index: number; intro: string; children?: React.ReactNode }> = ({ index, intro, children }) => {
  const part = PARTS[index];
  return (
    <section id={part.id} className="relative pt-[100px] sm:pt-[140px] pb-[20px] scroll-mt-[56px]" style={{ borderTop: "1px solid var(--sim-border)" }}>
      <Starfield/>
      <div className={WRAP}>
        <Reveal>
          <Kicker>{part.label}</Kicker>
          <h2 className={clsx(SERIF, "mt-[14px] font-light text-[48px] leading-[50px] sm:text-[76px] sm:leading-[76px]")}>{part.title}</h2>
          <p className={clsx(body, "mt-[22px] max-w-[720px]")} style={{ color: "var(--sim-body)" }}>{intro}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
};

const ChapterSection: React.FC<{ chapter: Chapter; reverse: boolean }> = ({ chapter, reverse }) => {
  const accent = ACCENTS[chapter.id];
  const href = `/ray-tracing/${chapter.id}`;
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
            <Kicker>{`Simulation ${chapter.numeral} · ${chapter.field}`}</Kicker>
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
            {chapter.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>{p}</p>
            ))}
            <NextLink
              href={href}
              className={clsx(MONO, "link-base mt-[30px] inline-flex items-center gap-[10px] rounded-full px-[22px] py-[12px] text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white/5")}
              style={{ border: `1px solid ${accent}`, color: accent, textDecoration: "none" }}
            >
              Open the simulation <span aria-hidden>→</span>
            </NextLink>
          </Reveal>
        </div>

        <div className="relative mt-[70px] grid grid-cols-1 gap-[44px] md:grid-cols-12">
          <div className="md:col-span-5">
            <Kicker color="var(--sim-muted)">What you are seeing</Kicker>
            <Stagger as="dl" className="mt-[18px] flex flex-col gap-[18px]">
              {chapter.features.map((f) => (
                <motion.div key={f.title} variants={item} className="pl-[16px]" style={{ borderLeft: `1px solid ${accent}66` }}>
                  <dt className={clsx(SERIF, "text-[21px] leading-[26px]")} style={{ color: "var(--sim-text)" }}>{f.title}</dt>
                  <dd className={clsx(SANS, "mt-[4px] text-[14.5px] leading-[24px] font-light")} style={{ color: "var(--sim-body)" }}>{f.text}</dd>
                </motion.div>
              ))}
            </Stagger>
          </div>
          <div className="md:col-span-4">
            <Kicker color="var(--sim-muted)">The physics</Kicker>
            <Stagger className="mt-[18px] flex flex-col gap-[12px]">
              {chapter.equations.map((eq) => (
                <motion.div key={eq.name} variants={item} className="rounded-[12px] px-[16px] py-[14px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.025)" }}>
                  <div className={clsx(SANS, "text-[12.5px] font-light")} style={{ color: "var(--sim-muted)" }}>{eq.name}</div>
                  <div className={clsx(MONO, "my-[8px] text-[14px] leading-[22px] break-words")} style={{ color: "var(--sim-text)" }}><Formula text={eq.formula}/></div>
                  <div className={clsx(SANS, "text-[12.5px] leading-[19px] font-light")} style={{ color: "var(--sim-faint)" }}>{eq.note}</div>
                </motion.div>
              ))}
            </Stagger>
          </div>
          <div className="md:col-span-3">
            <Kicker color="var(--sim-muted)">Try this</Kicker>
            <Stagger className="mt-[18px] flex flex-col gap-[10px]">
              {chapter.presets.map((p) => (
                <motion.a
                  key={p.label}
                  variants={item}
                  href={presetHref(chapter.id, p.params)}
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

const STEPS: Array<{ n: string; title: string; text: string }> = [
  { n: "01", title: "Trace", text: "For each of the 8.3 million pixels of a 4K frame, a light ray is integrated backwards through curved spacetime with a fourth-order Runge–Kutta solver, until it falls in, crosses the disc, or escapes. On a modern GPU the whole frame takes about a second." },
  { n: "02", title: "Cache", text: "The result is stored as a ray map: where each pixel's light came from. The wormhole goes further: its symmetry means every possible ray fits into one 2048 × 512 table, computed once." },
  { n: "03", title: "Shade", text: "Each frame then only looks things up: the disc's position as it rotates, its Doppler and gravitational shift, and the colour of a blackbody at that temperature, from precomputed spectral tables." },
  { n: "04", title: "Expose", text: "Light is kept in high dynamic range, from faint stars to the blazing inner disc, then bloomed and tone-mapped like film. The stars come from NASA's 16K HDR map of the Milky Way." },
];

const SimulationsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const { scrollYProgress: heroProgress } = useScroll({ container: scrollRef, target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1.04, 1.16]);
  const heroFade = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <SimulationsLayout active="overview" overlayNav>
        <div className="relative h-full w-full">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[56px] z-30 h-[2px] origin-left"
            style={{ scaleX: progress, background: "linear-gradient(to right, #f2a65a, #b394ff, #6cc8ff)" }}
          />
          <div ref={scrollRef} className="relative h-full w-full overflow-y-auto overflow-x-hidden" style={{ colorScheme: "dark" }}>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section ref={heroRef} className="relative flex min-h-[100vh] items-end overflow-hidden">
              <motion.img
                className="absolute inset-0 h-full w-full object-cover"
                src="/ray-tracing/images/hero.jpg"
                alt=""
                fetchPriority="high"
                style={{ y: heroY, scale: heroScale }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--sim-bg) 2%, rgba(5,5,8,0.55) 38%, rgba(5,5,8,0.1) 70%), linear-gradient(to right, rgba(5,5,8,0.75), rgba(5,5,8,0) 60%)" }}/>
              <motion.div className={clsx(WRAP, "pb-[70px] sm:pb-[96px] pt-[120px]")} style={{ opacity: heroFade }}>
                <Stagger>
                  <motion.div variants={item}><Kicker>An illustrated guide to black holes and relativity</Kicker></motion.div>
                  <motion.h1 variants={item} className={clsx(SERIF, "mt-[18px] max-w-[900px] font-light text-[54px] leading-[54px] sm:text-[84px] sm:leading-[82px] lg:text-[104px] lg:leading-[98px]")}>
                    Light, bent by <em className="italic" style={{ color: "var(--sim-accent)" }}>spacetime</em>
                  </motion.h1>
                  <motion.p variants={item} className={clsx(body, "mt-[26px] max-w-[640px]")} style={{ color: "var(--sim-body)" }}>
                    How does a black hole work, and what would one really look like? Eleven short lessons explain, with animated diagrams. Then three real-time simulations let you fly around a black hole, through a wormhole and close to the speed of light. Every pixel is a ray of light, traced through curved spacetime.
                  </motion.p>
                  <motion.div variants={item} className="mt-[34px] flex flex-wrap items-center gap-[14px]">
                    <a
                      href="#how-black-holes-work"
                      className={clsx(MONO, "link-base rounded-full px-[24px] py-[13px] text-[11px] tracking-[0.2em] uppercase transition-[filter] hover:brightness-110")}
                      style={{ backgroundColor: "var(--sim-accent)", color: "#140c04", textDecoration: "none" }}
                    >
                      Start learning ↓
                    </a>
                    <NextLink
                      href="/ray-tracing/blackhole"
                      className={clsx(MONO, "link-base rounded-full px-[24px] py-[13px] text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-white/5")}
                      style={{ border: "1px solid var(--sim-border)", color: "var(--sim-text)", textDecoration: "none" }}
                    >
                      Open the black hole →
                    </NextLink>
                  </motion.div>
                  <motion.div variants={item} className="mt-[56px] hidden sm:flex flex-row gap-[40px]">
                    {PARTS.map((p) => (
                      <a key={p.id} href={`#${p.id}`} className="link-base group" style={{ textDecoration: "none" }}>
                        <div className={clsx(MONO, "text-[10px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-accent)" }}>{p.label}</div>
                        <div className={clsx(SERIF, "text-[22px] transition-colors group-hover:text-[var(--sim-text)]")} style={{ color: "var(--sim-body)" }}>{p.title}</div>
                      </a>
                    ))}
                  </motion.div>
                </Stagger>
              </motion.div>
            </section>

            {/* ── Part One: how black holes work ───────────────── */}
            <PartHeader
              index={0}
              intro="A black hole is the simplest object in the universe, and the strangest: just a mass, a spin and a boundary nothing can leave. These eleven short lessons go from why things fall to why black holes glow. No maths needed; the equations are there if you want them."
            >
              <Stagger as="ol" className="mt-[44px] grid grid-cols-1 gap-x-[28px] gap-y-[2px] sm:grid-cols-2 lg:grid-cols-3">
                {LESSONS.map((l) => (
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

            {LESSONS.map((l, i) => (
              <LessonSection key={l.id} lesson={l} total={LESSONS.length} flip={i % 2 === 1} bare={l.id === "doppler"}>
                {DIAGRAMS[l.id]}
              </LessonSection>
            ))}

            {/* ── Part Two: tracing light ──────────────────────── */}
            <PartHeader
              index={1}
              intro="To draw a black hole, you need to know where every ray of light reaching your eye came from. In flat space that is easy, because light travels in straight lines. Near a black hole, light follows the curved paths of the lessons above, so drawing it becomes a calculation."
            />
            <section className="relative pb-[90px] sm:pb-[120px]">
              <div className={clsx(WRAP, "grid grid-cols-1 gap-[48px] lg:grid-cols-12 items-center pt-[30px]")}>
                <Reveal className="lg:col-span-5">
                  <h3 className={clsx(SERIF, "font-light text-[34px] leading-[40px]")}>Running the light backwards</h3>
                  <p className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>
                    Ray tracing follows light in reverse. From the camera, one ray per pixel is launched into the scene and stepped through the curved geometry. If it falls through the horizon, the pixel is black. If it crosses the disc, it takes the disc&apos;s glow, shifted by the Doppler effect and by gravity. If it escapes, it takes the colour of the sky in the direction it finally leaves.
                  </p>
                  <p className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>
                    Near the Sun the bending is tiny, 1.75 arcseconds for starlight grazing its edge, about half a thousandth of a degree. Near a black hole it shapes everything you see.
                  </p>
                </Reveal>
                <Reveal className="lg:col-span-7" delay={0.1}>
                  <div className="rounded-[16px] p-[18px] sm:p-[26px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.02)" }}>
                    <RayDiagram/>
                  </div>
                  <p className={clsx(SANS, "mt-[10px] text-[13px] italic font-light")} style={{ color: "var(--sim-muted)" }}>
                    Rays from the camera, seen from the side. Aim close to the hole and the light is captured, forming the shadow; aim a little wider and it is bent over the top, revealing the far side of the disc.
                  </p>
                </Reveal>
              </div>

              <div className={clsx(WRAP, "mt-[80px]")}>
                <Reveal>
                  <h3 className={clsx(SERIF, "font-light text-[34px] leading-[40px]")}>Making it real-time</h3>
                  <p className={clsx(body, "mt-[14px] max-w-[720px]")} style={{ color: "var(--sim-body)" }}>
                    Following light through curved spacetime is expensive, so the work is split: the hard part is done once, and everything that moves is cheap. That is what lets these run at full 4K in a browser tab.
                  </p>
                </Reveal>
                <Stagger as="ol" className="mt-[36px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
                  {STEPS.map((s) => (
                    <motion.li key={s.n} variants={item} className="rounded-[14px] p-[22px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.025)" }}>
                      <div className={clsx(MONO, "text-[11px] tracking-[0.2em]")} style={{ color: "var(--sim-accent)" }}>{s.n}</div>
                      <div className={clsx(SERIF, "mt-[8px] text-[28px]")} style={{ color: "var(--sim-text)" }}>{s.title}</div>
                      <p className={clsx(SANS, "mt-[8px] text-[14px] leading-[23px] font-light")} style={{ color: "var(--sim-body)" }}>{s.text}</p>
                    </motion.li>
                  ))}
                </Stagger>
              </div>
            </section>

            {/* ── Part Three: the simulations ──────────────────── */}
            <PartHeader
              index={2}
              intro="Three experiments to fly through. Each runs live in your browser at up to 4K; every setting can be changed, and every view can be shared as a link."
            />
            {CHAPTERS.map((c, i) => (
              <ChapterSection key={c.id} chapter={c} reverse={i % 2 === 1}/>
            ))}

            {/* ── Glossary ─────────────────────────────────────── */}
            <section className="relative py-[90px] sm:py-[120px]" style={{ borderTop: "1px solid var(--sim-border)" }}>
              <div className={WRAP}>
                <Reveal>
                  <Kicker>Glossary</Kicker>
                  <h2 className={clsx(h2, "mt-[14px]")}>A few words</h2>
                </Reveal>
                <Stagger as="dl" className="mt-[44px] grid grid-cols-1 gap-x-[56px] gap-y-[26px] md:grid-cols-2">
                  {GLOSSARY.map((g) => (
                    <motion.div key={g.title} variants={item} className="pb-[22px]" style={{ borderBottom: "1px solid var(--sim-border)" }}>
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
                  <Kicker color="var(--sim-muted)">Sources and credits</Kicker>
                  <ul className="mt-[16px] flex flex-col gap-[10px]">
                    {CREDITS.map((c) => (
                      <li key={c.url} className={clsx(SANS, "text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>
                        {c.text}
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="link-base underline underline-offset-[3px]" style={{ color: "var(--sim-accent)" }}>{c.link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-5">
                  <Kicker color="var(--sim-muted)">Requirements</Kicker>
                  <p className={clsx(SANS, "mt-[16px] text-[14px] leading-[22px] font-light")} style={{ color: "var(--sim-body)" }}>
                    A desktop browser with WebGL 2 and float render targets: recent Chrome, Edge, Firefox or Safari. At 4K the black hole uses about 400 MB of GPU memory; on smaller GPUs, lower the render resolution under Output.
                  </p>
                  <NextLink href="/" className={clsx(MONO, "link-base mt-[26px] inline-block text-[11px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-muted)", textDecoration: "none" }}>
                    ← Back to kevinyupolin.dev
                  </NextLink>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SimulationsLayout>
    </MotionConfig>
  );
};

export default SimulationsPage;
