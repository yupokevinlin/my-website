import { CHAPTERS, CREDITS, GLOSSARY } from "../../../display/components/Simulations/content";
import { LESSONS } from "../../../display/components/Simulations/lessons";
import { type Translation, localize } from "../../translation";

// The ray-tracing guide's content in English, from its data files: the
// overview's eleven lessons, the four simulations' chapters (also their Learn
// tabs), the glossary and the credits. Other languages are overlays with the
// same shape (see translation.ts); the guide's labels and the overview's other
// prose are in the dictionary (messages/guide/en.ts).
export const EN_RAY_TRACING = {
  lessons: LESSONS,
  chapters: CHAPTERS,
  glossary: GLOSSARY,
  credits: CREDITS,
};

export type RayTracingContent = typeof EN_RAY_TRACING;

// Never translated: ids, numbering, image paths, equations, the simulation
// settings a link opens with, and the titles of published works
export const RAY_TRACING_SKIP = {
  lessons: ["id", "number", "formula", "params", "sim"],
  chapters: ["id", "numeral", "image", "formula", "params"],
  glossary: [],
  credits: ["link", "url"],
} as const satisfies Record<keyof RayTracingContent, readonly string[]>;

type Skip<K extends keyof RayTracingContent> = (typeof RAY_TRACING_SKIP)[K][number];

export type RayTracingTranslation = {
  [K in keyof RayTracingContent]: Translation<RayTracingContent[K], Skip<K>>;
};

// The guide's content in another language: its text laid over the English
export const localizeRayTracing = (overlay: RayTracingTranslation): RayTracingContent =>
  Object.fromEntries(
    (Object.keys(EN_RAY_TRACING) as Array<keyof RayTracingContent>).map((key) => [key, localize(EN_RAY_TRACING[key], overlay[key], RAY_TRACING_SKIP[key])]),
  ) as RayTracingContent;
