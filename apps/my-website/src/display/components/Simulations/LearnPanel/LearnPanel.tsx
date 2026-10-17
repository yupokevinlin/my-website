import React from "react";
import NextLink from "next/link";
import clsx from "clsx";
import type { Chapter, Preset } from "../content";
import { LESSONS } from "../lessons";
import { MONO, SANS, SERIF } from "../theme";
import Formula from "../Formula/Formula";

export interface LearnPanelProps {
  chapter: Chapter;
  handlePreset(preset: Preset): void;
}

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className={clsx(MONO, "text-[10.5px] tracking-[0.2em] uppercase mt-[26px] mb-[12px]")} style={{ color: "var(--sim-muted)" }}>
    {children}
  </h3>
);

// The educational side of a simulation: what it shows, things to try (which
// set the parameters live), what to look for, and the governing equations.
const LearnPanel: React.FC<LearnPanelProps> = ({ chapter, handlePreset }) => {
  const body = clsx(SANS, "text-[13.5px] leading-[22px] font-light");
  return (
    <div className="px-[18px] pt-[18px] pb-[8px]">
      <p className={clsx(SERIF, "text-[19px] leading-[25px] italic")} style={{ color: "var(--sim-text)" }}>{chapter.subtitle}</p>
      {chapter.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className={clsx(body, "mt-[12px]")} style={{ color: "var(--sim-body)" }}>{p}</p>
      ))}

      <Heading>Try this</Heading>
      <div className="flex flex-col gap-[8px]">
        {chapter.presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="btn-base group text-left rounded-[8px] px-[12px] py-[10px] cursor-pointer transition-colors hover:bg-white/[0.06]"
            style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.02)" }}
            onClick={() => handlePreset(preset)}
          >
            <span className={clsx(SANS, "block text-[13.5px] font-normal")} style={{ color: "var(--sim-accent)" }}>
              {preset.label} <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </span>
            <span className={clsx(SANS, "block text-[12.5px] leading-[18px] font-light mt-[2px]")} style={{ color: "var(--sim-muted)" }}>{preset.description}</span>
          </button>
        ))}
      </div>

      <Heading>What you are seeing</Heading>
      <dl className="flex flex-col gap-[12px]">
        {chapter.features.map((f) => (
          <div key={f.title}>
            <dt className={clsx(SERIF, "text-[17px] leading-[22px]")} style={{ color: "var(--sim-text)" }}>{f.title}</dt>
            <dd className={clsx(body, "mt-[2px]")} style={{ color: "var(--sim-body)" }}>{f.text}</dd>
          </div>
        ))}
      </dl>

      <Heading>The physics</Heading>
      <div className="flex flex-col gap-[10px]">
        {chapter.equations.map((eq) => (
          <div key={eq.name} className="rounded-[8px] px-[12px] py-[10px]" style={{ border: "1px solid var(--sim-border)", background: "rgba(255,255,255,0.02)" }}>
            <div className={clsx(SANS, "text-[12px] font-light")} style={{ color: "var(--sim-muted)" }}>{eq.name}</div>
            <div className={clsx(MONO, "text-[13px] my-[6px] break-words")} style={{ color: "var(--sim-text)" }}><Formula text={eq.formula}/></div>
            <div className={clsx(SANS, "text-[12px] leading-[17px] font-light")} style={{ color: "var(--sim-faint)" }}>{eq.note}</div>
          </div>
        ))}
      </div>

      {(chapter.id === "blackhole" || chapter.id === "infall") && (
        <>
          <Heading>New to black holes?</Heading>
          <ol className="flex flex-col">
            {LESSONS.map((l) => (
              <li key={l.id}>
                <NextLink
                  href={`/ray-tracing#${l.id}`}
                  className={clsx(SANS, "link-base flex items-baseline gap-[10px] py-[5px] text-[13px] font-light hover:text-[var(--sim-text)]")}
                  style={{ color: "var(--sim-body)", textDecoration: "none" }}
                >
                  <span className={clsx(MONO, "text-[10.5px]")} style={{ color: "var(--sim-accent)" }}>{l.number}</span>
                  {l.title}
                </NextLink>
              </li>
            ))}
          </ol>
        </>
      )}

      <Heading>Keys</Heading>
      <p className={clsx(MONO, "text-[11.5px] leading-[20px]")} style={{ color: "var(--sim-muted)" }}>
        Drag · look or orbit<br/>Wheel or pinch · zoom or move<br/>Space · pause &nbsp; F · fullscreen<br/>P · snapshot &nbsp; H · hide interface
      </p>
      <p className={clsx(SANS, "text-[12.5px] font-light mt-[18px]")} style={{ color: "var(--sim-faint)" }}>
        More in the <NextLink href={`/ray-tracing#${chapter.id}`} className="link-base underline" style={{ color: "var(--sim-accent)" }}>illustrated overview</NextLink>.
      </p>
    </div>
  );
};

export default LearnPanel;
