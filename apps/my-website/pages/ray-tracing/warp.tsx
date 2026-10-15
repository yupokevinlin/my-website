import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const Warp: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Warp Drive - Kevin Lin"
        description="Ride an Alcubierre warp bubble faster than light, with light traced through the warped spacetime of the bubble wall."
        path="/ray-tracing/warp"
        image="/ray-tracing/thumbs/warp.jpg"
      />
      <SimulationPage id="warp"/>
    </div>
  );
};

export default Warp;
