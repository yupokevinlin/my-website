import React, { useMemo, useState } from "react";
import clsx from "clsx";
import type { ParamDef, Params, ParamValue } from "../../../../simulations/sims/types";
import { ExpandMoreIcon } from "../SimulationIcons/SimulationIcons";
import { MONO, SANS } from "../theme";

export interface ControlPanelProps {
  defs: Array<ParamDef>;
  params: Params;
  copied: boolean;
  handleChange(key: string, value: ParamValue): void;
  handleReset(): void;
  handleCopyLink(): void;
}

// Opaque, so the browser's open dropdown menu is dark too (a translucent
// background is drawn over white in Chrome's menu).
const SELECT_BG = "#16171e";

const formatValue = (def: ParamDef, v: number): string => {
  if (def.format) return def.format(v);
  const s = v.toFixed(def.digits ?? 2);
  return def.unit ? `${s} ${def.unit}` : s;
};

const RetraceMark: React.FC = () => (
  <span className="ml-[6px] text-[11px]" style={{ color: "var(--sim-accent)" }} title="Changing this re-traces the light paths">⟳</span>
);

const Switch: React.FC<{ checked: boolean; onChange(v: boolean): void; label: string }> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className="btn-base relative h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full transition-colors duration-150"
    style={{ border: "1px solid var(--sim-border)", backgroundColor: checked ? "var(--sim-accent)" : "rgba(255,255,255,0.08)", padding: 0 }}
    onClick={() => onChange(!checked)}
  >
    <span
      className="absolute top-[2px] h-[12px] w-[12px] rounded-full transition-all duration-150"
      style={{ left: checked ? "16px" : "2px", backgroundColor: checked ? "#0c0d14" : "var(--sim-muted)" }}
    />
  </button>
);

const Control: React.FC<{ def: ParamDef; value: ParamValue; onChange(v: ParamValue): void }> = ({ def, value, onChange }) => {
  const label = (
    <span className={clsx(SANS, "text-[13px] leading-[16px] font-light")} style={{ color: "var(--sim-body)" }}>
      {def.label}
      {def.retrace && <RetraceMark/>}
    </span>
  );

  if (def.kind === "toggle") {
    return (
      <div className="flex flex-row items-center justify-between gap-[12px]" title={def.hint}>
        {label}
        <Switch checked={Boolean(value)} onChange={onChange} label={def.label}/>
      </div>
    );
  }

  if (def.kind === "select") {
    return (
      <label className="flex flex-col gap-[6px]" title={def.hint}>
        {label}
        <select
          className={clsx(SANS, "btn-base w-full h-[32px] rounded-[6px] px-[8px] text-[13px] font-light cursor-pointer")}
          style={{ border: "1px solid var(--sim-border)", backgroundColor: SELECT_BG, color: "var(--sim-text)", colorScheme: "dark" }}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {(def.options ?? []).map((o) => (
            <option key={o.value} value={o.value} style={{ backgroundColor: SELECT_BG, color: "#ece8e1" }}>{o.label}</option>
          ))}
        </select>
      </label>
    );
  }

  const v = Number(value);
  return (
    <label className="flex flex-col gap-[5px]" title={def.hint}>
      <div className="flex flex-row items-baseline justify-between gap-[12px]">
        {label}
        <span className={clsx(MONO, "text-[11.5px] tabular-nums whitespace-nowrap")} style={{ color: "var(--sim-accent)" }}>
          {formatValue(def, v)}
        </span>
      </div>
      <input
        type="range"
        className="w-full cursor-pointer accent-[var(--sim-accent)]"
        style={{ colorScheme: "dark" }}
        min={def.min}
        max={def.max}
        step={def.step}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(def.default)}
      />
    </label>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { defs, params, copied, handleChange, handleReset, handleCopyLink } = props;
  const groups = useMemo(() => {
    const m = new Map<string, Array<ParamDef>>();
    defs.forEach((d) => m.set(d.group, [...(m.get(d.group) ?? []), d]));
    return [...m.entries()];
  }, [defs]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ Output: true, Quality: true });
  const ghost = clsx(MONO, "btn-base flex-1 h-[32px] rounded-[6px] text-[10.5px] tracking-[0.14em] uppercase cursor-pointer transition-colors hover:bg-white/5");

  return (
    <div className="flex flex-col w-full">
      {groups.map(([group, items]) => (
        <section key={group} style={{ borderBottom: "1px solid var(--sim-border)" }}>
          <button
            type="button"
            className="btn-base w-full flex flex-row items-center justify-between h-[40px] px-[18px] cursor-pointer"
            style={{ border: "none", background: "transparent" }}
            onClick={() => setCollapsed((c) => ({ ...c, [group]: !c[group] }))}
            aria-expanded={!collapsed[group]}
          >
            <span className={clsx(MONO, "text-[10.5px] tracking-[0.2em] uppercase")} style={{ color: "var(--sim-muted)" }}>{group}</span>
            <ExpandMoreIcon
              className="!h-[18px] !w-[18px] transition-transform duration-150"
              style={{ color: "var(--sim-faint)", transform: collapsed[group] ? "rotate(-90deg)" : "none" }}
            />
          </button>
          {!collapsed[group] && (
            <div className="flex flex-col gap-[14px] px-[18px] pt-[2px] pb-[16px]">
              {items
                .filter((d) => !d.visibleIf || d.visibleIf(params))
                .map((d) => (
                  <Control key={d.key} def={d} value={params[d.key]} onChange={(v) => handleChange(d.key, v)}/>
                ))}
            </div>
          )}
        </section>
      ))}
      <div className="flex flex-row gap-[8px] px-[18px] pt-[16px]">
        <button type="button" className={ghost} style={{ border: "1px solid var(--sim-border)", background: "transparent", color: "var(--sim-body)" }} onClick={handleReset}>
          Reset
        </button>
        <button type="button" className={ghost} style={{ border: "1px solid var(--sim-accent)", background: "transparent", color: "var(--sim-accent)" }} onClick={handleCopyLink}>
          {copied ? "Copied ✓" : "Share link"}
        </button>
      </div>
      <p className={clsx(SANS, "px-[18px] pt-[12px] text-[12px] font-light leading-[17px]")} style={{ color: "var(--sim-faint)" }}>
        <span style={{ color: "var(--sim-accent)" }}>⟳</span> re-traces the light paths: an instant preview, then full resolution.
      </p>
    </div>
  );
};

export default ControlPanel;
