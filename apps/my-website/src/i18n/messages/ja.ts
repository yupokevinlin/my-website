import type { Messages } from "./en";

// Japanese. Text only: everything else comes from the English (see en.ts).
export const MESSAGES_JA: Messages = {
  common: {
    language: "言語",
    changeLanguage: "言語を変更",
    skipToContent: "本文へスキップ",
    javascriptRequired: "このアプリを利用するには、JavaScriptを有効にしてください。",
  },
  home: {
    seasons: {
      spring: "春",
      summer: "夏",
      autumn: "秋",
      winter: "冬",
    },
    seasonGroup: "季節",
    seasonTheme: (season) => `${season}のテーマ`,
    seasonInCity: (season) => `バンクーバーの${season}`,
    nav: {
      sections: "セクション",
      experience: "職務経歴",
      projects: "プロジェクト",
      skills: "スキル",
      contact: "連絡先",
      resume: "レジュメ",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
    },
    hero: {
      place: (city, region) => `${city}（${region}）`,
      seeMyWork: "実績を見る",
      resume: "レジュメ",
      getInTouch: "お問い合わせ",
      scrollToAbout: "自己紹介へスクロール",
    },
    about: {
      label: "自己紹介",
      title: "私について",
      basedIn: "拠点",
      languages: "言語",
      education: "学歴",
      degreeAt: (degree, school) => `${school} ${degree}`,
      now: "現在",
    },
    experience: {
      label: "職務経歴",
      title: "これまでの職歴",
      present: "現在",
      showMore: (count) => `さらに${count}件を表示`,
      showLess: "閉じる",
      earlier: "以前の職歴",
      stack: (company) => `${company}の技術スタック`,
      // "2年7か月", "1年", "11か月"
      duration: (years, months) => {
        const y = years ? `${years}年` : "";
        const m = months || !years ? `${months}か月` : "";
        return `${y}${m}`;
      },
    },
    projects: {
      label: "プロジェクト",
      title: "これまでに作ったもの",
      lead: "共同創業したヘルスケアプラットフォームと、趣味で作った物理シミュレーション。そのほか、以前の制作物もご紹介します。",
      earlier: "以前のプロジェクト",
      archived: "アーカイブ済み",
      tools: (project) => `${project}の使用技術`,
    },
    skills: {
      label: "スキル",
      title: "得意分野",
    },
    contact: {
      label: "連絡先",
      title: "お気軽にご連絡ください",
      linkedIn: "LinkedIn",
      gitHub: "GitHub",
      resume: "レジュメ",
      resumeDetail: "クリックしてダウンロード",
    },
    footer: {
      previousVersion: "以前のバージョン",
      seasonsNote: "イラストはバンクーバーの季節に合わせて変わります。",
    },
  },
};
