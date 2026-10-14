import type { Params } from "../../../simulations/sims/types";

// Part One of the /ray-tracing overview: how black holes work, as a series of
// short illustrated lessons. Each lesson has its own animated diagram (see
// SimulationsPage), and some link into the black hole simulation with a preset.

export type LessonId =
  | "gravity"
  | "escape"
  | "birth"
  | "horizon"
  | "photon-sphere"
  | "accretion"
  | "lensing"
  | "doppler"
  | "spin"
  | "tides"
  | "hawking";

export interface Fact {
  value: string;
  label: string;
}

export interface Lesson {
  id: LessonId;
  number: string;
  title: string;
  lead: string;
  paragraphs: Array<string>;
  keyIdea: { text: string; formula?: string };
  facts?: Array<Fact>;
  caption: string;
  tryIt?: { label: string; params: Params };
}

export const LESSONS: Array<Lesson> = [
  {
    id: "gravity",
    number: "01",
    title: "Gravity is the shape of spacetime",
    lead: "Things fall because space and time are curved.",
    paragraphs: [
      "Newton described gravity as a force that pulls masses together. In 1915 Einstein replaced the force with geometry. Mass and energy curve spacetime, the four-dimensional fabric of space and time, and everything, from planets to light, follows the straightest possible path through it. The Earth circles the Sun not because something pulls on it, but because in the curved spacetime around the Sun its straightest path closes into an orbit.",
      "Time is part of the fabric too: clocks closer to a mass tick more slowly. The effect is small but real. Clocks on GPS satellites, further from the Earth's mass, gain about 45 microseconds a day on clocks on the ground; their orbital speed takes back 7. Ignore the difference and positions would drift by about ten kilometres a day.",
    ],
    keyIdea: { text: "Spacetime tells matter how to move; matter tells spacetime how to curve. (John Wheeler)", formula: "G_μν = (8πG / c⁴) T_μν" },
    facts: [
      { value: "1915", label: "Einstein publishes general relativity" },
      { value: "38 µs", label: "net daily gain of a GPS clock" },
    ],
    caption: "The rubber-sheet picture: a mass dents the grid and a moon rolls around the dent. It is only an analogy, since real curvature also bends time, but it captures the idea.",
    tryIt: { label: "See the bending as a grid", params: { skyMode: "grid" } },
  },
  {
    id: "escape",
    number: "02",
    title: "Too heavy for light",
    lead: "Squeeze any mass small enough, and nothing can climb out.",
    paragraphs: [
      "Throw a ball upwards and it falls back. Throw it faster than 11.2 kilometres a second, the Earth's escape velocity, and it never returns. The escape velocity depends on the mass and on how close you are to it: squeeze the Earth smaller while keeping its mass, and the escape velocity at its surface rises.",
      "In 1783 the English clergyman John Michell asked what would happen if a star were so compact that its escape velocity exceeded the speed of light. Its light could never leave: a dark star. Einstein's theory makes the idea exact. In 1916 Karl Schwarzschild found the solution for a single mass, and in it lies a critical size, now called the Schwarzschild radius. Compress any mass inside it, and a black hole forms.",
    ],
    keyIdea: { text: "Every mass has a Schwarzschild radius. It is about 3 kilometres for every Sun's worth of mass.", formula: "r_s = 2GM / c²" },
    caption: "Pick an object. Ordinary objects shrink to their Schwarzschild radius; real black holes are compared with orbits in our Solar System.",
  },
  {
    id: "birth",
    number: "03",
    title: "How a black hole is born",
    lead: "When a giant star runs out of fuel, gravity wins.",
    paragraphs: [
      "A star is a balancing act. Gravity pulls its gas inwards, and the heat of nuclear fusion in its core pushes back. When the fuel runs out, the balance fails. Stars like the Sun shrink into white dwarfs, held up by electrons that refuse to be squeezed any closer.",
      "Stars of more than about eight Suns end in a supernova: their iron core collapses in less than a second. Usually the core becomes a neutron star. But if what is left weighs more than about two to three Suns, as tends to happen for stars of roughly twenty Suns or more, not even neutrons can hold it up, and it falls inside its own Schwarzschild radius. A stellar black hole is born, usually between 5 and 50 times the mass of the Sun.",
      "Every large galaxy also has a supermassive black hole at its centre, millions to billions of times heavier. Ours, Sagittarius A*, weighs about 4.3 million Suns: astronomers have weighed it by following stars that orbit it, for over thirty years. How such giants grew so large, so early in the history of the universe, is still an open question.",
    ],
    keyIdea: { text: "Black holes come in two main families: stellar ones, left by dying stars, and supermassive ones at the centres of galaxies." },
    facts: [
      { value: "~100 million", label: "stellar black holes estimated in the Milky Way" },
      { value: "4.3 million", label: "Suns in Sagittarius A*, our galaxy's centre" },
    ],
    caption: "A massive star, its core collapse, the supernova, and the black hole left behind. The timescales are wildly compressed: the star lives millions of years, the collapse takes a fraction of a second.",
  },
  {
    id: "horizon",
    number: "04",
    title: "The event horizon",
    lead: "A boundary you can cross only once.",
    paragraphs: [
      "The Schwarzschild radius marks the event horizon. It is not a surface: an astronaut falling through would find nothing there. It is a point of no return. Outside it, a powerful enough rocket can still escape. Inside it, every possible path, even for light, leads further in.",
      "One way to picture it is as a river. Space flows into the black hole like water towards a waterfall, faster and faster as it goes, and light swims through it at the speed of light. Far out, the current is weak and light easily swims away. At the horizon the current reaches the speed of light, and light aimed outwards stands still. Inside, the current always wins.",
      "Time tells the same story. Seen from far away, a falling clock ticks ever more slowly as it nears the horizon, and its light grows redder and dimmer until it fades from view, apparently frozen at the edge. The astronaut holding it notices none of this, and crosses in a finite time.",
    ],
    keyIdea: { text: "Near a mass, clocks run slow by a factor that falls to zero at the horizon.", formula: "dτ / dt = √(1 − r_s / r)" },
    caption: "The river model. Dots are space flowing inwards; arrows are flashes of light aimed outwards. Outside the horizon light makes slow progress, at the horizon it stands still, inside it is swept in.",
  },
  {
    id: "photon-sphere",
    number: "05",
    title: "The photon sphere and the shadow",
    lead: "Light can orbit a black hole, and the result is a hole in the sky.",
    paragraphs: [
      "At one and a half times the Schwarzschild radius, gravity bends light into a circle. This is the photon sphere. The orbit is unstable, like a pencil balanced on its tip: the slightest nudge sends the light spiralling in or flying away. If you could stand there, you would see the back of your own head.",
      "Light arriving from far away with an aim inside a critical distance of the centre dips below the photon sphere and is swallowed. Seen from outside, all those missing rays make a dark disc: the black hole's shadow. Gravity magnifies it, so it is about 2.6 times as wide as the horizon itself. Light that only just misses circles the hole on its way past, and piles up into a thin bright ring at the shadow's edge.",
      "In 2019 the Event Horizon Telescope, a network of radio dishes as wide as the Earth, photographed the shadow of the black hole M87*, 55 million light-years away. In 2022 it did the same for Sagittarius A*: from Earth, its ring is as big as a doughnut on the Moon would look.",
    ],
    keyIdea: { text: "The photon sphere sits at 1.5 r_s. Its shadow on the sky has a radius of about 2.6 r_s.", formula: "b_c = (√27 / 2) r_s ≈ 2.6 r_s" },
    caption: "Light rays from the left, computed from Schwarzschild's equations. Rays aimed inside the critical distance (dashed) are captured; one that just misses loops around the hole first.",
    tryIt: { label: "See the shadow without the disc", params: { showDisc: false } },
  },
  {
    id: "accretion",
    number: "06",
    title: "The accretion disc",
    lead: "Black holes are invisible. The gas falling into them is among the brightest things in the universe.",
    paragraphs: [
      "On its own a black hole gives off no light. What we see is matter on its way in. Gas from a companion star or from a galaxy's crowded centre cannot fall straight in: like water circling a drain, it keeps its sideways motion and settles into a flat, spinning disc.",
      "The inner disc orbits much faster than the outer disc, so neighbouring rings of gas shear past each other. Tangled magnetic fields act like friction, heating the gas to millions of degrees and letting it slowly spiral inwards. At the inner edge it moves at half the speed of light.",
      "That inner edge is the innermost stable circular orbit, or ISCO: three times the Schwarzschild radius for a black hole that does not spin. Closer in, no orbit is stable, and gas plunges into the horizon. Before it gets there it has turned about 6% of its mass into light, and up to about 30% around a fast-spinning hole. Nuclear fusion manages 0.7%. That is why quasars, fed by supermassive black holes, outshine their whole galaxies.",
    ],
    keyIdea: { text: "Inner orbits are faster than outer ones, just as Mercury outpaces Neptune. Friction between them heats the gas and drains its energy.", formula: "v = √(GM / r)" },
    facts: [
      { value: "6–30%", label: "of the gas's mass turned into light" },
      { value: "0.7%", label: "for nuclear fusion in the Sun" },
    ],
    caption: "The disc seen from above. Each ring orbits at its own speed, faster further in. Inside the dashed ISCO, gas spirals into the hole.",
    tryIt: { label: "Speed up the disc", params: { discSpeed: 80 } },
  },
  {
    id: "lensing",
    number: "07",
    title: "Why the disc wraps over the top",
    lead: "The famous Interstellar look is gravity acting as a lens.",
    paragraphs: [
      "Without gravity, a disc around a ball seen from the side would look like a flat ellipse, its far half hidden behind the ball. A black hole bends the light from that far half on its way to us. Light leaving the top of the far disc is bent up and over the shadow; light from its underside is bent beneath it. So we see the back of the disc twice: as an arch over the top, and a thinner one underneath.",
      "Nothing about the disc itself is bent: it is flat and thin. Only the light is. Change your viewpoint and the image changes with it: from directly above, the far side of the disc wraps into a ring all the way around the shadow.",
    ],
    keyIdea: { text: "A black hole is a lens: it shows you what lies behind it, stretched, magnified and often more than once." },
    caption: "The same flat disc, without and with the bending of light. Press the buttons to switch between them.",
    tryIt: { label: "Look from high above", params: { inclination: 45 } },
  },
  {
    id: "doppler",
    number: "08",
    title: "One side shines brighter",
    lead: "Racing gas beams its light forwards, and gravity drains its energy.",
    paragraphs: [
      "Near its inner edge the disc moves at a good fraction of the speed of light: on one side towards us, on the other away. Relativity makes this matter enormously. Light from the approaching side is shifted to bluer colours and concentrated into a forward beam, so it looks far brighter; the receding side looks redder and dimmer. Brightness grows with roughly the fourth power of the Doppler factor, so a modest change of colour is a large change of brightness.",
      "On top of that, light climbing out of the black hole's gravity loses energy and is shifted to redder colours: gravitational redshift. The innermost gas, the hottest of all, looks cooler and dimmer than it really is.",
      "Interstellar left all this out. Its makers kept the disc symmetric so audiences would not be puzzled by a lopsided black hole. The simulation can do either: its cinematic mode keeps a single hue, while its physical mode shifts each part of the disc by its own blackbody temperature.",
    ],
    keyIdea: { text: "What we see depends on how fast the source moves and how deep in gravity it sits. Both are folded into one shift factor g.", formula: "I_obs = g⁴ · I_emit" },
    caption: "True colours at spin 0.95: gas on the left moves towards us and is boosted to blue-white; gas on the right moves away and fades to orange.",
    tryIt: { label: "Switch on true colours", params: { colorMode: "physical", temperature: 9000, spin: 0.95 } },
  },
  {
    id: "spin",
    number: "09",
    title: "Spin",
    lead: "Real black holes spin, and drag spacetime around with them.",
    paragraphs: [
      "Stars rotate, and a collapsing core spins up like a figure skater pulling in their arms. The black hole keeps that rotation. In 1963 Roy Kerr found the exact solution for a spinning black hole. The black hole in Interstellar, and the one in these simulations, is a Kerr black hole.",
      "A spinning black hole drags space around with it, an effect called frame dragging. Close in, the dragging is so strong that nothing can stay still: in the ergosphere, even a rocket at full thrust is carried around with the spin. The horizon shrinks, and gas orbiting in the same direction as the spin can circle much closer before it plunges, so the disc reaches further in and shines hotter.",
      "Spin changes the shadow too. Light passing on the side that turns towards us is helped along and can get closer, while light on the other side is held back. At high spin one edge of the shadow flattens and the whole shadow shifts sideways.",
    ],
    keyIdea: { text: "Spin is measured by a/M, from 0 (no spin) to 1 (the fastest possible). Theory suggests real ones stop near 0.998.", formula: "r₊ = M + √(M² − a²)" },
    caption: "A slice through a spinning black hole, seen side on. Move the slider: the horizon shrinks, the ergosphere bulges out at the equator, and a disc orbiting with the spin reaches further in, while one orbiting against it is held further out.",
  },
  {
    id: "tides",
    number: "10",
    title: "Spaghettification",
    lead: "Fall in feet first, and gravity pulls your feet harder than your head.",
    paragraphs: [
      "Gravity weakens with distance, so it always pulls a little harder on the near end of an object than on the far end. Across your body on Earth the difference is far too small to notice; across the Earth, the Moon's version of it raises the ocean tides. Near a black hole it becomes enormous: a falling astronaut is stretched from head to foot and squeezed from the sides, like spaghetti.",
      "Surprisingly, small black holes are the dangerous ones. Fall into a black hole of 10 Suns and the difference between the pull on your feet and on your head would reach twenty million g at the horizon: you would be torn apart hundreds of kilometres before reaching it. At Sagittarius A*, the difference at the horizon is about a ten-thousandth of g. You would cross without feeling a thing.",
      "Stars meet the same fate. When one wanders too close to a supermassive black hole it is pulled into a long stream of gas, and part of it falls in, lighting up a flare that lasts for months: a tidal disruption event.",
    ],
    keyIdea: { text: "The stretching grows as the cube of how close you are. At the horizon it falls with the square of the mass.", formula: "Δa ≈ 2GM·L / r³" },
    facts: [
      { value: "20,000,000 g", label: "at the horizon of a 10-Sun black hole" },
      { value: "0.0001 g", label: "at the horizon of Sagittarius A*" },
    ],
    caption: "An astronaut falling towards a small black hole is stretched along the direction of the fall and squeezed across it.",
  },
  {
    id: "hawking",
    number: "11",
    title: "Do black holes last forever?",
    lead: "Almost. Quantum mechanics lets them glow, very faintly.",
    paragraphs: [
      "In 1974 Stephen Hawking showed that quantum effects near the horizon make a black hole give off a faint thermal glow, so it slowly loses mass. The bigger the black hole, the colder it is. One with the mass of the Sun would have a temperature of about 60 billionths of a degree above absolute zero, far colder than the 2.7 K afterglow of the Big Bang. So today every known black hole swallows more energy than it radiates, and grows.",
      "Only in the very far future, once the universe has cooled below them, will they begin to shrink. A black hole of one Sun would take around 10⁶⁷ years to evaporate; the largest, around 10¹⁰⁰. Hawking radiation has never been observed, but it remains one of our deepest clues to how gravity and quantum mechanics fit together.",
    ],
    keyIdea: { text: "A black hole's temperature is inversely proportional to its mass: the smaller, the hotter.", formula: "T = ħc³ / (8πGMk_B)" },
    facts: [
      { value: "60 nK", label: "temperature of a black hole of one Sun" },
      { value: "2.7 K", label: "temperature of the cosmic microwave background" },
      { value: "10⁶⁷ yr", label: "for a black hole of one Sun to evaporate" },
    ],
    caption: "Pairs of particles appear at the horizon; one escapes as Hawking radiation. This is the popular picture, and a simplification of the real calculation.",
  },
];
