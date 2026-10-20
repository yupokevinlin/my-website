import { test, expect } from '@playwright/test';
import { VIEWPORTS, openLanguages, revealAll } from './helpers';

// The home page and the ray-tracing guide in every language: each page says
// its language, links to the others, keeps its links in its language, and
// lays out at phone and desktop sizes without anything running off the side
// (French runs longer than English; Chinese and Japanese wrap differently).

const LANGUAGES = [
  { prefix: '', lang: 'en', label: 'English' },
  { prefix: '/fr', lang: 'fr', label: 'Français' },
  { prefix: '/zh-cn', lang: 'zh-CN', label: '简体中文' },
  { prefix: '/zh-tw', lang: 'zh-TW', label: '繁體中文' },
  { prefix: '/ja', lang: 'ja', label: '日本語' },
];

for (const { prefix, lang, label } of LANGUAGES) {
  test.describe(lang, () => {
    test('home page: language, alternates, links and layout', async ({ page }) => {
      for (const viewport of [VIEWPORTS.phone, VIEWPORTS.desktop]) {
        await page.setViewportSize(viewport);
        await page.goto(prefix || '/');
        expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang);
        expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(6);
        await expect(page.locator('h1')).toHaveText('Kevin Lin');
        // The guide's links stay in this language
        const guide = await page.locator('a[href*="/ray-tracing"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
        for (const href of guide) expect(href?.startsWith(`${prefix}/ray-tracing`)).toBe(true);
        await revealAll(page);
        const width = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, view: document.documentElement.clientWidth }));
        expect(width.page).toBeLessThanOrEqual(width.view);
        const bar = await page.locator('header').first().boundingBox();
        expect(bar?.height).toBeLessThanOrEqual(72);
      }
    });

    test('ray-tracing guide: language, alternates and links', async ({ page }) => {
      for (const path of ['/ray-tracing', '/ray-tracing/blackhole']) {
        // The simulation at its smallest render size, so several browsers
        // tracing light at once (without a GPU) don't starve the page
        await page.goto(`${prefix}${path}${path.endsWith('blackhole') ? '#resolution=720p' : ''}`);
        expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang);
        expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(6);
        expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://kevinyupolin.dev${prefix}${path}`);
        const nav = await page.locator('header a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
        for (const href of nav) expect(href?.startsWith(prefix || '/')).toBe(true);
      }
    });

    test('the language switcher links to this page in every language', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto(prefix || '/');
      // The switcher is named after the page's language
      await openLanguages(page, label);
      const links = await page.locator('#v2-languages a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(links.sort()).toEqual(['/', '/fr', '/ja', '/zh-cn', '/zh-tw']);
    });
  });
}

test('picking a language is remembered on the next visit', async ({ page }) => {
  await page.goto('/');
  await openLanguages(page, 'English');
  await page.locator('#v2-languages a[hreflang="ja"]').click();
  await expect(page).toHaveURL(/\/ja$/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/ja$/);
  // Back to English, which is remembered too
  await openLanguages(page, '日本語');
  await page.locator('#v2-languages a[hreflang="en"]').click();
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
});
