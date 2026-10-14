import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { Lesson } from "../lessons";
import { presetHref } from "../content";
import Formula from "../Formula/Formula";
import { ClientOnly, Reveal, Stagger, item } from "../motion";
import { MONO, SANS, SERIF } from "../theme";

export interface LessonSectionProps {
  lesson: Lesson;
  total: number;
  /** Put the figure on the left on large screens. */
  flip: boolean;
  /** The animated diagram, or an image with `bare`. */
  children: React.ReactNode;
  /** The figure brings its own frame (e.g. a photograph). */
  bare?: boolean;
}

export const WRAP = "relative mx-auto w-full max-w-[1180px] px-[20px] sm:px-[36px]";
const body = clsx(SANS, "text-[16px] sm:text-[17px] leading-[28px] sm:leading-[30px] font-light");

// One lesson of "How black holes work": the text on one side, and a sticky
// animated figure on the other, so the figure stays in view while reading.
const LessonSection: React.FC<LessonSectionProps> = ({ lesson, total, flip, children, bare }) => (
  <section id={lesson.id} className="relative py-[60px] sm:py-[90px] scroll-mt-[56px]">
    <div className={WRAP}>
      <div className="grid grid-cols-1 items-start gap-[36px] lg:grid-cols-12 lg:gap-[60px]">
        <div className={clsx("lg:col-span-5", flip && "lg:order-2")}>
          <Reveal>
            <div className="flex items-center gap-[12px]">
              <span className={clsx(MONO, "text-[11px] tracking-[0.24em] uppercase")} style={{ color: "var(--sim-accent)" }}>Lesson {lesson.number}</span>
              <span className="h-[1px] w-[36px]" style={{ background: "var(--sim-accent)", opacity: 0.45 }}/>
              <span className={clsx(MONO, "text-[11px] tracking-[0.2em]")} style={{ color: "var(--sim-faint)" }}>of {total}</span>
            </div>
            <h3 className={clsx(SERIF, "mt-[14px] font-light text-[36px] leading-[40px] sm:text-[46px] sm:leading-[50px]")} style={{ color: "var(--sim-text)" }}>{lesson.title}</h3>
            <p className={clsx(SERIF, "mt-[12px] italic text-[21px] leading-[29px] sm:text-[24px] sm:leading-[32px]")} style={{ color: "var(--sim-accent)" }}>{lesson.lead}</p>
          </Reveal>
          {lesson.paragraphs.map((p, i) => (
            <Reveal key={p.slice(0, 24)} delay={0.05 * i} y={16}>
              <p className={clsx(body, "mt-[18px]")} style={{ color: "var(--sim-body)" }}>{p}</p>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <div
              className="mt-[28px] rounded-[14px] px-[18px] py-[16px]"
              style={{ border: "1px solid rgba(242,166,90,0.28)", background: "linear-gradient(135deg, rgba(242,166,90,0.09), rgba(242,166,90,0.015))" }}
            >
              <div className={clsx(MONO, "text-[10.5px] tracking-[0.24em] uppercase")} style={{ color: "var(--sim-accent)" }}>Key idea</div>
              <p className={clsx(SERIF, "mt-[6px] text-[20px] leading-[27px]")} style={{ color: "var(--sim-text)" }}><Formula text={lesson.keyIdea.text}/></p>
              {lesson.keyIdea.formula && (
                <div className={clsx(MONO, "mt-[10px] text-[15px] leading-[22px] break-words")} style={{ color: "var(--sim-text)" }}><Formula text={lesson.keyIdea.formula}/></div>
              )}
            </div>
          </Reveal>

          {lesson.facts && (
            <Stagger as="dl" className="mt-[24px] grid grid-cols-2 gap-x-[20px] gap-y-[16px]">
              {lesson.facts.map((f) => (
                <motion.div key={f.label} variants={item} className="pl-[14px]" style={{ borderLeft: "1px solid rgba(242,166,90,0.4)" }}>
                  <dt className={clsx(SERIF, "text-[26px] leading-[30px] sm:text-[30px] sm:leading-[34px]")} style={{ color: "var(--sim-text)" }}>{f.value}</dt>
                  <dd className={clsx(SANS, "mt-[2px] text-[13px] leading-[19px] font-light")} style={{ color: "var(--sim-muted)" }}>{f.label}</dd>
                </motion.div>
              ))}
            </Stagger>
          )}

          {lesson.tryIt && (
            <Reveal delay={0.1}>
              <a
                href={presetHref("blackhole", lesson.tryIt.params)}
                className={clsx(SANS, "link-base group mt-[26px] inline-flex items-center gap-[10px] rounded-full px-[18px] py-[10px] text-[14px] transition-colors hover:bg-white/[0.05]")}
                style={{ border: "1px solid var(--sim-border)", color: "var(--sim-text)", textDecoration: "none" }}
              >
                <span className={clsx(MONO, "text-[10px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-accent)" }}>Try it</span>
                {lesson.tryIt.label}
                <span className="inline-block transition-transform group-hover:translate-x-[3px]" style={{ color: "var(--sim-accent)" }}>→</span>
              </a>
            </Reveal>
          )}
        </div>

        <div className={clsx("lg:col-span-7 lg:sticky lg:top-[88px]", flip && "lg:order-1")}>
          <Reveal delay={0.12}>
            <figure>
              <div
                className={clsx("overflow-hidden rounded-[16px]", !bare && "p-[14px] sm:p-[22px]")}
                style={{ border: "1px solid var(--sim-border)", background: "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.035), rgba(255,255,255,0.01))" }}
              >
                {bare ? children : <ClientOnly fallback={<div className="aspect-[2/1] w-full"/>}>{children}</ClientOnly>}
              </div>
              <figcaption className={clsx(SANS, "mt-[10px] text-[13px] leading-[20px] font-light italic")} style={{ color: "var(--sim-muted)" }}>{lesson.caption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default LessonSection;
