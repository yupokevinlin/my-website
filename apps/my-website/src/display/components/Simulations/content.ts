import type { Params } from "../../../simulations/sims/types";

// Educational copy for the /ray-tracing pages, shared by the overview essay
// and each simulation's Learn tab.

export type SimId = "blackhole" | "infall" | "wormhole" | "lightspeed" | "flyby";

export interface Preset {
  label: string;
  description: string;
  params: Params;
}

export interface Feature {
  title: string;
  text: string;
}

export interface Equation {
  name: string;
  formula: string;
  note: string;
}

export interface Chapter {
  id: SimId;
  numeral: string;
  kicker: string;
  field: string;
  title: string;
  subtitle: string;
  image: string;
  imageCaption: string;
  paragraphs: Array<string>;
  features: Array<Feature>;
  equations: Array<Equation>;
  presets: Array<Preset>;
}

export const CHAPTERS: Array<Chapter> = [
  {
    id: "blackhole",
    numeral: "I",
    kicker: "Simulation I · General relativity",
    field: "General relativity",
    title: "The Black Hole",
    subtitle: "A star's worth of mass, folded so tightly that not even light escapes.",
    image: "/ray-tracing/images/blackhole.jpg",
    imageCaption: "A black hole with spin 0.215, seen from just above its accretion disc.",
    paragraphs: [
      "Gargantua, the black hole in Interstellar, is a spinning black hole. Mass curves spacetime, and light, which always takes the straightest path available, follows the curve. Close to the hole the bending is so strong that light can orbit it, loop around behind it, or fall in for good.",
      "Every pixel here is a ray of light traced backwards from the camera through the curved spacetime around the hole. If the ray crosses the event horizon, the pixel is black: that is the shadow. If it crosses the thin disc of hot gas orbiting the hole, it picks up the disc's glow, shifted in colour and brightness by the speed of the gas and by gravity itself.",
    ],
    features: [
      { title: "The shadow", text: "Every direction from which no light can reach you. It is about two and a half times wider than the event horizon, because light passing close to the hole is captured too." },
      { title: "The arch over the top", text: "The far side of the disc, behind the hole. Its light is bent up and over the shadow, so the disc seems to wrap around it." },
      { title: "The thin ring", text: "Light that skimmed the photon sphere and looped around the hole before escaping. Each extra lap makes a thinner, fainter image." },
      { title: "One side brighter", text: "Gas on one side races towards you at a sizeable fraction of the speed of light. Relativistic beaming throws its light forward, so the approaching side outshines the receding one." },
    ],
    equations: [
      { name: "Light follows null geodesics", formula: "ds² = g_μν dx^μ dx^ν = 0", note: "The spacetime interval along a light ray is zero; the metric g describes the curvature." },
      { name: "Event horizon", formula: "r₊ = M + √(M² − a²)", note: "a is the spin per unit mass. At a = M the hole spins as fast as it possibly can." },
      { name: "Disc brightness", formula: "I_obs = g³ · I_emit ,  g = ν_obs / ν_emit", note: "Iν/ν³ is conserved along a ray, so the redshift g sets both colour and brightness." },
    ],
    presets: [
      { label: "No spin", description: "A Schwarzschild black hole: the shadow becomes a perfect circle.", params: { spin: 0 } },
      { label: "Near-maximal spin", description: "Frame dragging pulls the light around, flattening one side of the shadow.", params: { spin: 0.998 } },
      { label: "True colours", description: "Full Doppler colour: the approaching side turns blue-white, the receding side fades to red.", params: { colorMode: "physical", temperature: 9000, spin: 0.95 } },
      { label: "Interstellar's choice", description: "Switch the Doppler shift off, as the film did, and the disc becomes symmetric.", params: { doppler: 0 } },
      { label: "Lensing grid", description: "Replace the stars with a grid to see how strongly the hole bends light.", params: { skyMode: "grid" } },
      { label: "Just the shadow", description: "Hide the disc to see the shadow and the lensed stars behind it.", params: { showDisc: false } },
    ],
  },
  {
    id: "infall",
    numeral: "II",
    kicker: "Simulation II · General relativity",
    field: "General relativity",
    title: "Into the Black Hole",
    subtitle: "What you would really see on a one-way trip through the event horizon.",
    image: "/ray-tracing/images/infall.jpg",
    imageCaption: "Just inside the horizon. The black region below is still only part of the sky, ringed by blueshifted light.",
    paragraphs: [
      "What would you see if you fell into a black hole? Space flows inwards around a black hole like a river, faster the closer it gets, and at the horizon it flows at the speed of light. Dropped from far away, you are carried along with it, so you cross the horizon without feeling a thing. Nothing marks the boundary. Only afterwards does every path lead to the singularity.",
      "Here the camera falls straight into a non-spinning black hole. Because the hole is perfectly round, a light ray's path depends only on your distance and the angle you look at, so every possible ray is traced once into a table. Your fall also changes the colours you see: light from below is blueshifted and light from above redshifted, by an amount that combines gravity and your own speed.",
    ],
    features: [
      { title: "The black region below", text: "Every direction from which no light can reach you. It grows as you fall, yet as you cross the horizon it covers only a circle about 84° across. The horizon always seems to lie ahead." },
      { title: "The ring at its edge", text: "Light that skimmed the photon sphere, at one and a half times the horizon radius. You are falling towards it, so it is blueshifted to a blue-white glow." },
      { title: "Inside", text: "The singularity is no longer a place below you but a moment in your future. Dropped from far away, you reach it 4GM/3c³ of your own time after crossing the horizon: about 28 seconds for Sagittarius A*." },
      { title: "The last view", text: "Near the singularity, the sky above dims to a deep red while light from the sides is squeezed into a thin, intensely blue band around you." },
      { title: "Hovering instead", text: "Someone hovering just outside the horizon on a powerful rocket sees something else entirely: the whole outside universe squeezed into a small, brilliantly blueshifted circle overhead." },
    ],
    equations: [
      { name: "The river of space", formula: "v = √(2GM / r)", note: "The speed at which space flows inwards, and the speed of anything dropped from far away. It reaches c at the horizon, r = 2GM/c², and exceeds it inside." },
      { name: "Colour of the sky", formula: "D = 1 / (1 + (v/c) cos α)", note: "α is measured from straight up. The factor combines gravity and your own fall exactly: blue below, red above." },
      { name: "Time left", formula: "τ = (2/3) · r^(3/2) / √(2GM)", note: "Your own time to the singularity. From the horizon: 4GM/3c³, about 28 s for Sagittarius A* and 12 hours for M87*." },
    ],
    presets: [
      { label: "Hover at the edge", description: "Fire rockets to hold still just outside the horizon: the sky shrinks into a bright circle overhead.", params: { observer: "hover", radius: 2.05 } },
      { label: "Stop at the photon sphere", description: "Pause where light could orbit the hole, then drag to look around.", params: { motion: "manual", radius: 3 } },
      { label: "Just inside", description: "Past the point of no return, yet the horizon still seems to be below you.", params: { motion: "manual", radius: 1.5 } },
      { label: "The other universe", description: "Inside an idealised, eternal black hole, a second universe appears below you.", params: { interior: "eternal", motion: "manual", radius: 1 } },
      { label: "Real-time fall", description: "Fall at the true pace of your own clock: the inside takes a blink.", params: { pacing: "proper" } },
      { label: "Lensing grid", description: "Replace the stars with a grid to see how the view is bent and squeezed.", params: { skyMode: "grid" } },
    ],
  },
  {
    id: "wormhole",
    numeral: "III",
    kicker: "Simulation III · General relativity",
    field: "General relativity",
    title: "The Wormhole",
    subtitle: "A tunnel through spacetime, seen as a crystal ball onto another galaxy.",
    image: "/ray-tracing/images/wormhole.jpg",
    imageCaption: "Approaching the mouth: the far galaxy inside, our own sky wrapped into rings around it.",
    paragraphs: [
      "A wormhole connects two distant regions of space through a shortcut. The one in Interstellar, designed with physicist Kip Thorne, is a smooth, spherically symmetric tunnel described by three numbers: the radius of its throat ρ, the length of the throat 2a, and a lensing width set by M.",
      "From outside it looks like a sphere. Light that passes through the tunnel brings the view from the other side, so another galaxy appears inside it, while light skimming the mouth is wrapped into rings of the sky behind you. Because the shape is so symmetric, a light ray's fate depends on only two numbers, so every possible ray is integrated once into a table and the camera can fly straight through.",
    ],
    features: [
      { title: "The sphere", text: "The mouth of the wormhole. Inside it you see the sky of the far side, lensed through the throat." },
      { title: "The rings around it", text: "Light from your own sky, bent around the mouth. The nearer the edge, the more times it has been wrapped." },
      { title: "Inside the throat", text: "The walls are both skies, stretched along the tunnel. The camera turns to face them as it passes through." },
      { title: "Looking back", text: "From the far side, your home galaxy appears inside the sphere instead." },
    ],
    equations: [
      { name: "The geometry", formula: "ds² = −dt² + dℓ² + r(ℓ)² dΩ²", note: "ℓ is the distance travelled through the tunnel; r(ℓ) is the size of the sphere at that point." },
      { name: "The shape", formula: "r(ℓ) = ρ + M [ x·arctan x − ½ ln(1 + x²) ]", note: "with x = 2(|ℓ| − a) / πM outside the throat, and r = ρ inside it." },
      { name: "Which rays pass through", formula: "b = r · sin α  <  ρ", note: "The impact parameter b is conserved along a ray; only rays with b smaller than the throat get through." },
    ],
    presets: [
      { label: "Fly through", description: "A one-way trip through the throat, on a loop.", params: { travel: "fly" } },
      { label: "Strong lensing", description: "A wider, smoother mouth that bends far more of the sky.", params: { lensing: 1 } },
      { label: "Long throat", description: "A longer tunnel: inside, the walls stretch out into streaks.", params: { throat: 4 } },
      { label: "Sharp edge", description: "No tunnel and almost no lensing width: a crisp sphere with thin rings.", params: { throat: 0, lensing: 0.03 } },
      { label: "Lensing grid", description: "Replace the home sky with a grid to see how it wraps around the mouth.", params: { skyA: "grid" } },
      { label: "Park at the mouth", description: "Stop just outside the mouth, then drag to look around.", params: { travel: "manual", position: 1.6 } },
    ],
  },
  {
    id: "lightspeed",
    numeral: "IV",
    kicker: "Simulation IV · Special relativity",
    field: "Special relativity",
    title: "Near Light Speed",
    subtitle: "Fly towards the centre of the Milky Way and watch the sky crowd in ahead of you.",
    image: "/ray-tracing/images/lightspeed.jpg",
    imageCaption: "At 0.99c the whole galaxy is squeezed forward into a narrow, blue-shifted band.",
    paragraphs: [
      "Nothing with mass can reach the speed of light, but it can get as close as you like. As it does, the sky changes in three ways at once. Aberration squeezes the view forwards, the way rain seems to slant towards you when you run. The Doppler effect shifts the light ahead to bluer colours and the light behind to redder ones. And beaming makes the view ahead brighter and the view behind darker.",
      "Speed here is set by the rapidity η, where your speed is v = c·tanh η. Rapidities simply add, so equal steps of the slider feel like equal pushes of the engine, even as v creeps ever closer to c. Ship time and galaxy time are counted separately: at high speed, years pass at home for every second on board.",
    ],
    features: [
      { title: "The bright cone ahead", text: "Starlight from all around is crowded forwards. At 0.99c, everything that was ahead of you fits into a circle only 16° across." },
      { title: "Colour shift", text: "Stars ahead are blue-shifted and stars behind are red-shifted, by the Doppler factor D." },
      { title: "Darkness behind", text: "Beaming dims the view behind you so strongly that at high speed the sky there almost vanishes." },
      { title: "Passing stars", text: "A 3D field of nearby stars streams past with real parallax, stretched by the same aberration." },
    ],
    equations: [
      { name: "Speed from rapidity", formula: "β = v/c = tanh η ,  γ = cosh η", note: "Rapidities add like ordinary numbers; speeds do not." },
      { name: "Aberration", formula: "tan(θ_ship / 2) = e^−η · tan(θ_galaxy / 2)", note: "Angles from the direction of travel shrink as η grows." },
      { name: "Doppler factor", formula: "D = γ (1 + β cos θ_galaxy)", note: "A star at temperature T looks exactly like a star at D·T: blackbody light stays blackbody." },
    ],
    presets: [
      { label: "At rest", description: "The ordinary Milky Way, for comparison.", params: { speed: 0 } },
      { label: "0.9c", description: "The sky starts to crowd forwards and turn blue ahead.", params: { speed: 1.472 } },
      { label: "0.99c", description: "Half the sky fits into a narrow cone ahead.", params: { speed: 2.647 } },
      { label: "0.99999c", description: "The galaxy collapses to a point ahead, and the cosmic microwave background starts to glow.", params: { speed: 6.103, cmb: true } },
      { label: "Geometry only", description: "Turn off the colour and brightness changes to see pure aberration.", params: { dopplerColor: false, beaming: false } },
      { label: "Accelerate at 1 g", description: "Start from rest under Earth gravity: after one year of ship time you reach 0.77c.", params: { drive: "accel", speed: 10 } },
    ],
  },
  {
    id: "flyby",
    numeral: "V",
    kicker: "Simulation V · Special relativity",
    field: "Special relativity",
    title: "Flying Past Earth",
    subtitle: "Race past home at nearly the speed of light, and watch the planet turn, shrink and glow.",
    image: "/ray-tracing/images/flyby.jpg",
    imageCaption: "Approaching at 0.9c: South America and the Atlantic, blueshifted, with the night side turning away.",
    paragraphs: [
      "Race past the Earth at 90% of the speed of light and you might expect to see it squashed, since relativity shortens moving objects along their direction of travel. You won't. Light from the far parts of the planet set out earlier than light from the near parts, and the two effects cancel: a passing sphere always looks perfectly round. Instead it looks turned, as if it had rotated towards where you are heading. James Terrell and Roger Penrose worked this out in 1959, more than fifty years after Einstein's theory.",
      "Every pixel here is a ray of light traced back to the Earth, which stands still while you move. Its colour shifts too. Ahead, sunlight off the oceans turns blue-white and city lights blaze. Go faster and something stranger happens: the Earth's own heat, infrared light no eye can see, is shifted into view, and the whole planet glows like a lamp.",
    ],
    features: [
      { title: "Round, but turned", text: "However fast it passes, the Earth never looks squashed. When it appears directly beside you, you are seeing the side that faces where you are heading: it looks turned by 64° at 0.9c and 82° at 0.99c." },
      { title: "Ahead: small and blue", text: "Aberration crowds everything ahead into a small patch of sky, so the Earth looks tiny and far away until the last moment. Its light arrives blueshifted and brighter." },
      { title: "Beside you: still blue", text: "Even when it appears directly beside you, the Earth's light is blueshifted, by the factor γ: 2.3 times at 0.9c. Your own clock runs slow, so the world outside looks sped up." },
      { title: "Behind: fading out", text: "Once past, the Earth fills much of the sky, but its light is redshifted towards the infrared and dimmed until it all but disappears." },
      { title: "The heat glow", text: "The Earth glows at about 288 K, in the infrared. Head on at 0.98c its light is shifted ten times, and that glow becomes visible as a 2,900 K orange, brighter than the sunlit side. The colder cloud tops show darker, like an infrared weather image." },
      { title: "The Moon's far side", text: "Fly on past the Moon. As it appears beside you, you see mostly its far side, the one that never faces Earth." },
    ],
    equations: [
      { name: "Aberration", formula: "cos θ' = (cos θ + β) / (1 + β cos θ)", note: "θ: direction of the light in Earth's frame; θ': as seen from the ship. Both measured from the direction of travel." },
      { name: "Doppler factor", formula: "D = γ (1 + β cos θ')", note: "At 0.99c: 14 times bluer ahead, 7 times beside you, 14 times redder behind." },
      { name: "Apparent turn", formula: "α = arcsin β", note: "How far a passing sphere seems rotated when it appears directly beside you." },
      { name: "Heat glow", formula: "T_seen = D · 288 K", note: "A blackbody stays a blackbody when Doppler shifted, only hotter or colder." },
    ],
    presets: [
      { label: "Slow flyby", description: "The same path at 300 km/s, a thousandth of light speed, for comparison.", params: { speed: 0.001 } },
      { label: "0.98c", description: "The Earth's own heat glows orange, brighter than its sunlit side.", params: { speed: 2.298 } },
      { label: "Without aberration", description: "Where the Earth really is: no squeezing forwards, no turn.", params: { aberration: false } },
      { label: "Stop at closest approach", description: "Halt where the Earth is nearest. It still appears ahead of you.", params: { motion: "manual", position: 0 } },
      { label: "On to the Moon", description: "Pass the Moon as well, and see its far side as it goes by.", params: { moon: true } },
      { label: "Aberration grid", description: "Replace the stars with a grid to see the sky crowd forwards.", params: { skyMode: "grid" } },
    ],
  },
];

