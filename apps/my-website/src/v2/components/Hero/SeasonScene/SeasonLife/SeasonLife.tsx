import type { ReactNode, RefObject } from "react";
import dynamic from "next/dynamic";
import type { Season } from "../../../../season";
import useWidth from "../../../../../hooks/useWidth";
import Fireflies from "../../../../../display/components/AnimatedImages/Fireflies/Fireflies";
import { Birds } from "./Birds/Birds";
import { FLOCKS } from "./Birds/flocks";

const ReactSnowfall = dynamic(() => import("react-snowfall"), { ssr: false });

export interface SeasonLifeProps {
  season: Season;
  card?: RefObject<HTMLElement | null>; // the hero card, which phones' birds fly below
}

// The season's animation, as on the original site: snow, birds, fireflies
export const SeasonLife = ({ season, card }: SeasonLifeProps): ReactNode => {
  const width = useWidth();
  const small = /xs|sm/.test(width);
  switch (season) {
    case "winter":
      return <ReactSnowfall color="#fff" snowflakeCount={small ? 80 : 160} radius={[0.5, small ? 2.4 : 3.2]} speed={[0.5, 1.8]} wind={[-0.4, 1.2]}/>;
    case "spring":
      return <Birds flock={FLOCKS.spring} card={card}/>;
    case "summer":
      return <Fireflies><div className="h-full w-full"/></Fireflies>;
    case "autumn":
      return <Birds flock={FLOCKS.autumn} card={card}/>;
  }
};
