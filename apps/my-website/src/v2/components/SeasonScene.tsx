import React from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { MONO } from "../fonts";
import { SEASONS, SEASON_LABEL, SEASON_SCENE, Season } from "../season";
import { useSeason } from "../SeasonContext";
import useWidth from "../../hooks/useWidth";
import Fireflies from "../../display/components/AnimatedImages/Fireflies/Fireflies";
import BlueJayPigeon from "../../display/components/AnimatedImages/BlueJayPigeon/BlueJayPigeon";
import Goose from "../../display/components/AnimatedImages/Goose/Goose";
import CrowMallard from "../../display/components/AnimatedImages/CrowMallard/CrowMallard";

const ReactSnowfall = dynamic(() => import("react-snowfall"), { ssr: false });

// The season's own animation, as on the original site: snow, birds, fireflies
const SeasonLife: React.FC<{ season: Season }> = ({ season }) => {
  const width = useWidth();
  const small = /xs|sm/.test(width);
  switch (season) {
    case "winter":
      return <ReactSnowfall color="#fff" snowflakeCount={small ? 70 : 120} radius={[0.5, small ? 2.2 : 3]} speed={[0.5, 1.6]} wind={[-0.4, 1]}/>;
    case "spring":
      return <BlueJayPigeon width={width}/>;
    case "summer":
      return <Fireflies><div className="h-full w-full"/></Fireflies>;
    case "autumn":
      return <><Goose width={width}/><CrowMallard width={width}/></>;
  }
};

export interface SeasonSceneProps {
  className?: string;
}

// All four original illustrations are stacked; CSS shows the current one
// (html[data-season]) and crossfades on a switch, so the first paint is right
// before React runs.
const SeasonScene: React.FC<SeasonSceneProps> = ({ className }) => {
  const { season } = useSeason();
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={clsx("relative aspect-[16/11] overflow-hidden rounded-[22px] shadow-[0_24px_50px_-18px_rgba(20,30,45,0.35)]", className)}>
      {SEASONS.map((s) => (
        <div
          key={s}
          data-season={s}
          className="v2-scene-layer absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${SEASON_SCENE[s].image}), ${SEASON_SCENE[s].sky}`, backgroundPosition: "70% 70%" }}
        />
      ))}
      {season && !reduceMotion ? (
        <div key={season} className="pointer-events-none absolute inset-0 overflow-hidden">
          <SeasonLife season={season}/>
        </div>
      ) : null}
      <span className={clsx(MONO, "absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[12px] text-[var(--v2-ink)]")}>
        {SEASONS.map((s) => <span key={s} data-season={s} className="v2-season-label">{SEASON_LABEL[s]} in Vancouver</span>)}
      </span>
    </div>
  );
};

export default SeasonScene;
