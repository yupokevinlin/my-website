// The ray-tracing guide's interface text in English: its labels, prose, page
// titles, diagrams and the simulations' readouts. English is the source of
// truth, as in ../en.ts; every other language's file is typed `GuideText`.
// It lives apart from the home page's text so each page loads only its own.

export const EN_GUIDE_TEXT = {
  // <title> is "<name> - Kevin Lin"; the description is for search results
  // and link previews
  heads: {
    overview: {
      name: "Relativistic Ray Tracing",
      description: "How black holes work, and why light bends: an illustrated guide with real-time 4K ray-traced simulations of a spinning black hole, a fall through its event horizon, the Interstellar wormhole and near-light-speed travel.",
    },
    blackhole: {
      name: "Black Hole",
      description: "A spinning black hole with a lensed accretion disc, ray-traced through curved spacetime in real time at 4K.",
    },
    infall: {
      name: "Falling Into a Black Hole",
      description: "Fall through the event horizon of a black hole and see what you would really see, with every light ray traced through curved spacetime.",
    },
    wormhole: {
      name: "Wormhole",
      description: "Fly through the Interstellar wormhole into another galaxy, with every light ray pre-integrated through the curved geometry.",
    },
    lightspeed: {
      name: "Near Light Speed",
      description: "Travel towards the galactic centre near the speed of light: relativistic aberration, Doppler colour shift and beaming.",
    },
  },
  layout: {
    brand: "Relativistic Ray Tracing",
    menu: "Menu",
    nav: {
      home: "Home",
      overview: "Overview",
      blackhole: "Black Hole",
      infall: "Falling In",
      wormhole: "Wormhole",
      lightspeed: "Light Speed",
    },
  },
  overview: {
    dopplerAlt: "A black hole in true colours, brighter and bluer on the left",
    hero: {
      kicker: "An illustrated guide to black holes and relativity",
      // "Light, bent by <em>spacetime</em>"
      titleBefore: "Light, bent by ",
      titleEmphasis: "spacetime",
      titleAfter: "",
      text: "How does a black hole work, and what would one really look like? Eleven short lessons explain, with animated diagrams. Then four real-time simulations let you fly around a black hole and fall into one, through a wormhole and close to the speed of light. Every pixel is a ray of light, traced through curved spacetime.",
      startLearning: "Start learning ↓",
      openBlackHole: "Open the black hole →",
    },
    parts: [
      {
        label: "Part One",
        title: "How black holes work",
        intro: "A black hole is the simplest object in the universe, and the strangest: just a mass, a spin and a boundary nothing can leave. These eleven short lessons go from why things fall to why black holes glow. No maths needed; the equations are there if you want them.",
      },
      {
        label: "Part Two",
        title: "Tracing light",
        intro: "To draw a black hole, you need to know where every ray of light reaching your eye came from. In flat space that is easy, because light travels in straight lines. Near a black hole, light follows the curved paths of the lessons above, so drawing it becomes a calculation.",
      },
      {
        label: "Part Three",
        title: "The simulations",
        intro: "Four experiments to fly through. Each runs live in your browser at up to 4K; every setting can be changed, and every view can be shared as a link.",
      },
    ],
    tracing: {
      title: "Running the light backwards",
      paragraphs: [
        "Ray tracing follows light in reverse. From the camera, one ray per pixel is launched into the scene and stepped through the curved geometry. If it falls through the horizon, the pixel is black. If it crosses the disc, it takes the disc's glow, shifted by the Doppler effect and by gravity. If it escapes, it takes the colour of the sky in the direction it finally leaves.",
        "Near the Sun the bending is tiny, 1.75 arcseconds for starlight grazing its edge, about half a thousandth of a degree. Near a black hole it shapes everything you see.",
      ],
      caption: "Rays from the camera, seen from the side. Aim close to the hole and the light is captured, forming the shadow; aim a little wider and it is bent over the top, revealing the far side of the disc.",
    },
    realTime: {
      title: "Making it real-time",
      text: "Following light through curved spacetime is expensive, so the work is split: the hard part is done once, and everything that moves is cheap. That is what lets these run at full 4K in a browser tab.",
      steps: [
        { title: "Trace", text: "For each of the 8.3 million pixels of a 4K frame, a light ray is integrated backwards through curved spacetime with a fourth-order Runge–Kutta solver, until it falls in, crosses the disc, or escapes. On a modern GPU the whole frame takes about a second." },
        { title: "Cache", text: "The result is stored as a ray map: where each pixel's light came from. The wormhole and the fall into the black hole go further: their symmetry means every possible ray fits into one table, computed once." },
        { title: "Shade", text: "Each frame then only looks things up: the disc's position as it rotates, its Doppler and gravitational shift, and the colour of a blackbody at that temperature, from precomputed spectral tables." },
        { title: "Expose", text: "Light is kept in high dynamic range, from faint stars to the blazing inner disc, then bloomed and tone-mapped like film. The stars come from NASA's 16K HDR map of the Milky Way." },
      ],
    },
    chapter: {
      kicker: (numeral: string, field: string): string => `Simulation ${numeral} · ${field}`,
      open: "Open the simulation",
      seeing: "What you are seeing",
      physics: "The physics",
      tryThis: "Try this",
    },
    glossary: { kicker: "Glossary", title: "A few words" },
    credits: "Sources and credits",
    requirements: {
      title: "Requirements",
      text: "A desktop browser with WebGL 2 and float render targets: recent Chrome, Edge, Firefox or Safari. At 4K the black hole uses about 400 MB of GPU memory; on smaller GPUs, lower the render resolution under Output.",
    },
    back: "← Back to kevinyupolin.dev",
  },
  lesson: {
    number: (n: string): string => `Lesson ${n}`,
    of: (total: number): string => `of ${total}`,
    keyIdea: "Key idea",
    tryIt: "Try it",
  },
  learn: {
    tryThis: "Try this",
    seeing: "What you are seeing",
    physics: "The physics",
    newToBlackHoles: "New to black holes?",
    keys: "Keys",
    keyDrag: "Drag · look or orbit",
    keyWheel: "Wheel or pinch · zoom or move",
    keySpace: "Space · pause",
    keyFullscreen: "F · fullscreen",
    keySnapshot: "P · snapshot",
    keyHide: "H · hide interface",
    // "More in the <link>illustrated overview</link>."
    moreBefore: "More in the ",
    moreLink: "illustrated overview",
    moreAfter: ".",
  },
  controls: {
    retraces: "Changing this re-traces the light paths",
    reset: "Reset",
    copied: "Copied ✓",
    shareLink: "Share link",
    // After the ⟳ mark
    retraceNote: "re-traces the light paths: an instant preview, then full resolution.",
    // The settings' sections, by their id in the simulations' definitions
    groups: {
      "Black hole": "Black hole",
      Camera: "Camera",
      Disc: "Disc",
      Gas: "Gas",
      Sky: "Sky",
      Quality: "Quality",
      Fall: "Fall",
      Light: "Light",
      Wormhole: "Wormhole",
      Skies: "Skies",
      Ship: "Ship",
      Relativity: "Relativity",
      Stars: "Stars",
      Output: "Output",
    } as Record<string, string>,
  },
  simulation: {
    play: "Play (Space)",
    pause: "Pause (Space)",
    fullscreen: "Fullscreen (F)",
    snapshot: "Save a PNG at the render resolution (P)",
    learn: "Learn",
    controls: "Controls",
    fps: (fps: string): string => `${fps} fps`,
    starting: "starting…",
    paused: "paused",
    noWebGl: "This simulation needs WebGL 2 with float render targets",
    noWebGlHint: "Try a recent Chrome, Edge, Firefox or Safari with hardware acceleration enabled.",
    lost: "The 3D view stopped",
    lostMessage: "The browser stopped the 3D view, most likely because it ran out of graphics memory.",
    lostHint: "Reload the page to try again. A lower render resolution or star map detail under Output also helps.",
    skyLoading: (size: number): string => `Loading ${size}² star map…`,
    skyProgress: (size: number, percent: number): string => `Loading ${size}² star map… ${percent}%`,
    skyFailed: (size: number): string => `Star map failed to load (${size})`,
  },
  // Each simulation's readouts over the view and its progress line. Values
  // arrive already formatted (numbers with their decimals).
  readouts: {
    blackhole: {
      horizon: "Event horizon r₊",
      isco: (prograde: boolean): string => `ISCO (${prograde ? "prograde" : "retrograde"})`,
      photonOrbit: "Photon orbit",
      horizonSpin: "Horizon spin Ω_H",
      cameraClock: "Camera clock rate",
      cameraClockValue: (rate: string): string => `${rate} × distant clock`,
      tracing: (percent: string): string => `Tracing geodesics ${percent}%`,
      traced: "Ray map complete",
    },
    infall: {
      radius: "Radius",
      radiusValue: (m: string, horizons: string): string => `${m} M · ${horizons} × horizon`,
      where: "Where",
      outside: "Outside the horizon",
      inside: "Inside the horizon",
      thrust: "Rocket thrust to hover",
      clock: "Your clock rate",
      clockValue: (rate: string): string => `${rate} × far away`,
      timeLeft: "Your time to the singularity",
      tidal: "Tidal stretch on your body",
      // Units of the time left; µs, ms, s, min and h are international
      days: (n: string): string => `${n} days`,
      integrating: (percent: string): string => `Integrating light paths ${percent}%`,
      ready: "Light paths ready",
    },
    wormhole: {
      cameraL: "Camera l",
      radius: "Circumferential radius r(l)",
      universe: "Universe",
      insideThroat: "Inside the throat",
      home: "Home (Milky Way side)",
      farSide: "Far side",
      lensingWidth: "Lensing width W",
      throatLength: "Throat length 2a",
      integrating: (percent: string): string => `Integrating geodesic table ${percent}%`,
      ready: "Geodesic table ready",
    },
    lightspeed: {
      speed: "Speed",
      doppler: "Doppler ahead / behind",
      shipTime: "Ship (proper) time",
      earthTime: "Galaxy (Earth) time",
      years: (n: string): string => `${n} yr`,
      distance: "Distance travelled",
      lightYears: (n: string): string => `${n} ly`,
      toCentre: "To galactic centre",
      passed: "Passed!",
    },
  },
  // The lessons' animated diagrams: SVG labels (set in small capitals) and
  // each diagram's accessible description
  diagrams: {
    ray: {
      aria: "Diagram of light rays bending around a black hole",
      camera: "camera",
      escapes: "escapes to the stars",
      arches: "arches over the top",
      hitsDisc: "hits the disc",
      captured: "captured: the shadow",
      photonSphere: "photon sphere",
    },
    curvedSpace: {
      aria: "A grid dented by a mass, with a moon orbiting in the dent",
      caption: "mass curves the grid · the moon follows the curve",
    },
    squeeze: {
      aria: (body: string): string => `${body} compared with its Schwarzschild radius`,
      realSize: (body: string): string => `${body}'s real size`,
      squeezed: "radius, squeezed on a log scale",
      toScale: "event horizon, to scale",
      // A length, from millimetres to billions of kilometres. format(value,
      // decimals) writes a number the way the page's language does (12,742 /
      // 12 742), so each language can also pick its own large units
      length: (km: number, format: (value: number, decimals: number) => string): string => {
        if (km >= 1e9) return `${format(km / 1e9, 1)} billion km`;
        if (km >= 1e6) return `${format(km / 1e6, 1)} million km`;
        if (km >= 100) return `${format(km, 0)} km`;
        if (km >= 1) return `${format(km, 2)} km`;
        if (km >= 1e-3) return `${format(km * 1e3, 1)} m`;
        return `${format(km * 1e6, 1)} mm`;
      },
      bodies: {
        earth: { name: "Earth", mass: "1 Earth", verdict: "The whole Earth squeezed to the size of a marble." },
        sun: { name: "Sun", mass: "1 Sun", verdict: "The Sun squeezed into a ball 6 km across, about the size of a small town." },
        sgr: { name: "Sagittarius A*", mass: "4.3 million Suns", compareLabel: "Mercury's orbit", verdict: "The black hole at the centre of the Milky Way would fit well inside Mercury's orbit." },
        m87: { name: "M87*", mass: "6.5 billion Suns", compareLabel: "Pluto's orbit", verdict: "The first black hole ever photographed: its horizon is three times wider than Pluto's orbit." },
      },
    },
    collapse: {
      aria: "A massive star collapses, explodes as a supernova and leaves a black hole",
      stages: ["Massive star", "Core collapse", "Supernova", "Black hole"],
    },
    river: {
      aria: "Space flowing into a black hole like a river, with light aimed outwards",
      photons: ["escapes, slowly", "stands still", "swept inwards"],
      horizon: "event horizon",
      flow: "← space flows in, ever faster",
      centre: "centre",
      farAway: "far away →",
    },
    photonSphere: {
      aria: "Light rays bending around a black hole; some are captured, one loops around it",
      // Followed by "2.6 rₛ"
      critical: "critical distance · 2.6",
      fromFar: "light from far away →",
      // Followed by "1.5 rₛ"
      sphere: "photon sphere · 1.5",
      horizon: "horizon",
      rays: "rays:",
      escape: "escape",
      loop: "loop",
      captured: "captured",
    },
    accretion: {
      aria: "An accretion disc: inner rings orbit faster than outer rings; gas inside the ISCO falls in",
      // Followed by "3 rₛ"
      isco: "ISCO · inner edge, 3",
      outer: "outer gas · slow, cooler",
      inner: "inner gas · fast, millions of degrees",
    },
    lensing: {
      aria: "A disc around a black hole, without and with gravitational lensing",
      withGravity: "With gravity",
      withoutGravity: "Without gravity",
      // One label over two lines
      farSide1: "far side of the disc,",
      farSide2: "bent over the top",
      below: "far side, seen from below",
    },
    spin: {
      aria: "Slice through a spinning black hole showing the horizon, ergosphere and inner disc edges",
      spin: "Spin a/M",
      spinAria: "Black hole spin",
      withSpin: "disc orbiting with the spin",
      againstSpin: "disc orbiting against it",
      isco: "ISCO",
      legend: "ergosphere (dashed) · horizon (black)",
      axis: "spin axis",
      horizon: "Horizon r₊",
      iscoWith: "ISCO, with the spin",
      iscoAgainst: "ISCO, against it",
      efficiency: "Mass turned into light",
      open: (spin: string): string => `Open the simulation at spin ${spin} →`,
    },
    tides: {
      aria: "An astronaut is stretched falling into a small black hole, but not into a supermassive one",
      small: "10 Suns",
      smallHorizon: "horizon 30 km",
      large: "Sagittarius A*",
      largeHorizon: "horizon 13 million km",
    },
    hawking: {
      aria: "Particle pairs near a black hole's horizon; one of each pair escapes as Hawking radiation",
      escapes: "escapes · Hawking radiation",
      fallsIn: "falls in · the hole loses mass",
    },
  },
};

export type GuideText = typeof EN_GUIDE_TEXT;
