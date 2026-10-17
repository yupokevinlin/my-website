import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { SEASONS, SEASON_SCENE, Season } from "../season";
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
      return <ReactSnowfall color="#fff" snowflakeCount={small ? 80 : 160} radius={[0.5, small ? 2.4 : 3.2]} speed={[0.5, 1.8]} wind={[-0.4, 1.2]}/>;
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

// The original full-screen illustrations. All four are stacked and CSS shows
// the current one (html[data-season]), crossfading on a switch, so the first
// paint is right before React runs. Only the current picture loads at first;
// the others follow once the page has loaded (html.v2-scenes-ready), and the
// snow, birds and fireflies start after that, so they never slow the first
// paint.
const SeasonScene: React.FC<SeasonSceneProps> = ({ className }) => {
  const { season } = useSeason();
  const reduceMotion = useReducedMotion();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ready = () => {
      document.documentElement.classList.add("v2-scenes-ready");
      timer = setTimeout(() => setSettled(true), 400);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      window.removeEventListener("load", ready);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden="true" className={clsx("overflow-hidden", className)}>
      {SEASONS.map((s) => (
        <div
          key={s}
          data-season={s}
          className="v2-scene-layer absolute inset-0 bg-cover bg-no-repeat"
          style={{ "--v2-sky": SEASON_SCENE[s].sky, "--v2-scene": `url(${SEASON_SCENE[s].image}), ${SEASON_SCENE[s].sky}`, backgroundPosition: "70% 70%" } as React.CSSProperties}
        />
      ))}
      {season && settled && !reduceMotion ? (
        <div key={season} className="pointer-events-none absolute inset-0 overflow-hidden">
          <SeasonLife season={season}/>
        </div>
      ) : null}
    </div>
  );
};

export default SeasonScene;
