// The home page's Projects section: two featured projects, then the earlier
// ones in a compact row, newest first. Screenshots are WebP, 1200 px wide or
// less. Links to other sites open in a new tab; site paths (/v1) don't.

export interface ProjectLink {
  label: string;
  href: string;
}

export interface FeaturedProject {
  name: string;
  // The small line above the name
  kicker: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  tags: string[];
  links: ProjectLink[];
}

export interface EarlierProject {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  year: number;
  href: string;
  archived?: boolean;
}

export const featuredProjects: FeaturedProject[] = [
  {
    name: "ForteCare",
    kicker: "Co-founder & CTO",
    description: "Automates the specialist referral journey, from intake to a finished visit note, with AI triage and summaries built on de-identified records, so patients reach the right specialist faster and physicians walk in prepared.",
    image: { src: "/resources/images/projects/fortecare.webp", alt: "ForteCare: the right specialist, at the right time", width: 1200, height: 630 },
    tags: ["Next.js", "NestJS", "Azure", "Claude API", "FHIR"],
    links: [{ label: "Visit fortecare.ai", href: "https://fortecare.ai/" }],
  },
  {
    name: "Relativistic Ray Tracing",
    kicker: "WebGL 2 · Physics",
    description: "Real-time 4K simulations of a black hole, a fall through its event horizon, a wormhole and near-light-speed travel, with an illustrated guide to the physics behind each one.",
    image: { src: "/resources/images/projects/ray-tracing.webp", alt: "Ray-traced black hole with its glowing accretion disc bent over and under the shadow", width: 1200, height: 675 },
    tags: ["React", "TypeScript", "WebGL 2", "GLSL"],
    links: [
      { label: "Try it live", href: "/ray-tracing/blackhole" },
      { label: "Read the guide", href: "/ray-tracing" },
      { label: "Code", href: "https://github.com/yupokevinlin/my-website" },
    ],
  },
];

export const earlierProjects: EarlierProject[] = [
  {
    name: "This site, version 1",
    description: "The site's first design: a full-screen seasonal scene with snow, birds and fireflies, which this one grew from.",
    icon: "/resources/icons/winterIcon.svg",
    tags: ["React", "TypeScript", "Material UI", "Redux"],
    year: 2021,
    href: "/v1",
  },
  {
    name: "COVID-19 Tracker",
    description: "Interactive world map and charts for tracking the pandemic.",
    icon: "/resources/images/projects/covid19TrackerAppIcon.svg",
    tags: ["React", "Esri", "D3", "Express"],
    year: 2020,
    href: "https://github.com/yupokevinlin/covid-19-interactive-world-map",
    archived: true,
  },
  {
    name: "Write My MP",
    description: "Helps Canadians find and contact their Member of Parliament.",
    icon: "/resources/images/projects/writeMyMPIcon.svg",
    tags: ["React", "Esri", "Express", "Cheerio"],
    year: 2020,
    href: "https://github.com/yupokevinlin/write-my-mp",
    archived: true,
  },
  {
    name: "React Electron Template",
    description: "A hot-reloading Electron, React and TypeScript starter.",
    icon: "/resources/images/projects/electronTemplate.svg",
    tags: ["Electron", "React", "Webpack"],
    year: 2020,
    href: "https://github.com/yupokevinlin/react-electron-typescript-template",
  },
];
