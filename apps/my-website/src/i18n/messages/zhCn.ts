import type { Messages } from "./en";

// Simplified Chinese. Text only: everything else comes from the English (see en.ts).
export const MESSAGES_ZH_CN: Messages = {
  common: {
    language: "语言",
    changeLanguage: "切换语言",
    skipToContent: "跳至主要内容",
    javascriptRequired: "请启用 JavaScript 以运行此应用。",
  },
  home: {
    seasons: {
      spring: "春季",
      summer: "夏季",
      autumn: "秋季",
      winter: "冬季",
    },
    seasonGroup: "季节",
    seasonTheme: (season) => `${season}主题`,
    seasonInCity: (season) => `温哥华的${season}`,
    nav: {
      sections: "页面导航",
      experience: "经历",
      projects: "项目",
      skills: "技能",
      contact: "联系",
      resume: "简历",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    hero: {
      // The eyebrow line stays short: "高级全栈 + AI 工程师 · 温哥华"
      place: (city) => city,
      seeMyWork: "查看我的作品",
      resume: "简历",
      getInTouch: "联系我",
      scrollToAbout: "滚动至“关于”",
    },
    about: {
      label: "关于",
      title: "简单介绍一下我",
      basedIn: "所在地",
      languages: "语言",
      education: "教育背景",
      // "英属哥伦比亚大学化学理学学士"
      degreeAt: (degree, school) => `${school}${degree}`,
      now: "目前",
    },
    experience: {
      label: "经历",
      title: "我工作过的地方",
      present: "至今",
      showMore: (count) => `展开其余${count}项`,
      showLess: "收起",
      earlier: "早期经历",
      stack: (company) => `${company} 技术栈`,
      // "2年7个月", "11个月", "3年"
      duration: (years, months) => {
        const y = years ? `${years}年` : "";
        const m = months || !years ? `${months}个月` : "";
        return `${y}${m}`;
      },
    },
    projects: {
      label: "项目",
      title: "我打造的作品",
      lead: "一个我联合创办的医疗平台、一个出于兴趣打造的物理模拟，以及一些早期作品。",
      earlier: "早期项目",
      archived: "已归档",
      tools: (project) => `${project} 使用的技术`,
    },
    skills: {
      label: "技能",
      title: "我常用的技术",
    },
    contact: {
      label: "联系",
      title: "联系我",
      linkedIn: "LinkedIn",
      gitHub: "GitHub",
      resume: "简历",
      resumeDetail: "点击下载",
    },
    footer: {
      previousVersion: "旧版网站",
      seasonsNote: "温哥华四季的插画。",
    },
  },
};
