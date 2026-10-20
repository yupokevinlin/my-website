import { type RefObject, useEffect } from "react";
import { type FlightPlan, NARROW, type Sky, birdScale, createFlight, flightPoses, stepFlight } from "../components/Hero/SeasonScene/SeasonLife/Birds/flight";

// The top bar covers the top of the hero's scene
const TOP_BAR = 64;

// The band the birds fly in, inside the scene: below the top bar and above
// the hills. Narrower than Tailwind's sm breakpoint, the hero card moves to
// the top and spans the screen (Hero.tsx), so they fly below it, where the
// picture shows.
const measureSky = (scene: HTMLElement, card: HTMLElement | null): Sky => {
  const box = scene.getBoundingClientRect();
  let top = TOP_BAR + 16;
  if (card && box.width < NARROW) top = Math.max(top, card.getBoundingClientRect().bottom - box.top + 14);
  return { width: box.width, top, bottom: Math.max(top + 120, box.height * 0.42), scale: birdScale(box.width) };
};

// Flies the plans' birds (birds[i] is each plan's members in turn) across
// the scene, one frame at a time, while the scene is on screen
export const useFlight = (
  plans: FlightPlan[],
  scene: RefObject<HTMLElement | null>,
  birds: RefObject<Array<HTMLElement | null>>,
  card?: RefObject<HTMLElement | null>,
): void => {
  useEffect(() => {
    const box = scene.current;
    if (!box) return;
    const random = Math.random;
    const flights = plans.map((plan) => createFlight(plan, random));
    const shown: boolean[] = [];
    const frames: number[] = [];
    let sky = measureSky(box, card?.current ?? null);
    let request = 0;
    let last = 0;

    const draw = () => {
      let index = 0;
      flights.forEach((flight, i) => {
        const plan = plans[i];
        for (const pose of flightPoses(flight, plan, sky)) {
          const bird = birds.current[index];
          if (bird) {
            if (shown[index] !== pose.visible) {
              bird.style.visibility = pose.visible ? "visible" : "hidden";
              shown[index] = pose.visible;
            }
            if (pose.visible) {
              const { width } = plan.species;
              bird.style.transform = `translate3d(${pose.x - width / 2}px, ${pose.y - (width * 55) / 160}px, 0) rotate(${pose.rotate.toFixed(2)}deg) scale(${pose.flip * pose.scale}, ${pose.scale})`;
              if (frames[index] !== pose.frame) {
                bird.style.backgroundPosition = `${-pose.frame * width}px 0`;
                frames[index] = pose.frame;
              }
            }
          }
          index++;
        }
      });
    };

    const tick = (now: number) => {
      // A long gap (a background tab) moves the birds on by a tenth of a second
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      flights.forEach((flight, i) => stepFlight(flight, plans[i], sky, dt, random));
      draw();
      request = requestAnimationFrame(tick);
    };
    const start = () => {
      if (request) return;
      last = 0;
      request = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(request);
      request = 0;
    };

    const resize = new ResizeObserver(() => { sky = measureSky(box, card?.current ?? null); });
    resize.observe(box);
    if (card?.current) resize.observe(card.current);
    // Only while the hero is on screen
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(box);

    return () => {
      stop();
      resize.disconnect();
      visibility.disconnect();
    };
  }, [plans, scene, birds, card]);
};
