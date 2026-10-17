import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const Infall: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Falling Into a Black Hole - Kevin Lin"
        description="Fall through the event horizon of a black hole and see what you would really see, with every light ray traced through curved spacetime."
        path="/ray-tracing/infall"
        image="/ray-tracing/thumbs/infall.jpg"
      />
      <SimulationPage id="infall"/>
    </div>
  );
};

export default Infall;
