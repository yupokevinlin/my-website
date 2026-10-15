import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { CONSTRAINED_DEFAULTS, Engine, EngineStats, GLOBAL_PARAMS } from "../../../simulations/gl/engine";
import { isConstrainedDevice } from "../../../simulations/gl/device";
import { getSimulation } from "../../../simulations/sims/registry";
import type { ParamDef, Params, ParamValue, Simulation } from "../../../simulations/sims/types";
import SimulationsLayout from "../../components/Simulations/SimulationsLayout/SimulationsLayout";
import ControlPanel from "../../components/Simulations/ControlPanel/ControlPanel";
import LearnPanel from "../../components/Simulations/LearnPanel/LearnPanel";
import DarkScrollbars from "../../components/Simulations/DarkScrollbars/DarkScrollbars";
import { Preset, SimId, getChapter } from "../../components/Simulations/content";
import { MONO, SANS, SERIF } from "../../components/Simulations/theme";
import { CameraIcon, FullscreenIcon, InfoIcon, PauseIcon, PlayIcon, TuneIcon } from "../../components/Simulations/SimulationIcons/SimulationIcons";

const defaultsOf = (defs: Array<ParamDef>): Params => Object.fromEntries(defs.map((d) => [d.key, d.default]));

const noSubscribe = () => () => undefined;

