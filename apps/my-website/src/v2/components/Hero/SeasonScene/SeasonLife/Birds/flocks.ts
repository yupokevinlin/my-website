import type { FlightPlan, Species } from "./flight";

// The original site's drawings: each sprite is a strip of frames through one
// wing beat (the frame numbers below are counted from 0). The blue jay and
// pigeon are drawn facing left and are mirrored to fly right, so only one
// strip of each loads.

const BLUE_JAY: Species = {
  sprite: "/resources/animations/bluejayLeft.svg",
  frames: 8,
  faces: -1,
  width: 72,
  wingbeat: 0.34,
  wingsUp: 4,
  glide: 2, // wings folded against the body
  crossing: 10,
  style: "bounding",
  bob: 1.5,
};

const PIGEON: Species = {
  sprite: "/resources/animations/pigeonLeft.svg",
  frames: 10,
  faces: -1,
  width: 78,
  wingbeat: 0.3,
  wingsUp: 0,
  glide: 3, // wings held out
  crossing: 9,
  style: "flapGlide",
  bob: 1.5,
};

const CROW: Species = {
  sprite: "/resources/animations/crow.svg",
  frames: 11,
  faces: 1,
  width: 84,
  wingbeat: 0.5, // slow, rowing beats
  wingsUp: 10,
  glide: 7, // wings flat
  crossing: 11.5,
  style: "flapGlide",
  bob: 1.2,
};

const MALLARD: Species = {
  sprite: "/resources/animations/mallard.svg",
  frames: 8,
  faces: 1,
  width: 84,
  wingbeat: 0.26, // ducks beat fast and fly straight
  wingsUp: 3,
  glide: 1,
  crossing: 8.5,
  style: "steady",
  bob: 1,
};

const GOOSE: Species = {
  sprite: "/resources/animations/goose.svg",
  frames: 7,
  faces: -1,
  width: 84,
  wingbeat: 0.5,
  wingsUp: 4,
  glide: 2, // wings level
  crossing: 12.5,
  style: "steady",
  glides: true,
  bob: 1.2,
};

const ALONE: Array<[number, number]> = [[0, 0]];

// A small V: the leader in front, one goose behind on each side
const V: Array<[number, number]> = [[0, 0], [0.75, -0.73], [0.75, 0.73]];

// Mallards often fly in pairs, one a little behind and above the other
const PAIR: Array<[number, number]> = [[0, 0], [1.1, -0.45]];

// Each season's flights. Phones fly the ones marked `phones`.
export const FLOCKS: Record<"spring" | "autumn", FlightPlan[]> = {
  spring: [
    { species: BLUE_JAY, members: ALONE, altitude: [0.3, 1], delay: 0.5, rest: [3, 9], phones: true },
    { species: PIGEON, members: ALONE, altitude: [0, 0.6], delay: 3, rest: [5, 12], phones: true },
    { species: BLUE_JAY, members: ALONE, altitude: [0.2, 0.9], delay: 6, rest: [4, 11], phones: true },
    { species: BLUE_JAY, members: ALONE, altitude: [0.1, 0.8], delay: 9, rest: [5, 12] },
    { species: PIGEON, members: ALONE, altitude: [0, 0.7], delay: 12, rest: [6, 14] },
  ],
  autumn: [
    // Heading south: left, as on the original site
    { species: GOOSE, members: V, heading: -1, altitude: [0, 0.4], delay: 1, rest: [6, 14], phones: true },
    { species: CROW, members: ALONE, altitude: [0.2, 0.9], delay: 3.5, rest: [4, 10], phones: true },
    { species: MALLARD, members: PAIR, altitude: [0.3, 1], delay: 7, rest: [6, 14], phones: true },
    { species: CROW, members: ALONE, altitude: [0.1, 0.8], delay: 11, rest: [6, 13] },
  ],
};
