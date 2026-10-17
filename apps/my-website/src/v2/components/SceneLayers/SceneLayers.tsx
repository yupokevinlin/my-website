import type { CSSProperties, ReactNode } from "react";
import { SEASONS, SEASON_SCENE } from "../../season";

export interface SceneLayersProps {
  // background-position of the illustration
  position?: string;
}

// The four original illustrations, stacked inside a positioned parent. CSS
// shows the current season's (html[data-season]) and crossfades on a switch,
// so the first paint is right before React runs. Only the current picture
// loads at first; the others wait for html.v2-scenes-ready (see SeasonScene).
export const SceneLayers = ({ position = "70% 70%" }: SceneLayersProps): ReactNode => (
  <>
    {SEASONS.map((season) => (
      <div
        key={season}
        data-season={season}
        className="v2-scene-layer absolute inset-0 bg-cover bg-no-repeat"
        style={{
          "--v2-sky": SEASON_SCENE[season].sky,
          "--v2-scene": `url(${SEASON_SCENE[season].image}), ${SEASON_SCENE[season].sky}`,
          backgroundPosition: position,
        } as CSSProperties}
      />
    ))}
  </>
);
