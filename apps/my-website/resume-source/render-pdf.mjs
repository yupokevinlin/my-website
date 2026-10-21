// Renders kevin-lin-resume.html, the resume's source (two fixed US Letter pages), to the PDF the
// site serves, public/resources/resume/kevin-lin-resume.pdf, with the repo's Playwright Chromium
// (run `npx playwright install` once). The HTML embeds its font and QR code, so no internet
// connection is needed, and printing it from Chrome or Edge with no margins gives the same pages.
//
// From the repo root:  node apps/my-website/resume-source/render-pdf.mjs [html] [pdf] [--png <dir>]
//   --png <dir>  also saves a PNG of each page (2x) there, for a quick look.
// It prints how much room is left on each page; "OVERFLOWS" means text would be cut off.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const pngIndex = args.indexOf("--png");
const pngDir = pngIndex >= 0 ? path.resolve(args.splice(pngIndex, 2)[1]) : null;
const htmlPath = path.resolve(args[0] || path.join(here, "kevin-lin-resume.html"));
const pdfPath = path.resolve(args[1] || path.join(here, "..", "public", "resources", "resume", "kevin-lin-resume.pdf"));

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });
await page.pdf({ path: pdfPath, format: "Letter", printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
console.log("wrote " + pdfPath);

// Chromium writes a variable font into a PDF as Type 3 fonts: glyphs drawn as shapes, which PDF
// readers can't select or highlight properly. The HTML embeds static weights for that reason;
// this catches a variable font creeping back in.
const type3 = (fs.readFileSync(pdfPath, "latin1").match(/\/Subtype\s*\/Type3\b/g) || []).length;
console.log(type3 ? "WARNING: " + type3 + " Type 3 fonts in the PDF, so its text won't select properly. Embed static fonts, not a variable font." : "fonts: embedded as real fonts, no Type 3");

// Room left on each page: from the lowest piece of content (the footer doesn't count) to the
// bottom of the text area. Chromium hides anything past the page's edge, so watch for OVERFLOWS.
const metrics = await page.evaluate(() =>
  [...document.querySelectorAll(".page")].map((p, i) => {
    const r = p.getBoundingClientRect();
    const areaBottom = r.bottom - parseFloat(getComputedStyle(p).paddingBottom);
    let bottom = r.top;
    for (const el of p.querySelectorAll("*")) {
      if (el.closest(".foot")) continue;
      const b = el.getBoundingClientRect();
      if (b.height > 0 && b.bottom > bottom) bottom = b.bottom;
    }
    const free = (areaBottom - bottom) * 0.75;
    const fonts = [...new Set([...p.querySelectorAll("h1, h2, h3, h4, p, li, dt, dd, span")].map((el) => getComputedStyle(el).fontFamily.split(",")[0]))].join(", ");
    return "page " + (i + 1) + ": " + (free >= 0 ? free.toFixed(1) + " pt free" : "OVERFLOWS by " + (-free).toFixed(1) + " pt") + " (font: " + fonts + ")";
  }),
);
console.log(metrics.join("\n"));

if (pngDir) {
  fs.mkdirSync(pngDir, { recursive: true });
  const pages = await page.$$(".page");
  for (let i = 0; i < pages.length; i++) {
    const file = path.join(pngDir, "page-" + (i + 1) + ".png");
    await pages[i].screenshot({ path: file });
    console.log("wrote " + file);
  }
}
await browser.close();
