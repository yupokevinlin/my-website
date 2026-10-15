import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const Flyby: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Flying Past Earth - Kevin Lin"
        description="Race past the Earth at nearly the speed of light: see it turn, shrink, change colour and glow with its own heat, with every ray of light traced exactly."
        path="/ray-tracing/flyby"
        image="/ray-tracing/thumbs/flyby.jpg"
      />
      <SimulationPage id="flyby"/>
    </div>
  );
};

export default Flyby;
