import fs from "fs";
import path from "path";
import { type BirdPose, type FlightPlan, type FlightState, type Sky, birdScale, createFlight, flightPoses, stepFlight } from "../src/v2/components/Hero/SeasonScene/SeasonLife/Birds/flight";
import { FLOCKS } from "../src/v2/components/Hero/SeasonScene/SeasonLife/Birds/flocks";

// A repeatable random, so a phone and a desktop see the same flights
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const TOP = 80;
const BOTTOM = 380;
const sky = (width: number): Sky => ({ width, top: TOP, bottom: BOTTOM, scale: birdScale(width) });
const DT = 1 / 60;

// Flies a plan at 60 frames a second, calling back every frame
const fly = (plan: FlightPlan, width: number, seconds: number, seed: number, onFrame: (t: number, poses: BirdPose[], state: FlightState) => void) => {
  const random = seeded(seed);
  const area = sky(width);
  const state = createFlight(plan, random);
  for (let t = 0; t < seconds; t += DT) {
    stepFlight(state, plan, area, DT, random);
    onFrame(t, flightPoses(state, plan, area), state);
  }
};

// Seconds the leader takes from entering the screen to leaving it, on its
// first crossing
const crossingTime = (plan: FlightPlan, width: number, seed: number): number => {
  let entered: number | null = null;
  let left: number | null = null;
  fly(plan, width, 60, seed, (t, [lead]) => {
    if (left !== null || !lead.visible) return;
    const inside = lead.x >= 0 && lead.x <= width;
    if (inside && entered === null) entered = t;
    if (!inside && entered !== null) left = t;
  });
  if (entered === null || left === null) throw new Error("the bird never crossed");
  return left - entered;
};

const PLANS = Object.values(FLOCKS).flat();
const everywhere = (plan: FlightPlan): FlightPlan => ({ ...plan, phones: true });

describe("Birds", () => {
  it("take as long to cross a phone as a desktop", () => {
    for (const [i, plan] of PLANS.entries()) {
      const phone = crossingTime(everywhere(plan), 390, i + 1);
      const desktop = crossingTime(plan, 1440, i + 1);
      expect(Math.abs(phone - desktop)).toBeLessThan(0.05);
      // About the species' crossing, a little slower when further away
      expect(desktop).toBeGreaterThan(plan.species.crossing * 0.85);
      expect(desktop).toBeLessThan(plan.species.crossing * 1.4);
    }
  });

  it("are fewer on phones", () => {
    for (const plan of PLANS.filter((p) => !p.phones)) {
      let seen = false;
      fly(plan, 390, 60, 1, (_, poses) => { seen ||= poses.some((pose) => pose.visible); });
      expect(seen).toBe(false);
    }
    expect(FLOCKS.spring.filter((p) => p.phones).length).toBeLessThan(FLOCKS.spring.length);
    expect(FLOCKS.autumn.filter((p) => p.phones).length).toBeLessThan(FLOCKS.autumn.length);
  });

  it("stay in the sky, tilt gently, face the way they fly and show real frames", () => {
    for (const plan of PLANS) {
      for (const width of [390, 1440]) {
        let [low, high, tilt, frameLow, frameHigh, wrongWay] = [Infinity, -Infinity, 0, Infinity, -Infinity, 0];
        let lastX: number | null = null;
        fly(everywhere(plan), width, 90, 3, (_, poses) => {
          const [lead] = poses;
          if (!lead.visible) {
            lastX = null;
            return;
          }
          for (const pose of poses) {
            low = Math.min(low, pose.y);
            high = Math.max(high, pose.y);
            tilt = Math.max(tilt, Math.abs(pose.rotate));
            frameLow = Math.min(frameLow, pose.frame);
            frameHigh = Math.max(frameHigh, pose.frame);
          }
          // The drawing faces the way the leader moves
          if (lastX !== null && Math.sign(lead.x - lastX) !== plan.species.faces * lead.flip) wrongWay++;
          lastX = lead.x;
        });
        expect(low).toBeGreaterThan(TOP - 30);
        expect(high).toBeLessThan(BOTTOM + 40);
        expect(tilt).toBeLessThanOrEqual(12);
        expect(tilt).toBeGreaterThan(1);
        expect(frameLow).toBe(0);
        expect(frameHigh).toBe(plan.species.frames - 1);
        expect(wrongWay).toBe(0);
      }
    }
  });

  it("glide or fold their wings between beats, except mallards", () => {
    for (const plan of PLANS) {
      let glided = false;
      let heldGlideFrame = false;
      fly(plan, 1440, 120, 5, (_, poses, state) => {
        glided ||= state.flying && state.gliding;
        heldGlideFrame ||= state.flying && state.gliding && poses[0].frame === plan.species.glide;
      });
      const mallard = plan.species.sprite.includes("mallard");
      expect(glided).toBe(!mallard);
      expect(heldGlideFrame).toBe(!mallard);
    }
  });

  it("use sprites that exist", () => {
    for (const plan of PLANS) expect(fs.existsSync(path.join(__dirname, "../public", plan.species.sprite))).toBe(true);
  });
});
