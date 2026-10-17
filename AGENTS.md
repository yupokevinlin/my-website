# Kevin Lin's portfolio: kevinyupolin.dev

Kevin's personal site. Recruiters find it from LinkedIn, his resume and searches for his name, so keep it accurate, consistent with LinkedIn, and easy for search engines to read.

- Next.js 16 (pages router), React 19, Tailwind v4, in an Nx workspace. The app is `apps/my-website`.
- Static export (`output: "export"`, `images.unoptimized`) to `dist/apps/my-website`, hosted on Firebase Hosting (`firebase.json`). There is no server and no Next.js image optimization.
- Pages: `/`, the portfolio (`pages/index.tsx` → `src/v2/HomePage`); `/v1`, the previous design (`pages/v1.tsx` → `src/root/App` → `src/display/pages/MainPage`), frozen and `noindex`, so don't update it; and the ray-tracing guide `/ray-tracing` with four simulation pages (`pages/ray-tracing/*.tsx`). `/v2` redirects to `/` (`firebase.json`).
- The home page (`src/v2/`) opens on a full-screen seasonal scene. The season follows the calendar in Vancouver (Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter), and the switch in the top bar changes it for the visit. `SEASON_SCRIPT` in `src/v2/season.ts` sets `html[data-season]` before the first paint, so CSS shows the right colours, scene and switch ring before React runs. The season colours are CSS variables in the "v2 home page" block of `styles/globals.css`.
- Test: `npx nx run my-website:test`. Accessibility: `npx nx run @org/my-website-e2e:e2e` runs axe on the home page in every season at phone and desktop widths, against the dev server (run `npx playwright install` once first). Build: `npm run build:my-website`. Deploy: `npm run deploy:my-website`. Deploying updates the live site, so do it only when Kevin asks.
- Branches: `main` is the only long-lived branch. Work on a feature branch and open a pull request into `main`. There is no `develop` or `master`.

## Where things live

All paths below are under `apps/my-website/`.

| What | Where |
|---|---|
| Name, job title, employer, start-up, location, email, LinkedIn, GitHub, resume path | `src/data/profile.ts` (`profile`) |
| Hero: eyebrow line, pitch, skills line, the date "years building software" counts from | `src/data/profile.ts` (`title`, `pitch`, `heroSkills`, `careerStart`) |
| Home page title, description and share image | `src/data/profile.ts` (`homeSeo`) |
| Home page JSON-LD (Person + WebSite) | `src/data/profile.ts` (`homeJsonLd`), rendered in `pages/index.tsx` |
| Jobs and achievements | `src/data/experience.ts` (`experience`, and `earlyExperience` for the folded Protrade roles) |
| About text, languages, education | `src/data/about.ts` |
| Projects, with their screenshots and alt text | `src/data/projects.ts`; images in `public/resources/images/projects/` |
| Skills and their logos | `src/data/skills.ts`; logos in `public/resources/images/skills/` |
| Contact links | `src/v2/components/Contact.tsx`, which reads `profile` |
| Season colours, scenes and the head script | `styles/globals.css` ("v2 home page"), `src/v2/season.ts` |
| Share image (1200 × 630) | `public/resources/og-image.png`, rendered from `scripts/og-image/og-image.html` by `node apps/my-website/scripts/og-image/render.mjs` |
| Resume | `public/resources/resume/kevin-lin-resume.pdf`. Kevin exports it from `resume-source/Kevin Lin's Resume.pub`, which sits next to the QR code image it uses. Keep source files out of `public/`, because everything in it is published. `firebase.json` redirects the old "Kevin Lin's Resume.pdf" URL here. |
| Ray-tracing page titles and descriptions | the `SimulationsHead` props in each `pages/ray-tracing/*.tsx` |
| Ray-tracing JSON-LD and the guide's dates | `src/display/components/Simulations/SimulationsHead/SimulationsHead.tsx` |
| Sitemap, robots | `public/sitemap.xml`, `public/robots.txt` |

## When Kevin's experience changes

For a new job, promotion, title change, new achievement or new project, go through this whole list. Many of these places repeat the same facts, and search engines trust the site more when they all agree.

