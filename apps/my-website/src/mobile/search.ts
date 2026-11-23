import type { Phone } from "./types";

// A forgiving search over the phones: "s26 ultra", "s26u", "pixle 10 pro",
// "galaxy fold", "iphone 18 pm" and "17pro" all find what they mean. Each word
// of the query has to match the phone somehow; the closer the matches, the
// higher it ranks.

// Lowercase letters and digits only, with "+" kept as "plus"
const squash = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]/g, "");

// Words, with letters and digits apart ("s26" -> "s", "26"; "17pro" -> "17", "pro")
const words = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/([a-z])(\d)|(\d)([a-z])/g, "$1$3 $2$4")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

// Common shorthand, as the words they stand for
const SHORTHAND: Record<string, string> = { pm: "pro max", u: "ultra", fe: "fe", px: "pixel", sg: "samsung galaxy", ip: "iphone" };

// How many edits turn a into b (a letter added, dropped, changed, or two
// neighbours swapped: "pixle" is one edit from "pixel"), giving up past `limit`
const distance = (a: string, b: string, limit: number): number => {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let before: number[] = [];
  let row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) next[j] = Math.min(next[j], before[j - 2] + 1);
    }
    if (Math.min(...next) > limit) return limit + 1;
    before = row;
    row = next;
  }
  return row[b.length];
};

// Whether the letters of `needle` appear in `hay` in order ("s26u" in "s26ultra")
const inOrder = (needle: string, hay: string): boolean => {
  let at = 0;
  for (const letter of hay) if (letter === needle[at]) at += 1;
  return at === needle.length;
};

// How well one query word matches the phone's words: 0 is no match
const wordScore = (word: string, phoneWords: string[], squashed: string): number => {
  if (phoneWords.includes(word)) return 4;
  // A number must match whole: "1" isn't "17", "10" isn't "100"
  if (/^\d+$/.test(word)) return 0;
  if (phoneWords.some((candidate) => candidate.startsWith(word))) return 3;
  if (word.length >= 4 && phoneWords.some((candidate) => distance(word, candidate, word.length >= 7 ? 2 : 1) <= (word.length >= 7 ? 2 : 1))) return 2;
  if (word.length >= 3 && inOrder(word, squashed)) return 1;
  return 0;
};

export const phoneLabel = (phone: Phone): string => `${phone.brand} ${phone.name}`;

// The phones matching `query`, best first (newest first among equals).
// An empty query lists them all, newest first.
export const searchPhones = (phones: Phone[], query: string): Phone[] => {
  const queryWords = words(query).flatMap((word) => (SHORTHAND[word] ? words(SHORTHAND[word]) : [word]));
  const newestFirst = [...phones].sort((a, b) => b.released.localeCompare(a.released));
  if (!queryWords.length) return newestFirst;
  const whole = squash(query);
  return newestFirst
    .map((phone) => {
      const label = phoneLabel(phone);
      // A storage size in the query ("1tb") matches a phone sold in it
      const labelWords = words(label);
      const storageWords = phone.storages.flatMap((size) => words(size));
      const phoneWords = [...labelWords, ...storageWords];
      const squashed = squash(label);
      const scores = queryWords.map((word) => wordScore(word, phoneWords, squashed));
      if (scores.includes(0)) {
        // Or the whole query run together, as a shorthand of the name ("s26u")
        return { phone, score: whole.length >= 3 && inOrder(whole, squashed) ? 1 : 0 };
      }
      // Exact names first: "iPhone 17" before "iPhone 17 Pro"
      // Name words the query left out; phones with more storage sizes aren't ranked lower
      const extra = labelWords.length - queryWords.filter((word) => labelWords.includes(word) || !storageWords.includes(word)).length;
      return { phone, score: scores.reduce((sum, score) => sum + score, 0) * 10 - Math.max(0, extra) };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((match) => match.phone);
};
