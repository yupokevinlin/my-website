# Kevin Lin's portfolio: kevinyupolin.dev

Kevin's personal site. Recruiters find it from LinkedIn, his resume and searches for his name, so keep it accurate, consistent with LinkedIn, and easy for search engines to read.

- Next.js 16 (pages router), React 19, Tailwind v4, in an Nx workspace. The app is `apps/my-website`.
- Static export (`output: "export"`, `images.unoptimized`) to `dist/apps/my-website`, hosted on Firebase Hosting (`firebase.json`). There is no server and no Next.js image optimization.
- Pages: `/`, the portfolio (`pages/index.tsx` → `src/root/App` → `src/display/pages/MainPage`), and the ray-tracing guide `/ray-tracing` with four simulation pages (`pages/ray-tracing/*.tsx`).
- Test: `npx nx run my-website:test`. Build: `npm run build:my-website`. Deploy: `npm run deploy:my-website`. Deploying updates the live site, so do it only when Kevin asks.
- Branches: `main` is the only long-lived branch. Work on a feature branch and open a pull request into `main`. There is no `develop` or `master`.

## Where things live

All paths below are under `apps/my-website/`.

| What | Where |
|---|---|
| Name, headline, job title, employer, location, email, LinkedIn, GitHub, resume path | `src/data/profile.ts` (`profile`) |
| Home page title, description and share image | `src/data/profile.ts` (`homeSeo`) |
| Home page JSON-LD (Person + WebSite) | `src/data/profile.ts` (`homeJsonLd`), rendered in `pages/index.tsx` |
| Jobs and achievements | `src/display/components/Content/Experience/Experience.tsx` (`entries`) |
| About text | `src/display/components/Content/About/About.tsx` |
| Projects, with their screenshots and alt text | `src/display/components/Content/Projects/Projects.tsx` |
| Skills, Languages, Education | `src/display/components/Content/{Skills,Languages,Education}/` |
| Contact links | `Contact.tsx`, which reads `profile` |
| Share image (1200 × 630) | `public/resources/og-image.png`, rendered from `scripts/og-image/og-image.html` by `node apps/my-website/scripts/og-image/render.mjs` |
| Resume | `public/resources/resume/kevin-lin-resume.pdf`. Kevin exports it from `resume-source/Kevin Lin's Resume.pub`, which sits next to the QR code image it uses. Keep source files out of `public/`, because everything in it is published. `firebase.json` redirects the old "Kevin Lin's Resume.pdf" URL here. |
| Ray-tracing page titles and descriptions | the `SimulationsHead` props in each `pages/ray-tracing/*.tsx` |
| Ray-tracing JSON-LD and the guide's dates | `src/display/components/Simulations/SimulationsHead/SimulationsHead.tsx` |
| Sitemap, robots | `public/sitemap.xml`, `public/robots.txt` |

## When Kevin's experience changes

For a new job, promotion, title change, new achievement or new project, go through this whole list. Many of these places repeat the same facts, and search engines trust the site more when they all agree.

1. **Experience**: edit `entries` in `Experience.tsx`, newest first. Dates are `"Mon YYYY - Present | City, Country"`. Entries with the same `company` string group into one card. Durations count up to the build month on their own, so don't hardcode them.
2. **Current role**: if the title or employer changed, update `jobTitle`, `employer` and, if his positioning changed, `headline` in `profile.ts`. Then rewrite `homeSeo.title` and `homeSeo.description` and the Person `description` in `homeJsonLd`. Keep the title at 60 characters or less, starting with "Kevin Lin". Keep the description between 150 and 160 characters.
3. **About**: the intro line and first paragraph name his current role and team. The second paragraph says "Eight years into building software". He started in July 2018, so that number goes up every July.
4. **Share image**: change the title line in `scripts/og-image/og-image.html`, run `render.mjs`, and look at the PNG before committing.
5. **Resume**: Kevin re-exports the PDF from Publisher. Keep the file name `kevin-lin-resume.pdf`, and set the PDF's document title to "Kevin Lin – Resume", because Google shows that title in results.
6. **Skills**: add an icon to `public/resources/images/skills/` and an entry in `Skills.tsx`.
7. **Sitemap**: set `<lastmod>` for `/` in `public/sitemap.xml` to today's date.
8. **LinkedIn**: remind Kevin to make the same change on LinkedIn (headline, About, Experience). Never sign in to or edit his LinkedIn without his explicit permission.
9. Run the tests and the build, and show Kevin the result before deploying.

Decisions Kevin has made. Ask him before changing any of these:

- ForteCare (he's CTO & co-founder) stays off the site. It's on LinkedIn only, described at a high level.
- COVID-19 Tracker and Write My MP are archived: their live sites are offline, so they link to the GitHub repos.
- His phone number isn't on the site.
- `alternateNames` in `profile.ts` ("Kevin Yupo Lin", "Yupo Lin") are other names people may search for.

## SEO rules

Tests in `apps/my-website/specs/index.spec.tsx` check most of these. If you change the structure on purpose, update the tests. Don't delete them to get a pass.

- **Headings.** Each page has exactly one `h1`. On the home page, the top bar name is the `h1`. Section titles (`SectionWrapper`) are `h2`. Companies, projects, skill groups, languages, schools and contact methods are `h3`, and job titles are `h4`. Use `<Typography component="h3">`; Tailwind's preflight resets heading styles, so it looks the same as a `<p>`. To make a link a heading, wrap it in `<h3 className="contents">`.
- **Links.** Anything that navigates uses `<Link href>` or `<Button href>` from `components/`. Both render a real `<a>`: site paths go through next/link, and http(s) links open in a new tab. Never navigate with `onClick` plus `window.open` or `router.push`, or with a `role="link"` span, because search engines can't follow them. Add `rel="me"` to links to Kevin's own profiles.
- **New profiles.** For a new public profile (X, Bluesky, dev.to and so on), add it to `profile.ts`, to `sameAs` in `homeJsonLd`, and to Contact with `rel="me"`.
- **New pages.** A new public page needs its own title (60 characters or less), a description (150–160 characters), a canonical URL and Open Graph/Twitter tags (`SimulationsHead` does this for ray-tracing pages). Add it to `sitemap.xml` with a `<lastmod>`, and link to it from an existing page with a real `<a>`.
- **Ray-tracing guide.** When the guide's content changes, bump `GUIDE_MODIFIED` in `SimulationsHead.tsx` and that page's `<lastmod>` in the sitemap.
- **Images.** Every content image gets an alt that describes what it shows. Carousel images are `{ src, alt }`, and images below the fold get `loading="lazy"`. Keep screenshots 1920 px wide or less, since nothing resizes them at build time. Save screenshots as WebP with `node apps/my-website/scripts/to-webp.mjs <files>` (quality 80, or `--quality 85` for ray-tracing renders), then delete the originals. Three kinds of image stay as they are: og:image files stay PNG or JPG, because LinkedIn doesn't show WebP previews; the Milky Way sky faces stay JPG, because they hold encoded brightness data that lossy WebP changes; and icons stay SVG.
- **Colour contrast.** Small text in the season colour uses `--primary-text`, not `--primary-main`. Winter, spring and autumn's main colours are below 4.5:1 on white, and `--primary-text` meets it in every season. A new season in `SEASON_VARS` (`MainPage.tsx`) needs its own `--primary-text`. Icon-only buttons need an `aria-label`; `specs/index.spec.tsx` checks this.
- **Loading screen.** It waits only for the winter picture (preloaded in `pages/index.tsx`), and for 3 s at most. The other seasons load behind the page. A season switch waits until that season's picture has loaded, so the crossfade stays smooth.
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
