import { blackholeSim } from "./blackhole";
import { infallSim } from "./infall";
import { lightspeedSim } from "./lightspeed";
import { neutronSim } from "./neutron";
import type { SimulationDescriptor } from "./types";
import { wormholeSim } from "./wormhole";

export const SIMULATIONS: SimulationDescriptor[] = [blackholeSim, infallSim, wormholeSim, lightspeedSim, neutronSim];

export function getSimulation(id: string): SimulationDescriptor {
  const s = SIMULATIONS.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown simulation ${id}`);
  return s;
}
