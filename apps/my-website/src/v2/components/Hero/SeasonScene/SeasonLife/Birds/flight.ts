// How the hero's birds fly. A flight is one bird, or a formation of them,
// crossing the sky from one side to the other and then resting off screen
// before the next crossing (flocks.ts lists each season's flights).
//
// It aims for life rather than a loop. Every crossing picks its own height,
// drift, pace and wing rate. The wings beat through the drawing's frames, and
// the body rises a little on each downstroke. Blue jays flap in bursts and
// dip with their wings folded, pigeons and crows glide between runs of beats,
// geese and mallards beat steadily, and every bird tilts with its path.
//
// A crossing takes the same time on every screen: the speed is a share of the
// width, so a bird on a phone moves across the picture as it does on a
// desktop. Birds are a little smaller on small screens, like the picture.

export type Heading = 1 | -1; // 1 flies right, -1 flies left

export type FlightStyle =
  | "bounding" // bursts of beats with the wings folded between them, dipping (blue jay)
  | "flapGlide" // runs of beats with glides between them, sinking gently (pigeon, crow)
  | "steady"; // beats all the way across, now and then a short glide if `glides`

export interface Species {
  sprite: string; // the frames side by side, each 80 × 55
  frames: number;
  faces: Heading; // the way the drawing faces
  width: number; // px on a wide screen
  wingbeat: number; // seconds for one beat
  wingsUp: number; // the frame with the wings highest, where the body is lowest
  glide: number; // the frame held while gliding (wings folded, when bounding)
  crossing: number; // seconds to cross the screen, on any screen
  style: FlightStyle;
  glides?: boolean; // a steady flier that glides now and then
  bob: number; // px the body rises and falls with each beat
}

export interface FlightPlan {
  species: Species;
  // Where each bird flies, from the leader: [behind, below], in body lengths
  // and heights. [[0, 0]] is a bird on its own.
  members: Array<[number, number]>;
  heading?: Heading; // always this way, or either way, picked each crossing
  altitude: [number, number]; // where in the sky band it flies: 0 top, 1 bottom
  delay: number; // seconds before the first crossing
  rest: [number, number]; // seconds off screen between crossings
  phones?: boolean; // also flies on narrow screens, which have fewer birds
}

// The part of the scene the birds fly in, in px
export interface Sky {
  width: number;
  top: number;
  bottom: number;
  scale: number; // the birds' size, 1 on a wide screen
}

// Where one bird is drawn: its centre, tilt (degrees), size and frame
export interface BirdPose {
  visible: boolean;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flip: Heading;
  frame: number;
}

interface Member {
  phase: number; // through the wing beat, 0 to 1
  pace: number; // this bird's beat, as a share of the species' (about 1)
  folded: boolean; // holding the glide frame
  drift: number; // seed for its small wander inside a formation
}

export interface FlightState {
  flying: boolean;
  wait: number; // seconds until the next crossing, while resting
  time: number; // seconds into this crossing
  heading: Heading;
  progress: number; // 0 just off one side, 1 just off the other
  crossing: number; // seconds to cross the screen, this time
  depth: number; // further birds are smaller and slower
  from: number; // altitude, 0 to 1 in the band, at the start and the end
  to: number;
  wander: Array<[number, number, number]>; // slow swaying: px, period, phase
  gliding: boolean;
  modeLeft: number; // seconds until it starts or stops gliding
  dip: number; // px below its path, from gliding or folding
  dipSpeed: number;
  pitch: number; // degrees, nose down positive
  lastY: number | null;
  members: Member[];
}

export type Random = () => number;

// Narrower screens than this fly only the plans marked `phones`
export const NARROW = 640;

const MAX_TILT = 12; // degrees
const HEIGHT = 55 / 80; // the frames' height, as a share of their width

// How far a bird drops below its path while not beating, in px, and how
// quickly it gets there: a blue jay's quick dip, a glider's slow sink
const DIP = { bounding: 10, flapGlide: 12, steady: 4 };
const DIP_STIFFNESS = { bounding: 40, flapGlide: 6, steady: 4 };

