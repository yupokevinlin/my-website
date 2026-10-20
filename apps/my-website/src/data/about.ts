import { numberWord } from "../v2/time";

// The home page's About section. A paragraph can be a function of the years
// Kevin has been building software, counted from profile.careerStart at build
// time, so "Ten years" becomes "Eleven years" on its own. Translations are
// overlays in src/i18n/content/.

export const about = {
  paragraphs: <Array<string | ((years: number) => string)>>[
    "I'm a senior full-stack and AI engineer in Vancouver. At Best Buy Canada I'm tech lead of the Mobile Activation team: I won the company hackathon with one of its first AI-enhanced customer experiences, led my team's shift to AI-driven development, and led development of Best Buy Canada's design system.",
    "I'm also co-founder and CTO of ForteCare, where I architect a healthcare platform that brings AI into the specialist referral journey, from intake to a finished visit note.",
    (years: number): string => `My path into software started in chemistry at UBC and a stint automating spreadsheets at a trading company. ${numberWord(years)} years into building software, I still love finding better and faster ways to do things, from shipping full-stack products to building AI into the products and the way my team works.`,
  ],
  location: "Vancouver, BC, Canada",
  // Shown as one badge each
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Mandarin", level: "Fluent" },
    { name: "French", level: "DELF A1" },
  ],
  education: {
    degree: "BSc Chemistry",
    school: "The University of British Columbia",
    logo: "/resources/images/education/ubc.svg",
    award: "President's Entrance Scholarship",
  },
  now: "Tech lead at Best Buy Canada, CTO at ForteCare",
};
