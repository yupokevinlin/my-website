import { type ReactNode, type RefObject, useRef } from "react";
import { useFlight } from "../../../../../hooks/useFlight";
import type { FlightPlan } from "./flight";

export interface BirdsProps {
  flock: FlightPlan[];
  card?: RefObject<HTMLElement | null>; // the hero card, which phones' birds fly below
}

// A season's birds over the hero's scene. Each is a box showing one frame of
// its sprite; useFlight moves them and picks the frames.
export const Birds = ({ flock, card }: BirdsProps): ReactNode => {
  const scene = useRef<HTMLDivElement>(null);
  const birds = useRef<Array<HTMLElement | null>>([]);
  useFlight(flock, scene, birds, card);

  const boxes = flock.flatMap((plan, i) => plan.members.map((_, j) => ({ key: `${i}-${j}`, species: plan.species })));
  return (
    <div ref={scene} className="absolute inset-0">
      {boxes.map(({ key, species }, index) => (
        <div
          key={key}
          ref={(bird) => { birds.current[index] = bird; }}
          className="invisible absolute left-0 top-0 bg-no-repeat will-change-transform"
          style={{
            width: species.width,
            height: (species.width * 55) / 80,
            backgroundImage: `url(${species.sprite})`,
            backgroundSize: `${species.frames * species.width}px 100%`,
          }}
        />
      ))}
    </div>
  );
};
