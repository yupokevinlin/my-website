import { blackholeSim } from "./blackhole";
import { infallSim } from "./infall";
import { lightspeedSim } from "./lightspeed";
import type { SimulationDescriptor } from "./types";
import { warpSim } from "./warp";
import { wormholeSim } from "./wormhole";

export const SIMULATIONS: SimulationDescriptor[] = [blackholeSim, wormholeSim, lightspeedSim, infallSim, warpSim];

export function getSimulation(id: string): SimulationDescriptor {
  const s = SIMULATIONS.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown simulation ${id}`);
  return s;
}
