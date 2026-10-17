import { formatDuration, monthsBetween, parseMonth } from "../../time";
import type { Company, Role } from "../../../data/experience";

export const DASH = " – ";

// "Mar 2024 – Present" and "2 yrs 7 mos"
export const roleSpan = (role: Role): { range: string; duration: string } => ({
  range: `${role.start}${DASH}${role.end}`,
  duration: formatDuration(monthsBetween(parseMonth(role.start), parseMonth(role.end))),
});

// Earliest start to latest end, and the time actually worked (gaps between
// roles at the same company don't count)
export const companySpan = (company: Company): { range: string; duration: string } => {
  const byDate = (a: string, b: string) => monthsBetween(parseMonth(b), parseMonth(a));
  const starts = company.roles.map((role) => role.start).sort(byDate);
  const ends = company.roles.map((role) => role.end).sort(byDate);
  const last = ends.includes("Present") ? "Present" : ends[ends.length - 1];
  const months = company.roles.reduce((sum, role) => sum + monthsBetween(parseMonth(role.start), parseMonth(role.end)), 0);
  return { range: `${starts[0]}${DASH}${last}`, duration: formatDuration(months) };
};
