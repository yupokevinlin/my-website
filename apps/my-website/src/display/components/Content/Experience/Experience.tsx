import React from "react";
import { Paper, Typography, Link } from "@/components";
import NavigationUtils from "../../../../helpers/NavigationUtils";
import useWidth from "../../../../hooks/useWidth";
import { Breakpoint } from "@/components/types";

interface ExperienceEntry {
  logo: string;
  company: string;
  url: string;
  role: string;
  description: string;
  achievements: string[];
  date: string;
}

interface RoleEntry {
  role: string;
  achievements: string[];
  dateDisplay: string; // "Mar 2024 - Present - Vancouver, Canada"
}

interface ExperienceGroup {
  logo: string;
  company: string;
  url: string;
  description: string;
  overallRange: string;  // "Aug 2021 - Present"
  totalDuration: string; // "4 yrs 9 mos"
  roles: RoleEntry[];
}

// --- Date helpers -----------------------------------------------------------
const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};
const NOW = { year: 2026, month: 4 }; // May 2026

function parseMonthYear(s: string): { year: number; month: number; display: string } {
  const t = s.trim();
  if (t === "Present") return { ...NOW, display: "Present" };
  const [mon, yr] = t.split(" ");
  return { year: parseInt(yr, 10), month: MONTH_MAP[mon] ?? 0, display: t };
}

function monthsDiff(a: { year: number; month: number }, b: { year: number; month: number }): number {
  return (b.year - a.year) * 12 + (b.month - a.month);
}

