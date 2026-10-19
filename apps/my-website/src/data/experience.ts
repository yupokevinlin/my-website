// Kevin's jobs for the home page's Experience section. Best Buy Canada, his main
// job, comes first, then ForteCare, then past jobs newest first. Keep it
// in step with LinkedIn and the resume; AGENTS.md lists everything else to
// update when his experience changes.
//
// Dates are "Mon YYYY" or "Present". Durations count up to the build month on
// their own, so never hardcode them. Each role shows its `highlights` (lead
// with the result or the number); `more` sits behind "Show more".

export interface Role {
  title: string;
  start: string;
  end: string;
  location: string;
  highlights: string[];
  more?: string[];
}

export interface Company {
  name: string;
  url: string;
  // A square mark, shown at 40-56 px
  logo: string;
  // One line on what the company does, for recruiters who don't know it
  about: string;
  roles: Role[];
  // The main tools, shown as chips under the roles
  stack?: string[];
}

export const experience: Company[] = [
  {
    name: "Best Buy Canada",
    url: "https://www.bestbuy.ca/",
    logo: "/resources/images/experience/bestbuy-square.svg",
    about: "Consumer electronics retailer, in stores and online",
    roles: [
      {
        title: "Senior Software Engineer",
        start: "Mar 2024",
        end: "Present",
        location: "Vancouver, BC",
        highlights: [
          "Won Best Buy's hackathon by engineering one of the company's first AI-enhanced customer experiences, streamlining mobile phone purchases to improve in-store conversion and customer satisfaction.",
          "Helped recover and preserve $18M in vendor funding with an Android app for warehouse operations.",
          "Led development of Best Buy Canada's design system: a scalable component library, with shared standards between design and development.",
          "Spearheaded the Mobile Activation team's shift to AI-driven development, setting the tooling standards and practices the team adopted.",
        ],
        more: [
          "As tech lead of the Mobile Activation team, mentored several back-end engineers into successful full-stack roles.",
          "Saved the organization hundreds of hours by shipping, in a single day with AI-assisted development, a browser extension that automated JIRA link migrations during the move to JIRA Cloud.",
        ],
      },
      {
        title: "Software Engineer",
        start: "Aug 2021",
        end: "Mar 2024",
        location: "Vancouver, BC",
        highlights: [
          "Delivered the chain-wide Enterprise Returns Application in four months as development lead, with Nx, TypeScript, Next.js, NextAuth.js and React, keeping the rollout of Best Buy's new transaction system on track.",
          "Saved the Mobile Activation team more than 3 hours a week by automating the build, release and release-approval processes.",
          "Reached the finals of Best Buy's hackathon with an LLM-powered check that flagged when the wrong mobile device was scanned during a sale.",
        ],
      },
    ],
  },
  {
    name: "ForteCare",
    url: "https://fortecare.ai/",
    logo: "/resources/images/experience/fortecare.svg",
    about: "Healthcare AI start-up automating the specialist referral journey",
    roles: [
      {
        title: "Chief Technology Officer & Co-Founder",
        start: "May 2026",
        end: "Present",
        location: "Los Angeles (remote)",
        highlights: [
          "Reduced de-identification cost by 100x and processing time by 10x, while raising accuracy from 97.3% to 99.5%.",
          "Led AI integration across the platform and developed medical MCP servers and skills for LLMs.",
          "Architected the platform: Next.js apps and 15 NestJS microservices on Azure Container Apps in an Nx monorepo, integrating with Epic and Cerner EHRs over FHIR and HL7.",
        ],
      },
    ],
  },
  {
    name: "ServiceLink",
    url: "https://www.servicelinksoftware.com/",
    logo: "/resources/images/experience/servicelink-mark.svg",
    about: "Workforce management software for some of North America's largest utilities",
    roles: [
      {
        title: "Software Engineer",
        start: "Jul 2019",
        end: "Aug 2021",
        location: "Vancouver, BC",
        highlights: [
          "Architected the new client UI with React, Microsoft Fluent UI, TypeScript, Redux and Redux Saga.",
          "Sharply increased UI development speed by migrating the client application from jQuery to modular React components.",
          "Saved hours on every release by modernizing and automating the build and release-notes process with Jenkins pipelines.",
        ],
        more: [
          "Attracted new customers by replacing the legacy mapping component with Esri.",
          "Simplified the client application's sign-in by integrating Microsoft Azure Active Directory.",
        ],
      },
      {
        title: "Software Support Engineer",
        start: "Jul 2018",
        end: "Jul 2019",
        location: "Vancouver, BC",
        highlights: [
          "Strengthened application security with Nginx, so the application passed the HCL (IBM) AppScan.",
          "Improved release quality by replacing the centralized workflow with Gitflow.",
          "Built a dynamic PDF report generator with Apache PDFBox.",
        ],
        more: ["Customized JIRA workflows with the ScriptRunner plugin."],
      },
    ],
  },
];

// Folded under "Early experience" at the end of the timeline
export const earlyExperience: Company[] = [
  {
    name: "Protrade Asia Limited",
    url: "http://www.protrade.org/",
    logo: "/resources/images/experience/protrade-mark.svg",
    about: "Trading and logistics for industrial raw materials",
    roles: [
      {
        title: "Contracted Software Developer",
        start: "Mar 2021",
        end: "Jun 2021",
        location: "Vancouver, BC",
        highlights: [
          "Cut processing times by 3x by modernizing legacy VBA-enhanced Excel spreadsheets.",
          "Built an Electron, React and Express application that parsed and organized data from thousands of Excel spreadsheets.",
        ],
      },
      {
        title: "Contracted VBA Developer",
        start: "Aug 2017",
        end: "Sep 2017",
        location: "Toronto, ON",
        highlights: [
          "Built a VBA-enhanced customer relationship management spreadsheet in Excel.",
          "Created a VBA-enhanced Excel spreadsheet that generated graphical reports.",
        ],
      },
      {
        title: "Special Assistant",
        start: "Oct 2016",
        end: "Jun 2017",
        location: "Taipei, Taiwan",
        highlights: [
          "Cut the time spent on price-update emails by 80% by automating them with VBA.",
          "Created VBA macro-enhanced Excel spreadsheets that turned sales data into graphical reports.",
          "Trained sales staff on the petrochemical supply chain, designed trade show posters and marketing content, and coordinated quarterly cross-office meetings.",
        ],
      },
    ],
  },
];
