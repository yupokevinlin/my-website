import { type ReactNode, type RefObject, useEffect, useState } from "react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { useSeason } from "../../../SeasonContext";
import { SceneLayers } from "../../SceneLayers/SceneLayers";
import { SeasonLife } from "./SeasonLife/SeasonLife";

export interface SeasonSceneProps {
  className?: string;
  card?: RefObject<HTMLElement | null>; // the hero card, which phones' birds fly below
}

// The hero's full-screen illustration. Once the page has loaded, it lets the
// other seasons' pictures load (html.v2-scenes-ready) and then starts the
// snow, birds or fireflies, so they never slow the first paint.
export const SeasonScene = ({ className, card }: SeasonSceneProps): ReactNode => {
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
      <SceneLayers/>
      {season && settled && !reduceMotion ? (
        <div key={season} className="pointer-events-none absolute inset-0 overflow-hidden">
          <SeasonLife season={season} card={card}/>
        </div>
      ) : null}
    </div>
  );
};
