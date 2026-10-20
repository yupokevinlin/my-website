import type { HomeTranslation } from "./en";

// Traditional Chinese. Text only: everything else comes from the English (see en.ts).
export const HOME_ZH_TW: HomeTranslation = {
  profile: {
    title: "資深全端 + AI 工程師",
    pitch: (years) =>
      `Best Buy Canada 技術負責人，同時也是醫療 AI 新創 ForteCare 的共同創辦人暨技術長。擁有 ${years} 年以上軟體開發經驗，目前專注於讓 AI 在實際產品與團隊中發揮價值。`,
    city: "溫哥華",
    region: "卑詩省",
  },
  seo: {
    title: "Kevin Lin | 溫哥華資深全端與 AI 工程師",
    description: "Kevin Lin 是加拿大溫哥華的資深全端與 AI 工程師，擅長使用 React、Next.js 與 TypeScript 打造產品，並將 AI 導入實際產品與團隊。歡迎瀏覽他的專案、工作經歷與履歷。",
    imageAlt: "Kevin Lin，位於加拿大卑詩省溫哥華的資深全端 + AI 工程師",
  },
  about: {
    paragraphs: [
      "我是在溫哥華工作的資深全端與 AI 工程師。在 Best Buy Canada，我擔任 Mobile Activation 團隊的技術負責人：以公司首批 AI 強化顧客體驗之一贏得公司黑客松冠軍，帶領團隊轉型為 AI 驅動開發，並主導 Best Buy Canada 設計系統的開發。",
      "我同時是 ForteCare 的共同創辦人暨技術長，主導一套醫療平台的架構設計，將 AI 導入專科轉診的完整流程，從收案一路到完成看診紀錄。",
      (years) => `我的軟體之路，始於在 UBC 主修化學，以及在一家貿易公司將試算表自動化的一段經歷。投入軟體開發至今 ${years} 年，我依然熱衷於找出更好、更快的做事方法：從交付全端產品，到將 AI 融入產品與團隊的工作方式。`,
    ],
    location: "加拿大卑詩省溫哥華",
    languages: [
      {
        name: "英文",
        level: "流利",
      },
      {
        name: "中文",
        level: "流利",
      },
      {
        name: "法文",
        level: "DELF A1",
      },
    ],
    education: {
      degree: "化學理學士",
      school: "英屬哥倫比亞大學（UBC）",
      award: "校長入學獎學金",
    },
    now: "Best Buy Canada 技術負責人、ForteCare 技術長",
  },
  experience: [
    {
      about: "消費性電子產品零售商，經營實體門市與網路商店",
      roles: [
        {
          title: "資深軟體工程師",
          location: "溫哥華，卑詩省",
          highlights: [
            "贏得 Best Buy 黑客松冠軍：打造公司首批 AI 強化顧客體驗之一，簡化手機購買流程，提升門市轉換率與顧客滿意度。",
            "開發倉儲作業用的 Android 應用程式，協助追回並保住 1,800 萬美元的供應商補助款。",
            "主導 Best Buy Canada 設計系統的開發：建立可擴充的元件庫，並訂定設計與開發共用的規範。",
            "帶頭推動 Mobile Activation 團隊轉型為 AI 驅動開發，制定團隊採用的工具標準與開發實務。",
          ],
          more: [
            "擔任 Mobile Activation 團隊技術負責人期間，指導多位後端工程師成功轉型為全端工程師。",
            "運用 AI 輔助開發，在一天內推出自動遷移 JIRA 連結的瀏覽器擴充功能，於轉移至 JIRA Cloud 期間為公司省下數百小時。",
          ],
        },
        {
          title: "軟體工程師",
          location: "溫哥華，卑詩省",
          highlights: [
            "擔任開發負責人，四個月內交付全連鎖門市使用的企業退貨系統，確保 Best Buy 新交易系統如期導入；技術採用 Nx、TypeScript、Next.js、NextAuth.js 與 React。",
            "將建置、發布與發布審核流程自動化，每週為 Mobile Activation 團隊節省超過 3 小時。",
            "打進 Best Buy 黑客松決賽：以 LLM 打造檢查機制，在銷售過程中掃描到錯誤的行動裝置時即時示警。",
          ],
        },
      ],
    },
    {
      about: "將專科轉診流程自動化的醫療 AI 新創公司",
      roles: [
        {
          title: "技術長暨共同創辦人",
          location: "洛杉磯（遠端）",
          highlights: [
            "將去識別化成本降低 100 倍、處理速度提升 10 倍，同時將準確率從 97.3% 提高到 99.5%。",
            "主導全平台的 AI 整合，並為 LLM 開發醫療領域的 MCP 伺服器與技能（Skills）。",
            "設計平台架構：在 Nx monorepo 中建置 Next.js 應用程式與 15 個 NestJS 微服務，部署於 Azure Container Apps，並透過 FHIR 與 HL7 串接 Epic 與 Cerner 電子病歷系統（EHR）。",
          ],
        },
      ],
    },
    {
      about: "服務北美多家大型公用事業公司的人力管理軟體",
      roles: [
        {
          title: "軟體工程師",
          location: "溫哥華，卑詩省",
          highlights: [
            "以 React、Microsoft Fluent UI、TypeScript、Redux 與 Redux Saga 設計新版用戶端介面的架構。",
            "將用戶端應用程式從 jQuery 遷移至模組化的 React 元件，大幅加快介面開發速度。",
            "以 Jenkins pipeline 將建置與版本說明流程現代化並自動化，每次發布都省下數小時。",
          ],
          more: [
            "以 Esri 取代舊版地圖元件，成功吸引新客戶。",
            "整合 Microsoft Azure Active Directory，簡化用戶端應用程式的登入流程。",
          ],
        },
        {
          title: "軟體支援工程師",
          location: "溫哥華，卑詩省",
          highlights: [
            "以 Nginx 強化應用程式安全性，使其通過 HCL（IBM）AppScan 弱點掃描。",
            "以 Gitflow 取代集中式工作流程，提升發布品質。",
            "使用 Apache PDFBox 開發動態 PDF 報表產生器。",
          ],
          more: [
            "使用 ScriptRunner 外掛程式客製化 JIRA 工作流程。",
          ],
        },
      ],
    },
  ],
  earlyExperience: [
    {
      about: "工業原物料貿易與物流",
      roles: [
        {
          title: "約聘軟體開發工程師",
          location: "溫哥華，卑詩省",
          highlights: [
            "翻新以 VBA 強化的舊版 Excel 試算表，處理速度提升 3 倍。",
            "以 Electron、React 與 Express 開發應用程式，解析並整理數千份 Excel 試算表中的資料。",
          ],
        },
        {
          title: "約聘 VBA 開發工程師",
          location: "多倫多，安大略省",
          highlights: [
            "在 Excel 中以 VBA 打造客戶關係管理（CRM）試算表。",
            "製作結合 VBA 的 Excel 試算表，自動產生圖表報表。",
          ],
        },
        {
          title: "特別助理",
          location: "台北，台灣",
          highlights: [
            "以 VBA 自動化價格更新電子郵件，耗費時間減少 80%。",
            "製作搭配 VBA 巨集的 Excel 試算表，將銷售資料轉為圖表報表。",
            "為業務人員進行石化供應鏈教育訓練，設計展覽海報與行銷內容，並協調每季跨辦公室會議。",
          ],
        },
      ],
    },
  ],
  featuredProjects: [
    {
      name: "ForteCare",
      kicker: "共同創辦人暨技術長",
      description: "以去識別化病歷為基礎，透過 AI 分流與摘要，將專科轉診從收案到完成看診紀錄的整個流程自動化，讓病患更快找到合適的專科醫師，醫師看診前也能做好充分準備。",
      image: {
        alt: "ForteCare：在對的時間，找到對的專科醫師",
      },
      links: [
        {
          label: "前往 fortecare.ai",
        },
      ],
    },
    {
      name: "相對論光線追蹤",
      kicker: "WebGL 2 · 物理",
      description: "以 4K 即時模擬黑洞、穿越事件視界的墜落、蟲洞與接近光速的旅行，並附上圖解指南，說明每個模擬背後的物理原理。",
      image: {
        alt: "以光線追蹤呈現的黑洞：發光的吸積盤在黑洞陰影的上方與下方彎折環繞",
      },
      links: [
        {
          label: "線上體驗",
        },
        {
          label: "閱讀指南",
        },
        {
          label: "原始碼",
        },
      ],
    },
  ],
  earlierProjects: [
    {
      name: "個人網站（第一版）",
      description: "本站的第一版設計：全螢幕的四季場景，有飄雪、飛鳥與螢火蟲，也是現在這個版本的起點。",
    },
    {
      name: "COVID-19 疫情追蹤",
      description: "以互動式世界地圖與圖表追蹤疫情發展。",
    },
    {
      name: "Write My MP",
      description: "協助加拿大民眾找到並聯絡自己選區的國會議員。",
    },
    {
      name: "React Electron 範本",
      description: "支援熱重載的 Electron、React 與 TypeScript 起始專案範本。",
    },
  ],
  skillGroups: [
    {
      name: "領導與架構",
      rows: [
        {
          skills: [
            {
              name: "技術領導",
            },
            {
              name: "系統設計",
            },
            {
              name: "微服務",
            },
            {
              name: "分散式系統",
            },
            {
              name: "從 0 到 1 打造產品",
            },
            {
              name: "指導與培育",
            },
            {
              name: "人才招募",
            },
            {
              name: "面試",
            },
            {
              name: "工程規範",
            },
            {
              name: "程式碼審查",
            },
            {
              name: "設計文件",
            },
            {
              name: "跨部門協作",
            },
            {
              name: "利害關係人管理",
            },
            {
              name: "敏捷開發",
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
          label: "狀態與資料管理",
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
          label: "樣式與 UI",
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
          label: "前端工藝",
          skills: [
            {
              name: "設計系統",
            },
            {
              name: "無障礙設計（WCAG）",
            },
            {
              name: "網頁效能",
            },
            {
              name: "國際化（i18n）",
            },
          ],
        },
      ],
    },
    {
      name: "設計",
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
      name: "後端",
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
              name: "REST API 設計",
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
              name: "單一登入（SSO）",
            },
            {
              name: "Auth.js",
            },
          ],
        },
      ],
    },
    {
      name: "資料庫",
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
              name: "LLM 整合",
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
              name: "AI 代理（Agents）",
            },
            {
              name: "MCP",
            },
            {
              name: "Agent 技能（Skills）",
            },
            {
              name: "模型評測（Evals）",
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
          label: "AI 輔助開發",
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
          label: "機器學習",
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
      name: "雲端與 DevOps",
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
      name: "品質保證",
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
              name: "視覺回歸測試",
            },
          ],
        },
      ],
    },
    {
      name: "開發工具",
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
