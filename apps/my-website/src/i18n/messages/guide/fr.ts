import type { GuideText } from "./en";

// French plural, which starts at 2: "1,5 million", "19,2 milliards", "0,5 an".
// n arrives already formatted ("12 742", "1,5", "0.37").
const plural = (n: string, one: string, many: string): string =>
  (parseFloat(n.replace(/\s/g, "").replace(",", ".")) < 2 ? one : many);

// The ray-tracing guide's text in French. Text only:
// everything else comes from the English (see en.ts).
export const GUIDE_TEXT_FR: GuideText = {
  heads: {
    overview: {
      name: "Lancer de rayons relativiste",
      description: "Comment fonctionnent les trous noirs et pourquoi la lumière se courbe : guide illustré et simulations 4K en temps réel, du trou noir en rotation au trou de ver.",
    },
    blackhole: {
      name: "Trou noir",
      description: "Un trou noir en rotation et son disque d'accrétion déformé par effet de lentille, rendus par lancer de rayons dans l'espace-temps courbe, en 4K et en temps réel.",
    },
    infall: {
      name: "Chute dans un trou noir",
      description: "Traversez l'horizon des événements d'un trou noir et voyez ce que vous verriez vraiment, chaque rayon de lumière étant tracé à travers l'espace-temps courbe.",
    },
    wormhole: {
      name: "Trou de ver",
      description: "Traversez le trou de ver d'Interstellar jusqu'à une autre galaxie, chaque rayon de lumière étant pré-intégré à travers la géométrie courbe de l'espace-temps.",
    },
    lightspeed: {
      name: "Presque à la vitesse de la lumière",
      description: "Foncez vers le centre de la galaxie presque à la vitesse de la lumière : aberration relativiste, décalage Doppler des couleurs et focalisation relativiste.",
    },
  },
  layout: {
    brand: "Lancer de rayons relativiste",
    menu: "Menu",
    nav: {
      home: "Accueil",
      overview: "Le guide",
      blackhole: "Trou noir",
      infall: "La chute",
      wormhole: "Trou de ver",
      lightspeed: "Vitesse lumière",
    },
  },
  overview: {
    dopplerAlt: "Un trou noir en couleurs réelles, plus lumineux et plus bleu à gauche",
    hero: {
      kicker: "Un guide illustré des trous noirs et de la relativité",
      titleBefore: "La lumière, courbée par l'",
      titleEmphasis: "espace-temps",
      titleAfter: "",
      text: "Comment fonctionne un trou noir, et à quoi ressemblerait-il vraiment ? Onze courtes leçons l'expliquent, avec des schémas animés. Ensuite, quatre simulations en temps réel vous emmènent autour d'un trou noir puis à l'intérieur, à travers un trou de ver et presque à la vitesse de la lumière. Chaque pixel est un rayon de lumière, tracé à travers l'espace-temps courbe.",
      startLearning: "Découvrir les leçons ↓",
      openBlackHole: "Explorer le trou noir →",
    },
    parts: [
      {
        label: "Première partie",
        title: "Comment fonctionnent les trous noirs",
        intro: "Un trou noir est l'objet le plus simple de l'univers, et le plus étrange : une masse, une rotation et une frontière dont rien ne peut ressortir. En onze courtes leçons, on passe de la chute des corps à l'éclat des trous noirs. Pas besoin de maths ; les équations sont là si vous voulez les voir.",
      },
      {
        label: "Deuxième partie",
        title: "Suivre la lumière",
        intro: "Pour dessiner un trou noir, il faut savoir d'où vient chaque rayon de lumière qui atteint votre œil. Dans un espace plat, c'est facile, car la lumière se propage en ligne droite. Près d'un trou noir, elle suit les trajectoires courbes des leçons ci-dessus : le dessiner devient alors un calcul.",
      },
      {
        label: "Troisième partie",
        title: "Les simulations",
        intro: "Quatre expériences à explorer en vol libre. Chacune tourne en direct dans votre navigateur, jusqu'en 4K ; chaque réglage peut être modifié, et chaque vue partagée sous forme de lien.",
      },
    ],
    tracing: {
      title: "La lumière à rebours",
      paragraphs: [
        "Le lancer de rayons suit la lumière à l'envers. Depuis la caméra, un rayon par pixel est lancé dans la scène et avance pas à pas à travers la géométrie courbe. S'il franchit l'horizon, le pixel est noir. S'il traverse le disque, il prend l'éclat du disque, décalé par l'effet Doppler et par la gravité. S'il s'échappe, il prend la couleur du ciel dans la direction où il finit par s'en aller.",
        "Près du Soleil, la déviation est infime : 1,75 seconde d'arc pour la lumière d'une étoile qui frôle son bord, soit environ un demi-millième de degré. Près d'un trou noir, elle façonne tout ce que vous voyez.",
      ],
      caption: "Les rayons issus de la caméra, vus de côté. Visez près du trou et la lumière est capturée : elle forme l'ombre. Visez un peu plus large et elle est courbée par-dessus, révélant l'arrière du disque.",
    },
    realTime: {
      title: "Atteindre le temps réel",
      text: "Suivre la lumière à travers l'espace-temps courbe coûte cher en calcul ; le travail est donc partagé : la partie difficile est faite une seule fois, et tout ce qui bouge ne coûte presque rien. C'est ce qui permet à ces simulations de tourner en 4K dans un simple onglet de navigateur.",
      steps: [
        {
          title: "Tracer",
          text: "Pour chacun des 8,3 millions de pixels d'une image 4K, un rayon lumineux est intégré à rebours à travers l'espace-temps courbe avec un solveur de Runge–Kutta d'ordre 4, jusqu'à ce qu'il tombe dans le trou, traverse le disque ou s'échappe. Sur un GPU récent, l'image entière prend environ une seconde.",
        },
        {
          title: "Stocker",
          text: "Le résultat est stocké sous forme de carte des rayons : d'où vient la lumière de chaque pixel. Le trou de ver et la chute dans le trou noir vont plus loin : grâce à leur symétrie, tous les rayons possibles tiennent dans une seule table, calculée une fois pour toutes.",
        },
        {
          title: "Colorer",
          text: "Chaque image se contente ensuite de consulter des tables : la position du disque pendant sa rotation, son décalage Doppler et gravitationnel, et la couleur d'un corps noir à cette température, tirée de tables spectrales précalculées.",
        },
        {
          title: "Exposer",
          text: "La lumière est conservée en grande plage dynamique (HDR), des étoiles les plus pâles au disque intérieur éblouissant, puis dotée d'un halo et ramenée à l'écran par mappage tonal, comme sur une pellicule. Les étoiles proviennent de la carte HDR 16K de la Voie lactée publiée par la NASA.",
        },
      ],
    },
    chapter: {
      kicker: (numeral, field) => `Simulation ${numeral} · ${field}`,
      open: "Ouvrir la simulation",
      seeing: "Ce que vous voyez",
      physics: "La physique",
      tryThis: "À essayer",
    },
    glossary: {
      kicker: "Glossaire",
      title: "Petit lexique",
    },
    credits: "Sources et crédits",
    requirements: {
      title: "Configuration requise",
      text: "Un navigateur de bureau compatible avec WebGL 2 et les cibles de rendu en virgule flottante : une version récente de Chrome, Edge, Firefox ou Safari. En 4K, le trou noir utilise environ 400 Mo de mémoire GPU ; sur les GPU plus modestes, réduisez la résolution du rendu dans la section Image.",
    },
    back: "← Retour à kevinyupolin.dev",
  },
  lesson: {
    number: (n) => `Leçon ${n}`,
    of: (total) => `sur ${total}`,
    keyIdea: "Idée clé",
    tryIt: "Essayez",
  },
  learn: {
    tryThis: "À essayer",
    seeing: "Ce que vous voyez",
    physics: "La physique",
    newToBlackHoles: "Vous découvrez les trous noirs ?",
    keys: "Touches",
    keyDrag: "Glisser · regarder ou orbiter",
    keyWheel: "Molette ou pincement · zoomer ou se déplacer",
    keySpace: "Espace · pause",
    keyFullscreen: "F · plein écran",
    keySnapshot: "P · capture",
    keyHide: "H · masquer l'interface",
    moreBefore: "Plus de détails dans le ",
    moreLink: "guide illustré",
    moreAfter: ".",
  },
  controls: {
    retraces: "Modifier ce réglage recalcule les trajets de la lumière",
    reset: "Réinitialiser",
    copied: "Copié ✓",
    shareLink: "Partager le lien",
    retraceNote: "recalcule les trajets de la lumière : un aperçu immédiat, puis la pleine résolution.",
    groups: {
      "Black hole": "Trou noir",
      Camera: "Caméra",
      Disc: "Disque",
      Gas: "Gaz",
      Sky: "Ciel",
      Quality: "Qualité",
      Fall: "Chute",
      Light: "Lumière",
      Wormhole: "Trou de ver",
      Skies: "Ciels",
      Ship: "Vaisseau",
      Relativity: "Relativité",
      Stars: "Étoiles",
      Output: "Image",
    },
  },
  simulation: {
    play: "Lecture (Espace)",
    pause: "Pause (Espace)",
    fullscreen: "Plein écran (F)",
    snapshot: "Enregistrer un PNG à la résolution du rendu (P)",
    learn: "Comprendre",
    controls: "Réglages",
    fps: (fps) => `${fps} i/s`,
    starting: "démarrage…",
    paused: "en pause",
    noWebGl: "Cette simulation nécessite WebGL 2 et des cibles de rendu en virgule flottante",
    noWebGlHint: "Essayez une version récente de Chrome, Edge, Firefox ou Safari, avec l'accélération matérielle activée.",
    lost: "La vue 3D s'est arrêtée",
    lostMessage: "Le navigateur a arrêté la vue 3D, très probablement faute de mémoire graphique.",
    lostHint: "Rechargez la page pour réessayer. Réduire la résolution du rendu ou le détail de la carte du ciel, dans la section Image, aide aussi.",
    skyLoading: (size) => `Chargement de la carte du ciel ${size}²…`,
    skyProgress: (size, percent) => `Chargement de la carte du ciel ${size}²… ${percent}\u202f%`,
    skyFailed: (size) => `Échec du chargement de la carte du ciel (${size})`,
  },
  readouts: {
    blackhole: {
      horizon: "Horizon des événements r₊",
      isco: (prograde) => `ISCO (${prograde ? "prograde" : "rétrograde"})`,
      photonOrbit: "Orbite des photons",
      horizonSpin: "Rotation de l'horizon Ω_H",
      cameraClock: "Rythme de l'horloge de la caméra",
      cameraClockValue: (rate) => `${rate} × horloge lointaine`,
      tracing: (percent) => `Tracé des géodésiques ${percent}\u202f%`,
      traced: "Carte des rayons terminée",
    },
    infall: {
      radius: "Rayon",
      radiusValue: (m, horizons) => `${m} M · ${horizons} × l'horizon`,
      where: "Position",
      outside: "À l'extérieur de l'horizon",
      inside: "À l'intérieur de l'horizon",
      thrust: "Poussée pour rester stationnaire",
      clock: "Rythme de votre horloge",
      clockValue: (rate) => `${rate} × horloge lointaine`,
      timeLeft: "Votre temps jusqu'à la singularité",
      tidal: "Étirement de marée sur votre corps",
      days: (n) => `${n} jours`,
      integrating: (percent) => `Intégration des trajets lumineux ${percent}\u202f%`,
      ready: "Trajets lumineux prêts",
    },
    wormhole: {
      cameraL: "Caméra l",
      radius: "Rayon circonférentiel r(l)",
      universe: "Univers",
      insideThroat: "Dans la gorge",
      home: "Le nôtre (côté Voie lactée)",
      farSide: "L'autre côté",
      lensingWidth: "Largeur de lentille W",
      throatLength: "Longueur de la gorge 2a",
      integrating: (percent) => `Intégration de la table des géodésiques ${percent}\u202f%`,
      ready: "Table des géodésiques prête",
    },
    lightspeed: {
      speed: "Vitesse",
      doppler: "Doppler avant / arrière",
      shipTime: "Temps (propre) du vaisseau",
      earthTime: "Temps de la galaxie (Terre)",
      years: (n) => `${n} ${plural(n, "an", "ans")}`,
      distance: "Distance parcourue",
      lightYears: (n) => `${n} al`,
      toCentre: "Jusqu'au centre galactique",
      passed: "Dépassé !",
    },
  },
  diagrams: {
    ray: {
      aria: "Schéma de rayons lumineux déviés autour d'un trou noir",
      camera: "caméra",
      escapes: "s'échappe vers les étoiles",
      arches: "passe par-dessus",
      hitsDisc: "touche le disque",
      captured: "capturé : l'ombre",
      photonSphere: "sphère de photons",
    },
    curvedSpace: {
      aria: "Une grille creusée par une masse, avec une lune en orbite dans le creux",
      caption: "la masse courbe la grille · la lune suit la courbe",
    },
    squeeze: {
      aria: (body) => `${body} face à son rayon de Schwarzschild`,
      realSize: (body) => `${body}\u00a0: taille réelle`,
      squeezed: "rayon, comprimé sur une échelle log",
      toScale: "horizon des événements, à l'échelle",
      length: (km, format) => {
        if (km >= 1e9) { const n = format(km / 1e9, 1); return `${n} ${plural(n, "milliard", "milliards")} de km`; }
        if (km >= 1e6) { const n = format(km / 1e6, 1); return `${n} ${plural(n, "million", "millions")} de km`; }
        if (km >= 100) return `${format(km, 0)} km`;
        if (km >= 1) return `${format(km, 2)} km`;
        if (km >= 1e-3) return `${format(km * 1e3, 1)} m`;
        return `${format(km * 1e6, 1)} mm`;
      },
      bodies: {
        earth: {
          name: "Terre",
          mass: "1 masse terrestre",
          verdict: "La Terre entière comprimée à la taille d'une bille.",
        },
        sun: {
          name: "Soleil",
          mass: "1 masse solaire",
          verdict: "Le Soleil comprimé en une boule de 6 km de diamètre, à peu près la taille d'une petite ville.",
        },
        sgr: {
          name: "Sagittarius A*",
          mass: "4,3 millions de masses solaires",
          compareLabel: "orbite de Mercure",
          verdict: "Le trou noir au centre de la Voie lactée tiendrait largement à l'intérieur de l'orbite de Mercure.",
        },
        m87: {
          name: "M87*",
          mass: "6,5 milliards de masses solaires",
          compareLabel: "orbite de Pluton",
          verdict: "Le premier trou noir jamais photographié : son horizon est trois fois plus large que l'orbite de Pluton.",
        },
      },
    },
    collapse: {
      aria: "Une étoile massive s'effondre, explose en supernova et laisse un trou noir",
      stages: [
        "Étoile massive",
        "Effondrement",
        "Supernova",
        "Trou noir",
      ],
    },
    river: {
      aria: "L'espace s'écoule vers un trou noir comme une rivière, et de la lumière est émise vers l'extérieur",
      photons: [
        "s'échappe, lentement",
        "immobile",
        "emporté",
      ],
      horizon: "horizon des événements",
      flow: "← l'espace afflue, toujours plus vite",
      centre: "centre",
      farAway: "au loin →",
    },
    photonSphere: {
      aria: "Rayons lumineux déviés autour d'un trou noir ; certains sont capturés, l'un d'eux en fait le tour",
      critical: "distance critique · 2,6",
      fromFar: "lumière venue de loin →",
      sphere: "sphère de photons · 1,5",
      horizon: "horizon",
      rays: "rayons :",
      escape: "échappés",
      loop: "en boucle",
      captured: "capturés",
    },
    accretion: {
      aria: "Un disque d'accrétion : les anneaux intérieurs tournent plus vite que les anneaux extérieurs ; le gaz situé en deçà de l'ISCO tombe dans le trou",
      isco: "ISCO · bord interne à 3",
      outer: "gaz externe · lent, plus froid",
      inner: "gaz interne · rapide, des millions de degrés",
    },
    lensing: {
      aria: "Un disque autour d'un trou noir, sans puis avec la lentille gravitationnelle",
      withGravity: "Avec gravité",
      withoutGravity: "Sans gravité",
      farSide1: "l'arrière du disque,",
      farSide2: "rabattu par-dessus",
      below: "l'arrière, vu par-dessous",
    },
    spin: {
      aria: "Coupe d'un trou noir en rotation montrant l'horizon, l'ergosphère et les bords internes du disque",
      spin: "Spin a/M",
      spinAria: "Spin du trou noir",
      withSpin: "disque dans le sens du spin",
      againstSpin: "disque à contre-sens",
      isco: "ISCO",
      legend: "ergosphère (pointillés) · horizon (noir)",
      axis: "axe de rotation",
      horizon: "Horizon r₊",
      iscoWith: "ISCO, dans le sens du spin",
      iscoAgainst: "ISCO, à contre-sens",
      efficiency: "Masse convertie en lumière",
      open: (spin) => `Ouvrir la simulation avec un spin de ${spin} →`,
    },
    tides: {
      aria: "Un astronaute est étiré en tombant dans un petit trou noir, mais pas dans un trou noir supermassif",
      small: "10 masses solaires",
      smallHorizon: "horizon de 30 km",
      large: "Sagittarius A*",
      largeHorizon: "horizon de 13 millions de km",
    },
    hawking: {
      aria: "Paires de particules près de l'horizon d'un trou noir ; l'une de chaque paire s'échappe sous forme de rayonnement de Hawking",
      escapes: "s'échappe · rayonnement de Hawking",
      fallsIn: "tombe · le trou perd de la masse",
    },
  },
};
