# Kevin Lin's portfolio: kevinyupolin.dev

Kevin's personal site. Recruiters find it from LinkedIn, his resume and searches for his name, so keep it accurate, consistent with LinkedIn, and easy for search engines to read.

- Next.js 16 (pages router), React 19, Tailwind v4, in an Nx workspace. The app is `apps/my-website`.
- Static export (`output: "export"`, `images.unoptimized`) to `dist/apps/my-website`, hosted on Firebase Hosting (`firebase.json`). There is no server and no Next.js image optimization.
- Pages: `/`, the portfolio (`pages/index.tsx` → `src/v2/HomePage`); `/v1`, the previous design (`pages/v1.tsx` → `src/root/App` → `src/display/pages/MainPage`), frozen and `noindex`, so don't update it; and the ray-tracing guide `/ray-tracing` with four simulation pages (`pages/ray-tracing/*.tsx`). `/v2` redirects to `/` (`firebase.json`).
- Languages: the home page and the ray-tracing guide are in English, French, Simplified Chinese, Traditional Chinese and Japanese (the same set as the North Pacific Materials site), listed in `src/i18n/locales.ts`. English has no prefix (`/`, `/ray-tracing`); the others are under `/fr`, `/zh-cn`, `/zh-tw` and `/ja`. `/v1` and the resume are English only. A static export can't use Next.js's `i18n` routing, so `pages/[locale]/...` generates each language's pages from the English ones, `_app` hands the language to components through `LocaleContext` (`useLocale`), and `_document` sets `<html lang>`. Each page file wraps its page in its text pack with `withText` (`src/i18n/packs/`): English pages import only English, `pages/[locale]/...` the other four languages, and neither imports the other kind of page's text (home or guide). Components read the text with `useMessages`, `useHomeContent` and the guide's hooks (`useGuide.ts`). Never import `src/i18n/messages/index.ts` or the `index.ts` files in `src/i18n/content/` from page code: they hold every language at once, for `_document` and the tests. The switcher (the page's language, by name, in the top bar; at the end of the phone menu) is made of real links and remembers the choice in localStorage; `LOCALE_SCRIPT` (`src/i18n/localeScript.ts`) then opens English pages in that language on the next visit. There's no detection from the browser's language. Each page has a canonical URL in its language, hreflang links to every language (and x-default to English) and `og:locale`. Chinese and Japanese get system CJK fonts through `--font-cjk` in `globals.css`.
- The home page (`src/v2/`) opens on a full-screen seasonal scene. The season follows the calendar in Vancouver (Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter), and the switch in the top bar changes it for the visit. `SEASON_SCRIPT` in `src/v2/season.ts` sets `html[data-season]` before the first paint, so CSS shows the right colours, scene and switch ring before React runs. The season colours are CSS variables in the "v2 home page" block of `styles/globals.css`: the page, section and chip backgrounds, borders, accents and the footer all change with the season, and the page ends on the same scene behind Contact. The native scroll bar is hidden on the home page; `PageScrollbar` draws the original design's floating 10 px thumb.
- Test: `npx nx run my-website:test`. Browser tests: `npx nx run @org/my-website-e2e:e2e` (add `-- --project=chromium` for Chromium only) runs Playwright against the dev server, at a small phone, a phone, a tablet and a desktop size (`apps/my-website-e2e/src/helpers.ts`): `a11y.spec.ts` runs axe (WCAG 2.2 AA) in every season and with the phone menu open, and `layout.spec.ts` checks that nothing runs off the side, the season picture shows around the hero and Contact cards (below them on phones), the top bar fits, no text is cut off, and text and tap targets are big enough. Its report has a full-page screenshot at each size. Run `npx playwright install` once first. After a layout change, run these and look at the screenshots. Build: `npm run build:my-website`. Deploy: `npm run deploy:my-website`. Deploying updates the live site, so do it only when Kevin asks.
- Code style for the home page (`src/v2`): one component per file, in `Name/Name.tsx` folders, with a component's private children in subfolders (`Experience/CompanyCard/CompanyCard.tsx`). Components are arrow functions with typed props that return `ReactNode` (no `React.FC`), and use named exports (pages under `pages/` keep the default export Next.js needs). Repeated looks are components (`ButtonLink`, `Chip`, `Eyebrow`, the `icons/`), not shared class strings. Hooks go in `src/v2/hooks/`.
- Branches: `main` is the only long-lived branch. Work on a feature branch and open a pull request into `main`. There is no `develop` or `master`.

