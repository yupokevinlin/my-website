import { numberWord, yearsSince } from "../v2/time";
import { profile } from "./profile";

// The home page's About section. The years count up from profile.careerStart
// at build time, so "Ten years" becomes "Eleven years" on its own.
const years = numberWord(yearsSince(profile.careerStart));

export const about = {
  paragraphs: [
    "I'm a senior full-stack and AI engineer in Vancouver. At Best Buy Canada I'm tech lead of the Mobile Activation team: I won the company hackathon with one of its first AI-enhanced customer experiences, led my team's shift to AI-driven development, and led development of Best Buy Canada's design system.",
    "I'm also co-founder and CTO of ForteCare, where I architect a healthcare platform that brings AI into the specialist referral journey, from intake to a finished visit note.",
    `My path into software started in chemistry at UBC and a stint automating spreadsheets at a trading company. ${years} years into building software, I still love finding better and faster ways to do things, from shipping full-stack products to ray-tracing black holes in the browser.`,
  ],
  facts: [
    { label: "Based in", value: "Vancouver, BC, Canada" },
    { label: "Languages", value: "English and Mandarin (fluent), French (DELF A1)" },
    { label: "Education", value: "BSc Chemistry, The University of British Columbia", detail: "President's Entrance Scholarship" },
    { label: "Now", value: "Tech lead at Best Buy Canada, CTO at ForteCare" },
  ],
};
