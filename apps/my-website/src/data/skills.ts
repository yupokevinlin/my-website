// The home page's Skills section: groups of chips, each with a small logo
// where one exists. Logos live in public/resources/images/skills/; prefer a
// square mark over a wordmark, since it shows at 18 px.

export interface Skill {
  name: string;
  // File name in /resources/images/skills/
  logo?: string;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

const s = (name: string, logo?: string): Skill => ({ name, logo });

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    skills: [
      s("TypeScript", "typescript.svg"), s("JavaScript", "javascript.svg"), s("React", "react.svg"), s("Next.js", "nextjs.svg"),
      s("React Server Components", "react.svg"), s("Redux Toolkit", "redux-toolkit.svg"), s("Zustand"), s("TanStack Query", "tanstack-query.svg"),
      s("Tailwind CSS", "tailwind.svg"), s("Sass", "sass.svg"), s("Material UI", "mui.svg"), s("Fluent UI"),
      s("Framer Motion", "framer.svg"), s("React Native", "reactnative.svg"), s("Electron", "electron.svg"),
    ],
  },
  {
    name: "AI",
    skills: [
      s("Claude Code", "claude-mark.svg"), s("Claude API", "claude-mark.svg"), s("AI agents & evals"), s("MCP", "mcp.svg"),
      s("GitHub Copilot", "copilot.svg"), s("OpenAI API", "openai-mark.svg"), s("Gemini API", "gemini-mark.svg"), s("Ollama", "ollama.svg"),
      s("Hugging Face", "huggingface.svg"), s("TensorFlow", "tensorflow.svg"), s("OpenCV", "opencv.svg"),
    ],
  },
  {
    name: "Backend & data",
    skills: [
      s("Node.js", "nodejs.svg"), s("NestJS", "nestjs.svg"), s("Express", "express-mark.svg"), s("REST API design"),
      s("GraphQL", "graphql.svg"), s("Java", "java-cup.svg"), s("Spring Boot", "springboot.svg"), s("Python", "python.svg"),
      s("C#", "csharp.svg"), s("PostgreSQL", "postgres.svg"), s("MongoDB", "mongodb-leaf.svg"), s("SQL Server", "sqlserver.svg"),
      s("Redis", "redis.svg"), s("RabbitMQ", "rabbitmq.svg"), s("Azure AD / SSO", "azure.svg"), s("HL7 FHIR / EHR integration"),
    ],
  },
  {
    name: "Cloud & DevOps",
    skills: [
      s("AWS", "aws.svg"), s("Azure", "azure.svg"), s("Google Cloud", "google-cloud.svg"), s("Firebase", "firebase.svg"),
      s("Docker", "docker.svg"), s("Kubernetes", "kubernetes.svg"), s("OpenShift", "openshift.svg"), s("Terraform", "terraform.svg"),
      s("GitHub Actions", "github-actions.svg"), s("Jenkins", "jenkins.svg"), s("Nginx", "nginx.svg"),
    ],
  },
  {
    name: "Testing",
    skills: [
      s("Jest", "jest.svg"), s("Vitest", "vitest.svg"), s("React Testing Library", "rtl.svg"), s("Playwright", "playwright-masks.svg"),
      s("Cypress", "cypress.svg"), s("Storybook", "storybook.svg"), s("Visual regression testing"),
    ],
  },
  {
    name: "Practices & tools",
    skills: [
      s("Design systems"), s("Accessibility (WCAG)"), s("Web performance"), s("i18n"), s("Figma", "figma.svg"),
      s("Nx", "nx.svg"), s("Vite", "vite.svg"), s("Webpack", "webpack.svg"), s("Git", "git.svg"), s("GitHub", "github.svg"),
    ],
  },
  {
    name: "Leadership & architecture",
    skills: [
      s("Technical leadership"), s("Mentoring"), s("System design"), s("Microservices"), s("Agile / Scrum"),
      s("Hiring & interviewing"), s("0→1 product building"), s("Cross-functional collaboration"), s("Code review standards"),
    ],
  },
];
