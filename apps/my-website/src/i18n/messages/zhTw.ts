import type { Messages } from "./en";

// Chinese puts a space between Chinese and Latin text ("ForteCare 使用的工具",
// "相對論光線追蹤使用的工具"): add one after a name that ends in a Latin
// letter, digit or symbol.
const spaced = (name: string): string => (/[!-~]$/.test(name) ? `${name} ` : name);

// Traditional Chinese. Text only: everything else comes from the English (see en.ts).
export const MESSAGES_ZH_TW: Messages = {
  common: {
    language: "語言",
    changeLanguage: "切換語言",
    skipToContent: "跳至主要內容",
    javascriptRequired: "需要啟用 JavaScript 才能執行此應用程式。",
  },
  home: {
    seasons: {
      spring: "春天",
      summer: "夏天",
      autumn: "秋天",
      winter: "冬天",
    },
    seasonGroup: "季節",
    seasonTheme: (season) => `${season}主題`,
    seasonInCity: (season) => `溫哥華的${season}`,
    nav: {
      sections: "頁面導覽",
      experience: "經歷",
      projects: "專案",
      skills: "技能",
      contact: "聯絡",
      resume: "履歷",
      openMenu: "開啟選單",
      closeMenu: "關閉選單",
    },
    hero: {
      place: (city, region) => `${region}${city}`,
      seeMyWork: "看看我的作品",
      resume: "履歷",
      getInTouch: "與我聯絡",
      scrollToAbout: "捲動至「關於我」",
    },
    about: {
      label: "關於我",
      title: "簡單認識我",
      basedIn: "所在地",
      languages: "語言",
      education: "學歷",
      degreeAt: (degree, school) => `${school}${degree}`,
      now: "現職",
    },
    experience: {
      label: "經歷",
      title: "我曾任職的公司",
      present: "至今",
      showMore: (count) => `顯示其餘 ${count} 項`,
      showLess: "收合",
      earlier: "早期經歷",
      stack: (company) => `${spaced(company)}使用的技術`,
      // "2 年 7 個月", "11 個月", "3 年"
      duration: (years, months) => {
        const y = years ? `${years} 年` : "";
        const m = months || !years ? `${months} 個月` : "";
        return [y, m].filter(Boolean).join(" ");
      },
    },
    projects: {
      label: "專案",
      title: "我打造的作品",
      lead: "我共同創辦的醫療平台、一個純粹出於興趣打造的物理模擬，以及一些較早期的作品。",
      earlier: "早期專案",
      archived: "已封存",
      tools: (project) => `${spaced(project)}使用的工具`,
    },
    skills: {
      label: "技能",
      title: "我使用的技術",
    },
    contact: {
      label: "聯絡",
      title: "與我聯絡",
      linkedIn: "LinkedIn",
      gitHub: "GitHub",
      resume: "履歷",
      resumeDetail: "點此下載",
    },
    footer: {
      previousVersion: "舊版網站",
      seasonsNote: "插圖會隨著溫哥華的四季變換。",
    },
  },
};
