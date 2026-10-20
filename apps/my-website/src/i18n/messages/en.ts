// The site's interface text in English: buttons, labels, headings, accessible
// names, date and duration formats. English is the source of truth: add a
// string here first, and the compiler then asks for it in every other
// language (fr.ts, zhCn.ts, zhTw.ts, ja.ts are typed `Messages`).
//
// This file holds the text every page uses (common) and the home page's;
// the ray-tracing guide's is in guide/, so each page loads only its own.
// Content (Kevin's experience, projects, the guide's lessons) is translated
// separately, as overlays: see src/i18n/content/.

export const EN_MESSAGES = {
  common: {
    // The language switcher
    language: "Language",
    changeLanguage: "Change language",
    skipToContent: "Skip to content",
    javascriptRequired: "You need to enable JavaScript to run this app.",
  },
  home: {
    seasons: { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" },
    // The season switch in the top bar
    seasonGroup: "Season",
    seasonTheme: (season: string): string => `${season} theme`,
    // The badge in the hero's corner
    seasonInCity: (season: string): string => `${season} in Vancouver`,
    nav: {
      sections: "Sections",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
      resume: "Resume",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      // The eyebrow line: "Senior Full-Stack + AI Engineer · Vancouver, BC"
      place: (city: string, region: string): string => `${city}, ${region}`,
      seeMyWork: "See my work",
      resume: "Resume",
      getInTouch: "Get in touch",
      scrollToAbout: "Scroll to About",
    },
    about: {
      label: "About",
      title: "A bit about me",
      basedIn: "Based in",
      languages: "Languages",
      education: "Education",
      // "BSc Chemistry, The University of British Columbia"
      degreeAt: (degree: string, school: string): string => `${degree}, ${school}`,
      now: "Now",
    },
    experience: {
      label: "Experience",
      title: "Where I've worked",
      present: "Present",
      showMore: (count: number): string => `Show ${count} more`,
      showLess: "Show less",
      earlier: "Earlier experience",
      stack: (company: string): string => `${company} stack`,
      // LinkedIn style: "2 yrs 7 mos", "11 mos", "3 yrs"
      duration: (years: number, months: number): string => {
        const y = years ? `${years} yr${years === 1 ? "" : "s"}` : "";
        const m = months || !years ? `${months} mo${months === 1 ? "" : "s"}` : "";
        return [y, m].filter(Boolean).join(" ");
      },
    },
    projects: {
      label: "Projects",
      title: "Things I've built",
      lead: "A healthcare platform I co-founded and a physics simulation I built for fun, then some earlier work.",
      earlier: "Earlier projects",
      archived: "Archived",
      tools: (project: string): string => `${project} tools`,
    },
    skills: {
      label: "Skills",
      title: "What I work with",
    },
    contact: {
      label: "Contact",
      title: "Get in touch",
      linkedIn: "LinkedIn",
      gitHub: "GitHub",
      resume: "Resume",
      resumeDetail: "Click here to download",
    },
    footer: {
      previousVersion: "Previous version",
      seasonsNote: "The illustration follows Vancouver's seasons.",
    },
  },
  // The ray-tracing guide: its pages' titles, the overview's prose, labels,
  // diagrams and the simulations' readouts. The lessons, chapters, glossary
  // and credits are content overlays (src/i18n/content/rayTracing/), and the
  // simulations' settings another (src/i18n/content/simulations/).
};

export type Messages = typeof EN_MESSAGES;
