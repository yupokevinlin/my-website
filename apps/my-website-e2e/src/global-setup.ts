import type { FullConfig } from '@playwright/test';

// Compiles every page on the dev server before any test opens one. `next dev`
// compiles a page the first time it's requested, and each compile makes every
// page already open in a browser rebuild (Fast Refresh). With a dozen workers
// starting on cold pages at once, that churn and the compiling itself made
// tests time out or measure a page mid-rebuild. One request per page file is
// enough: every language's copy shares the file under pages/[locale]/.
const SIMULATIONS = ['blackhole', 'infall', 'lightspeed', 'wormhole'];
const ROUTES = [
  '/',
  '/v1',
  '/mobile-price-checker',
  '/404',
  ...['', '/fr'].flatMap((prefix) => [prefix || '/', `${prefix}/ray-tracing`, ...SIMULATIONS.map((sim) => `${prefix}/ray-tracing/${sim}`)]),
];

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:3000';
  for (const route of [...new Set(ROUTES)]) {
    const response = await fetch(new URL(route, baseURL));
    await response.text();
    if (!response.ok) throw new Error(`Warming ${route} on the dev server failed: ${response.status}`);
  }
}