1. **Experience**: edit `src/data/experience.ts`, newest first. Dates are `"Mon YYYY"` or `"Present"`; a company's roles sit in one card, newest first. Put the three or four strongest bullets in `highlights`, leading with the result or the number, and the rest in `more` (behind "Show more"). Durations count up to the build month on their own, so don't hardcode them.
2. **Current role**: if the title or employer changed, update `jobTitle`, `employer`, `title` and `pitch` in `profile.ts`. Then rewrite `homeSeo.title` and `homeSeo.description` and the Person `description` in `homeJsonLd`. Keep the title at 60 characters or less, starting with "Kevin Lin". Keep the description between 150 and 160 characters.
3. **About**: `src/data/about.ts` names his current roles, and so does its "Now" line. "Ten years into building software" and the hero's "10 years" count from `careerStart` (October 2016) at build time, so they update on their own.
4. **Share image**: change the title line in `scripts/og-image/og-image.html`, run `render.mjs`, and look at the PNG before committing. Then bump the `?v=` number on `homeSeo.image` in `profile.ts`. LinkedIn caches images by URL, so it keeps showing the old picture (or none) until the URL changes. After deploying, re-inspect the page at linkedin.com/post-inspector.
5. **Resume**: Kevin re-exports the PDF from Publisher. Keep the file name `kevin-lin-resume.pdf`, and set the PDF's document title to "Kevin Lin – Resume", because Google shows that title in results.
6. **Skills**: add an entry to a group in `src/data/skills.ts`. If the skill has a logo, add a square mark (not a wordmark: it shows at 18 px) to `public/resources/images/skills/`.
7. **Sitemap**: set `<lastmod>` for `/` in `public/sitemap.xml` to today's date.
8. **LinkedIn**: remind Kevin to make the same change on LinkedIn (headline, About, Experience). Never sign in to or edit his LinkedIn without his explicit permission.
9. Run the tests and the build, and show Kevin the result before deploying.

Decisions Kevin has made. Ask him before changing any of these:

- ForteCare (he's CTO & co-founder) is on the site: an Experience entry with the three bullets Kevin approved, the first featured project, and a `worksFor` in the JSON-LD. Ask him before adding more detail about it.
- `/v1` is a frozen snapshot of the previous design. Experience updates only touch the new home page.
- COVID-19 Tracker and Write My MP are archived: their live sites are offline, so they link to the GitHub repos.
- His phone number isn't on the site.
- `alternateNames` in `profile.ts` ("Kevin Yupo Lin", "Yupo Lin") are other names people may search for.

## SEO rules

Tests in `apps/my-website/specs/index.spec.tsx` check most of these. If you change the structure on purpose, update the tests. Don't delete them to get a pass.

- **Headings.** Each page has exactly one `h1`. On the home page, the name in the hero is the `h1`. Section titles (`src/v2/components/Section.tsx`) are `h2`. Companies, projects, skill groups and contact methods are `h3`, and job titles are `h4`. Tailwind's preflight resets heading styles, so a heading looks like whatever its classes say.
- **Links.** Anything that navigates is a real `<a href>`: a plain `<a>` on the home page, and `<Link href>` or `<Button href>` from `components/` in the ray-tracing guide. Links to other sites open in a new tab. Never navigate with `onClick` plus `window.open` or `router.push`, or with a `role="link"` span, because search engines can't follow them. Add `rel="me"` to links to Kevin's own profiles.
- **Folded content.** "Show more" and "Early experience" keep their text in the page (`Collapse.tsx`, `inert` while closed), so search engines still read it. Don't change them to render only when opened.
- **New profiles.** For a new public profile (X, Bluesky, dev.to and so on), add it to `profile.ts`, to `sameAs` in `homeJsonLd`, and to Contact with `rel="me"`.
- **New pages.** A new public page needs its own title (60 characters or less), a description (150–160 characters), a canonical URL and Open Graph/Twitter tags (`SimulationsHead` does this for ray-tracing pages). Add it to `sitemap.xml` with a `<lastmod>`, and link to it from an existing page with a real `<a>`.
- **Ray-tracing guide.** When the guide's content changes, bump `GUIDE_MODIFIED` in `SimulationsHead.tsx` and that page's `<lastmod>` in the sitemap.
- **Images.** Every content image gets an alt that describes what it shows (project images: `image.alt` in `projects.ts`). A logo or icon next to its own name is decorative: `alt=""` and `aria-hidden="true"`. Images below the fold get `loading="lazy"`. Keep screenshots 1920 px wide or less, since nothing resizes them at build time. Save screenshots as WebP with `node apps/my-website/scripts/to-webp.mjs <files>` (quality 80, or `--quality 85` for ray-tracing renders), then delete the originals. Three kinds of image stay as they are: og:image files stay PNG or JPG, because LinkedIn doesn't show WebP previews; the Milky Way sky faces stay JPG, because they hold encoded brightness data that lossy WebP changes; and icons stay SVG.
- **Colour contrast.** On the home page, `--v2-accent` text is at least 4.5:1 on white, on the grey wash and on the season tint, and white text on `--v2-accent-strong` is too. The scene shows through the hero's frosted card, so text there uses `--v2-accent-strong`, `--v2-body` or `--v2-ink`, never `--v2-accent` or `--v2-muted`. After changing a season colour, run the accessibility e2e test. Icon-only buttons need an `aria-label`; `specs/index.spec.tsx` checks this.
- **Animations.** The home page uses framer-motion's small `m` components inside `LazyMotion strict` (a plain `motion.div` throws there), and `MotionConfig reducedMotion="user"`. The hero text only moves, never fades in from nothing, so it shows on the first paint. Content that fades in on scroll goes through `Reveal` (`src/v2/motion.tsx`); a `<noscript>` style in `_document.tsx` shows it without JavaScript.
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
