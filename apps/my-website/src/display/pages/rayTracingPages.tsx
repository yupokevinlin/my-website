import type { ReactNode } from "react";
import SimulationsHead from "../components/Simulations/SimulationsHead/SimulationsHead";
import SimulationsPage from "./SimulationsPage/SimulationsPage";
import SimulationPage from "./SimulationPage/SimulationPage";

// The ray-tracing guide's pages, each with its head. The files under
// pages/ray-tracing/ (English) and pages/[locale]/ray-tracing/ (the other
// languages) wrap them in their text (see src/i18n/packs/withText.tsx).

export const RayTracingOverview = (): ReactNode => (
  <div className="root">
    <SimulationsHead page="overview" path="/ray-tracing" image="/ray-tracing/thumbs/blackhole.jpg"/>
    <SimulationsPage/>
  </div>
);

export const BlackHolePage = (): ReactNode => (
  <div className="root">
    <SimulationsHead page="blackhole" path="/ray-tracing/blackhole" image="/ray-tracing/thumbs/blackhole.jpg"/>
    <SimulationPage id="blackhole"/>
  </div>
);

export const InfallPage = (): ReactNode => (
  <div className="root">
    <SimulationsHead page="infall" path="/ray-tracing/infall" image="/ray-tracing/thumbs/infall.jpg"/>
    <SimulationPage id="infall"/>
  </div>
);

export const WormholePage = (): ReactNode => (
  <div className="root">
    <SimulationsHead page="wormhole" path="/ray-tracing/wormhole" image="/ray-tracing/thumbs/wormhole.jpg"/>
    <SimulationPage id="wormhole"/>
  </div>
);

export const LightspeedPage = (): ReactNode => (
  <div className="root">
    <SimulationsHead page="lightspeed" path="/ray-tracing/lightspeed" image="/ray-tracing/thumbs/lightspeed.jpg"/>
    <SimulationPage id="lightspeed"/>
  </div>
);
