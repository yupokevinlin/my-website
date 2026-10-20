import { Page, expect } from '@playwright/test';

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

// The sizes the home page is checked at: a small and a common phone, a tablet
// held upright, and a laptop
export const VIEWPORTS = {
  'small phone': { width: 360, height: 640 },
  phone: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

// Scrolls to the bottom and back so every scroll-in animation has finished
export const revealAll = async (page: Page) => {
  // The page grows as pictures load, so the height is read again each step
  for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 500) {
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
export const transitionsDone = (page: Page) =>
  page.waitForFunction(() => !document.getAnimations().some((animation) => animation instanceof CSSTransition && animation.transitionProperty.startsWith('--v2')));

// Waits for the page's one-off animations (fade-ins, not endless loops) to
// finish, so axe doesn't measure contrast on text that is still fading in
export const animationsDone = (page: Page) =>
  page.waitForFunction(() => !document.getAnimations().some((animation) => animation.playState === 'running' && animation.effect?.getComputedTiming().iterations !== Infinity));

// Opens the language switcher named after the page's language. A built page
// shows its button before React has hydrated it, so it retries the click
// until the list appears.
export const openLanguages = async (page: Page, label: string | RegExp) => {
  const button = page.getByRole('button', { name: typeof label === 'string' ? new RegExp(`^${label} –`) : label });
  await expect(async () => {
    if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
    await expect(page.locator('#v2-languages a').first()).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
};

// Waits until the page's main heading, the block around it (the hero's text
// and buttons) and everything in it are fully opaque: framer-motion fades
// them in from JavaScript, which runs slowly when the machine is busy
export const heroShown = (page: Page) =>
  page.waitForFunction(() => {
    const block = document.querySelector('h1')?.parentElement;
    if (!block) return false;
    const opacity = (el: Element | null): number => (el ? Number(getComputedStyle(el).opacity) * opacity(el.parentElement) : 1);
    return opacity(block) === 1 && [...block.querySelectorAll('*')].every((el) => Number(getComputedStyle(el).opacity) === 1);
  });
