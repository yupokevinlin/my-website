import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const LightSpeed: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Near Light Speed - Kevin Lin"
        description="Travel towards the galactic centre near the speed of light: relativistic aberration, Doppler colour shift and beaming."
        path="/ray-tracing/lightspeed"
        image="/ray-tracing/thumbs/lightspeed.jpg"
      />
      <SimulationPage id="lightspeed"/>
    </div>
  );
};

export default LightSpeed;
