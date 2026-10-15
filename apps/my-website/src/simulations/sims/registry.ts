import { blackholeSim } from "./blackhole";
import { infallSim } from "./infall";
import { lightspeedSim } from "./lightspeed";
import type { SimulationDescriptor } from "./types";
import { wormholeSim } from "./wormhole";

export const SIMULATIONS: SimulationDescriptor[] = [blackholeSim, infallSim, wormholeSim, lightspeedSim];

export function getSimulation(id: string): SimulationDescriptor {
  const s = SIMULATIONS.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown simulation ${id}`);
  return s;
}
