import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationsPage from "../../src/display/pages/SimulationsPage/SimulationsPage";

// The guide's overview in English; pages/[locale]/ray-tracing/index.tsx is the
// same page in the other languages
const RayTracing: NextPage = () => (
  <div className={"root"}>
    <SimulationsHead page="overview" path="/ray-tracing" image="/ray-tracing/thumbs/blackhole.jpg"/>
    <SimulationsPage/>
  </div>
);

export default RayTracing;
