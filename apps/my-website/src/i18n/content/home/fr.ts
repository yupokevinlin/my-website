import type { HomeTranslation } from "./en";

// French. Text only: everything else comes from the English (see en.ts).
export const HOME_FR: HomeTranslation = {
  profile: {
    title: "Ingénieur senior full stack et IA",
    pitch: (years) =>
      `Responsable technique chez Best Buy Canada, cofondateur et directeur technique (CTO) de ForteCare, une start-up d'IA en santé. Plus de ${years} ans à concevoir des logiciels, désormais centré sur l'IA au service de vrais produits et de vraies équipes.`,
    city: "Vancouver",
    region: "C.-B.",
  },
  seo: {
    title: "Kevin Lin | Ingénieur senior full stack et IA à Vancouver",
    description: "Kevin Lin, ingénieur senior full stack et IA à Vancouver (C.-B.), crée des produits React, Next.js et TypeScript. Découvrez ses projets, son parcours et son CV.",
    imageAlt: "Kevin Lin, ingénieur senior full stack et IA à Vancouver (C.-B.)",
  },
  about: {
    paragraphs: [
      "Je suis ingénieur senior full stack et IA à Vancouver. Chez Best Buy Canada, je suis responsable technique de l'équipe Mobile Activation : j'ai remporté le hackathon de l'entreprise avec l'une de ses premières expériences client enrichies par l'IA, mené le virage de mon équipe vers le développement piloté par l'IA et dirigé le développement du système de design de Best Buy Canada.",
      "Je suis aussi cofondateur et directeur technique (CTO) de ForteCare, où je conçois l'architecture d'une plateforme de santé qui intègre l'IA au parcours d'orientation vers les spécialistes, de l'admission du patient jusqu'à la note de consultation finalisée.",
      (years) => `Mon parcours vers le logiciel a commencé par des études de chimie à l'UBC, puis par un passage dans une société de négoce, où j'automatisais des feuilles de calcul. Après ${years} ans dans le développement logiciel, j'aime toujours autant trouver des façons plus efficaces et plus rapides de faire les choses, qu'il s'agisse de livrer des produits full stack ou d'intégrer l'IA aux produits comme à la façon de travailler de mon équipe.`,
    ],
    location: "Vancouver (C.-B.), Canada",
    languages: [
      {
        name: "Anglais",
        level: "Courant",
      },
      {
        name: "Mandarin",
        level: "Courant",
      },
      {
        name: "Français",
        level: "DELF A1",
      },
    ],
    education: {
      degree: "B. Sc. en chimie",
      school: "Université de la Colombie-Britannique",
      award: "Bourse d'admission du président (President's Entrance Scholarship)",
    },
    now: "Responsable technique chez Best Buy Canada, CTO de ForteCare",
  },
  experience: [
    {
      about: "Détaillant d'électronique grand public, en magasin et en ligne",
      roles: [
        {
          title: "Ingénieur logiciel senior",
          location: "Vancouver (C.-B.)",
          highlights: [
            "Victoire au hackathon de Best Buy grâce à l'une des premières expériences client de l'entreprise enrichies par l'IA, conçue pour simplifier l'achat de téléphones mobiles et améliorer la conversion en magasin et la satisfaction client.",
            "Contribution à la récupération et à la préservation de 18 M$ de financement de fournisseurs grâce à une application Android pour les opérations d'entrepôt.",
            "Pilotage du développement du système de design de Best Buy Canada : une bibliothèque de composants évolutive, avec des normes communes au design et au développement.",
            "À l'origine du virage de l'équipe Mobile Activation vers le développement piloté par l'IA : définition des normes d'outillage et des pratiques adoptées par l'équipe.",
          ],
          more: [
            "En tant que responsable technique de l'équipe Mobile Activation, mentorat de plusieurs ingénieurs back-end, devenus des ingénieurs full stack accomplis.",
            "Économie de centaines d'heures pour l'organisation grâce à une extension de navigateur, développée en une seule journée avec l'aide de l'IA, qui a automatisé la migration des liens JIRA lors du passage à JIRA Cloud.",
          ],
        },
        {
          title: "Ingénieur logiciel",
          location: "Vancouver (C.-B.)",
          highlights: [
            "Responsable du développement de l'Enterprise Returns Application, l'application de retours de toute la chaîne, livrée en quatre mois avec Nx, TypeScript, Next.js, NextAuth.js et React pour que le déploiement du nouveau système transactionnel de Best Buy respecte son calendrier.",
            "Plus de 3 heures par semaine économisées pour l'équipe Mobile Activation grâce à l'automatisation du build, des mises en production et de leur approbation.",
            "Finaliste du hackathon de Best Buy avec une vérification propulsée par un LLM, qui signalait quand le mauvais appareil mobile était scanné lors d'une vente.",
          ],
        },
      ],
    },
    {
      about: "Start-up d'IA en santé qui automatise le parcours d'orientation vers les spécialistes",
      roles: [
        {
          title: "Directeur technique (CTO) et cofondateur",
          location: "Los Angeles (à distance)",
          highlights: [
            "Coût de dépersonnalisation divisé par 100 et temps de traitement divisé par 10, tout en faisant passer la précision de 97,3 % à 99,5 %.",
            "Direction de l'intégration de l'IA dans toute la plateforme et développement de serveurs MCP et de compétences (skills) pour LLM, dédiés au domaine médical.",
            "Conception de l'architecture de la plateforme : applications Next.js et 15 microservices NestJS sur Azure Container Apps dans un monorepo Nx, intégrés aux dossiers médicaux électroniques Epic et Cerner via FHIR et HL7.",
          ],
        },
      ],
    },
    {
      about: "Logiciel de gestion de la main-d'œuvre pour certaines des plus grandes entreprises de services publics d'Amérique du Nord",
      roles: [
        {
          title: "Ingénieur logiciel",
          location: "Vancouver (C.-B.)",
          highlights: [
            "Conception de l'architecture de la nouvelle interface client avec React, Microsoft Fluent UI, TypeScript, Redux et Redux Saga.",
            "Forte accélération du développement de l'interface grâce à la migration de l'application client de jQuery vers des composants React modulaires.",
            "Des heures gagnées à chaque version grâce à la modernisation et à l'automatisation du build et des notes de version avec des pipelines Jenkins.",
          ],
          more: [
            "Acquisition de nouveaux clients grâce au remplacement de l'ancien composant cartographique par Esri.",
            "Simplification de la connexion à l'application client grâce à l'intégration de Microsoft Azure Active Directory.",
          ],
        },
        {
          title: "Ingénieur de soutien logiciel",
          location: "Vancouver (C.-B.)",
          highlights: [
            "Renforcement de la sécurité de l'application avec Nginx, qui lui a permis de réussir l'analyse HCL (IBM) AppScan.",
            "Amélioration de la qualité des versions grâce au remplacement du flux de travail centralisé par Gitflow.",
            "Création d'un générateur dynamique de rapports PDF avec Apache PDFBox.",
          ],
          more: [
            "Personnalisation des flux de travail JIRA avec l'extension ScriptRunner.",
          ],
        },
      ],
    },
  ],
  earlyExperience: [
    {
      about: "Négoce et logistique de matières premières industrielles",
      roles: [
        {
          title: "Développeur logiciel contractuel",
          location: "Vancouver (C.-B.)",
          highlights: [
            "Temps de traitement divisés par 3 grâce à la modernisation d'anciennes feuilles de calcul Excel enrichies en VBA.",
            "Création d'une application Electron, React et Express qui analysait et organisait les données de milliers de feuilles de calcul Excel.",
          ],
        },
        {
          title: "Développeur VBA contractuel",
          location: "Toronto (Ont.)",
          highlights: [
            "Création d'une feuille de calcul Excel de gestion de la relation client, enrichie en VBA.",
            "Conception d'une feuille de calcul Excel enrichie en VBA qui produisait des rapports graphiques.",
          ],
        },
        {
          title: "Adjoint spécial",
          location: "Taipei (Taïwan)",
          highlights: [
            "Temps consacré aux courriels de mise à jour des prix réduit de 80 % grâce à leur automatisation en VBA.",
            "Création de feuilles de calcul Excel enrichies de macros VBA qui transformaient les données de ventes en rapports graphiques.",
            "Formation du personnel de vente sur la chaîne d'approvisionnement pétrochimique, conception d'affiches pour des salons professionnels et de contenus marketing, et coordination des réunions trimestrielles entre les bureaux.",
          ],
        },
      ],
    },
  ],
  featuredProjects: [
    {
      name: "ForteCare",
      kicker: "Cofondateur et directeur technique (CTO)",
      description: "Automatise le parcours d'orientation vers les spécialistes, de l'admission à la note de consultation finalisée, grâce au triage et aux résumés par IA fondés sur des dossiers dépersonnalisés : les patients voient plus vite le bon spécialiste, et les médecins arrivent préparés.",
      image: {
        alt: "ForteCare : le bon spécialiste, au bon moment",
      },
      links: [
        {
          label: "Visiter fortecare.ai",
        },
      ],
    },
    {
      name: "Lancer de rayons relativiste",
      kicker: "WebGL 2 · Physique",
      description: "Simulations 4K en temps réel d'un trou noir, d'une chute à travers son horizon des événements, d'un trou de ver et d'un voyage à une vitesse proche de celle de la lumière, avec un guide illustré de la physique derrière chacune.",
      image: {
        alt: "Trou noir rendu par lancer de rayons, dont le disque d'accrétion lumineux se courbe au-dessus et au-dessous de son ombre",
      },
      links: [
        {
          label: "Essayer en direct",
        },
        {
          label: "Lire le guide",
        },
        {
          label: "Code",
        },
      ],
    },
  ],
  earlierProjects: [
    {
      name: "Mon site web (version 1)",
      description: "La première version du site : une scène saisonnière plein écran, avec neige, oiseaux et lucioles, dont est issue la version actuelle.",
    },
    {
      name: "COVID-19 Tracker",
      description: "Carte du monde interactive et graphiques pour suivre la pandémie.",
    },
    {
      name: "Write My MP",
      description: "Aide les Canadiens à trouver leur député et à communiquer avec lui.",
    },
    {
      name: "React Electron Template",
      description: "Un modèle de départ Electron, React et TypeScript, avec rechargement à chaud.",
    },
  ],
  skillGroups: [
    {
      name: "Leadership et architecture",
      rows: [
        {
          skills: [
            {
              name: "Leadership technique",
            },
            {
              name: "Conception de systèmes",
            },
            {
              name: "Microservices",
            },
            {
              name: "Systèmes distribués",
            },
            {
              name: "Création de produits de 0 à 1",
            },
            {
              name: "Mentorat",
            },
            {
              name: "Recrutement",
            },
            {
              name: "Conduite d'entrevues",
            },
            {
              name: "Normes d'ingénierie",
            },
            {
              name: "Revue de code",
            },
            {
              name: "Documents de conception",
            },
            {
              name: "Collaboration interfonctionnelle",
            },
            {
              name: "Gestion des parties prenantes",
            },
            {
              name: "Livraison agile",
            },
          ],
        },
      ],
    },
    {
      name: "Front-end",
      rows: [
        {
          skills: [
            {
              name: "TypeScript",
            },
            {
              name: "React",
            },
            {
              name: "Next.js",
            },
            {
              name: "App Router",
            },
            {
              name: "React Server Components",
            },
            {
              name: "React Native",
            },
            {
              name: "Electron",
            },
          ],
        },
        {
          label: "État et données",
          skills: [
            {
              name: "Redux Toolkit",
            },
            {
              name: "Zustand",
            },
            {
              name: "TanStack Query",
            },
          ],
        },
        {
          label: "Styles et interfaces",
          skills: [
            {
              name: "Tailwind CSS",
            },
            {
              name: "Sass",
            },
            {
              name: "Material UI",
            },
            {
              name: "Fluent UI",
            },
            {
              name: "Framer Motion",
            },
          ],
        },
        {
          label: "Savoir-faire",
          skills: [
            {
              name: "Systèmes de design",
            },
            {
              name: "Accessibilité (WCAG)",
            },
            {
              name: "Performance web",
            },
            {
              name: "Internationalisation",
            },
          ],
        },
      ],
    },
    {
      name: "Design",
      rows: [
        {
          skills: [
            {
              name: "Figma",
            },
            {
              name: "Storybook",
            },
          ],
        },
      ],
    },
    {
      name: "Back-end",
      rows: [
        {
          skills: [
            {
              name: "Node.js",
            },
            {
              name: "NestJS",
            },
            {
              name: "Express",
            },
            {
              name: "Python",
            },
            {
              name: "Java",
            },
            {
              name: "Spring Boot",
            },
            {
              name: "C#",
            },
            {
              name: "Conception d'API REST",
            },
            {
              name: "GraphQL",
            },
            {
              name: "Redis",
            },
            {
              name: "RabbitMQ",
            },
            {
              name: "Azure AD",
            },
            {
              name: "SSO",
            },
            {
              name: "Auth.js",
            },
          ],
        },
      ],
    },
    {
      name: "Données",
      rows: [
        {
          skills: [
            {
              name: "PostgreSQL",
            },
            {
              name: "MongoDB",
            },
            {
              name: "SQL Server",
            },
            {
              name: "Oracle DB",
            },
          ],
        },
      ],
    },
    {
      name: "Ingénierie de l'IA",
      rows: [
        {
          skills: [
            {
              name: "Intégration de LLM",
            },
            {
              name: "Claude API",
            },
            {
              name: "OpenAI API",
            },
            {
              name: "Gemini API",
            },
            {
              name: "DeepSeek API",
            },
            {
              name: "Agents d'IA",
            },
            {
              name: "MCP",
            },
            {
              name: "Compétences agentiques",
            },
            {
              name: "Évaluations (evals)",
            },
            {
              name: "Ollama",
            },
            {
              name: "Hugging Face",
            },
          ],
        },
        {
          label: "Développement assisté par l'IA",
          skills: [
            {
              name: "Claude Code",
            },
            {
              name: "GitHub Copilot",
            },
          ],
        },
        {
          label: "Apprentissage automatique",
          skills: [
            {
              name: "TensorFlow",
            },
            {
              name: "OpenCV",
            },
          ],
        },
      ],
    },
    {
      name: "Cloud et DevOps",
      rows: [
        {
          skills: [
            {
              name: "AWS",
            },
            {
              name: "Azure",
            },
            {
              name: "Google Cloud",
            },
            {
              name: "Firebase",
            },
            {
              name: "Docker",
            },
            {
              name: "Kubernetes",
            },
            {
              name: "OpenShift",
            },
            {
              name: "Terraform",
            },
            {
              name: "GitHub Actions",
            },
            {
              name: "Jenkins",
            },
            {
              name: "Nginx",
            },
          ],
        },
      ],
    },
    {
      name: "Assurance qualité",
      rows: [
        {
          skills: [
            {
              name: "Jest",
            },
            {
              name: "Vitest",
            },
            {
              name: "React Testing Library",
            },
            {
              name: "Playwright",
            },
            {
              name: "Cypress",
            },
            {
              name: "Tests de régression visuelle",
            },
          ],
        },
      ],
    },
    {
      name: "Outillage",
      rows: [
        {
          skills: [
            {
              name: "Nx",
            },
            {
              name: "Vite",
            },
            {
              name: "GitHub",
            },
          ],
        },
      ],
    },
  ],
};
