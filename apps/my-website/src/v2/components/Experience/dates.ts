import { monthsBetween, parseMonth } from "../../time";
import { LOCALE_TAGS, type Locale } from "../../../i18n/locales";
import type { Messages } from "../../../i18n/messages/en";
import type { Company, Role } from "../../../data/experience";

export const DASH = " – ";

// "Mar 2024" in the page's language ("mars 2024", "2024年3月"); "Present"
// becomes the dictionary's word for it
const formatMonth = (value: string, locale: Locale, messages: Messages): string => {
  if (value === "Present") return messages.home.experience.present;
  const { year, month } = parseMonth(value);
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { month: "short", year: "numeric", timeZone: "UTC" }).format(Date.UTC(year, month, 1));
};

const formatDuration = (months: number, messages: Messages): string =>
  messages.home.experience.duration(Math.floor(months / 12), months % 12);

// "Mar 2024 – Present" and "2 yrs 7 mos", in the page's language
export const roleSpan = (role: Role, locale: Locale, messages: Messages): { range: string; duration: string } => ({
  range: `${formatMonth(role.start, locale, messages)}${DASH}${formatMonth(role.end, locale, messages)}`,
  duration: formatDuration(monthsBetween(parseMonth(role.start), parseMonth(role.end)), messages),
});

// Earliest start to latest end, and the time actually worked (gaps between
// roles at the same company don't count)
export const companySpan = (company: Company, locale: Locale, messages: Messages): { range: string; duration: string } => {
  const byDate = (a: string, b: string) => monthsBetween(parseMonth(b), parseMonth(a));
  const starts = company.roles.map((role) => role.start).sort(byDate);
  const ends = company.roles.map((role) => role.end).sort(byDate);
  const last = ends.includes("Present") ? "Present" : ends[ends.length - 1];
  const months = company.roles.reduce((sum, role) => sum + monthsBetween(parseMonth(role.start), parseMonth(role.end)), 0);
  return { range: `${formatMonth(starts[0], locale, messages)}${DASH}${formatMonth(last, locale, messages)}`, duration: formatDuration(months, messages) };
};
