import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

// In English; pages/[locale]/ray-tracing/blackhole.tsx is the same page in the
// other languages
const BlackHole: NextPage = () => (
  <div className={"root"}>
    <SimulationsHead page="blackhole" path="/ray-tracing/blackhole" image="/ray-tracing/thumbs/blackhole.jpg"/>
    <SimulationPage id="blackhole"/>
  </div>
);

export default BlackHole;