## Where things live

All paths below are under `apps/my-website/`.

| What | Where |
|---|---|
| Name, job title, employer, start-up, location, email, LinkedIn, GitHub, resume path | `src/data/profile.ts` (`profile`) |
| Hero: eyebrow line, pitch, the date its "years building software" counts from | `src/data/profile.ts` (`title`, `pitch`, `careerStart`) |
| Home page title, description and share image | `src/data/profile.ts` (`homeSeo`) |
| Home page JSON-LD (Person + WebSite) | `src/data/profile.ts` (`homeJsonLd`), rendered by `src/v2/components/HomeHead/HomeHead.tsx`. It stays in English in every language. |
| Jobs and achievements | `src/data/experience.ts` (`experience`, and `earlyExperience` for the folded Protrade roles) |
| About text, languages, education | `src/data/about.ts` |
| Projects, with their screenshots and alt text | `src/data/projects.ts`; images in `public/resources/images/projects/` |
| Skills and their logos | `src/data/skills.ts`; logos in `public/resources/images/skills/` |
| Contact links | `src/v2/components/Contact/Contact.tsx`, which reads `profile` |
| Season colours, scenes and the head script | `styles/globals.css` ("v2 home page"), `src/v2/season.ts` |
| Birds over the hero (species, each season's flights, how they fly) | `src/v2/components/Hero/SeasonScene/SeasonLife/Birds/` (`flocks.ts`, `flight.ts`), moved by `src/v2/hooks/useFlight.ts`. A crossing takes the same time on every screen width, and phones fly fewer, smaller birds below the hero card; `specs/birds.spec.ts` checks this. `/v1` keeps its own birds in `src/display/components/AnimatedImages/`. |
| Share image (1200 × 630) | `public/resources/og-image.png`, rendered from `scripts/og-image/og-image.html` by `node apps/my-website/scripts/og-image/render.mjs` |
| Resume | `public/resources/resume/kevin-lin-resume.pdf`, rendered from `resume-source/kevin-lin-resume.html` (two fixed Letter pages, with Inter and the QR code embedded) by `node apps/my-website/resume-source/render-pdf.mjs`, which prints the room left on each page. Inter is embedded as static weights, never the variable font: Chromium turns a variable font into Type 3 text in the PDF, which readers can't select properly, and the script warns if that happens. `resume-source/README.md` describes the design, the font, the QR code and what the content mirrors. Keep source files out of `public/`, because everything in it is published. `firebase.json` redirects the old "Kevin Lin's Resume.pdf" URL here. The Publisher file `resume-source/Kevin Lin's Resume.pub` is the former source, kept for reference. |
| Ray-tracing page titles and descriptions | `heads` in `src/i18n/messages/guide/en.ts` (and each language's file beside it) |
| Ray-tracing JSON-LD and the guide's dates | `src/display/components/Simulations/SimulationsHead/SimulationsHead.tsx` |
| Sitemap, robots | `public/sitemap.xml` (every page in every language, with hreflang alternates), `public/robots.txt` |
| Languages, paths, the switcher's memory | `src/i18n/locales.ts`, `src/i18n/localeScript.ts`, `src/v2/components/TopBar/LanguageSwitcher/` |
| Interface text in every language (buttons, labels, headings) | The home page's and the shared text in `src/i18n/messages/en.ts`, and `fr.ts`, `zhCn.ts`, `zhTw.ts`, `ja.ts` beside it; the guide's (its prose, diagrams, readouts, page titles) in `src/i18n/messages/guide/` |
| Translations of the content (home page, guide, simulation settings) | `src/i18n/content/home/`, `rayTracing/`, `simulations/`: `en.ts` gathers the English, the other files hold each language's text |
| How recurring terms are translated | `src/i18n/GLOSSARY.md` |

## When Kevin's experience changes

For a new job, promotion, title change, new achievement or new project, go through this whole list. Many of these places repeat the same facts, and search engines trust the site more when they all agree.

1. **Experience**: edit `src/data/experience.ts`. Best Buy Canada, his main job, comes first and ForteCare second; past jobs follow, newest first. Dates are `"Mon YYYY"` or `"Present"`; a company's roles sit in one card, newest first. Put the three or four strongest bullets in `highlights`, leading with the result or the number, and the rest in `more`, behind "Show more" on past roles (a current role shows them all). Durations count up to the build month on their own, so don't hardcode them.
2. **Current role**: if the title or employer changed, update `jobTitle`, `employer`, `title` and `pitch` in `profile.ts`. Then rewrite `homeSeo.title` and `homeSeo.description` and the Person `description` in `homeJsonLd`. Keep the title at 60 characters or less, starting with "Kevin Lin". Keep the description between 150 and 160 characters.
3. **About**: `src/data/about.ts` names his current roles, and so does its "Now" line. "Ten years into building software" and the hero pitch's "10+ years" count from `careerStart` (October 2016) at build time, so they update on their own.
4. **Share image**: change the title line in `scripts/og-image/og-image.html`, run `render.mjs`, and look at the PNG before committing. Then bump the `?v=` number on `homeSeo.image` in `profile.ts`. LinkedIn caches images by URL, so it keeps showing the old picture (or none) until the URL changes. After deploying, re-inspect the page at linkedin.com/post-inspector.
5. **Resume**: make the same change in `resume-source/kevin-lin-resume.html` (its summary, roles, bullets, projects and skills mirror the site's data), run `node apps/my-website/resume-source/render-pdf.mjs`, check that neither page OVERFLOWS, and look at the PDF. Keep the file name `kevin-lin-resume.pdf` and the HTML's `<title>`, "Kevin Lin – Resume", which becomes the PDF's document title, because Google shows that title in results.
6. **Skills**: add an entry to a group in `src/data/skills.ts`. Groups are by what Kevin does, leadership first. Every skill has a picture (a test checks): a tool or product gets its logo, a square mark (not a wordmark: it shows at 18 px) in `public/resources/images/skills/`, preferably SVG; an idea or practice gets a line icon, added to `SHAPES` in `src/v2/components/icons/SkillIcon/SkillIcon.tsx` (from Lucide, lucide.dev).
7. **Translations**: make the same change in French, Simplified Chinese, Traditional Chinese and Japanese: the content in `src/i18n/content/home/{fr,zhCn,zhTw,ja}.ts` (same shape as the English; a new bullet, job or skill needs its entry in the same place in every language), and any new interface text in `src/i18n/messages/` (the guide's in `messages/guide/`). `specs/i18n.spec.ts` fails, naming the path, until every language has it. Kevin can review the Chinese himself; follow `src/i18n/GLOSSARY.md`.
8. **Sitemap**: set `<lastmod>` for `/` in every language in `public/sitemap.xml` to today's date.
9. **LinkedIn**: remind Kevin to make the same change on LinkedIn (headline, About, Experience). Never sign in to or edit his LinkedIn without his explicit permission.
10. Run the tests and the build, and show Kevin the result before deploying.

Decisions Kevin has made. Ask him before changing any of these:

- ForteCare (he's CTO & co-founder) is on the site: an Experience entry with the three bullets Kevin approved, the first featured project, and a `worksFor` in the JSON-LD. Ask him before adding more detail about it.
- `/v1` is a frozen snapshot of the previous design. Experience updates only touch the new home page.
- COVID-19 Tracker and Write My MP are archived: their live sites are offline, so they link to the GitHub repos.
- His phone number isn't on the site. It is on the resume.
- The resume (`resume-source/kevin-lin-resume.html`) shortens ServiceLink and Protrade on purpose, mirrors the site's Projects section except ForteCare (it is under Experience only), and gives the ray-tracing project no links.
- `alternateNames` in `profile.ts` ("Kevin Yupo Lin", "Yupo Lin") are other names people may search for.

## SEO rules

Tests in `apps/my-website/specs/index.spec.tsx` check most of these. If you change the structure on purpose, update the tests. Don't delete them to get a pass.

- **Headings.** Each page has exactly one `h1`. On the home page, the name in the hero is the `h1`. Section titles (`src/v2/components/Section/Section.tsx`) are `h2`. Companies, projects, skill groups and contact methods are `h3`, and job titles are `h4`. Tailwind's preflight resets heading styles, so a heading looks like whatever its classes say.
- **Links.** Anything that navigates is a real `<a href>`: a plain `<a>` on the home page, and `<Link href>` or `<Button href>` from `components/` in the ray-tracing guide. Links to other sites open in a new tab. Never navigate with `onClick` plus `window.open` or `router.push`, or with a `role="link"` span, because search engines can't follow them. Add `rel="me"` to links to Kevin's own profiles.
- **Folded content.** "Show more" and "Earlier experience" keep their text in the page (`Collapse/Collapse.tsx`, `inert` while closed), so search engines still read it. Don't change them to render only when opened.
- **New profiles.** For a new public profile (X, Bluesky, dev.to and so on), add it to `profile.ts`, to `sameAs` in `homeJsonLd`, and to Contact with `rel="me"`.
- **New pages.** A new public page needs its own title (60 characters or less), a description (150–160 characters), a canonical URL and Open Graph/Twitter tags (`SimulationsHead` does this for ray-tracing pages). Wrap it in its text with `withText` (see the other page files) and give it a copy under `pages/[locale]/` that wraps it in the other languages' pack, so it exists in every language, with hreflang links (`alternateLinks` in `src/i18n/seo.ts`). Add it to `sitemap.xml` in every language with a `<lastmod>`, and link to it from an existing page with a real `<a>` (use `localePath`, so links stay in the page's language).
- **Ray-tracing guide.** When the guide's content changes, bump `GUIDE_MODIFIED` in `SimulationsHead.tsx` and that page's `<lastmod>` in the sitemap (in every language), and update the translations.
- **Images.** Every content image gets an alt that describes what it shows (project images: `image.alt` in `projects.ts`). A logo or icon next to its own name is decorative: `alt=""` and `aria-hidden="true"`. Images below the fold get `loading="lazy"`. Keep screenshots 1920 px wide or less, since nothing resizes them at build time. Save screenshots as WebP with `node apps/my-website/scripts/to-webp.mjs <files>` (quality 80, or `--quality 85` for ray-tracing renders), then delete the originals. Three kinds of image stay as they are: og:image files stay PNG or JPG, because LinkedIn doesn't show WebP previews; the Milky Way sky faces stay JPG, because they hold encoded brightness data that lossy WebP changes; and icons stay SVG.
- **Colour contrast.** On the home page, `--v2-accent` text is at least 4.5:1 on white and on every season background (`--v2-page`, `--v2-wash`, `--v2-chip`), and white text on `--v2-accent-strong` and `--v2-deep` is too. `--v2-bright` is only for decoration (dots, timeline lines, card borders), never text. The scene shows through the frosted cards in the hero and Contact, so text there uses `--v2-accent-strong`, `--v2-body` or `--v2-ink`, never `--v2-accent` or `--v2-muted`. After changing a season colour, run the browser tests. Icon-only buttons need an `aria-label`; `specs/index.spec.tsx` checks this.
- **Speed.** Lighthouse counts every long task after the first paint. Keep the home page's text in its pack (above), keep analytics starting late (`_app.tsx`: after the first interaction or 5 seconds, when the browser is idle), and don't use `break-inside-avoid` inside CSS columns: the Skills cards are `inline-block` instead, because balancing columns of breakable cards made the browser lay them out again and again, the slowest thing on the page. To measure, build and serve the static export (not the dev server), stopping the dev server first.
- **Animations.** The home page uses framer-motion's small `m` components inside `LazyMotion strict` (a plain `motion.div` throws there), and `MotionConfig reducedMotion="user"`. The hero text only moves, never fades in from nothing, so it shows on the first paint. Content that fades in on scroll goes through `Reveal` (`src/v2/components/Reveal/Reveal.tsx`); a `<noscript>` style in `_document.tsx` shows it without JavaScript.
- **After a deploy that changes search-visible content:** Kevin can request indexing in Google Search Console, and refresh LinkedIn's cached preview at linkedin.com/post-inspector if the share image or title changed.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
