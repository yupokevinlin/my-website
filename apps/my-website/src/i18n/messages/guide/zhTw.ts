import type { GuideText } from "./en";

// Chinese puts a space between Chinese and Latin text ("ForteCare 使用的工具",
// "相對論光線追蹤使用的工具"): add one after a name that ends in a Latin
// letter, digit or symbol.
const spaced = (name: string): string => (/[!-~]$/.test(name) ? `${name} ` : name);

// The ray-tracing guide's text in Traditional Chinese. Text only:
// everything else comes from the English (see en.ts).
export const GUIDE_TEXT_ZH_TW: GuideText = {
  heads: {
    overview: {
      name: "相對論光線追蹤",
      description: "黑洞如何運作？光為什麼會彎曲？這份圖解指南搭配 4K 即時光線追蹤模擬，帶你環繞旋轉黑洞、穿越事件視界、飛越《星際效應》的蟲洞，並以接近光速的速度旅行。",
    },
    blackhole: {
      name: "黑洞",
      description: "在瀏覽器中親眼看見一個旋轉中的黑洞：以 4K 解析度即時進行光線追蹤，每一道光線都穿過彎曲時空，呈現被重力透鏡扭曲的吸積盤與黑洞的陰影。",
    },
    infall: {
      name: "墜入黑洞",
      description: "墜入黑洞、穿越事件視界，親眼看看你真正會看到的景象：整片星空在你周圍扭曲、變色。畫面中的每一道光線，都在彎曲時空中逐步追蹤計算而來。",
    },
    wormhole: {
      name: "蟲洞",
      description: "飛越電影《星際效應》中的蟲洞，抵達另一個星系。每一道光線都已預先在彎曲的幾何結構中完成積分，讓你在瀏覽器中即時穿越喉部，看見另一側的星空。",
    },
    lightspeed: {
      name: "接近光速",
      description: "以接近光速的速度飛向銀河中心，親眼看見相對論效應：前方星空因光行差而聚攏，色彩因都卜勒頻移而改變，亮度也因相對論性集束而增強。",
    },
  },
  layout: {
    brand: "相對論光線追蹤",
    menu: "選單",
    nav: {
      home: "首頁",
      overview: "總覽",
      blackhole: "黑洞",
      infall: "墜入黑洞",
      wormhole: "蟲洞",
      lightspeed: "接近光速",
    },
  },
  overview: {
    dopplerAlt: "以真實色彩呈現的黑洞，左側更亮、也更偏藍",
    hero: {
      kicker: "黑洞與相對論的圖解指南",
      // "被<em>時空</em>彎曲的光"
      titleBefore: "被",
      titleEmphasis: "時空",
      titleAfter: "彎曲的光",
      text: "黑洞是怎麼運作的？它真正的模樣又是如何？十一堂簡短的課程搭配動畫圖解，為你一一說明。接著，四個即時模擬讓你環繞黑洞飛行、墜入黑洞、穿越蟲洞，並以接近光速的速度旅行。畫面上的每個像素都是一道光線，在彎曲的時空中逐一追蹤而來。",
      startLearning: "開始學習 ↓",
      openBlackHole: "開啟黑洞模擬 →",
    },
    parts: [
      {
        label: "第一部分",
        title: "黑洞如何運作",
        intro: "黑洞是宇宙中最簡單、也最奇特的天體：只有質量、自旋，以及一道任何東西都無法離開的邊界。這十一堂簡短的課程，從物體為什麼會掉落，一路講到黑洞為什麼會發光。不需要數學基礎；想深入的話，方程式也都附在裡面。",
      },
      {
        label: "第二部分",
        title: "追蹤光線",
        intro: "要畫出黑洞，就得知道抵達你眼中的每一道光從何而來。在平坦的空間中這很簡單，因為光沿直線前進。但在黑洞附近，光會沿著前面課程介紹的彎曲路徑行進，於是畫出黑洞就成了一道計算題。",
      },
      {
        label: "第三部分",
        title: "模擬實驗",
        intro: "四個可以親自飛行體驗的實驗。每一個都在你的瀏覽器中以最高 4K 即時執行；所有設定都能調整，每個畫面也都能以連結分享。",
      },
    ],
    tracing: {
      title: "讓光倒著走",
      paragraphs: [
        "光線追蹤是把光的路徑反過來追。從相機出發，每個像素各發射一道光線進入場景，在彎曲的幾何結構中一步步推進。如果它落入視界，這個像素就是黑色；如果它穿過吸積盤，就取得盤面的光芒，並加上都卜勒效應與重力造成的頻移；如果它逃離了，就取得它最終離開方向上的天空顏色。",
        "在太陽附近，這種彎曲非常微小：掠過太陽邊緣的星光只偏折 1.75 角秒，大約萬分之五度。但在黑洞附近，它決定了你看到的一切。",
      ],
      caption: "從側面看相機發出的光線。瞄得離黑洞太近，光就會被捕獲，形成陰影；稍微瞄得開一點，光就會從上方彎折過去，讓你看到吸積盤的另一側。",
    },
    realTime: {
      title: "如何做到即時",
      text: "在彎曲時空中追蹤光線的計算量很大，所以工作被拆成兩部分：困難的部分只做一次，所有會動的部分都很輕量。正因如此，這些模擬才能在瀏覽器分頁中以完整 4K 執行。",
      steps: [
        {
          title: "追蹤",
          text: "4K 影格共有 830 萬個像素，每個像素的光線都以四階 Runge–Kutta 求解器在彎曲時空中反向積分，直到它落入黑洞、穿過吸積盤或逃逸為止。在現代 GPU 上，整個影格大約只需一秒。",
        },
        {
          title: "快取",
          text: "結果會儲存成一張光線映射圖，記錄每個像素的光從何而來。蟲洞與墜入黑洞這兩個模擬更進一步：由於它們的對稱性，所有可能的光線都能放進同一張表格，只需計算一次。",
        },
        {
          title: "著色",
          text: "之後每個影格都只需要查表：吸積盤旋轉時的位置、它的都卜勒與重力頻移，以及黑體在該溫度下的顏色，這些都來自預先計算好的光譜表。",
        },
        {
          title: "曝光",
          text: "光以高動態範圍保存，從黯淡的星星到熾熱的吸積盤內側都能呈現，接著像底片一樣加上光暈並進行色調映射。星空來自 NASA 的 16K HDR 銀河系星圖。",
        },
      ],
    },
    chapter: {
      kicker: (numeral, field) => `模擬 ${numeral} · ${field}`,
      open: "開啟模擬",
      seeing: "你看到的是什麼",
      physics: "背後的物理",
      tryThis: "試試看",
    },
    glossary: {
      kicker: "名詞解釋",
      title: "幾個關鍵名詞",
    },
    credits: "資料來源與致謝",
    requirements: {
      title: "系統需求",
      text: "需要支援 WebGL 2 與浮點渲染目標的桌機瀏覽器：最新版的 Chrome、Edge、Firefox 或 Safari。以 4K 執行時，黑洞模擬約使用 400 MB 的顯示記憶體；若 GPU 記憶體較小，請在「輸出」中降低渲染解析度。",
    },
    back: "← 返回 kevinyupolin.dev",
  },
  lesson: {
    number: (n) => `第 ${n} 課`,
    of: (total) => `共 ${total} 課`,
    keyIdea: "重點觀念",
    tryIt: "動手試試",
  },
  learn: {
    tryThis: "試試看",
    seeing: "你看到的是什麼",
    physics: "背後的物理",
    newToBlackHoles: "第一次認識黑洞？",
    keys: "按鍵",
    keyDrag: "拖曳 · 環顧或繞行",
    keyWheel: "滾輪或雙指縮放 · 拉近或移動",
    keySpace: "空白鍵 · 暫停",
    keyFullscreen: "F · 全螢幕",
    keySnapshot: "P · 截圖",
    keyHide: "H · 隱藏介面",
    // "更多說明請見<link>圖解總覽</link>。"
    moreBefore: "更多說明請見",
    moreLink: "圖解總覽",
    moreAfter: "。",
  },
  controls: {
    retraces: "變更此項會重新追蹤光線路徑",
    reset: "重設",
    copied: "已複製 ✓",
    shareLink: "分享連結",
    retraceNote: "表示變更後會重新追蹤光線路徑：先顯示即時預覽，再呈現完整解析度。",
    groups: {
      "Black hole": "黑洞",
      Camera: "相機",
      Disc: "吸積盤",
      Gas: "氣體",
      Sky: "天空",
      Quality: "品質",
      Fall: "墜落",
      Light: "光線",
      Wormhole: "蟲洞",
      Skies: "星空",
      Ship: "太空船",
      Relativity: "相對論",
      Stars: "恆星",
      Output: "輸出",
    },
  },
  simulation: {
    play: "播放（空白鍵）",
    pause: "暫停（空白鍵）",
    fullscreen: "全螢幕（F）",
    snapshot: "以渲染解析度儲存 PNG（P）",
    learn: "學習",
    controls: "控制",
    fps: (fps) => `${fps} fps`,
    starting: "啟動中…",
    paused: "已暫停",
    noWebGl: "此模擬需要支援浮點渲染目標的 WebGL 2",
    noWebGlHint: "請使用已啟用硬體加速的最新版 Chrome、Edge、Firefox 或 Safari。",
    lost: "3D 畫面已停止",
    lostMessage: "瀏覽器停止了 3D 畫面，很可能是因為顯示記憶體不足。",
    lostHint: "請重新載入頁面再試一次。在「輸出」中降低渲染解析度或星圖細節也會有幫助。",
    skyLoading: (size) => `正在載入 ${size}² 星圖…`,
    skyProgress: (size, percent) => `正在載入 ${size}² 星圖… ${percent}%`,
    skyFailed: (size) => `星圖載入失敗（${size}）`,
  },
  readouts: {
    blackhole: {
      horizon: "事件視界 r₊",
      isco: (prograde) => `ISCO（${prograde ? "順行" : "逆行"}）`,
      photonOrbit: "光子軌道",
      horizonSpin: "視界角速度 Ω_H",
      cameraClock: "相機時鐘速率",
      cameraClockValue: (rate) => `${rate} × 遠方時鐘`,
      tracing: (percent) => `正在追蹤測地線 ${percent}%`,
      traced: "光線映射圖已完成",
    },
    infall: {
      radius: "半徑",
      radiusValue: (m, horizons) => `${m} M · ${horizons} × 視界半徑`,
      where: "位置",
      outside: "視界外",
      inside: "視界內",
      thrust: "懸停所需的火箭推力",
      clock: "你的時鐘速率",
      clockValue: (rate) => `${rate} × 遠方`,
      timeLeft: "你抵達奇異點的剩餘時間",
      tidal: "你身體承受的潮汐拉伸",
      days: (n) => `${n} 天`,
      integrating: (percent) => `正在積分光線路徑 ${percent}%`,
      ready: "光線路徑已就緒",
    },
    wormhole: {
      cameraL: "相機 l",
      radius: "周長半徑 r(l)",
      universe: "宇宙",
      insideThroat: "喉部內",
      home: "家鄉（銀河系這側）",
      farSide: "另一側",
      lensingWidth: "透鏡寬度 W",
      throatLength: "喉部長度 2a",
      integrating: (percent) => `正在積分測地線表 ${percent}%`,
      ready: "測地線表已就緒",
    },
    lightspeed: {
      speed: "速度",
      doppler: "都卜勒（前方 / 後方）",
      shipTime: "太空船時間（固有時）",
      earthTime: "銀河系（地球）時間",
      years: (n) => `${n} 年`,
      distance: "航行距離",
      lightYears: (n) => `${n} 光年`,
      toCentre: "距銀河中心",
      passed: "已通過！",
    },
  },
  diagrams: {
    ray: {
      aria: "光線在黑洞周圍彎曲的示意圖",
      camera: "相機",
      escapes: "逃向星空",
      arches: "從上方彎過",
      hitsDisc: "擊中吸積盤",
      captured: "被捕獲：形成陰影",
      photonSphere: "光子球",
    },
    curvedSpace: {
      aria: "被質量壓出凹陷的網格，一顆衛星在凹陷中繞行",
      caption: "質量讓網格彎曲 · 衛星沿著彎曲運行",
    },
    squeeze: {
      aria: (body) => `${spaced(body)}與其史瓦西半徑的比較`,
      realSize: (body) => `${spaced(body)}的實際大小`,
      squeezed: "半徑（以對數尺度壓縮）",
      toScale: "事件視界（按實際比例）",
      length: (km, format) => {
        if (km >= 1e8) return `${format(km / 1e8, 1)} 億公里`;
        if (km >= 1e5) return `${format(km / 1e4, 0)} 萬公里`;
        if (km >= 100) return `${format(km, 0)} 公里`;
        if (km >= 1) return `${format(km, 2)} 公里`;
        if (km >= 1e-3) return `${format(km * 1e3, 1)} 公尺`;
        return `${format(km * 1e6, 1)} 公釐`;
      },
      bodies: {
        earth: {
          name: "地球",
          mass: "1 個地球質量",
          verdict: "整個地球被壓縮到一顆彈珠大小。",
        },
        sun: {
          name: "太陽",
          mass: "1 個太陽質量",
          verdict: "太陽被壓縮成直徑 6 公里的球，大約是一座小鎮的大小。",
        },
        sgr: {
          name: "人馬座 A*",
          mass: "430 萬個太陽質量",
          compareLabel: "水星軌道",
          verdict: "銀河系中心的黑洞，可以輕鬆放進水星的軌道之內。",
        },
        m87: {
          name: "M87*",
          mass: "65 億個太陽質量",
          compareLabel: "冥王星軌道",
          verdict: "史上第一個被拍下影像的黑洞：它的視界比冥王星的軌道還要寬三倍。",
        },
      },
    },
    collapse: {
      aria: "一顆大質量恆星塌縮、爆發成超新星，最後留下一個黑洞",
      stages: [
        "大質量恆星",
        "核心塌縮",
        "超新星",
        "黑洞",
      ],
    },
    river: {
      aria: "空間像河流一樣流入黑洞，光線朝外發射",
      photons: [
        "緩慢逃離",
        "停在原地",
        "被捲入",
      ],
      horizon: "事件視界",
      flow: "← 空間流入，越來越快",
      centre: "中心",
      farAway: "遠方 →",
    },
    photonSphere: {
      aria: "光線在黑洞周圍彎曲：有些被捕獲，有一道繞著黑洞打轉",
      // Followed by "2.6 rₛ"
      critical: "臨界距離 · 2.6",
      fromFar: "來自遠方的光 →",
      // Followed by "1.5 rₛ"
      sphere: "光子球 · 1.5",
      horizon: "視界",
      rays: "光線：",
      escape: "逃逸",
      loop: "繞行",
      captured: "被捕獲",
    },
    accretion: {
      aria: "吸積盤：內圈比外圈轉得更快；ISCO 以內的氣體會落入黑洞",
      // Followed by "3 rₛ"
      isco: "ISCO · 內緣，3",
      outer: "外側氣體 · 慢、較冷",
      inner: "內側氣體 · 快、數百萬度",
    },
    lensing: {
      aria: "黑洞周圍的吸積盤：沒有重力透鏡與有重力透鏡的對照",
      withGravity: "有重力",
      withoutGravity: "沒有重力",
      // One label over two lines
      farSide1: "吸積盤的遠側，",
      farSide2: "從上方彎折過來",
      below: "遠側，從下方看到",
    },
    spin: {
      aria: "旋轉黑洞的剖面，顯示視界、動圈與吸積盤的內緣",
      spin: "自旋 a/M",
      spinAria: "黑洞自旋",
      withSpin: "順著自旋公轉的吸積盤",
      againstSpin: "逆著自旋公轉的吸積盤",
      isco: "ISCO",
      legend: "動圈（虛線）· 視界（黑色）",
      axis: "自旋軸",
      horizon: "視界 r₊",
      iscoWith: "ISCO，順自旋",
      iscoAgainst: "ISCO，逆自旋",
      efficiency: "質量轉換成光的比例",
      open: (spin) => `以自旋 ${spin} 開啟模擬 →`,
    },
    tides: {
      aria: "太空人落入小黑洞時會被拉長，落入超大質量黑洞時則不會",
      small: "10 個太陽質量",
      smallHorizon: "視界 30 公里",
      large: "人馬座 A*",
      largeHorizon: "視界 1300 萬公里",
    },
    hawking: {
      aria: "黑洞視界附近的粒子對；每一對中都有一個逃逸，成為霍金輻射",
      escapes: "逃逸 · 霍金輻射",
      fallsIn: "落入 · 黑洞失去質量",
    },
  },
};
