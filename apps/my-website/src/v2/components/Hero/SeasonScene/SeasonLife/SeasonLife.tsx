import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { Season } from "../../../../season";
import useWidth from "../../../../../hooks/useWidth";
import Fireflies from "../../../../../display/components/AnimatedImages/Fireflies/Fireflies";
import BlueJayPigeon from "../../../../../display/components/AnimatedImages/BlueJayPigeon/BlueJayPigeon";
import Goose from "../../../../../display/components/AnimatedImages/Goose/Goose";
import CrowMallard from "../../../../../display/components/AnimatedImages/CrowMallard/CrowMallard";

const ReactSnowfall = dynamic(() => import("react-snowfall"), { ssr: false });

export interface SeasonLifeProps {
  season: Season;
}

// The season's own animation, as on the original site: snow, birds, fireflies
export const SeasonLife = ({ season }: SeasonLifeProps): ReactNode => {
  const width = useWidth();
  const small = /xs|sm/.test(width);
  switch (season) {
    case "winter":
      return <ReactSnowfall color="#fff" snowflakeCount={small ? 80 : 160} radius={[0.5, small ? 2.4 : 3.2]} speed={[0.5, 1.8]} wind={[-0.4, 1.2]}/>;
    case "spring":
      return <BlueJayPigeon width={width}/>;
    case "summer":
      return <Fireflies><div className="h-full w-full"/></Fireflies>;
    case "autumn":
      return <><Goose width={width}/><CrowMallard width={width}/></>;
  }
};
