import { GLOBAL_PARAMS } from "../../../simulations/gl/engine";
import { getSimulation } from "../../../simulations/sims/registry";
import type { ParamDef } from "../../../simulations/sims/types";
import type { Translation } from "../../translation";

// The text of the four simulations' settings in English, from their
// definitions in src/simulations: each setting's label, tooltip, unit and
// choices, by the setting's key (so the order of the settings can change
// freely), and each simulation's line of mouse and touch controls. "output" is
// the Output settings every simulation shares.

export interface ParamText {
  label: string;
  hint?: string;
  unit?: string;
  // Each choice's label, by its value
  options?: Record<string, string>;
}

const paramsText = (defs: Array<ParamDef>): Record<string, ParamText> =>
  Object.fromEntries(defs.map((d) => [d.key, {
    label: d.label,
    ...(d.hint ? { hint: d.hint } : {}),
    ...(d.unit ? { unit: d.unit } : {}),
    ...(d.options ? { options: Object.fromEntries(d.options.map((o) => [o.value, o.label])) } : {}),
  }]));

const simText = (id: string) => {
  const desc = getSimulation(id);
  return { controlsHelp: desc.controlsHelp, params: paramsText(desc.params) };
};

export const EN_SIMULATIONS = {
  blackhole: simText("blackhole"),
  infall: simText("infall"),
  wormhole: simText("wormhole"),
  lightspeed: simText("lightspeed"),
  output: { params: paramsText(GLOBAL_PARAMS) },
};

export type SimulationsText = typeof EN_SIMULATIONS;
export type SimulationsTranslation = Translation<SimulationsText>;

// Nothing in it is skipped: it holds only text
export const SIMULATIONS_SKIP: readonly string[] = [];
