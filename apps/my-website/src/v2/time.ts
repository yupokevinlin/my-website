// Counted at build time, like the Experience durations, so the numbers stay
// current on every deploy and the server and browser render the same text.
const BUILT = new Date(process.env.BUILD_DATE ?? Date.now());

export const yearsSince = ({ year, month }: { year: number; month: number }): number =>
  BUILT.getUTCFullYear() - year - (BUILT.getUTCMonth() < month ? 1 : 0);