const between = (random: Random, [low, high]: [number, number]): number => low + (high - low) * random();
const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));
const smoothstep = (t: number): number => t * t * (3 - 2 * t);

// The birds' size for a screen: full size from about 1440 px wide, 70% on
// phones, like the picture behind them
export const birdScale = (width: number): number => clamp(0.6 + width / 3600, 0.7, 1);

// Seconds of beating before the next glide (or fold)
const flapRun = (species: Species, random: Random): number => {
  if (species.style === "bounding") return Math.round(between(random, [3, 5])) * species.wingbeat;
  if (species.style === "flapGlide") return between(random, [2.2, 4.5]);
  return between(random, [7, 14]);
};

// Seconds of gliding (or folded wings) before beating again
const glideTime = (species: Species, random: Random): number => {
  if (species.style === "bounding") return between(random, [0.28, 0.45]);
  if (species.style === "flapGlide") return between(random, [0.9, 1.8]);
  return between(random, [0.7, 1.2]);
};

const glides = (species: Species): boolean => species.style !== "steady" || species.glides === true;

// A flight resting before its first crossing
export const createFlight = (plan: FlightPlan, random: Random): FlightState => ({
  flying: false,
  wait: plan.delay * between(random, [0.8, 1.2]),
  time: 0,
  heading: plan.heading ?? 1,
  progress: 0,
  crossing: plan.species.crossing,
  depth: 1,
  from: 0,
  to: 0,
  wander: [],
  gliding: false,
  modeLeft: 0,
  dip: 0,
  dipSpeed: 0,
  pitch: 0,
  lastY: null,
  members: plan.members.map(() => ({ phase: 0, pace: 1, folded: false, drift: 0 })),
});

const launch = (state: FlightState, plan: FlightPlan, random: Random): void => {
  const { species, altitude } = plan;
  state.flying = true;
  state.time = 0;
  state.progress = 0;
  state.heading = plan.heading ?? (random() < 0.5 ? 1 : -1);
  state.depth = between(random, [0.82, 1]);
  state.crossing = species.crossing * between(random, [0.9, 1.12]) / state.depth ** 0.6;
  state.from = between(random, altitude);
  state.to = clamp(state.from + between(random, [-0.3, 0.3]), altitude[0], altitude[1]);
  state.wander = [0, 1].map((): [number, number, number] => [between(random, [3, 8]), between(random, [4, 9]), random() * Math.PI * 2]);
  state.gliding = false;
  state.modeLeft = flapRun(species, random);
  state.dip = 0;
  state.dipSpeed = 0;
  state.pitch = 0;
  state.lastY = null;
  const lead = random();
  state.members.forEach((member, i) => {
    // Each bird a little behind the one ahead in the beat, at its own pace,
    // so a formation drifts in and out of step as real ones do
    member.phase = (lead + 1 - i * 0.12) % 1;
    member.pace = between(random, [0.95, 1.05]);
    member.folded = false;
    member.drift = random() * Math.PI * 2;
  });
};

const size = (plan: FlightPlan, sky: Sky, state: FlightState) => {
  const width = plan.species.width * sky.scale * state.depth;
  return { width, height: width * HEIGHT };
};

// How far the formation reaches behind, above and below its leader, in px
const reach = (plan: FlightPlan, sky: Sky, state: FlightState) => {
  const { width, height } = size(plan, sky, state);
  return {
    behind: Math.max(...plan.members.map(([behind]) => behind)) * width,
    above: Math.max(0, ...plan.members.map(([, below]) => -below)) * height,
    below: Math.max(0, ...plan.members.map(([, below]) => below)) * height,
  };
};

// Off screen on both sides, far enough that the last bird has gone too
const margin = (plan: FlightPlan, sky: Sky, state: FlightState): number => size(plan, sky, state).width + reach(plan, sky, state).behind + 8;

// The leader's height, before the beat's bob
const pathY = (state: FlightState, plan: FlightPlan, sky: Sky): number => {
  const { above, below } = reach(plan, sky, state);
  const top = sky.top + above;
  const room = Math.max(0, sky.bottom - below - top);
  const altitude = state.from + (state.to - state.from) * smoothstep(state.progress);
  const sway = state.wander.reduce((sum, [px, period, phase]) => sum + px * sky.scale * Math.sin((state.time / period) * Math.PI * 2 + phase), 0);
  return top + altitude * room + sway + state.dip * sky.scale;
};

