import { readFileSync } from 'node:fs';
import { test, expect, Page } from '@playwright/test';
import { SEASONS, VIEWPORTS, revealAll, transitionsDone } from './helpers';

// Runs axe (WCAG 2.2 A and AA) on the home page in every season, at phone,
// tablet and desktop sizes. The season colours change the contrast of every
// accent, so a new or changed season colour must pass here.
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const axeViolations = async (page: Page) => {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (context: object, options: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }> } }).axe;
    // Next.js's dev tools overlay (the N button) is not part of the site
    const result = await axe.run({ exclude: [['nextjs-portal']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  });
};

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  for (const season of SEASONS) {
    test(`home page has no accessibility violations: ${season}, ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.getByRole('button', { name: `${season} theme` }).click();
      await transitionsDone(page);
      await revealAll(page);
      await transitionsDone(page);
      expect(await axeViolations(page)).toEqual([]);
    });
  }
}

test('the phone menu has no accessibility violations and closes with Escape', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.phone);
  await page.goto('/');
  const menuButton = page.getByRole('button', { name: 'Open menu' });
  await menuButton.click();
  const menu = page.locator('#v2-menu');
  await expect(menu.getByRole('link', { name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  expect(await axeViolations(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
});
