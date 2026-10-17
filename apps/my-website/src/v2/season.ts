// The home page follows the real season in Vancouver, with a switch to try the
// others. The season lives on <html data-season>, so CSS can colour the page
// and pick the scene before React runs (no flash of the wrong season).

export type Season = "winter" | "spring" | "summer" | "autumn";

// In calendar order, as the switch shows them
export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_LABEL: Record<Season, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
};

// Northern hemisphere, by month (0 = January): Dec-Feb winter, Mar-May
// spring, Jun-Aug summer, Sep-Nov autumn. SEASON_SCRIPT repeats this.
export const seasonForMonth = (month: number): Season => {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

export const isSeason = (value: unknown): value is Season => SEASONS.includes(value as Season);

export const seasonIcon = (season: Season): string => `/resources/icons/${season}Icon.svg`;

// The original seasonal illustrations, each over its own sky.
export const SEASON_SCENE: Record<Season, { image: string; sky: string }> = {
  winter: { image: "/resources/seasons/winter.svg", sky: "linear-gradient(0deg, #ffffff 50%, #e4ecf4 80%, #91b4d2 100%)" },
  spring: { image: "/resources/seasons/spring.svg", sky: "linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)" },
  summer: { image: "/resources/seasons/summer.svg", sky: "linear-gradient(0deg, #e54009 0%, #e54009 58%, #f29939 63%, #919191 65%, #4a5b7b 75%, #0c0c15 100%)" },
  autumn: { image: "/resources/seasons/autumn.svg", sky: "linear-gradient(0deg, #ffffff 50%, #76d0ff 80%, #47bfff 100%)" },
};

// Runs in <head> before the page is drawn (see _document.tsx). Sets
// html[data-season] from today's date and, on the home page, preloads that
// season's picture (at high priority: it is the largest thing on screen) and
// switches the favicon to match. Keep it in step with seasonForMonth;
// specs/season.spec.ts checks they agree for every month.
export const SEASON_SCRIPT = `(function(){try{var m=new Date().getMonth(),s=m>=2&&m<=4?"spring":m>=5&&m<=7?"summer":m>=8&&m<=10?"autumn":"winter",d=document;d.documentElement.setAttribute("data-season",s);if(location.pathname==="/"){var l=d.createElement("link");l.rel="preload";l.as="image";l.href="/resources/seasons/"+s+".svg";l.fetchPriority="high";d.head.appendChild(l);["main-icon","shortcut-icon"].forEach(function(i){var e=d.getElementById(i);if(e)e.href="/resources/icons/"+s+"Icon.svg";});}}catch(e){}})();`;
