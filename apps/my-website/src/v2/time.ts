// Counted at build time, like the Experience durations, so the numbers stay
// current on every deploy and the server and browser render the same text.
const BUILT = new Date(process.env.BUILD_DATE ?? Date.now());

export interface YearMonth {
  year: number;
  // 0 = January
  month: number;
}

export const NOW: YearMonth = { year: BUILT.getUTCFullYear(), month: BUILT.getUTCMonth() };

export const yearsSince = ({ year, month }: YearMonth): number =>
  NOW.year - year - (NOW.month < month ? 1 : 0);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Mar 2024" -> { year: 2024, month: 2 }; "Present" -> the build month
export const parseMonth = (value: string): YearMonth => {
  if (value === "Present") return NOW;
  const [mon, year] = value.split(" ");
  const month = MONTHS.indexOf(mon);
  if (month < 0 || !/^\d{4}$/.test(year ?? "")) throw new Error(`Expected "Mon YYYY" or "Present", got "${value}"`);
  return { year: Number(year), month };
};

export const monthsBetween = (from: YearMonth, to: YearMonth): number =>
  (to.year - from.year) * 12 + (to.month - from.month);

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];

// For sentences: 10 -> "Ten"
export const numberWord = (n: number): string => WORDS[n] ?? String(n);
