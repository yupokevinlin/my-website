import { blackholeSim } from "./blackhole";
import { flybySim } from "./flyby";
import { infallSim } from "./infall";
import { lightspeedSim } from "./lightspeed";
import type { SimulationDescriptor } from "./types";
import { wormholeSim } from "./wormhole";

export const SIMULATIONS: SimulationDescriptor[] = [blackholeSim, infallSim, wormholeSim, lightspeedSim, flybySim];

export function getSimulation(id: string): SimulationDescriptor {
  const s = SIMULATIONS.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown simulation ${id}`);
  return s;
}
