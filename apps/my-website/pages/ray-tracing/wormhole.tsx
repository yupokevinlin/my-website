import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

// In English; pages/[locale]/ray-tracing/wormhole.tsx is the same page in the
// other languages
const Wormhole: NextPage = () => (
  <div className={"root"}>
    <SimulationsHead page="wormhole" path="/ray-tracing/wormhole" image="/ray-tracing/thumbs/wormhole.jpg"/>
    <SimulationPage id="wormhole"/>
  </div>
);

export default Wormhole;
