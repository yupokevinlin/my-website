import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const Wormhole: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Wormhole - Kevin Lin"
        description="Fly through the Interstellar wormhole into another galaxy, with every light ray pre-integrated through the curved geometry."
        path="/ray-tracing/wormhole"
        image="/ray-tracing/thumbs/wormhole.jpg"
      />
      <SimulationPage id="wormhole"/>
    </div>
  );
};

export default Wormhole;
