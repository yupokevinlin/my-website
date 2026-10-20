# Kevin Lin — Personal Website

The source of [kevinyupolin.dev](https://kevinyupolin.dev): Kevin Lin's portfolio and a real-time relativistic ray tracing guide. Built with **Next.js 16**, **React 19** and **Tailwind CSS v4** in an [Nx](https://nx.dev) monorepo, exported as a static site and hosted on Firebase Hosting.

## Features

- **Seasonal home page.** A full-screen illustration of the season in Vancouver, chosen from the date before the first paint, with a switch to try the others. Colours, favicon and the scene behind Contact follow the season, with snow in winter, fireflies in summer and birds in spring and autumn.
- **Portfolio.** About, Experience, Projects, Skills and Contact, with the resume as a PDF.
- **Five languages.** English, French, Simplified Chinese, Traditional Chinese and Japanese, at `/`, `/fr`, `/zh-cn`, `/zh-tw` and `/ja`. The switcher remembers the visitor's choice; each page has hreflang links and a canonical URL in its language.
- **Relativistic ray tracing guide** at `/ray-tracing`: eleven illustrated lessons and four WebGL 2 simulations (a black hole, falling in, a wormhole, near light speed) that trace light through curved spacetime in real time.
- **Accessible and search-friendly.** Automated WCAG 2.2 AA checks in every season and language, one `h1` per page, real links, structured data and a sitemap.
- **Fast.** Static pages; each page loads only its own language's text; analytics waits until the visitor interacts or the page has been idle.
- **The previous design** stays online, unchanged, at `/v1`.

## Getting started

Requires Node.js 20.9 or later and npm.

```sh
npm install
npm run start:my-website
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run start:my-website` | Development server on port 3000 |
| `npm run build:my-website` | Static export to `dist/apps/my-website` |
| `npm run test:my-website` | Unit tests |
| `npm run deploy:my-website` | Build and deploy to Firebase Hosting (updates the live site) |

Or with Nx directly:

```sh
npx nx run my-website:dev
npx nx run my-website:build
npx nx run my-website:test
npx nx run @org/my-website-e2e:e2e
```

The production build and the development server share `dist/apps/my-website`, so stop the development server before building.

## Testing

Unit tests use **Jest** and **React Testing Library**. Among other things, they check the SEO rules (headings, links, structured data), that every language is complete, and that the birds cross the screen at the same pace on every width.

```sh
npx nx run my-website:test
```

Browser tests use **Playwright** against the development server (they start one if none is running). They run axe in every season and language, check the layout at phone, tablet and desktop sizes, and check each language's pages and links. Install the browsers once first:

```sh
npx playwright install
npx nx run @org/my-website-e2e:e2e -- --project=chromium
```

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (pages router, static export) |
| UI | React 19, framer-motion |
| Styling | Tailwind CSS v4 |
| Graphics | WebGL 2 (the ray tracers) |
| Language | TypeScript 5.9 |
| Monorepo | Nx 22 |
| Testing | Jest 30, React Testing Library, Playwright, axe |
| Linting | ESLint 9, Prettier |
| Hosting | Firebase Hosting, Google Analytics |

## Where things are

```
apps/
  my-website/
    pages/            Routes: / (home), /ray-tracing/..., /v1, and [locale]/ for the other languages
    src/
      v2/             The home page: its sections, season scene, birds and hooks
      data/           Kevin's profile, experience, projects and skills (the English source of truth)
      i18n/           Languages: paths, interface text (messages/), translated content (content/), text packs
      display/        The ray-tracing guide's pages and components, and the /v1 design
      simulations/    The WebGL 2 ray tracers and their settings
    components/       Base components for the guide and /v1
    public/           Pictures, scenes, bird sprites, the resume, sitemap and robots.txt
    styles/           Global CSS, with the season colours
    specs/            Unit tests
    scripts/          The share image renderer and a WebP converter
  my-website-e2e/     Playwright tests: accessibility, layout and languages
```

[AGENTS.md](AGENTS.md) is the detailed guide for anyone (or any AI tool) changing the site: where each piece of content lives, what to update when Kevin's experience changes, and the SEO and accessibility rules.
