import { about } from "../../../data/about";
import { earlyExperience, experience } from "../../../data/experience";
import { homeSeo, profile } from "../../../data/profile";
import { earlierProjects, featuredProjects } from "../../../data/projects";
import { skillGroups } from "../../../data/skills";
import type { Translation } from "../../translation";

// The home page's content in every language. English comes from src/data, the
// source of truth for everything (dates, links, logos, the order of things);
// each other language is an overlay with the same shape, holding only text
// (see translation.ts).

// The English text, gathered from src/data
export const EN_HOME = {
  profile: {
    // The hero's eyebrow line and pitch, and the city in it
    title: profile.title,
    pitch: profile.pitch,
    city: profile.location.city,
    region: profile.location.region,
  },
  seo: {
    title: homeSeo.title,
    description: homeSeo.description,
    imageAlt: homeSeo.imageAlt,
  },
  about,
  experience,
  earlyExperience,
  featuredProjects,
  earlierProjects,
  skillGroups,
};

export type HomeContent = typeof EN_HOME;

// Keys that are never translated, in each part: names of companies, dates,
// links, logos and the names of tools
export const HOME_SKIP = {
  profile: [],
  seo: [],
  about: ["logo"],
  experience: ["name", "url", "logo", "start", "end", "stack"],
  earlyExperience: ["name", "url", "logo", "start", "end", "stack"],
  featuredProjects: ["src", "width", "height", "tags", "href"],
  earlierProjects: ["icon", "tags", "year", "href", "archived"],
  skillGroups: ["logo", "icon"],
} as const satisfies Record<keyof HomeContent, readonly string[]>;

type Skip<K extends keyof HomeContent> = (typeof HOME_SKIP)[K][number];

// What a translation of the home page holds: every text, in the same shape
export type HomeTranslation = {
  [K in keyof HomeContent]: Translation<HomeContent[K], Skip<K>>;
};