function formatDuration(months: number): string {
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos} mo${mos !== 1 ? "s" : ""}`;
  if (mos === 0) return `${yrs} yr${yrs !== 1 ? "s" : ""}`;
  return `${yrs} yr${yrs !== 1 ? "s" : ""} ${mos} mo${mos !== 1 ? "s" : ""}`;
}

/** "Mar 2024 - Present | Vancouver, Canada" -> { start, end, location } */
function parseDateString(dateStr: string) {
  const [rangePart, location = ""] = dateStr.split(" | ");
  const dash = rangePart.indexOf(" - ");
  const startStr = rangePart.slice(0, dash).trim();
  const endStr   = rangePart.slice(dash + 3).trim();
  return { start: parseMonthYear(startStr), end: parseMonthYear(endStr), location };
}

// --- Raw entries (unchanged data) -------------------------------------------
const entries: ExperienceEntry[] = [
  { logo: "./resources/images/experience/bestBuy.svg", company: "BEST BUY", url: "https://www.bestbuy.com/", role: "Senior Software Engineer (Developer III)", description: "Best Buy is a large American multinational retailer providing technology related products and services", achievements: ["\u2022 Engineered an AI-enhanced customer experience for mobile phone purchases at Best Buy Canada, improving in-store conversion and satisfaction.", "\u2022 Designed and built AI-powered workflows to modernize and streamline retail operations across Best Buy Canada Stores.", "\u2022 Spearheaded the Mobile Activation team\u2019s shift to AI-driven development, establishing new tooling standards and practices adopted across the team.", "\u2022 Lead the front-end development of Best Buy Canada\u2019s design system, delivering a consistent and scalable component library used across retail applications.", "\u2022 Served as lead front-end developer on the Stores Mobile Activation team; trained and mentored multiple back-end engineers who successfully transitioned into full-stack roles.", "\u2022 Built an Android application for warehouse operations that directly contributed to the recovery and preservation of $18M in vendor funding."], date: "Mar 2024 - Present | Vancouver, Canada" },
  { logo: "./resources/images/experience/bestBuy.svg", company: "BEST BUY", url: "https://www.bestbuy.com/", role: "Software Engineer (Developer II)", description: "Best Buy is a large American multinational retailer providing technology related products and services", achievements: ["\u2022 Lead developer for the Enterprise Returns Application (ERA). The ERA application is used in all stores to help customers with returns and was urgently needed to not cause delay of the roll out of Best Buy's new transaction system. This was completed on schedule in 4 months using Nx, TypeScript, Next.js, Next Auth, and React.", "\u2022 Saved more than 3 hours weekly by automating the build, release, and release approval processes.", "\u2022 Automated the migration from Bitbucket to GitHub using simple-git and Node.js to remove old and merged branches."], date: "Aug 2021 - Mar 2024 | Vancouver, Canada" },
  { logo: "./resources/images/experience/serviceLink.svg", company: "SERVICE LINK", url: "https://www.servicelinksoftware.com/", role: "Software Engineer", description: "Service Link is a workforce management software company servicing some of the largest utility companies in North America", achievements: ["\u2022 Architected and designed the new client UI using React, Microsoft Fluent UI, Typescript, Redux, and Redux Sagas.", "\u2022 Modernized and automated the build process and release notes generation using the Jenkins pipeline. Saved many hours with each release.", "\u2022 Improved and simplified the client application login process with Microsoft Azure Active Directory.", "\u2022 Attracted new customers by replacing the existing map with the ESRI map.", "\u2022 Transitioned the client application from jQuery to React. Dramatically increased UI development speed by introducing modular components."], date: "Jul 2019 - Aug 2021 | Vancouver, Canada" },
  { logo: "./resources/images/experience/serviceLink.svg", company: "SERVICE LINK", url: "https://www.servicelinksoftware.com/", role: "Software Support Engineer", description: "Service Link is a workforce management software company servicing some of the largest utility companies in North America", achievements: ["\u2022 Strengthened application security using Nginx which allowed the application to pass the HCL (IBM) AppScan.", "\u2022 Customized the JIRA workflow using the JIRA script runner plugin.", "\u2022 Created a dynamic PDF report generator using Apache PDFBox.", "\u2022 Greatly improved the quality of release by replacing the Centralized Workflow with the Gitflow Workflow."], date: "Jul 2018 - Jul 2019 | Vancouver, Canada" },
  { logo: "./resources/images/experience/protrade.svg", company: "PROTRADE ASIA LIMITED", url: "http://www.protrade.org/", role: "Contracted Software Developer", description: "Protrade is a full service trading and logistics company dealing in industrial raw materials", achievements: ["\u2022 Created an App written in Electron, React, and Express to parse thousands of excel spreadsheets and organize data.", "\u2022 Improved old VBA macro enhanced excel spreadsheets and reduced processing times by 3x."], date: "Mar 2021 - Jun 2021 | Vancouver, Canada" },
  { logo: "./resources/images/experience/protrade.svg", company: "PROTRADE ASIA LIMITED", url: "http://www.protrade.org/", role: "Contracted VBA Developer", description: "Protrade is a full service trading and logistics company dealing in industrial raw materials", achievements: ["\u2022 Designed a VBA enhanced Customer Relationship Management excel spreadsheet.", "\u2022 Created a VBA enhanced excel spreadsheet to generate graphical reports."], date: "Aug 2017 - Sep 2017 | Toronto, Canada" },
  { logo: "./resources/images/experience/protrade.svg", company: "PROTRADE ASIA LIMITED", url: "http://www.protrade.org/", role: "Special Assistant", description: "Protrade is a full service trading and logistics company dealing in industrial raw materials", achievements: ["\u2022 Designed software to automatically send price updates via e-mails using VBA. Reduced time spent by 80%.", "\u2022 Created VBA macro enhanced excel spreadsheets to calculate and manipulate sales data to generate graphical reports.", "\u2022 Provided training for sales staff regarding the petrochemical supply chain.", "\u2022 Designed trade show posters and content.", "\u2022 Coordinated quarterly cross office meetings."], date: "Oct 2016 - Jun 2017 | Taipei, Taiwan" },
];

// --- Build grouped entries --------------------------------------------------
const groupedEntries: ExperienceGroup[] = (() => {
  const groups: ExperienceGroup[] = [];

  entries.forEach((entry) => {
    const parsed = parseDateString(entry.date);
    const dateDisplay = `${parsed.start.display} - ${parsed.end.display}${parsed.location ? ` \u00B7 ${parsed.location}` : ""}`;

    const existing = groups.find((g) => g.company === entry.company);
    if (existing) {
      existing.roles.push({ role: entry.role, achievements: entry.achievements, dateDisplay });
    } else {
      groups.push({
        logo: entry.logo,
        company: entry.company,
        url: entry.url,
        description: entry.description,
        overallRange: "",
        totalDuration: "",
        roles: [{ role: entry.role, achievements: entry.achievements, dateDisplay }],
      });
    }
  });

  // Compute overall range & duration per group
  groups.forEach((group) => {
    const parsedDates = entries
      .filter((e) => e.company === group.company)
      .map((e) => parseDateString(e.date));

    const earliest = parsedDates.reduce((a, b) =>
      monthsDiff(NOW, a.start) > monthsDiff(NOW, b.start) ? b : a
    );
    const latest = parsedDates.reduce((a, b) =>
      monthsDiff(NOW, a.end) < monthsDiff(NOW, b.end) ? b : a
    );

    group.overallRange  = `${earliest.start.display} - ${latest.end.display}`;
    // Sum only actual time worked (excludes gaps between roles)
    const totalMonths   = parsedDates.reduce((sum, d) => sum + monthsDiff(d.start, d.end), 0);
    group.totalDuration = formatDuration(totalMonths);
  });

  return groups;
})();

// --- Component --------------------------------------------------------------
const Experience: React.FC = () => {
  const width: Breakpoint = useWidth();

  // Center the dot on content-font-body's first line.
  // Formula: (lineHeight - dotSize) / 2  where dotSize = 12px
  // lineHeight values match the globals.css content-font-body media queries.
  const dotMarginTop: string =
    /xs/.test(width) ? "calc(2.64vw - 6px)"   // line-height: 5.28vw
    : /sm/.test(width) ? "calc(1.585vw - 6px)" // line-height: 3.17vw
    : /md/.test(width) ? "calc(1.31vw - 6px)"  // line-height: 2.62vw
    : "calc(0.96vw - 6px)";                    // line-height: 1.92vw (lg / xl)

  // Equal gaps on both sides of each dot (gap = G = 10px).
  // gap-below = line.marginTop = G  (always)
  // gap-above = prev.line.marginBottom + dotMarginTop = G
  //   => line.marginBottom = G - dotMarginTop = calc(10px - dotMarginTop)
  //      Substituting dotMarginTop per breakpoint:  G=10, offset=6  =>  G+offset = 16
  const LINE_GAP = 10; // px - gap between dot edge and line end/start
  const lineMarginBottom: string =
    /xs/.test(width) ? `calc(${LINE_GAP + 6}px - 2.64vw)`   // calc(16px - 2.64vw)
    : /sm/.test(width) ? `calc(${LINE_GAP + 6}px - 1.585vw)` // calc(16px - 1.585vw)
    : /md/.test(width) ? `calc(${LINE_GAP + 6}px - 1.31vw)`  // calc(16px - 1.31vw)
    : `calc(${LINE_GAP + 6}px - 0.96vw)`;                    // calc(16px - 0.96vw)

  return (
  <div className="w-full flex flex-col items-center justify-center h-max content-grid-bg">
    {groupedEntries.map((group, i) => (
      <React.Fragment key={i}>
        <div className="paper-spacer"/>
        <Paper className="content-paper" elevation={3}>
          <div className="content-inner">

            {/* -- Company header (LinkedIn-style) -- */}
            <div className="flex flex-row items-center w-full" style={{ gap: "clamp(12px, 3vw, 20px)" }}>
              {/* Logo - fixed equal-width container, full-size image */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ width: "clamp(80px, 20vw, 140px)", height: "clamp(36px, 8vw, 60px)" }}
              >
                <img
                  src={group.logo}
                  alt={group.company}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {/* Company info */}
              <div className="flex flex-col justify-center gap-[0.5vw] sm:gap-1">
                <Link
                  className="content-font-link font-weight-medium hover:!bg-transparent active:!bg-transparent"
                  underline="hover"
                  style={{ color: "var(--primary-main)", height: "auto", lineHeight: "1.2", alignSelf: "flex-start" }}
                  onClick={() => NavigationUtils.goToWebsite(group.url)}
                >
                  {group.company}
                </Link>
                <Typography
                  className="content-font-body"
                  style={{ color: "var(--secondary-main)" }}
                >
                  {group.overallRange} {"\u00B7"} {group.totalDuration}
                </Typography>
              </div>
            </div>

            <div className="content-divider"/>

            {/* -- Description -- */}
            <Typography className="content-font-body !italic" style={{ color: "var(--secondary-dark)" }}>
              {group.description}
            </Typography>

            <div className="text-spacer"/>

            {/* -- Roles timeline -- */}
            <div className="w-full">
              {group.roles.map((roleEntry, j) => {
                const isLast = j === group.roles.length - 1;
                return (
                  <div key={j} style={{ display: "flex", flexDirection: "row", gap: "clamp(10px, 2.5vw, 16px)" }}>

                    {/* Left column: dot + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "12px" }}>
                      {/* Dot */}
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary-main)",
                        flexShrink: 0,
                        marginTop: dotMarginTop,
                      }}/>
                      {/* Line segment below dot (with gap top & bottom) */}
                      <div style={{
                        flex: 1,
                        width: "2px",
                        backgroundColor: "var(--primary-light)",
                        marginTop: `${LINE_GAP}px`,
                        marginBottom: lineMarginBottom,
                      }}/>
                    </div>

                    {/* Right column: role content */}
                    <div style={{ flex: 1, paddingBottom: isLast ? 0 : "clamp(14px, 3.5vw, 22px)" }}>
                      <Typography
                        className="content-font-body font-weight-medium"
                        style={{ color: "var(--primary-main)" }}
                      >
                        {roleEntry.role}
                      </Typography>
                      <div style={{ height: "clamp(4px, 1vw, 6px)" }}/>
                      <Typography className="content-font-body" style={{ color: "var(--secondary-main)" }}>
                        {roleEntry.dateDisplay}
                      </Typography>
                      <div style={{ height: "clamp(6px, 1.5vw, 10px)" }}/>
                      {roleEntry.achievements.map((ach, k) => (
                        <React.Fragment key={k}>
                          <div style={{ height: "clamp(4px, 1vw, 6px)" }}/>
                          <Typography className="content-font-body" style={{ color: "var(--secondary-dark)" }}>
                            {ach}
                          </Typography>
                        </React.Fragment>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </Paper>
      </React.Fragment>
    ))}
    <div className="paper-spacer"/>
    </div>
  );
};

export default Experience;
