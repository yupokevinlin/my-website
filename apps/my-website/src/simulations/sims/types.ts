import type { Engine } from "../gl/engine";
import type { GuideText } from "../../i18n/messages/guide/en";

// Every simulation's readout and progress text, in the page's language; each
// simulation reads its own part
export type Readouts = GuideText["readouts"];

export type ParamValue = number | boolean | string;
export type Params = Record<string, ParamValue>;

export interface ParamDef {
  key: string;
  label: string;
  group: string;
  kind: "range" | "toggle" | "select";
  default: ParamValue;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
  /** Changing this re-traces the light paths (preview first, then progressive 4K). */
  retrace?: boolean;
  hint?: string;
  /** Number of decimals for the value readout. */
  digits?: number;
  /** Custom value readout. */
  format?: (v: number) => string;
  /** Only show when this predicate is true. */
  visibleIf?: (p: Params) => boolean;
}

export interface FrameInfo {
  /** Simulation time in seconds (pauses when paused). */
  time: number;
  /** Delta in seconds since last frame (0 when paused). */
  dt: number;
  width: number;
  height: number;
}

export interface HudItem {
  label: string;
  value: string;
}

export interface SimStatus {
  /** 0..1 progress of the background bake, 1 when done. */
  progress: number;
  label: string;
}

export interface Simulation {
  /** Render one frame of HDR radiance into engine.post.hdr. */
  render(params: Params, frame: FrameInfo): void;
  /** Pointer drag in units of canvas height. Return param changes (or null). */
  onDrag?(dx: number, dy: number, params: Params): Partial<Params> | null;
  onWheel?(deltaY: number, params: Params): Partial<Params> | null;
  hud?(params: Params): HudItem[];
  status?(): SimStatus | null;
  dispose(): void;
}

export interface SimulationDescriptor {
  id: string;
  title: string;
  tagline: string;
  description: string;
  controlsHelp: string;
  params: ParamDef[];
  /** Per-simulation defaults for the shared Output settings (by key). */
  globalDefaults?: Params;
  create(engine: Engine, text: Readouts): Simulation;
}

export const num = (p: Params, k: string) => Number(p[k]);
export const bool = (p: Params, k: string) => Boolean(p[k]);
export const str = (p: Params, k: string) => String(p[k]);
export const DEG = Math.PI / 180;
