import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

// In English; pages/[locale]/ray-tracing/infall.tsx is the same page in the
// other languages
const Infall: NextPage = () => (
  <div className={"root"}>
    <SimulationsHead page="infall" path="/ray-tracing/infall" image="/ray-tracing/thumbs/infall.jpg"/>
    <SimulationPage id="infall"/>
  </div>
);

export default Infall;