export const getChapter = (id: SimId): Chapter => CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0];

/** URL of a simulation with a preset applied through its shareable hash. */
export const presetHref = (id: SimId, params: Params): string => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => q.set(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v)));
  const hash = q.toString();
  return hash ? `/ray-tracing/${id}#${hash}` : `/ray-tracing/${id}`;
};

export const GLOSSARY: Array<Feature> = [
  { title: "Schwarzschild radius", text: "The size to which a mass must be squeezed to become a black hole: rₛ = 2GM/c², about 3 km per Sun of mass." },
  { title: "Event horizon", text: "The boundary of a black hole. Anything inside, light included, can never get out." },
  { title: "Singularity", text: "Where general relativity predicts infinite density at the centre of a black hole. It most likely marks where the theory breaks down, not a real infinity." },
  { title: "Photon sphere", text: "The radius at which light can orbit a black hole in a circle. It is unstable: a nudge sends the light in or out." },
  { title: "Shadow", text: "The dark patch a black hole casts on the sky: every direction from which no light reaches you. About 2.6 times as wide as the horizon." },
  { title: "Accretion disc", text: "A flat disc of gas spiralling into a black hole, heated by friction until it glows." },
  { title: "ISCO", text: "The innermost stable circular orbit: the closest gas can orbit before plunging in. Spin moves it inwards for gas orbiting with the spin." },
  { title: "Frame dragging", text: "A spinning mass drags spacetime around with it, so nothing near a spinning black hole can stay still." },
  { title: "Ergosphere", text: "The region just outside a spinning black hole's horizon where frame dragging is so strong that nothing can stay still." },
  { title: "Spaghettification", text: "The stretching of a falling object by tides: gravity pulls its near end harder than its far end." },
  { title: "Hawking radiation", text: "The faint thermal glow that quantum effects should give every black hole, letting it slowly evaporate." },
  { title: "Gravitational lensing", text: "The bending of light by mass. It magnifies, distorts and duplicates whatever lies behind." },
  { title: "Gravitational redshift", text: "Light climbing out of a gravitational well loses energy and shifts to redder colours." },
  { title: "Relativistic beaming", text: "A source moving towards you looks brighter, and one moving away looks dimmer, far beyond the everyday Doppler effect." },
  { title: "Free fall", text: "Moving under gravity alone, with no rocket or ground pushing back. A falling observer feels weightless, and crosses a black hole's horizon without noticing it." },
  { title: "Einstein–Rosen bridge", text: "In the idealised, eternal black hole, a tunnel to a second universe. It pinches off too quickly for anything to cross, and real black holes, formed by collapsing stars, do not have one." },
  { title: "Throat", text: "The narrowest part of a wormhole, where its spheres have their smallest radius ρ." },
  { title: "Rapidity", text: "A measure of speed that adds simply: two boosts of η₁ and η₂ make η₁ + η₂, while the speed tanh η never reaches c." },
  { title: "Aberration", text: "The change in the apparent direction of light caused by your own motion." },
  { title: "Terrell rotation", text: "The apparent turning of a fast-moving object. Light from its far parts set out earlier, so it looks rotated rather than squashed; a sphere always stays round." },
];