// Moves a flight on by dt seconds
export const stepFlight = (state: FlightState, plan: FlightPlan, sky: Sky, dt: number, random: Random): void => {
  const { species } = plan;
  if (!state.flying) {
    state.wait -= dt;
    if (state.wait <= 0 && (plan.phones || sky.width >= NARROW)) launch(state, plan, random);
    return;
  }

  // Across at the same share of the width per second on every screen
  state.time += dt;
  const length = sky.width + 2 * margin(plan, sky, state);
  state.progress += (dt * sky.width) / state.crossing / length;
  if (state.progress >= 1) {
    state.flying = false;
    state.wait = between(random, plan.rest);
    return;
  }

  // Beating or gliding
  if (glides(species)) {
    state.modeLeft -= dt;
    if (state.modeLeft <= 0) {
      state.gliding = !state.gliding;
      state.modeLeft = state.gliding ? glideTime(species, random) : flapRun(species, random);
    }
  }

  // Dropping while gliding, climbing back while beating: a damped spring
  const stiffness = DIP_STIFFNESS[species.style];
  const target = state.gliding ? DIP[species.style] : 0;
  state.dipSpeed += (stiffness * (target - state.dip) - 2 * Math.sqrt(stiffness) * state.dipSpeed) * dt;
  state.dip += state.dipSpeed * dt;

  // The wings: each bird finishes its beat into the glide frame and holds it
  const glideAt = species.glide / species.frames;
  for (const member of state.members) {
    if (state.gliding && member.folded) continue;
    // A little quicker while climbing back after a glide
    const climbing = state.dipSpeed < -1 ? 1.12 : 1;
    const next = member.phase + (dt * climbing) / (species.wingbeat * member.pace);
    const passes = next >= 1 ? glideAt >= member.phase || glideAt < next - 1 : glideAt >= member.phase && glideAt < next;
    if (state.gliding && passes) {
      member.phase = glideAt;
      member.folded = true;
    } else {
      member.phase = next % 1;
      member.folded = false;
    }
  }

  // Tilting with the slope of the path, smoothly
  const y = pathY(state, plan, sky);
  if (state.lastY !== null && dt > 0) {
    const slope = (Math.atan2((y - state.lastY) / dt, sky.width / state.crossing) * 180) / Math.PI;
    state.pitch += (clamp(slope, -MAX_TILT, MAX_TILT) - state.pitch) * (1 - Math.exp(-dt * 5));
  }
  state.lastY = y;
};

// Where each bird of a flight is drawn now
export const flightPoses = (state: FlightState, plan: FlightPlan, sky: Sky): BirdPose[] => {
  const { species } = plan;
  const { width, height } = size(plan, sky, state);
  const edge = margin(plan, sky, state);
  const travelled = -edge + state.progress * (sky.width + 2 * edge);
  const leadX = state.heading === 1 ? travelled : sky.width - travelled;
  const leadY = pathY(state, plan, sky);
  const scale = sky.scale * state.depth;
  return state.members.map((member, i) => {
    const [behind, below] = plan.members[i];
    // The body is lowest with the wings up and highest after the downstroke
    const bob = member.folded ? 0 : species.bob * scale * Math.cos((member.phase - species.wingsUp / species.frames) * Math.PI * 2);
    // Birds in a formation wander a few px around their place
    const [swayX, swayY] = i === 0 ? [0, 0] : [Math.sin(state.time * 0.7 + member.drift) * 4 * scale, Math.sin(state.time * 0.9 + member.drift * 2) * 3 * scale];
    return {
      visible: state.flying,
      x: leadX - state.heading * behind * width + swayX,
      y: leadY + below * height + bob + swayY,
      rotate: state.heading * state.pitch,
      scale,
      flip: species.faces === state.heading ? 1 : -1,
      frame: Math.floor(member.phase * species.frames + 1e-6) % species.frames,
    };
  });
};
