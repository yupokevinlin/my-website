import type { CSSProperties, ReactNode } from "react";
import { SEASONS, SEASON_SCENE } from "../../season";

// The four original illustrations, stacked inside a positioned parent. CSS
// shows the current season's (html[data-season]) and crossfades on a switch,
// so the first paint is right before React runs. Only the current picture
// loads at first; the others wait for html.v2-scenes-ready (see SeasonScene).
// The bottom edge stays in view, so wide screens trim the sky, not the river.
// On phones the whole picture, from the sky to the river, takes the bottom
// 70% of the section, below the frosted card, with its sky gradient above;
// it is moved so the house (61% across it) is in the middle.
export const SceneLayers = (): ReactNode => (
  <>
    {SEASONS.map((season) => (
      <div
        key={season}
        data-season={season}
        className="v2-scene-layer absolute inset-0 bg-cover bg-no-repeat bg-[position:70%_100%] max-sm:bg-[position:67%_100%] max-sm:[background-size:auto_70%,cover]"
        style={{
          "--v2-sky": SEASON_SCENE[season].sky,
          "--v2-scene": `url(${SEASON_SCENE[season].image}), ${SEASON_SCENE[season].sky}`,
        } as CSSProperties}
      />
    ))}
  </>
);
