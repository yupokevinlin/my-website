import { test, expect, Page } from '@playwright/test';
import { PINNED_BUILD_DATE, SEASONS, VIEWPORTS, revealAll } from './helpers';

// Visual regression: a full-page screenshot of the home page in each season
// at each size, compared with the baselines in visual.spec.ts-snapshots/.
// The seasons recolour the whole page (backgrounds, accents, chips, footer)
// and change the hero and Contact scenes, so every season is checked at every
// size.
//
// What keeps the pictures the same from run to run:
// - The season comes from the date in the browser (SEASON_SCRIPT), so each
//   test sets the browser's clock to a day in that season before loading.
// - The dev server counts durations to PINNED_BUILD_DATE, not today.
// - Reduced motion: no snow, birds or fireflies (they move at random), and
//   framer-motion and the season colours don't animate.
//
// Baselines are kept for Chromium on Windows. After an intended change, look
// at the report's diffs, then update them:
//   npx nx run @org/my-website-e2e:e2e -- --project=chromium visual.spec.ts --update-snapshots

// A day in the middle of each season, at noon, so no time zone moves it
const SEASON_DAYS: Record<string, string> = {
  Spring: '2026-04-15T12:00:00',
  Summer: '2026-07-15T12:00:00',
  Autumn: '2026-10-15T12:00:00',
  Winter: '2026-01-15T12:00:00',
};

// Next.js's dev tools button (the N in the corner) isn't part of the site
const HIDE = 'nextjs-portal { display: none !important; }';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Months from "Mon YYYY" to the pinned build date, as the page shows it
// ("2 yrs 7 mos", "6 mos"; see messages/en.ts)
const durationToBuild = (start: string): string => {
  const [mon, year] = start.split(' ');
  const built = new Date(PINNED_BUILD_DATE);
  const months = (built.getUTCFullYear() - Number(year)) * 12 + built.getUTCMonth() - MONTHS.indexOf(mon);
  const [y, m] = [Math.floor(months / 12), months % 12];
  return [y ? `${y} yr${y === 1 ? '' : 's'}` : '', m || !y ? `${m} mo${m === 1 ? '' : 's'}` : ''].filter(Boolean).join(' ');
};

// Waits for the fonts and every picture, including the ones loaded lazily
// while revealAll scrolled
const settled = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every((img) => img.complete));
};

test.use({ reducedMotion: 'reduce' });
test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines are kept for Chromium only');
// One at a time, in one worker: sixteen tall screenshots at once, beside the
// ray-tracing pages rendering without a GPU, starve the other specs. Unlike
// 'serial', a failing test doesn't skip the rest, so every diff shows.
test.describe.configure({ mode: 'default' });

test('the dev server counts durations to the pinned build date', async ({ page }) => {
  await page.goto('/');
  // The current company's header: "May 2026 – Present · 6 mos"
  const header = page.locator('#experience p', { hasText: /– Present ·/ }).first();
  const [, start, shown] = (await header.textContent())?.match(/^(\w{3} \d{4}) – Present · (.+)$/) ?? [];
  expect(start, 'No "Mon YYYY – Present · duration" line in Experience').toBeTruthy();
  expect(shown, `The dev server isn't counting to ${PINNED_BUILD_DATE}: stop any other dev server, so the tests start their own`).toBe(durationToBuild(start));
});

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  for (const season of SEASONS) {
    test(`home page looks as before: ${season}, ${name}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(SEASON_DAYS[season]));
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-season', season.toLowerCase());
      await revealAll(page);
      await settled(page);
      await expect(page).toHaveScreenshot(`home-${season.toLowerCase()}-${name.replace(' ', '-')}.png`, {
        fullPage: true,
        animations: 'disabled',
        style: HIDE,
      });
    });
  }
}
