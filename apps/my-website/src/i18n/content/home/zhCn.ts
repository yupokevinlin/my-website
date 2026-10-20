import type { HomeTranslation } from "./en";

// Simplified Chinese. Text only: everything else comes from the English (see en.ts).
export const HOME_ZH_CN: HomeTranslation = {
  profile: {
    title: "高级全栈 + AI 工程师",
    pitch: (years) =>
      `Best Buy Canada 技术负责人，医疗 AI 初创公司 ForteCare 联合创始人兼首席技术官。拥有${years}年以上软件开发经验，现专注于让 AI 在真实的产品和团队中落地。`,
    city: "温哥华",
    region: "不列颠哥伦比亚省",
  },
  seo: {
    title: "Kevin Lin | 温哥华高级全栈与 AI 工程师",
    description: "Kevin Lin，常驻加拿大温哥华的高级全栈与 AI 工程师，现任 Best Buy Canada 技术负责人，使用 React、Next.js 和 TypeScript 构建产品。查看他的项目、工作经历和简历。",
    imageAlt: "Kevin Lin：加拿大温哥华的高级全栈 + AI 工程师",
  },
  about: {
    paragraphs: [
      "我是常驻温哥华的高级全栈与 AI 工程师。在 Best Buy Canada，我担任手机开通团队的技术负责人：凭借公司首批 AI 增强型客户体验之一赢得了公司黑客松冠军，带领团队转向 AI 驱动的开发模式，并主导了 Best Buy Canada 设计系统的开发。",
      "我同时是 ForteCare 的联合创始人兼首席技术官，负责医疗平台的架构设计，将 AI 引入专科转诊的全流程：从受理转诊到完成就诊记录。",
      (years) => `我的软件之路始于在 UBC 学习化学，以及在一家贸易公司做电子表格自动化的一段经历。从事软件开发${years}年来，我依然热衷于寻找更好、更快的做事方式：从交付全栈产品，到把 AI 融入产品和团队的工作方式。`,
    ],
    location: "加拿大温哥华",
    languages: [
      {
        name: "英语",
        level: "流利",
      },
      {
        name: "普通话",
        level: "流利",
      },
      {
        name: "法语",
        level: "DELF A1",
      },
    ],
    education: {
      degree: "化学理学学士",
      school: "英属哥伦比亚大学",
      award: "校长入学奖学金",
    },
    now: "Best Buy Canada 技术负责人，ForteCare 首席技术官",
  },
  experience: [
    {
      about: "消费电子零售商，覆盖线下门店与线上渠道",
      roles: [
        {
          title: "高级软件工程师",
          location: "温哥华，不列颠哥伦比亚省",
          highlights: [
            "打造公司首批 AI 增强型客户体验之一，夺得 Best Buy 黑客松冠军；该方案简化了手机购买流程，提升了门店转化率和客户满意度。",
            "开发用于仓储运营的 Android 应用，协助挽回并保住1800万美元的供应商资金。",
            "主导 Best Buy Canada 设计系统的开发：构建可扩展的组件库，并建立设计与开发之间的统一规范。",
            "推动手机开通团队转向 AI 驱动的开发模式，制定了团队所采用的工具标准与实践规范。",
          ],
          more: [
            "作为手机开通团队的技术负责人，指导多名后端工程师成功转型为全栈工程师。",
            "在迁移至 JIRA Cloud 期间，借助 AI 辅助开发在一天内交付一款自动迁移 JIRA 链接的浏览器扩展，为公司节省数百小时。",
          ],
        },
        {
          title: "软件工程师",
          location: "温哥华，不列颠哥伦比亚省",
          highlights: [
            "作为开发负责人，使用 Nx、TypeScript、Next.js、NextAuth.js 和 React，在四个月内交付覆盖全部门店的企业退货应用，确保 Best Buy 新交易系统按计划上线。",
            "将构建、发布及发布审批流程自动化，每周为手机开通团队节省3小时以上。",
            "开发基于大模型的校验功能，在销售中扫描到错误的手机设备时及时提醒，凭此进入 Best Buy 黑客松决赛。",
          ],
        },
      ],
    },
    {
      about: "医疗 AI 初创公司，致力于实现专科转诊全流程自动化",
      roles: [
        {
          title: "首席技术官兼联合创始人",
          location: "洛杉矶（远程）",
          highlights: [
            "将数据去标识化成本降低100倍、处理时间缩短10倍，同时将准确率从97.3%提升至99.5%。",
            "主导整个平台的 AI 集成，并为大模型开发医疗领域的 MCP 服务器和技能。",
            "设计平台整体架构：在 Nx monorepo 中构建 Next.js 应用和15个 NestJS 微服务，部署于 Azure Container Apps，并通过 FHIR 和 HL7 与 Epic、Cerner 电子病历系统（EHR）对接。",
          ],
        },
      ],
    },
    {
      about: "劳动力管理软件，服务北美多家大型公用事业公司",
      roles: [
        {
          title: "软件工程师",
          location: "温哥华，不列颠哥伦比亚省",
          highlights: [
            "使用 React、Microsoft Fluent UI、TypeScript、Redux 和 Redux Saga 设计新版客户端 UI 架构。",
            "将客户端应用从 jQuery 迁移至模块化 React 组件，大幅提升 UI 开发效率。",
            "借助 Jenkins 流水线实现构建和发布说明流程的现代化与自动化，每次发布节省数小时。",
          ],
          more: [
            "以 Esri 替换旧版地图组件，吸引了新客户。",
            "集成 Microsoft Azure Active Directory，简化客户端应用的登录流程。",
          ],
        },
        {
          title: "软件支持工程师",
          location: "温哥华，不列颠哥伦比亚省",
          highlights: [
            "通过 Nginx 加强应用安全，使应用顺利通过 HCL（IBM）AppScan 安全扫描。",
            "以 Gitflow 取代集中式工作流，提升发布质量。",
            "使用 Apache PDFBox 构建动态 PDF 报告生成器。",
          ],
          more: [
            "使用 ScriptRunner 插件定制 JIRA 工作流。",
          ],
        },
      ],
    },
  ],
  earlyExperience: [
    {
      about: "工业原材料贸易与物流",
      roles: [
        {
          title: "合同制软件开发工程师",
          location: "温哥华，不列颠哥伦比亚省",
          highlights: [
            "对基于 VBA 的旧版 Excel 电子表格进行现代化改造，将处理时间缩短3倍。",
            "使用 Electron、React 和 Express 构建应用，解析并整理来自数千份 Excel 电子表格的数据。",
          ],
        },
        {
          title: "合同制 VBA 开发工程师",
          location: "多伦多，安大略省",
          highlights: [
            "在 Excel 中构建基于 VBA 的客户关系管理（CRM）电子表格。",
            "开发基于 VBA 的 Excel 电子表格，用于生成图表报告。",
          ],
        },
        {
          title: "特别助理",
          location: "台北，台湾",
          highlights: [
            "使用 VBA 自动发送价格更新邮件，将相关耗时减少80%。",
            "开发基于 VBA 宏的 Excel 电子表格，将销售数据转化为图表报告。",
            "为销售人员提供石化供应链培训，设计展会海报和营销内容，并协调各办事处的季度联席会议。",
          ],
        },
      ],
    },
  ],
  featuredProjects: [
    {
      name: "ForteCare",
      kicker: "联合创始人兼首席技术官",
      description: "基于去标识化病历，通过 AI 分诊与摘要，实现从受理转诊到完成就诊记录的专科转诊全流程自动化，让患者更快找到合适的专科医生，让医生在接诊前做好充分准备。",
      image: {
        alt: "ForteCare：在合适的时间，找到合适的专科医生",
      },
      links: [
        {
          label: "访问 fortecare.ai",
        },
      ],
    },
    {
      name: "相对论光线追踪",
      kicker: "WebGL 2 · 物理",
      description: "实时 4K 模拟黑洞、穿越事件视界的坠落、虫洞以及近光速旅行，并配有图解指南，讲解每种现象背后的物理原理。",
      image: {
        alt: "光线追踪渲染的黑洞，发光的吸积盘在黑洞阴影的上方和下方弯曲",
      },
      links: [
        {
          label: "在线体验",
        },
        {
          label: "阅读指南",
        },
        {
          label: "源代码",
        },
      ],
    },
  ],
  earlierProjects: [
    {
      name: "个人网站（第一版）",
      description: "本站的初版设计：全屏四季场景，有飘雪、飞鸟和萤火虫，现在的设计正是由此发展而来。",
    },
    {
      name: "COVID-19 疫情追踪器",
      description: "用交互式世界地图和图表追踪全球疫情。",
    },
    {
      name: "Write My MP",
      description: "帮助加拿大人查找并联系所在选区的国会议员。",
    },
    {
      name: "React Electron 模板",
      description: "支持热重载的 Electron、React 和 TypeScript 入门模板。",
    },
  ],
  skillGroups: [
    {
      name: "领导力与架构",
      rows: [
        {
          skills: [
            {
              name: "技术领导力",
            },
            {
              name: "系统设计",
            },
            {
              name: "微服务",
            },
            {
              name: "分布式系统",
            },
            {
              name: "从0到1打造产品",
            },
            {
              name: "技术指导",
            },
            {
              name: "招聘",
            },
            {
              name: "面试",
            },
            {
              name: "工程规范",
            },
            {
              name: "代码评审",
            },
            {
              name: "设计文档",
            },
            {
              name: "跨职能协作",
            },
            {
              name: "利益相关方管理",
            },
            {
              name: "敏捷交付",
            },
          ],
        },
      ],
    },
    {
      name: "前端",
      rows: [
        {
          skills: [
            {
              name: "TypeScript",
            },
            {
              name: "React",
            },
            {
              name: "Next.js",
            },
            {
              name: "App Router",
            },
            {
              name: "React Server Components",
            },
            {
              name: "React Native",
            },
            {
              name: "Electron",
            },
          ],
        },
        {
          label: "状态与数据",
          skills: [
            {
              name: "Redux Toolkit",
            },
            {
              name: "Zustand",
            },
            {
              name: "TanStack Query",
            },
          ],
        },
        {
          label: "样式与 UI",
          skills: [
            {
              name: "Tailwind CSS",
            },
            {
              name: "Sass",
            },
            {
              name: "Material UI",
            },
            {
              name: "Fluent UI",
            },
            {
              name: "Framer Motion",
            },
          ],
        },
        {
          label: "工程实践",
          skills: [
            {
              name: "设计系统",
            },
            {
              name: "无障碍访问（WCAG）",
            },
            {
              name: "Web 性能优化",
            },
            {
              name: "国际化",
            },
          ],
        },
      ],
    },
    {
      name: "设计",
      rows: [
        {
          skills: [
            {
              name: "Figma",
            },
            {
              name: "Storybook",
            },
          ],
        },
      ],
    },
    {
      name: "后端",
      rows: [
        {
          skills: [
            {
              name: "Node.js",
            },
            {
              name: "NestJS",
            },
            {
              name: "Express",
            },
            {
              name: "Python",
            },
            {
              name: "Java",
            },
            {
              name: "Spring Boot",
            },
            {
              name: "C#",
            },
            {
              name: "REST API 设计",
            },
            {
              name: "GraphQL",
            },
            {
              name: "Redis",
            },
            {
              name: "RabbitMQ",
            },
            {
              name: "Azure AD",
            },
            {
              name: "单点登录（SSO）",
            },
            {
              name: "Auth.js",
            },
          ],
        },
      ],
    },
    {
      name: "数据",
      rows: [
        {
          skills: [
            {
              name: "PostgreSQL",
            },
            {
              name: "MongoDB",
            },
            {
              name: "SQL Server",
            },
            {
              name: "Oracle DB",
            },
          ],
        },
      ],
    },
    {
      name: "AI 工程",
      rows: [
        {
          skills: [
            {
              name: "大模型集成",
            },
            {
              name: "Claude API",
            },
            {
              name: "OpenAI API",
            },
            {
              name: "Gemini API",
            },
            {
              name: "DeepSeek API",
            },
            {
              name: "AI 智能体",
            },
            {
              name: "MCP",
            },
            {
              name: "智能体技能",
            },
            {
              name: "模型评测（Evals）",
            },
            {
              name: "Ollama",
            },
            {
              name: "Hugging Face",
            },
          ],
        },
        {
          label: "AI 辅助开发",
          skills: [
            {
              name: "Claude Code",
            },
            {
              name: "GitHub Copilot",
            },
          ],
        },
        {
          label: "机器学习",
          skills: [
            {
              name: "TensorFlow",
            },
            {
              name: "OpenCV",
            },
          ],
        },
      ],
    },
    {
      name: "云与 DevOps",
      rows: [
        {
          skills: [
            {
              name: "AWS",
            },
            {
              name: "Azure",
            },
            {
              name: "Google Cloud",
            },
            {
              name: "Firebase",
            },
            {
              name: "Docker",
            },
            {
              name: "Kubernetes",
            },
            {
              name: "OpenShift",
            },
            {
              name: "Terraform",
            },
            {
              name: "GitHub Actions",
            },
            {
              name: "Jenkins",
            },
            {
              name: "Nginx",
            },
          ],
        },
      ],
    },
    {
      name: "质量保证",
      rows: [
        {
          skills: [
            {
              name: "Jest",
            },
            {
              name: "Vitest",
            },
            {
              name: "React Testing Library",
            },
            {
              name: "Playwright",
            },
            {
              name: "Cypress",
            },
            {
              name: "视觉回归测试",
            },
          ],
        },
      ],
    },
    {
      name: "工具链",
      rows: [
        {
          skills: [
            {
              name: "Nx",
            },
            {
              name: "Vite",
            },
            {
              name: "GitHub",
            },
          ],
        },
      ],
    },
  ],
};
