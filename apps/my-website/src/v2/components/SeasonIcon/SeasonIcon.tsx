import type { ReactNode } from "react";
import clsx from "clsx";
import { SEASONS, seasonIcon } from "../../season";

export interface SeasonIconProps {
  size?: number;
  className?: string;
}

// The current season's round icon. All four are in the page and CSS shows
// the right one (html[data-season]), so it is right before React runs.
export const SeasonIcon = ({ size = 18, className }: SeasonIconProps): ReactNode => (
  <>
    {SEASONS.map((season) => (
      <img
        key={season}
        data-season={season}
        src={seasonIcon(season)}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={clsx("v2-season-only shrink-0", className)}
      />
    ))}
  </>
);
