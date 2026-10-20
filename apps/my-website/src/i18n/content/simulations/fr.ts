import type { SimulationsTranslation } from "./en";

// French. Text only: everything else comes from the English (see en.ts).
export const SIMULATIONS_FR: SimulationsTranslation = {
  blackhole: {
    controlsHelp: "Faire glisser : orbite (horizontal = azimut, vertical = inclinaison) · Molette ou pincement : distance",
    params: {
      spin: {
        label: "Spin a/M (rotation)",
        hint: "0 = Schwarzschild (sans rotation), 0,998 = limite de Thorne",
      },
      discDir: {
        label: "Orbite du disque",
        options: {
          pro: "Prograde (avec la rotation)",
          retro: "Rétrograde (contre la rotation)",
        },
      },
      distance: {
        label: "Distance",
        unit: "M",
      },
      inclination: {
        label: "Inclinaison",
        hint: "Hauteur au-dessus du plan du disque",
        unit: "°",
      },
      fov: {
        label: "Champ de vision",
        unit: "°",
      },
      azimuth: {
        label: "Azimut",
        hint: "Ne coûte rien grâce à la symétrie axiale : aucun nouveau tracé des rayons",
        unit: "°",
      },
      orbitSpeed: {
        label: "Orbite auto",
        unit: "°/s",
      },
      showDisc: {
        label: "Disque d'accrétion",
      },
      autoInner: {
        label: "Bord intérieur à l'ISCO",
      },
      rin: {
        label: "Rayon intérieur",
        unit: "M",
      },
      rout: {
        label: "Rayon extérieur",
        unit: "M",
      },
      discSpeed: {
        label: "Vitesse du disque",
        hint: "En unités de temps gravitationnel par seconde ; les orbites intérieures vont plus vite (képlériennes)",
        unit: "M/s",
      },
      temperature: {
        label: "Température maximale",
        unit: "K",
      },
      doppler: {
        label: "Décalage Doppler et gravitationnel",
        hint: "1 = intensité physique, 0 = pas d'effet Doppler (le choix artistique d'Interstellar)",
      },
      colorMode: {
        label: "Modèle de couleur",
        hint: "Physique : le côté qui s'éloigne rougit et peut virer au noir à forte rotation. Augmentez la température pour qu'il reste visible.",
        options: {
          cinematic: "Cinéma (teinte fixe, focalisation)",
          physical: "Corps noir (couleur Doppler complète)",
        },
      },
      discGain: {
        label: "Luminosité du disque",
      },
      opacity: {
        label: "Opacité du disque",
      },
      clouds: {
        label: "Structure du gaz",
        hint: "0 = simples traînées fines, 1 = couloirs concentriques le long desquels glissent des traînées de gaz",
      },
      clumpSize: {
        label: "Taille des traînées",
        hint: "Largeur des couloirs et des traînées",
      },
      coverage: {
        label: "Densité des traînées",
        hint: "Quantité de traînées de gaz ; les valeurs faibles laissent des trous à travers lesquels on voit",
      },
      concentration: {
        label: "Concentration centrale",
        hint: "À quel point le gaz devient plus dense et plus brillant vers le trou noir ; le gaz extérieur se réduit à de pâles filaments",
      },
      skyMode: {
        label: "Arrière-plan",
        options: {
          milkyway: "Voie lactée (NASA)",
          grid: "Grille de déviation",
          none: "Aucun",
        },
      },
      skyGain: {
        label: "Luminosité du ciel",
      },
      skyYaw: {
        label: "Rotation du ciel",
        unit: "°",
      },
      skyTilt: {
        label: "Inclinaison du ciel",
        hint: "Angle entre la Voie lactée et le plan du disque",
        unit: "°",
      },
      quality: {
        label: "Précision d'intégration",
        options: {
          draft: "Brouillon (rapide)",
          standard: "Standard",
          high: "Élevée (lente)",
        },
      },
    },
  },
  infall: {
    controlsHelp: "Faire glisser : regarder autour · Molette ou pincement : s'approcher ou s'éloigner (arrête la chute)",
    params: {
      observer: {
        label: "Observateur",
        hint: "Un observateur en vol stationnaire doit allumer ses fusées pour rester sur place ; rien ne peut rester immobile sur l'horizon ou à l'intérieur.",
        options: {
          fall: "En chute libre",
          hover: "En vol stationnaire (fusées)",
        },
      },
      motion: {
        label: "Mouvement",
        options: {
          fall: "Chute (en boucle)",
          manual: "Manuel",
        },
      },
      radius: {
        label: "Rayon (manuel) / rayon de départ",
        hint: "L'horizon est à 2 M, la sphère de photons à 3 M",
        unit: "M",
      },
      pacing: {
        label: "Rythme",
        hint: "Temps réel : le dernier tronçon, de l'horizon à la singularité, ne dure que 4/3 M de votre propre temps.",
        options: {
          even: "Ralentir près du trou",
          proper: "Temps réel (horloge en chute)",
        },
      },
      fallSpeed: {
        label: "Vitesse de chute",
        unit: "×",
      },
      mass: {
        label: "Masse du trou noir",
        hint: "Ne change que les durées et les forces réelles affichées ; la vue est la même quelle que soit la masse.",
        options: {
          stellar: "10 Soleils (stellaire)",
          sgra: "4,3 millions de Soleils (Sagittarius A*)",
          gargantua: "100 millions de Soleils (Gargantua)",
          m87: "6,5 milliards de Soleils (M87*)",
        },
      },
      interior: {
        label: "Intérieur de l'horizon",
        hint: "Le trou noir idéalisé et éternel est relié à un second univers, que vous apercevez sous vos pieds une fois à l'intérieur.",
        options: {
          real: "Trou noir réel (né d'une étoile effondrée)",
          eternal: "Trou noir éternel (voir l'autre univers)",
        },
      },
      autoLook: {
        label: "Garder le bord en vue",
        hint: "Se tourner du trou vers le ciel à mesure que la région noire s'agrandit",
      },
      fov: {
        label: "Champ de vision",
        unit: "°",
      },
      pitch: {
        label: "Regard haut / bas",
        hint: "S'ajoute à l'angle automatique ; 0° = droit vers le trou si l'angle automatique est désactivé",
        unit: "°",
      },
      azimuth: {
        label: "Tourner sur soi",
        unit: "°",
      },
      dopplerColor: {
        label: "Décalage Doppler des couleurs",
      },
      beaming: {
        label: "Variation de luminosité",
        hint: "La lumière décalée vers le bleu est plus brillante, celle décalée vers le rouge plus faible",
      },
      autoExposure: {
        label: "Adapter l'exposition en vol stationnaire",
      },
      skyMode: {
        label: "Arrière-plan",
        options: {
          milkyway: "Voie lactée (NASA)",
          grid: "Grille de déviation",
        },
      },
      skyGain: {
        label: "Luminosité du ciel",
      },
      otherGain: {
        label: "Luminosité de l'autre univers",
      },
      skyYaw: {
        label: "Rotation du ciel",
        unit: "°",
      },
      skyTilt: {
        label: "Inclinaison du ciel",
        unit: "°",
      },
    },
  },
  wormhole: {
    controlsHelp: "Faire glisser : regarder autour · Molette ou pincement : avancer dans le trou de ver (mode manuel)",
    params: {
      throat: {
        label: "Longueur de la gorge a",
        hint: "Demi-longueur de l'intérieur cylindrique, en unités du rayon de la gorge ρ",
        unit: "ρ",
      },
      lensing: {
        label: "Paramètre de lentille M",
        hint: "M plus grand = embouchure plus douce et effet de lentille gravitationnelle plus étendu",
        unit: "ρ",
      },
      travel: {
        label: "Mouvement de la caméra",
        options: {
          manual: "Manuel",
          oscillate: "Va-et-vient",
          fly: "Traversée (en boucle)",
        },
      },
      position: {
        label: "Distance l (manuelle) / amplitude",
        unit: "ρ",
      },
      travelSpeed: {
        label: "Vitesse de déplacement",
        unit: "ρ/s",
      },
      autoTurn: {
        label: "Orientation automatique",
        hint: "Se tourner vers la paroi de la gorge à l'intérieur du trou de ver, puis se retourner pour la regarder depuis l'autre côté",
      },
      turnStart: {
        label: "Distance de rotation",
        hint: "Distance à l'embouchure à partir de laquelle la caméra commence à tourner ; elle fait face à la paroi de la gorge en y entrant. Le trou de ver reste toujours en vue.",
        unit: "ρ",
      },
      fov: {
        label: "Champ de vision",
        unit: "°",
      },
      yaw: {
        label: "Lacet du regard",
        unit: "°",
      },
      pitch: {
        label: "Tangage du regard",
        unit: "°",
      },
      skyA: {
        label: "Ciel d'origine",
        options: {
          milkyway: "Voie lactée (NASA)",
          alien: "Galaxie à nébuleuses",
          grid: "Grille de déviation",
        },
      },
      skyB: {
        label: "Ciel de l'autre côté",
        options: {
          alien: "Galaxie à nébuleuses",
          milkyway: "Voie lactée (NASA)",
          grid: "Grille de déviation",
        },
      },
      gainA: {
        label: "Luminosité du ciel d'origine",
      },
      gainB: {
        label: "Luminosité de l'autre ciel",
      },
      skyYawA: {
        label: "Rotation du ciel d'origine",
        unit: "°",
      },
      skyYawB: {
        label: "Rotation de l'autre ciel",
        unit: "°",
      },
    },
  },
  lightspeed: {
    controlsHelp: "Faire glisser : regarder autour · Molette ou pincement : changer de vitesse",
    params: {
      speed: {
        label: "Vitesse",
        hint: "Rapidité η : β = tanh η, γ = cosh η. Des pas égaux correspondent à des poussées égales du moteur.",
      },
      drive: {
        label: "Propulsion",
        options: {
          cruise: "Croisière à la vitesse choisie",
          accel: "Accélérer à 1 g jusqu'à la vitesse choisie",
        },
      },
      yearsPerSecond: {
        label: "Temps de bord par seconde",
        unit: "an/s",
      },
      fov: {
        label: "Champ de vision",
        unit: "°",
      },
      yaw: {
        label: "Lacet du regard",
        hint: "0° = droit devant, 180° = regard vers l'arrière",
        unit: "°",
      },
      pitch: {
        label: "Tangage du regard",
        unit: "°",
      },
      aberration: {
        label: "Aberration",
      },
      dopplerColor: {
        label: "Décalage Doppler des couleurs",
      },
      beaming: {
        label: "Focalisation relativiste",
        hint: "Effet projecteur : la luminosité suit le facteur Doppler",
      },
      autoExposure: {
        label: "Adapter l'exposition à la vitesse",
        hint: "Comme un œil qui s'habitue à la vue de plus en plus lumineuse devant",
      },
      cmb: {
        label: "Fond diffus cosmologique",
        hint: "Devient visible devant vous aux vitesses extrêmes (D > ~300)",
      },
      cmbLog: {
        label: "Luminosité du fond diffus (log₁₀)",
      },
      nearStars: {
        label: "Étoiles proches en 3D",
      },
      density: {
        label: "Densité d'étoiles",
      },
      cellSize: {
        label: "Espacement des étoiles",
        unit: "al",
      },
      starGain: {
        label: "Luminosité des étoiles proches",
      },
      maxCells: {
        label: "Distance d'affichage",
        unit: "cellules",
      },
      skyMode: {
        label: "Arrière-plan",
        options: {
          milkyway: "Voie lactée (NASA)",
          grid: "Grille d'aberration",
          none: "Aucun",
        },
      },
      skyGain: {
        label: "Luminosité du ciel",
      },
    },
  },
  output: {
    params: {
      resolution: {
        label: "Résolution du rendu",
        hint: "Taille du rendu interne. Les captures sont enregistrées à cette résolution. Sur téléphone et tablette, le rendu ne dépasse pas la taille de l'écran, soit environ 1080p au plus.",
        options: {
          "2160p": "4K UHD (3840×2160)",
          "1440p": "QHD (2560×1440)",
          "1080p": "Full HD (1920×1080)",
          "720p": "HD (1280×720)",
          window: "Taille de la fenêtre",
        },
      },
      skyTier: {
        label: "Détail de la carte du ciel",
        hint: "NASA SVS Deep Star Maps 2020, prétraitées en cartes cubiques HDR. Sur téléphone et tablette, le détail est limité à Élevé.",
        options: {
          "1024": "Moyen : faces de 1024² (2 Mo)",
          "2048": "Élevé : faces de 2048² (11 Mo)",
          "4096": "Ultra : faces de 4096² (45 Mo)",
        },
      },
      exposure: {
        label: "Exposition",
        unit: "EV",
      },
      bloom: {
        label: "Halo lumineux",
      },
      bloomRadius: {
        label: "Rayon du halo",
      },
      tonemap: {
        label: "Mappage tonal",
        options: {
          "0": "ACES filmique",
          "1": "Reinhard",
          "2": "Linéaire (écrêtage)",
        },
      },
      timeScale: {
        label: "Vitesse du temps",
        unit: "×",
      },
    },
  },
};
