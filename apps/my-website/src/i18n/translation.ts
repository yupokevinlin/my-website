// Translations of the site's content (experience, projects, the guide's
// lessons...) are overlays: the English data in src/data and the guide's
// content files stays the source of truth for structure (ids, dates, links,
// images, numbers), and each language supplies only the text, in the same
// shape. localize() lays the text over the English data.
//
// Translation<T, Skip> is that shape: every string (and every function that
// returns one, such as a pitch that takes the years) in T, except under keys
// in Skip, which are never translated (ids, file names, URLs...). Arrays line
// up by position, so when English gains, loses or reorders an entry, its
// translations must follow; missingTranslations() (used by the tests) finds
// any gap.

type Fn = (...args: never[]) => string;

type HasText<V, Skip extends PropertyKey> = V extends string
  ? true
  : V extends Fn
    ? true
    : V extends readonly (infer U)[]
      ? HasText<U, Skip>
      : V extends object
        ? true extends { [K in keyof V]-?: K extends Skip ? false : HasText<V[K], Skip> }[keyof V]
          ? true
          : false
        : false;

export type Translation<T, Skip extends PropertyKey = never> = T extends string
  ? string
  : T extends Fn
    ? T
    : T extends readonly (infer U)[]
      ? Translation<U, Skip>[]
      : T extends object
        ? { [K in keyof T as K extends Skip ? never : true extends HasText<T[K], Skip> ? K : never]: Translation<T[K], Skip> }
        : never;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

// The English data with the overlay's text in place. Anything the overlay
// lacks stays English.
export const localize = <T>(base: T, overlay: unknown, skip: readonly PropertyKey[] = []): T => {
  if (typeof base === "string" || typeof base === "function") return (typeof overlay === typeof base ? overlay : base) as T;
  if (Array.isArray(base)) {
    const items = Array.isArray(overlay) ? overlay : [];
    return base.map((item, i) => localize(item, items[i], skip)) as T;
  }
  if (isObject(base)) {
    const source = isObject(overlay) ? overlay : {};
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(base)) out[key] = skip.includes(key) ? value : localize(value, source[key], skip);
    return out as T;
  }
  return base;
};

// Paths where English has text the overlay doesn't, or where an array's
// length differs: what the tests require to be empty for every language.
export const missingTranslations = (base: unknown, overlay: unknown, skip: readonly PropertyKey[] = [], path = ""): string[] => {
  if (typeof base === "string" || typeof base === "function") return typeof overlay === typeof base ? [] : [path || "(root)"];
  if (Array.isArray(base)) {
    if (!Array.isArray(overlay)) return [`${path} (missing list)`];
    const lengthGap = overlay.length !== base.length ? [`${path} (${overlay.length} entries, English has ${base.length})`] : [];
    return [...lengthGap, ...base.flatMap((item, i) => missingTranslations(item, overlay[i], skip, `${path}[${i}]`))];
  }
  if (isObject(base)) {
    const source = isObject(overlay) ? overlay : {};
    return Object.entries(base).flatMap(([key, value]) => (skip.includes(key) ? [] : missingTranslations(value, source[key], skip, path ? `${path}.${key}` : key)));
  }
  return [];
};
