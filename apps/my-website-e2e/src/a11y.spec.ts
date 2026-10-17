import { readFileSync } from 'node:fs';
import { test, expect, Page } from '@playwright/test';

// Runs axe (WCAG 2 A and AA) on the home page in every season, at phone and
// desktop widths. The season colours change the contrast of every accent, so
// a new or changed season colour must pass here.
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const VIEWPORTS = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 900 } };

// Scrolls to the bottom and back so every scroll-in animation has finished
const revealAll = async (page: Page) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    // Two frames, so the scroll-in observer sees each position
    await page.evaluate((top) => {
      window.scrollTo({ top, behavior: 'instant' });
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, y);
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.v2-reveal')].every((el) => getComputedStyle(el).opacity === '1'));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
};

// Waits for the season colours (--v2-* custom properties) to finish easing in
const transitionsDone = (page: Page) =>
  page.waitForFunction(() => !document.getAnimations().some((animation) => animation instanceof CSSTransition && animation.transitionProperty.startsWith('--v2')));

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  for (const season of SEASONS) {
    test(`home page has no accessibility violations: ${season}, ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.getByRole('button', { name: `${season} theme` }).click();
      await transitionsDone(page);
      await revealAll(page);
      await transitionsDone(page);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: { run: (context: Document, options: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }> } }).axe;
        const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
        return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      });
      expect(violations).toEqual([]);
    });
  }
}
