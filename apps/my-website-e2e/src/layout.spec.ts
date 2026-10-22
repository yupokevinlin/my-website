import { test, expect, Page } from '@playwright/test';
import { VIEWPORTS, revealAll } from './helpers';

// Checks that the home page lays out well at phone, tablet and desktop sizes:
// nothing runs off the side, the season's picture shows around the hero and
// Contact cards, the top bar fits, no text is cut off, and text and tap
// targets are big enough. The first test attaches a full-page screenshot at
// each size to the report, to look over by eye.

const isPhone = (name: string) => name.includes('phone');

// Everything visible in the page that ends past the right edge (or starts
// before the left), ignoring the scene pictures, which are clipped on purpose
const overflowing = (page: Page) =>
  page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll<HTMLElement>('.v2 *')]
      .filter((el) => !el.closest('[aria-hidden="true"]') && el.getClientRects().length > 0)
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > width + 1 || r.left < -1);
      })
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${(el.textContent ?? '').trim().slice(0, 40)}"`);
  });

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`${name} (${viewport.width}×${viewport.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('load');
    });

    test('nothing runs off the side of the page', async ({ page }, testInfo) => {
      await revealAll(page);
      const scroll = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, view: document.documentElement.clientWidth }));
      expect(scroll.page).toBeLessThanOrEqual(scroll.view);
      expect(await overflowing(page)).toEqual([]);
      await testInfo.attach(`home-${name}.png`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    });

    // The hero and Contact both put a frosted card over the season's picture
    for (const [section, heading] of [['hero', '#top h1'], ['Contact', '#contact h2']]) {
      test(`the season picture shows around the ${section} card`, async ({ page }) => {
        const scene = page.locator(heading).locator('xpath=ancestor::section[1]');
        await scene.scrollIntoViewIfNeeded();
        const outer = await scene.boundingBox();
        const card = await page.locator(heading).locator('xpath=ancestor::div[contains(@class,"rounded-[")][1]').boundingBox();
        expect(outer && card).toBeTruthy();
        if (!outer || !card) return;
        // The card stays inside the screen
        expect(card.x).toBeGreaterThanOrEqual(0);
        expect(card.x + card.width).toBeLessThanOrEqual(viewport.width);
        // At least a quarter of the section is picture, not card
        const uncovered = 1 - (card.width * card.height) / (outer.width * outer.height);
        expect(uncovered).toBeGreaterThan(0.25);
        if (isPhone(name)) {
          // On phones the picture shows below the card: at least 160px of it
          expect(outer.y + outer.height - (card.y + card.height)).toBeGreaterThan(160);
        }
        // The picture itself has loaded
        const sceneLoaded = await scene.evaluate((el) => {
          const layer = [...el.querySelectorAll<HTMLElement>('.v2-scene-layer')].find((l) => getComputedStyle(l).opacity === '1');
          return !!layer && getComputedStyle(layer).backgroundImage.includes('/resources/seasons/');
        });
        expect(sceneLoaded).toBe(true);
      });
    }

    test('the top bar fits on one line', async ({ page }) => {
      const bar = page.locator('header').first();
      const box = await bar.boundingBox();
      expect(box?.height).toBeLessThanOrEqual(72);
      const items = await bar.locator('a:visible, button:visible').evaluateAll((els) =>
        els.map((el) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, name: el.getAttribute('aria-label') || el.textContent?.trim() }; }));
      // No two controls overlap
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j];
          const overlap = a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
          expect(overlap, `${a.name} overlaps ${b.name}`).toBe(false);
        }
      }
      // The section links show from 900px (Tailwind md); below that, a menu
      if (viewport.width < 900) {
        await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
      } else {
        await expect(page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Experience' })).toBeVisible();
      }
    });

    test('text is readable and whole, and tap targets are big enough', async ({ page }) => {
      await revealAll(page);
      const problems = await page.evaluate((phone) => {
        const out: string[] = [];
        // Text at least 12px
        for (const el of document.querySelectorAll<HTMLElement>('.v2 p, .v2 li, .v2 a, .v2 button, .v2 h1, .v2 h2, .v2 h3, .v2 h4, .v2 dt, .v2 dd')) {
          if (!el.getClientRects().length || el.closest('[aria-hidden="true"], .sr-only')) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          if (size < 12) out.push(`${el.tagName} "${el.textContent?.trim().slice(0, 30)}" is ${size}px`);
        }
        // No text is cut off with an ellipsis
        for (const el of document.querySelectorAll<HTMLElement>('.v2 *')) {
          if (!el.getClientRects().length || getComputedStyle(el).textOverflow !== 'ellipsis') continue;
          if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName} "${el.textContent?.trim().slice(0, 30)}" is cut off`);
        }
        // Links and buttons that stand alone (not inside a sentence) are at
        // least 24px (WCAG 2.2 AA), or 32px on phones, where they are tapped
        const min = phone ? 32 : 24;
        for (const el of document.querySelectorAll<HTMLElement>('.v2 a[href], .v2 button')) {
          if (!el.getClientRects().length || el.closest('.sr-only, [inert]') || el.classList.contains('sr-only')) continue;
          if (el.parentElement?.tagName === 'P' && el.parentElement.textContent!.trim() !== el.textContent!.trim()) continue;
          const r = el.getBoundingClientRect();
          if (r.height < min - 0.5 && r.width < min - 0.5) out.push(`${el.tagName} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" is ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
        return out;
      }, isPhone(name));
      expect(problems).toEqual([]);
    });
  });
}

test('the phone menu opens, links to each section and closes', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.phone);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#v2-menu');
  for (const section of ['Experience', 'Projects', 'Skills', 'Contact', 'Resume']) {
    await expect(menu.getByRole('link', { name: section })).toBeVisible();
  }
  await menu.getByRole('link', { name: 'Skills' }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.locator('#skills h2')).toBeInViewport();
});

// When a phone turns upright, Safari keeps anything sized from the sideways
// layout that doesn't shrink back, and zooms the whole page out to fit it (the
// project cards once kept their sideways width through their 16:9 screenshots)
test('turning a phone upright leaves nothing past the side', async ({ page }) => {
  await page.setViewportSize({ width: VIEWPORTS.phone.height, height: VIEWPORTS.phone.width });
  await page.goto('/');
  await page.waitForLoadState('load');
  // Two frames, so the page has been drawn sideways, as on a phone before it turns
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.setViewportSize(VIEWPORTS.phone);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(await overflowing(page)).toEqual([]);
});