// shareable links: every non-default parameter lives in the URL hash
const parseHash = (hash: string, defs: Array<ParamDef>): Params => {
  const q = new URLSearchParams(hash.replace(/^#/, ""));
  const out: Params = {};
  for (const d of defs) {
    const raw = q.get(d.key);
    if (raw === null) continue;
    if (d.kind === "range") {
      const n = Number(raw);
      if (Number.isFinite(n)) out[d.key] = Math.min(d.max ?? n, Math.max(d.min ?? n, n));
    } else if (d.kind === "toggle") out[d.key] = raw === "1";
    else if (d.options?.some((o) => o.value === raw)) out[d.key] = raw;
  }
  return out;
};

const encodeHash = (params: Params, defs: Array<ParamDef>): string => {
  const q = new URLSearchParams();
  for (const d of defs) {
    const v = params[d.key];
    if (v === d.default) continue;
    if (typeof v === "boolean") q.set(d.key, v ? "1" : "0");
    else if (typeof v === "number") {
      const decimals = Math.max(0, Math.ceil(-Math.log10(d.step ?? 0.01)));
      q.set(d.key, String(Number(v.toFixed(decimals))));
    } else q.set(d.key, v);
  }
  const s = q.toString();
  return s ? `#${s}` : "";
};

// Frosted glass for the cards over the view: a light tint with a strong blur,
// so the simulation shows through behind the readouts. The text shadow keeps
// them readable over the bright disc.
const glass = "rounded-[10px] backdrop-blur-[16px] backdrop-saturate-150";
const glassStyle: React.CSSProperties = {
  backgroundColor: "rgba(10, 11, 18, 0.42)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
};

const ToolButton: React.FC<{ title: string; onClick(): void; active?: boolean; children: React.ReactNode }> = ({ title, onClick, active, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    className="btn-base flex h-[34px] min-w-[34px] items-center justify-center gap-[8px] rounded-[8px] px-[8px] cursor-pointer transition-colors hover:bg-white/10"
    style={{ border: "none", background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "var(--sim-accent)" : "var(--sim-text)" }}
    onClick={onClick}
  >
    {children}
  </button>
);

export interface SimulationPageProps {
  id: SimId;
}

const SimulationPage: React.FC<SimulationPageProps> = (props) => {
  const { id } = props;
  const desc = getSimulation(id);
  const chapter = getChapter(id);
  // Phones and tablets default to rendering at the screen's size with the High
  // star map; the desktop defaults use more graphics memory than they allow.
  const constrained = useSyncExternalStore(noSubscribe, isConstrainedDevice, () => false);
  const defs = useMemo(() => {
    const over = { ...(desc.globalDefaults ?? {}), ...(constrained ? CONSTRAINED_DEFAULTS : {}) };
    return [...desc.params, ...GLOBAL_PARAMS.map((d) => (d.key in over ? { ...d, default: over[d.key] } : d))];
  }, [desc, constrained]);
  const [params, setParams] = useState<Params>(() => defaultsOf(defs));
  const paramsRef = useRef(params);
  paramsRef.current = params;
  // After hydration the first render used the desktop defaults: move any
  // output setting still at its desktop default to the device's default.
  useEffect(() => {
    if (!constrained) return;
    setParams((p) => {
      const next = { ...p };
      for (const d of GLOBAL_PARAMS) if (d.key in CONSTRAINED_DEFAULTS && p[d.key] === d.default) next[d.key] = CONSTRAINED_DEFAULTS[d.key];
      return next;
    });
  }, [constrained]);

  const stageRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const simRef = useRef<Simulation | null>(null);
  const [stats, setStats] = useState<EngineStats | null>(null);
  const [error, setError] = useState<{ title: string; message: string; hint: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [tab, setTab] = useState<"controls" | "learn">("controls");
  const [uiHidden, setUiHidden] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  // stage size in CSS pixels; [0, 0] until the ResizeObserver first reports it
  const [stage, setStage] = useState<[number, number]>([0, 0]);
  const pausedScale = useRef(1);

  // ---- params from URL hash (shareable links and "try this" links) ----
  useEffect(() => {
    const apply = (): void => {
      const fromHash = parseHash(window.location.hash, defs);
      if (Object.keys(fromHash).length) setParams((p) => ({ ...p, ...fromHash }));
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [defs]);
  useEffect(() => {
    const t = setTimeout(() => {
      const h = encodeHash(params, defs);
      if (h !== window.location.hash) history.replaceState(history.state, "", window.location.pathname + h);
    }, 300);
    return () => clearTimeout(t);
  }, [params, defs]);

  // ---- stage size ----
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setStage([e.contentRect.width, e.contentRect.height]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const windowRes = useCallback((): [number, number] => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return [Math.round(stage[0] * dpr), Math.round(stage[1] * dpr)];
  }, [stage]);

  // ---- engine + simulation lifecycle ----
  useEffect(() => {
    const holder = holderRef.current, stageEl = stageRef.current;
    if (!holder || !stageEl) return undefined;
    // a fresh canvas per mount: a context lost via dispose() can't be re-acquired
    const canvas = document.createElement("canvas");
    canvas.className = "block shrink-0";
    holder.appendChild(canvas);
    let engine: Engine;
    let sim: Simulation;
    try {
      engine = new Engine(canvas);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = stageEl.getBoundingClientRect();
      engine.windowSize = [rect.width * dpr, rect.height * dpr];
      sim = desc.create(engine);
    } catch (e) {
      setError({
        title: "This simulation needs WebGL 2 with float render targets",
        message: e instanceof Error ? e.message : String(e),
        hint: "Try a recent Chrome, Edge, Firefox or Safari with hardware acceleration enabled.",
      });
      canvas.remove();
      return undefined;
    }
    engineRef.current = engine;
    simRef.current = sim;
    engine.start(sim, () => paramsRef.current, setStats);
    // Browsers drop the WebGL context when graphics memory runs out (phones especially).
    const lost = (): void => setError({
      title: "The 3D view stopped",
      message: "The browser stopped the 3D view, most likely because it ran out of graphics memory.",
      hint: "Reload the page to try again. A lower render resolution or star map detail under Output also helps.",
    });
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      // dispose() deliberately loses the context, which is not an error
      canvas.removeEventListener("webglcontextlost", lost);
      sim.dispose();
      engine.dispose();
      engineRef.current = null;
      simRef.current = null;
      canvas.remove();
    };
  }, [desc]);

  useEffect(() => {
    // the engine starts with the measured stage size; don't overwrite it with the placeholder
    if (engineRef.current && stage[0] > 0) engineRef.current.windowSize = windowRes();
  }, [windowRes, stage]);

  // scale the canvas (fixed render resolution) to cover the stage, centred;
  // the stage clips the overflow, while snapshots keep the full frame
  const renderW = stats?.width ?? 3840;
  const renderH = stats?.height ?? 2160;
  const fit = Math.max(stage[0] / renderW, stage[1] / renderH);
  useEffect(() => {
    const c = holderRef.current?.querySelector("canvas");
    if (!c) return;
    c.style.width = `${Math.ceil(renderW * fit)}px`;
    c.style.height = `${Math.ceil(renderH * fit)}px`;
  }, [renderW, renderH, fit]);

  const setParam = useCallback((key: string, value: ParamValue) => setParams((p) => ({ ...p, [key]: value })), []);
  const applyPreset = useCallback((preset: Preset) => setParams((p) => ({ ...p, ...preset.params })), []);

  // ---- pointer interaction ----
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return undefined;
    // One pointer drags the camera; two fingers pinch, which works like the wheel.
    // Positions are tracked here because touch pointers don't report movementX/Y everywhere.
    const pointers = new Map<number, { x: number; y: number }>();
    let spread = 0; // distance between the two pinching fingers at the last move
    const measureSpread = (): number => {
      const [a, b] = Array.from(pointers.values());
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const zoom = (deltaY: number): void => {
      setParams((p) => {
        const ch = simRef.current?.onWheel?.(deltaY, p);
        return ch ? ({ ...p, ...ch } as Params) : p;
      });
    };
    const down = (e: PointerEvent): void => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      spread = pointers.size === 2 ? measureSpread() : 0;
    };
    const move = (e: PointerEvent): void => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      const mx = e.clientX - last.x, my = e.clientY - last.y;
      last.x = e.clientX;
      last.y = e.clientY;
      if (pointers.size === 1 && simRef.current?.onDrag) {
        const h = el.getBoundingClientRect().height || 1;
        setParams((p) => {
          const ch = simRef.current?.onDrag?.(mx / h, my / h, p);
          return ch ? ({ ...p, ...ch } as Params) : p;
        });
      } else if (pointers.size === 2) {
        const d = measureSpread();
        // spreading the fingers zooms in, like scrolling up; doubling the spread
        // halves the black hole distance
        if (spread > 0 && d > 0) zoom(-Math.log(d / spread) * 1000);
        spread = d;
      }
    };
    const up = (e: PointerEvent): void => {
      pointers.delete(e.pointerId);
      spread = pointers.size === 2 ? measureSpread() : 0;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const wheel = (e: WheelEvent): void => {
      if (!simRef.current?.onWheel) return;
      e.preventDefault();
      zoom(e.deltaY);
    };
    // any button drags the camera, so keep the browser menu off the view
    const menu = (e: MouseEvent): void => e.preventDefault();
    // Safari's own pinch would zoom the page
    const gesture = (e: Event): void => e.preventDefault();
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("contextmenu", menu);
    el.addEventListener("gesturestart", gesture);
    el.addEventListener("gesturechange", gesture);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("contextmenu", menu);
      el.removeEventListener("gesturestart", gesture);
      el.removeEventListener("gesturechange", gesture);
    };
  }, []);

  // ---- actions ----
  const snapshot = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine || saving) return;
    setSaving(true);
    try {
      const blob = await engine.snapshot();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${desc.id}-${engine.width}x${engine.height}-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setSaving(false);
    }
  }, [desc.id, saving]);

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else stageRef.current?.requestFullscreen();
  }, []);

  const togglePause = useCallback(() => {
    setParams((p) => {
      const ts = Number(p.timeScale);
      if (ts > 0) {
        pausedScale.current = ts;
        return { ...p, timeScale: 0 };
      }
      return { ...p, timeScale: pausedScale.current || 1 };
    });
  }, []);

  const copyLink = useCallback(async () => {
    const url = window.location.origin + window.location.pathname + encodeHash(paramsRef.current, defs);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [defs]);

  const openPanel = (next: "controls" | "learn"): void => {
    if (panelOpen && tab === next) setPanelOpen(false);
    else {
      setTab(next);
      setPanelOpen(true);
    }
  };

  useEffect(() => {
    const key = (e: KeyboardEvent): void => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT") return;
      if (e.key === "h" || e.key === "H") setUiHidden((v) => !v);
      else if (e.key === "f" || e.key === "F") fullscreen();
      else if (e.key === "p" || e.key === "P") snapshot();
      else if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [fullscreen, snapshot, togglePause]);

  const hud = simRef.current?.hud?.(params) ?? [];
  const curve = simRef.current?.curve?.(params) ?? null;
  const status = stats?.status;
  // only report work in progress (tracing, star map loading), not finished states
  const working = [status && status.progress < 1 ? status.label : "", stats?.skyLoading ?? ""].filter(Boolean).join(" · ");
  const paused = Number(params.timeScale) === 0;
  const icon = "!h-[20px] !w-[20px]";

  return (
    <SimulationsLayout active={id} hideChrome={uiHidden}>
      <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
        <div ref={stageRef} className="relative w-full shrink-0 aspect-video overflow-hidden bg-black md:aspect-auto md:h-full md:flex-1 md:shrink">
          <div ref={holderRef} className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"/>

          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-[16px]">
              <div className={clsx(glass, "max-w-[520px] p-[24px]")} style={glassStyle}>
                <p className={clsx(SERIF, "text-[24px] mb-[10px]")} style={{ color: "var(--sim-text)" }}>{error.title}</p>
                <p className={clsx(SANS, "text-[14px] font-light mb-[8px]")} style={{ color: "var(--sim-body)" }}>{error.message}</p>
                <p className={clsx(SANS, "text-[14px] font-light")} style={{ color: "var(--sim-muted)" }}>{error.hint}</p>
              </div>
            </div>
          )}

          {!uiHidden && (
            <div className="pointer-events-none absolute left-[16px] top-[14px] sm:left-[22px] sm:top-[18px] flex flex-col gap-[12px] max-w-[calc(100%-200px)]">
              <div style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}>
                <div className={clsx(MONO, "text-[10px] tracking-[0.22em] uppercase")} style={{ color: "var(--sim-accent)" }}>{chapter.kicker}</div>
                <h1 className={clsx(SERIF, "text-[26px] leading-[30px] sm:text-[34px] sm:leading-[38px] font-normal mt-[4px]")} style={{ color: "var(--sim-text)" }}>{chapter.title}</h1>
              </div>
              {hud.length > 0 && (
                <div className={clsx(glass, "hidden sm:flex flex-col gap-[3px] px-[12px] py-[9px] w-max")} style={glassStyle}>
                  {hud.map((h) => (
                    <div key={h.label} className="flex flex-row items-baseline justify-between gap-[18px]">
                      <span className={clsx(SANS, "text-[11.5px] font-light whitespace-nowrap")} style={{ color: "var(--sim-body)" }}>{h.label}</span>
                      <span className={clsx(MONO, "text-[11.5px] tabular-nums whitespace-nowrap")} style={{ color: "var(--sim-text)" }}>{h.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {curve && (
                <div className={clsx(glass, "hidden sm:block px-[12px] pt-[8px] pb-[10px] w-[280px]")} style={glassStyle}>
                  <div className={clsx(SANS, "text-[11.5px] font-light mb-[6px]")} style={{ color: "var(--sim-body)" }}>{curve.label}</div>
                  <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="block h-[46px] w-full">
                    <polyline
                      points={curve.values.map((v, i) => `${(100 * i) / Math.max(curve.values.length - 1, 1)},${30 - 28 * v}`).join(" ")}
                      fill="none"
                      stroke="var(--sim-accent)"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line x1={100 * curve.marker} x2={100 * curve.marker} y1="0" y2="32" stroke="rgba(255,255,255,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                  </svg>
                </div>
              )}
            </div>
          )}

          {!uiHidden && (
            <div className={clsx(glass, "absolute right-[12px] top-[12px] flex flex-row items-center gap-[2px] p-[4px]")} style={glassStyle}>
              <ToolButton title={paused ? "Play (Space)" : "Pause (Space)"} onClick={togglePause}>
                {paused ? <PlayIcon className={icon}/> : <PauseIcon className={icon}/>}
              </ToolButton>
              <span className="hidden sm:flex">
                <ToolButton title="Fullscreen (F)" onClick={fullscreen}><FullscreenIcon className={icon}/></ToolButton>
              </span>
              <ToolButton title="Save a PNG at the render resolution (P)" active={saving} onClick={snapshot}>
                <CameraIcon className={icon}/>
              </ToolButton>
              <span className="mx-[2px] h-[20px] w-[1px]" style={{ backgroundColor: "var(--sim-border)" }}/>
              <ToolButton title="Learn" active={panelOpen && tab === "learn"} onClick={() => openPanel("learn")}><InfoIcon className={icon}/></ToolButton>
              <ToolButton title="Controls" active={panelOpen && tab === "controls"} onClick={() => openPanel("controls")}><TuneIcon className={icon}/></ToolButton>
            </div>
          )}

          {!uiHidden && (
            <div className={clsx(glass, "pointer-events-none absolute left-[12px] bottom-[12px] sm:left-[22px] sm:bottom-[16px] flex flex-col gap-[6px] px-[12px] py-[8px] max-w-[calc(100%-24px)]")} style={glassStyle}>
              {status && status.progress < 1 && (
                <div className="h-[2px] w-[220px] max-w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full transition-[width] duration-200" style={{ width: `${status.progress * 100}%`, backgroundColor: "var(--sim-accent)" }}/>
                </div>
              )}
              {working && (
                <span className={clsx(SANS, "text-[11.5px] font-light truncate")} style={{ color: "var(--sim-body)" }}>{working}</span>
              )}
              <span className={clsx(MONO, "text-[11px] tabular-nums")} style={{ color: "var(--sim-body)" }}>
                {stats ? `${stats.fps.toFixed(0)} fps` : "starting…"}
                {paused ? " · paused" : ""}
              </span>
            </div>
          )}

          {!uiHidden && (
            <span className={clsx(SANS, "pointer-events-none absolute right-[18px] bottom-[16px] hidden lg:block text-[11.5px] font-light")} style={{ color: "rgba(236,232,225,0.45)" }}>
              {desc.controlsHelp}
            </span>
          )}
        </div>

        {panelOpen && !uiHidden && (
          <aside
            className="flex min-h-0 w-full flex-1 flex-col md:absolute md:right-0 md:top-0 md:z-[1] md:h-full md:w-[330px] md:flex-none lg:static lg:w-[360px]"
            style={{ backgroundColor: "var(--sim-surface-solid)", borderLeft: "1px solid var(--sim-border)" }}
          >
            <div className="flex shrink-0 flex-row px-[18px] pt-[12px]" style={{ borderBottom: "1px solid var(--sim-border)" }}>
              {(["controls", "learn"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={clsx(MONO, "btn-base relative mr-[22px] pb-[10px] text-[10.5px] tracking-[0.2em] uppercase cursor-pointer")}
                  style={{ border: "none", background: "transparent", color: tab === t ? "var(--sim-text)" : "var(--sim-faint)" }}
                  onClick={() => setTab(t)}
                >
                  {t === "controls" ? "Controls" : "Learn"}
                  <span className="absolute left-0 right-0 bottom-[-1px] h-[1px]" style={{ backgroundColor: "var(--sim-accent)", opacity: tab === t ? 1 : 0 }}/>
                </button>
              ))}
            </div>
            <div className="relative min-h-0 flex-1">
              <DarkScrollbars>
                <div className="pb-[18px]">
                  {tab === "controls" ? (
                    <ControlPanel
                      defs={defs}
                      params={params}
                      copied={copied}
                      handleChange={setParam}
                      handleReset={() => setParams(defaultsOf(defs))}
                      handleCopyLink={copyLink}
                    />
                  ) : (
                    <LearnPanel chapter={chapter} handlePreset={applyPreset}/>
                  )}
                  <p className={clsx(MONO, "px-[18px] pt-[14px] text-[10px] leading-[15px] break-words")} style={{ color: "var(--sim-faint)" }}>{stats?.renderer}</p>
                </div>
              </DarkScrollbars>
            </div>
          </aside>
        )}
      </div>
    </SimulationsLayout>
  );
};

export default SimulationPage;
