import { Page } from '@playwright/test';

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
