import type { NextPage } from "next";
import SimulationsHead from "../../src/display/components/Simulations/SimulationsHead/SimulationsHead";
import SimulationPage from "../../src/display/pages/SimulationPage/SimulationPage";

const Neutron: NextPage = () => {
  return (
    <div className={"root"}>
      <SimulationsHead
        title="Neutron Star - Kevin Lin"
        description="A spinning neutron star whose gravity bends light so much that you can see part of its far side, with every light ray traced through its curved spacetime."
        path="/ray-tracing/neutron"
        image="/ray-tracing/thumbs/neutron.jpg"
      />
      <SimulationPage id="neutron"/>
    </div>
  );
};

export default Neutron;
