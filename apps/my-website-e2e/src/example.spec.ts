import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // The hero name is the page's only h1.
  expect(await page.locator('h1').innerText()).toContain('Kevin Lin');
});