export const CREDITS: Array<{ text: string; link: string; url: string }> = [
  { text: "ScienceClic English (Alessandro Roussel), ", link: "Let's reproduce the calculations from Interstellar", url: "https://www.youtube.com/watch?v=ABFGKdKKKyg" },
  { text: "Shaders by aroussel on Shadertoy: ", link: "Interstellar black hole and wormhole", url: "https://www.shadertoy.com/user/aroussel" },
  { text: "Star map: NASA/Goddard Space Flight Center Scientific Visualization Studio, ", link: "Deep Star Maps 2020", url: "https://svs.gsfc.nasa.gov/4851" },
  { text: "O. James, E. von Tunzelmann, P. Franklin and K. S. Thorne, ", link: "Visualizing Interstellar's Wormhole (2015)", url: "https://arxiv.org/abs/1502.03809" },
  { text: "O. James, E. von Tunzelmann, P. Franklin and K. S. Thorne, ", link: "Gravitational lensing by spinning black holes in astrophysics, and in the movie Interstellar (2015)", url: "https://arxiv.org/abs/1502.03808" },
  { text: "Event Horizon Telescope Collaboration, ", link: "First M87 Event Horizon Telescope Results. I. (2019)", url: "https://arxiv.org/abs/1906.11238" },
  { text: "Event Horizon Telescope Collaboration, ", link: "First Sagittarius A* Event Horizon Telescope Results. I. (2022)", url: "https://doi.org/10.3847/2041-8213/ac6674" },
  { text: "A. J. S. Hamilton and J. P. Lisle, ", link: "The river model of black holes (2008)", url: "https://arxiv.org/abs/gr-qc/0411060" },
  { text: "M. Moroz, ", link: "Tracing Geodesics", url: "https://michaelmoroz.github.io/TracingGeodesics/" },
  { text: "A. J. S. Hamilton, ", link: "Inside black holes", url: "https://jila.colorado.edu/~ajsh/insidebh/" },
  { text: "J. Terrell, ", link: "Invisibility of the Lorentz contraction (1959)", url: "https://doi.org/10.1103/PhysRev.116.1041" },
  { text: "R. Penrose, ", link: "The apparent shape of a relativistically moving sphere (1959)", url: "https://doi.org/10.1017/S0305004100033776" },
  { text: "Earth: NASA Earth Observatory (Reto Stöckli), ", link: "Blue Marble: Next Generation", url: "https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/" },
  { text: "Night lights: NASA Earth Observatory (Joshua Stevens, Miguel Román), ", link: "Earth at Night, Black Marble 2016", url: "https://science.nasa.gov/earth/earth-observatory/earth-at-night/" },
  { text: "Moon: NASA Scientific Visualization Studio (Ernie Wright), ", link: "CGI Moon Kit", url: "https://svs.gsfc.nasa.gov/4720" },
];
