import type { SimulationsTranslation } from "./en";

// Traditional Chinese. Text only: everything else comes from the English (see en.ts).
export const SIMULATIONS_ZH_TW: SimulationsTranslation = {
  blackhole: {
    controlsHelp: "拖曳：環繞（水平 = 方位角，垂直 = 傾角）· 滾輪或雙指縮放：距離",
    params: {
      spin: {
        label: "自旋 a/M（轉速）",
        hint: "0 = 史瓦西黑洞（不旋轉），0.998 = 索恩極限",
      },
      discDir: {
        label: "盤面繞行方向",
        options: {
          pro: "順行（與自旋同向）",
          retro: "逆行（與自旋反向）",
        },
      },
      distance: {
        label: "距離",
        unit: "M",
      },
      inclination: {
        label: "傾角",
        hint: "高出盤面的高度",
        unit: "°",
      },
      fov: {
        label: "視野",
        unit: "°",
      },
      azimuth: {
        label: "方位角",
        hint: "得益於軸對稱，調整時無須重新追蹤光線",
        unit: "°",
      },
      orbitSpeed: {
        label: "自動環繞",
        unit: "°/s",
      },
      showDisc: {
        label: "吸積盤",
      },
      autoInner: {
        label: "內緣設在 ISCO",
      },
      rin: {
        label: "內半徑",
        unit: "M",
      },
      rout: {
        label: "外半徑",
        unit: "M",
      },
      discSpeed: {
        label: "盤面轉速",
        hint: "每秒經過的重力時間單位；內側軌道較快（克卜勒運動）",
        unit: "M/s",
      },
      temperature: {
        label: "峰值溫度",
        unit: "K",
      },
      doppler: {
        label: "都卜勒與重力頻移",
        hint: "1 = 物理強度，0 = 無都卜勒效應（《星際效應》的藝術選擇）",
      },
      colorMode: {
        label: "色彩模型",
        hint: "物理模式：遠離的一側會變紅，高自旋時可能暗到全黑。調高溫度可讓它保持可見。",
        options: {
          cinematic: "電影風格（固定色調、集束）",
          physical: "黑體（完整都卜勒色彩）",
        },
      },
      discGain: {
        label: "盤面亮度",
      },
      opacity: {
        label: "盤面不透明度",
      },
      clouds: {
        label: "氣體結構",
        hint: "0 = 單純的細條紋，1 = 同心的氣體帶，氣體條紋沿著它們滑動",
      },
      clumpSize: {
        label: "條紋大小",
        hint: "氣體帶與條紋的寬度",
      },
      coverage: {
        label: "條紋密度",
        hint: "氣體條紋的數量；數值低時會留下可以看穿的縫隙",
      },
      concentration: {
        label: "內側集中度",
        hint: "氣體越靠近黑洞變得越密、越亮的程度；外側氣體會化為淡淡的細絲",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "銀河系（NASA）",
          grid: "透鏡網格",
          none: "無",
        },
      },
      skyGain: {
        label: "天空亮度",
      },
      skyYaw: {
        label: "天空旋轉",
        unit: "°",
      },
      skyTilt: {
        label: "天空傾斜",
        hint: "銀河系與盤面之間的夾角",
        unit: "°",
      },
      quality: {
        label: "積分精度",
        options: {
          draft: "草稿（快速）",
          standard: "標準",
          high: "高（較慢）",
        },
      },
    },
  },
  infall: {
    controlsHelp: "拖曳：環顧四周 · 滾輪或雙指縮放：靠近或遠離（會停止下落）",
    params: {
      observer: {
        label: "觀察者",
        hint: "懸停的觀察者必須點燃火箭才能停在原地；在視界上或視界內，沒有東西能懸停。",
        options: {
          fall: "自由落下",
          hover: "以火箭懸停",
        },
      },
      motion: {
        label: "運動",
        options: {
          fall: "落入（循環）",
          manual: "手動",
        },
      },
      radius: {
        label: "半徑（手動）／起始半徑",
        hint: "視界在 2 M，光子球在 3 M",
        unit: "M",
      },
      pacing: {
        label: "節奏",
        hint: "真實時間：從視界到奇異點的最後一段，以你自己的時間計只需 4/3 M。",
        options: {
          even: "靠近黑洞時放慢",
          proper: "真實時間（下落者的時鐘）",
        },
      },
      fallSpeed: {
        label: "下落速度",
        unit: "×",
      },
      mass: {
        label: "黑洞質量",
        hint: "只會改變讀數中的真實時間與力；畫面在任何質量下都相同。",
        options: {
          stellar: "10 個太陽（恆星級）",
          sgra: "430 萬個太陽（人馬座 A*）",
          gargantua: "1 億個太陽（Gargantua）",
          m87: "65 億個太陽（M87*）",
        },
      },
      interior: {
        label: "視界內部",
        hint: "理想化的永恆黑洞連接著另一個宇宙；進入視界後，你會在下方瞥見它。",
        options: {
          real: "真實黑洞（由恆星塌縮形成）",
          eternal: "永恆黑洞（看見另一個宇宙）",
        },
      },
      autoLook: {
        label: "讓邊緣保持在視野內",
        hint: "隨著黑色區域擴大，從面向黑洞逐漸轉向天空",
      },
      fov: {
        label: "視野",
        unit: "°",
      },
      pitch: {
        label: "抬頭／低頭",
        hint: "疊加在自動角度上；關閉自動時，0° = 正對下方的黑洞",
        unit: "°",
      },
      azimuth: {
        label: "轉向",
        unit: "°",
      },
      dopplerColor: {
        label: "都卜勒色移",
      },
      beaming: {
        label: "亮度偏移",
        hint: "藍移的光較亮，紅移的光較暗",
      },
      autoExposure: {
        label: "懸停時自動調整曝光",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "銀河系（NASA）",
          grid: "透鏡網格",
        },
      },
      skyGain: {
        label: "天空亮度",
      },
      otherGain: {
        label: "另一個宇宙的亮度",
      },
      skyYaw: {
        label: "天空旋轉",
        unit: "°",
      },
      skyTilt: {
        label: "天空傾斜",
        unit: "°",
      },
    },
  },
  wormhole: {
    controlsHelp: "拖曳：環顧四周 · 滾輪或雙指縮放：沿蟲洞移動（手動模式）",
    params: {
      throat: {
        label: "喉部長度 a",
        hint: "圓柱形內部的半長，以喉部半徑 ρ 為單位",
        unit: "ρ",
      },
      lensing: {
        label: "透鏡參數 M",
        hint: "M 越大，洞口越平滑，重力透鏡的範圍也越寬",
        unit: "ρ",
      },
      travel: {
        label: "相機運動",
        options: {
          manual: "手動",
          oscillate: "來回穿越",
          fly: "飛越（循環）",
        },
      },
      position: {
        label: "距離 l（手動）／範圍",
        unit: "ρ",
      },
      travelSpeed: {
        label: "移動速度",
        unit: "ρ/s",
      },
      autoTurn: {
        label: "相機自動轉向",
        hint: "在蟲洞內轉向面對喉部的牆面，再從另一側回頭看它",
      },
      turnStart: {
        label: "轉向距離",
        hint: "相機在離洞口多遠處開始轉向；進入時會面對喉部牆面。蟲洞始終保持在視野內。",
        unit: "ρ",
      },
      fov: {
        label: "視野",
        unit: "°",
      },
      yaw: {
        label: "左右視角",
        unit: "°",
      },
      pitch: {
        label: "上下視角",
        unit: "°",
      },
      skyA: {
        label: "家鄉側天空",
        options: {
          milkyway: "銀河系（NASA）",
          alien: "星雲星系",
          grid: "透鏡網格",
        },
      },
      skyB: {
        label: "彼端天空",
        options: {
          alien: "星雲星系",
          milkyway: "銀河系（NASA）",
          grid: "透鏡網格",
        },
      },
      gainA: {
        label: "家鄉天空亮度",
      },
      gainB: {
        label: "彼端天空亮度",
      },
      skyYawA: {
        label: "家鄉天空旋轉",
        unit: "°",
      },
      skyYawB: {
        label: "彼端天空旋轉",
        unit: "°",
      },
    },
  },
  lightspeed: {
    controlsHelp: "拖曳：環顧四周 · 滾輪或雙指縮放：改變速度",
    params: {
      speed: {
        label: "速度",
        hint: "快度 η：β = tanh η，γ = cosh η。每段相等的間距，感覺都像引擎一次相同的推力。",
      },
      drive: {
        label: "推進方式",
        options: {
          cruise: "以設定速度巡航",
          accel: "以 1 g 加速至設定速度",
        },
      },
      yearsPerSecond: {
        label: "每秒的船上時間",
        unit: "年/秒",
      },
      fov: {
        label: "視野",
        unit: "°",
      },
      yaw: {
        label: "左右視角",
        hint: "0° = 正前方，180° = 向後看",
        unit: "°",
      },
      pitch: {
        label: "上下視角",
        unit: "°",
      },
      aberration: {
        label: "光行差",
      },
      dopplerColor: {
        label: "都卜勒色移",
      },
      beaming: {
        label: "相對論性集束",
        hint: "探照燈效應：亮度隨都卜勒因子縮放",
      },
      autoExposure: {
        label: "依速度調整曝光",
        hint: "就像眼睛適應前方越來越亮的景象",
      },
      cmb: {
        label: "宇宙微波背景輻射",
        hint: "在極高速度下（D 超過約 300）會出現在前方",
      },
      cmbLog: {
        label: "CMB 亮度（log₁₀）",
      },
      nearStars: {
        label: "近距離 3D 星星",
      },
      density: {
        label: "星星密度",
      },
      cellSize: {
        label: "星星間距",
        unit: "光年",
      },
      starGain: {
        label: "近處星星亮度",
      },
      maxCells: {
        label: "星星繪製距離",
        unit: "格",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "銀河系（NASA）",
          grid: "光行差網格",
          none: "無",
        },
      },
      skyGain: {
        label: "天空亮度",
      },
    },
  },
  output: {
    params: {
      resolution: {
        label: "渲染解析度",
        hint: "內部渲染尺寸，快照也以此解析度儲存。手機和平板最多以螢幕尺寸渲染，上限約為 1080p。",
        options: {
          "2160p": "4K UHD（3840×2160）",
          "1440p": "QHD（2560×1440）",
          "1080p": "Full HD（1920×1080）",
          "720p": "HD（1280×720）",
          window: "符合視窗大小",
        },
      },
      skyTier: {
        label: "星圖細節",
        hint: "NASA SVS Deep Star Maps 2020，預先處理成 HDR 立方體貼圖。手機和平板最高只能選「高」。",
        options: {
          "1024": "中：每面 1024²（2 MB）",
          "2048": "高：每面 2048²（11 MB）",
          "4096": "超高：每面 4096²（45 MB）",
        },
      },
      exposure: {
        label: "曝光",
        unit: "EV",
      },
      bloom: {
        label: "光暈",
      },
      bloomRadius: {
        label: "光暈半徑",
      },
      tonemap: {
        label: "色調映射",
        options: {
          "0": "ACES 電影色調",
          "1": "Reinhard",
          "2": "線性（裁切）",
        },
      },
      timeScale: {
        label: "時間速度",
        unit: "×",
      },
    },
  },
};
