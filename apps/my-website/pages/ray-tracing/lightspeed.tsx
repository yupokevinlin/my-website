import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

// In English; pages/[locale]/ray-tracing/lightspeed.tsx is the same page in the
// other languages
const LightSpeed: NextPage = () => (
  <div className={"root"}>
    <SimulationsHead page="lightspeed" path="/ray-tracing/lightspeed" image="/ray-tracing/thumbs/lightspeed.jpg"/>
    <SimulationPage id="lightspeed"/>
  </div>
);

export default LightSpeed;
