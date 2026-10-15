import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationsPage from "../../src/display/pages/SimulationsPage/SimulationsPage";

const RayTracing: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Relativistic Ray Tracing - Kevin Lin"
        description="How black holes work, and why light bends: an illustrated guide with real-time 4K ray-traced simulations of a spinning black hole, a fall through its event horizon, the Interstellar wormhole, near-light-speed travel and a flight past Earth."
        path="/ray-tracing"
        image="/ray-tracing/thumbs/blackhole.jpg"
      />
      <SimulationsPage/>
    </div>
  );
};

export default RayTracing;
