import type { Messages } from "./en";

// French. Text only: everything else comes from the English (see en.ts).
export const MESSAGES_FR: Messages = {
  common: {
    language: "Langue",
    changeLanguage: "Changer de langue",
    skipToContent: "Aller au contenu",
    javascriptRequired: "Vous devez activer JavaScript pour utiliser cette application.",
  },
  home: {
    seasons: {
      spring: "Printemps",
      summer: "Été",
      autumn: "Automne",
      winter: "Hiver",
    },
    seasonGroup: "Saison",
    seasonTheme: (season) => `Thème ${season.toLowerCase()}`,
    seasonInCity: (season) => `${season} à Vancouver`,
    nav: {
      sections: "Sections",
      experience: "Expérience",
      projects: "Projets",
      skills: "Compétences",
      contact: "Contact",
      resume: "CV",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
    },
    hero: {
      place: (city, region) => `${city} (${region})`,
      seeMyWork: "Voir mes projets",
      resume: "CV",
      getInTouch: "Me contacter",
      scrollToAbout: "Aller à la section À propos",
    },
    about: {
      label: "À propos",
      title: "En quelques mots",
      basedIn: "Basé à",
      languages: "Langues",
      education: "Formation",
      degreeAt: (degree, school) => `${degree}, ${school}`,
      now: "Actuellement",
    },
    experience: {
      label: "Expérience",
      title: "Mon parcours",
      present: "aujourd'hui",
      showMore: (count) => `Afficher ${count} de plus`,
      showLess: "Afficher moins",
      earlier: "Expérience antérieure",
      stack: (company) => `Technologies utilisées chez ${company}`,
      // LinkedIn style: "2 ans 7 mois", "11 mois", "1 an"
      duration: (years, months) => {
        const y = years ? `${years} an${years === 1 ? "" : "s"}` : "";
        const m = months || !years ? `${months} mois` : "";
        return [y, m].filter(Boolean).join(" ");
      },
    },
    projects: {
      label: "Projets",
      title: "Mes réalisations",
      lead: "Une plateforme de santé que j'ai cofondée et une simulation physique créée pour le plaisir, puis quelques projets plus anciens.",
      earlier: "Projets antérieurs",
      archived: "Archivé",
      tools: (project) => `Outils utilisés pour ${project}`,
    },
    skills: {
      label: "Compétences",
      title: "Ma boîte à outils",
    },
    contact: {
      label: "Contact",
      title: "Me contacter",
      linkedIn: "LinkedIn",
      gitHub: "GitHub",
      resume: "CV",
      resumeDetail: "Cliquez ici pour le télécharger",
    },
    footer: {
      previousVersion: "Version précédente",
      seasonsNote: "L'illustration suit les saisons de Vancouver.",
    },
  },
};
