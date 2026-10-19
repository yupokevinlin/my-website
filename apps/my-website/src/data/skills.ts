import type { SkillIconName } from "../v2/components/icons/SkillIcon/SkillIcon";

// The home page's Skills section: groups of chips, grouped by what Kevin does
// rather than by kind of tool, leadership first. Each chip is one idea with
// one picture: a tool or product shows its logo (in
// public/resources/images/skills/; prefer a square mark over a wordmark, since
// it shows at 18 px), and an idea or practice shows a line icon from SkillIcon
// in the season's accent.

export interface Skill {
  name: string;
  // File name in /resources/images/skills/
  logo?: string;
  // A line icon, for a skill that has no logo
  icon?: SkillIconName;
}

export interface SkillRow {
  // A small label over the row, for groups split into kinds
  label?: string;
  skills: Skill[];
}

export interface SkillGroup {
  name: string;
  rows: SkillRow[];
}

const s = (name: string, logo: string): Skill => ({ name, logo });
const i = (name: string, icon: SkillIconName): Skill => ({ name, icon });

export const skillGroups: SkillGroup[] = [
  {
    name: "Leadership & Architecture",
    rows: [{
      skills: [
        i("Technical Leadership", "compass"), i("System Design", "network"), i("Microservices", "boxes"), i("Distributed Systems", "waypoints"),
        i("0 to 1 Product Building", "rocket"), i("Mentoring", "graduation-cap"), i("Hiring", "user-plus"), i("Interviewing", "messages-square"),
        i("Engineering Standards", "file-check"), i("Code Review", "git-pull-request"), i("Design Docs", "file-text"), i("Cross-Functional Collaboration", "users"), i("Stakeholder Management", "handshake"), i("Agile Delivery", "refresh-cw"),
      ],
    }],
  },
  {
    name: "Frontend",
    rows: [
      {
        skills: [
          s("TypeScript", "typescript.svg"), s("React", "react-mark.svg"), s("Next.js", "nextjs.svg"), i("App Router", "route"), i("React Server Components", "server"),
          s("React Native", "reactnative.svg"), s("Electron", "electron.svg"),
        ],
      },
      { label: "State & Data", skills: [s("Redux Toolkit", "redux-toolkit.svg"), s("Zustand", "zustand.png"), s("TanStack Query", "tanstack-query.svg")] },
      {
        label: "Styling & UI",
        skills: [s("Tailwind CSS", "tailwind.svg"), s("Sass", "sass.svg"), s("Material UI", "mui.svg"), s("Fluent UI", "fluentui-mark.svg"), s("Framer Motion", "framer.svg")],
      },
      {
        label: "Craft",
        skills: [i("Design Systems", "component"), i("Accessibility (WCAG)", "accessibility"), i("Web Performance", "gauge"), i("Internationalization", "languages")],
      },
    ],
  },
  {
    name: "Design",
    rows: [{ skills: [s("Figma", "figma.svg"), s("Storybook", "storybook.svg")] }],
  },
  {
    name: "Backend",
    rows: [{
      skills: [
        s("Node.js", "nodejs.svg"), s("NestJS", "nestjs.svg"), s("Express", "express-mark.svg"), s("Python", "python.svg"),
        s("Java", "java-cup.svg"), s("Spring Boot", "springboot.svg"), s("C#", "csharp.svg"), i("REST API Design", "braces"), s("GraphQL", "graphql.svg"),
        s("Redis", "redis.svg"), s("RabbitMQ", "rabbitmq.svg"), s("Azure AD", "azure.svg"), i("SSO", "key-round"), s("Auth.js", "authjs.png"),
      ],
    }],
  },
  {
    name: "Data",
    rows: [{ skills: [s("PostgreSQL", "postgres.svg"), s("MongoDB", "mongodb-leaf.svg"), s("SQL Server", "sqlserver.svg"), s("Oracle DB", "oracle-mark.svg")] }],
  },
  {
    name: "AI Engineering",
    rows: [
      {
        skills: [
          i("LLM Integration", "sparkles"), s("Claude API", "claude-mark.svg"), s("OpenAI API", "openai-mark.svg"),
          s("Gemini API", "gemini-mark.svg"), s("DeepSeek API", "deepseek.svg"), i("AI Agents", "bot"),
          s("MCP", "mcp.svg"), i("Agentic Skills", "puzzle"), i("Evals", "list-checks"), s("Ollama", "ollama.svg"), s("Hugging Face", "huggingface.svg"),
        ],
      },
      { label: "AI-Assisted Development", skills: [s("Claude Code", "claude-mark.svg"), s("GitHub Copilot", "copilot.svg")] },
      { label: "ML", skills: [s("TensorFlow", "tensorflow.svg"), s("OpenCV", "opencv.svg")] },
    ],
  },
  {
    name: "Cloud & DevOps",
    rows: [{
      skills: [
        s("AWS", "aws.svg"), s("Azure", "azure.svg"), s("Google Cloud", "google-cloud.svg"), s("Firebase", "firebase.svg"),
        s("Docker", "docker.svg"), s("Kubernetes", "kubernetes.svg"), s("OpenShift", "openshift.svg"), s("Terraform", "terraform.svg"),
        s("GitHub Actions", "github-actions.svg"), s("Jenkins", "jenkins.svg"), s("Nginx", "nginx-mark.svg"),
      ],
    }],
  },
  {
    name: "Quality Assurance",
    rows: [{
      skills: [
        s("Jest", "jest.svg"), s("Vitest", "vitest.svg"), s("React Testing Library", "rtl.svg"), s("Playwright", "playwright-masks.svg"),
        s("Cypress", "cypress.svg"), i("Visual Regression Testing", "scan-eye"),
      ],
    }],
  },
  {
    name: "Tooling",
    rows: [{ skills: [s("Nx", "nx.svg"), s("Vite", "vite.svg"), s("GitHub", "github.svg")] }],
  },
];
