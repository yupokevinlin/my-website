import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const BlackHole: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Black Hole - Kevin Lin"
        description="A spinning black hole with a lensed accretion disc, ray-traced through curved spacetime in real time at 4K."
        path="/ray-tracing/blackhole"
        image="/ray-tracing/thumbs/blackhole.jpg"
      />
      <SimulationPage id="blackhole"/>
    </div>
  );
};

export default BlackHole;
