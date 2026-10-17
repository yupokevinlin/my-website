import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Season, isSeason, seasonForMonth, seasonIcon } from "./season";

interface SeasonState {
  // null until the page has mounted; CSS already shows the right season by then
  season: Season | null;
  setSeason(season: Season): void;
}

const SeasonContext = createContext<SeasonState>({ season: null, setSeason: () => undefined });

export const useSeason = (): SeasonState => useContext(SeasonContext);

export interface SeasonProviderProps {
  children: ReactNode;
}

// Holds the season the head script picked, and switches it for the visit
export const SeasonProvider = ({ children }: SeasonProviderProps): ReactNode => {
  const [season, setSeasonState] = useState<Season | null>(null);

  useEffect(() => {
    const fromScript = document.documentElement.dataset.season;
    setSeasonState(isSeason(fromScript) ? fromScript : seasonForMonth(new Date().getMonth()));
  }, []);

  // A switch lasts for the visit; the next visit follows the calendar again
  const setSeason = useCallback((next: Season) => {
    document.documentElement.dataset.season = next;
    for (const id of ["main-icon", "shortcut-icon"]) {
      const link = document.getElementById(id) as HTMLLinkElement | null;
      if (link) link.href = seasonIcon(next);
    }
    setSeasonState(next);
  }, []);

  return <SeasonContext.Provider value={{ season, setSeason }}>{children}</SeasonContext.Provider>;
};
