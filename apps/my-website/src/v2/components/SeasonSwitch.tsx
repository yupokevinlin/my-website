import React from "react";
import clsx from "clsx";
import { SEASONS, SEASON_LABEL, seasonIcon } from "../season";
import { useSeason } from "../SeasonContext";

export interface SeasonSwitchProps {
  className?: string;
}

// Four round season badges, spring to winter. One ring slides to the current
// season; its position comes from CSS (html[data-season], see globals.css),
// so it is right on the first paint.
const SeasonSwitch: React.FC<SeasonSwitchProps> = ({ className }) => {
  const { season, setSeason } = useSeason();

  return (
    <div role="group" aria-label="Season" className={clsx("relative flex items-center gap-1 rounded-full border border-[var(--v2-line)] bg-white/70 p-1", className)}>
      <span aria-hidden="true" className="v2-season-ring pointer-events-none absolute left-1 top-1 h-8 w-8 rounded-full bg-[var(--v2-tint)] shadow-[0_0_0_2px_var(--v2-accent)]"/>
      {SEASONS.map((s) => (
        <button
          key={s}
          type="button"
          data-season={s}
          aria-label={`${SEASON_LABEL[s]} theme`}
          aria-pressed={season === s}
          title={SEASON_LABEL[s]}
          onClick={() => setSeason(s)}
          className="v2-season-btn relative grid h-8 w-8 cursor-pointer place-items-center rounded-full transition-[opacity,scale] duration-300 hover:scale-110 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]"
        >
          <img src={seasonIcon(s)} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6"/>
        </button>
      ))}
    </div>
  );
};

export default SeasonSwitch;
