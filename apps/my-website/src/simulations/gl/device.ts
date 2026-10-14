// Phones and tablets get lighter defaults and hard limits. Their browsers,
// iOS Safari especially, close a tab that uses too much graphics memory, and
// the desktop defaults (4K buffers and a 4096² star map) need over 1 GB.

/** Largest render size on a phone or tablet, in pixels (1920 × 1080). */
export const CONSTRAINED_MAX_PIXELS = 1920 * 1080;

/** Largest star map face on a phone or tablet. */
export const CONSTRAINED_MAX_SKY = 2048;

/** True on phones and tablets. False during server rendering. */
export function isConstrainedDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) return true;
  // iPadOS reports itself as a Mac; touch support gives it away
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}
