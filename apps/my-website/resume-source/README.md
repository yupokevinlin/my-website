# Resume source

The resume the site serves, `public/resources/resume/kevin-lin-resume.pdf`, is rendered from `kevin-lin-resume.html` here. Nothing in this folder is published; `public/` is.

| File | What it is |
|---|---|
| `kevin-lin-resume.html` | The resume: two fixed US Letter pages. The text and the CSS at the top are the parts to edit. The generated `<style>` at the very end of the file (the embedded font) and the inline QR code `<svg>` in the header are not meant to be edited. |
| `render-pdf.mjs` | Renders the PDF: `node apps/my-website/resume-source/render-pdf.mjs` from the repo root (`--png <dir>` also saves a PNG of each page). It prints how much room is left on each page and says OVERFLOWS when text would be cut off, since Chromium hides anything past a page's edge. No internet needed. |
| `Kevin Lin's Resume.pub`, `QRCode.svg` | The former Microsoft Publisher source and its QR code, kept for reference. Publisher was retired from Microsoft 365 in October 2026, and this file no longer feeds the PDF. |

The same pages come out of Chrome or Edge: open the HTML, print to Save as PDF, paper size Letter, margins None, scale 100 %, headers and footers off. Background colours print on their own (`print-color-adjust: exact`). On screen, the browser shows the two pages as sheets on a grey background; that styling is screen-only.

## Design

- Type: Inter, the website's font, as a variable font (Latin subset, 48 KB from Google Fonts) embedded in the file as base64, so the layout is identical on any machine, online or offline. Body 9.5 pt on 12.9 pt; name 27 pt.
- Colours from the site's default (winter) palette: accent `#306596` for section labels, role titles, bullets and icons; links `#2c5e8b`; ink `#161b22`; body `#333c47`; secondary `#5b6673`; rules `#d9e1ea`; tag backgrounds `#eef4fa`.
- Header: name, title line, the site's pitch as a two-line summary, and the QR code with its caption; then a three-column contact grid with line icons. Links show readable short forms but point at the full URLs.
- Sections: uppercase letter-spaced labels with a rule. Companies are bold with their one-line description beside them; each role has its dates and location on the right and round accent bullets. Projects carry their stack as tags. Skills are a label column and dot-separated lists. Education and Languages share the bottom row, with the language badges all the width of the widest one.
- The `<title>`, "Kevin Lin – Resume", becomes the PDF's document title, which Google shows in search results. Keep it.

## The QR code

It encodes `https://kevinyupolin.dev/`, generated with the `qrcode` npm package (version 2, error correction M) and drawn inline as an SVG with a 4-module quiet zone inside its 68 pt box. The old `QRCode.svg` had a 0.3-module quiet zone and sat right under a line of text, which is why phones struggled with it. If the URL ever changes, regenerate the `<path>` and keep the quiet zone.

## Content

The content mirrors the site's data (`src/data/*.ts`), so a change there belongs here too (AGENTS.md, "When Kevin's experience changes").

- Title line: `profile.title`. Summary: `profile.pitch`, with the years counted from `careerStart` (October 2016). Contact: `profile`, plus the phone number, which is not on the site.
- Experience, in the site's order: Best Buy Canada and ForteCare carry all their `highlights` and `more` bullets. ServiceLink and Protrade are shortened on purpose, because they matter less now: ServiceLink keeps the three Software Engineer `highlights` and one Software Support Engineer bullet; Protrade keeps the Special Assistant role with two bullets, without the two contract roles.
- Projects match the site's Projects section: ForteCare and Relativistic Ray Tracing with the site's descriptions and tags (the ray-tracing project carries no links on the resume), then the four earlier projects as a compact grid with their years and stacks.
- Skills: the site's groups, every item, in the site's order, with the sub-rows merged into their group.
- Education and languages: `src/data/about.ts`.

Page 1 has about 15 pt to spare and page 2 about 8 pt, so adding a line means removing one, or shaving `line-height` (12.9 pt) or the bullet gap (2.4 pt).
