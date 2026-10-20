import type { SimulationsTranslation } from "./en";

// Simplified Chinese. Text only: everything else comes from the English (see en.ts).
export const SIMULATIONS_ZH_CN: SimulationsTranslation = {
  blackhole: {
    controlsHelp: "拖动：环绕（水平 = 方位角，垂直 = 倾角）· 滚轮或双指缩放：距离",
    params: {
      spin: {
        label: "自旋 a/M（转速）",
        hint: "0 = 史瓦西黑洞（不转动），0.998 = 索恩极限",
      },
      discDir: {
        label: "吸积盘绕行方向",
        options: {
          pro: "顺行（与自旋同向）",
          retro: "逆行（与自旋反向）",
        },
      },
      distance: {
        label: "距离",
        unit: "M",
      },
      inclination: {
        label: "倾角",
        hint: "高出吸积盘平面的角度",
        unit: "°",
      },
      fov: {
        label: "视野",
        unit: "°",
      },
      azimuth: {
        label: "方位角",
        hint: "得益于轴对称，调整它无需重新追踪光线",
        unit: "°",
      },
      orbitSpeed: {
        label: "自动环绕",
        unit: "°/s",
      },
      showDisc: {
        label: "吸积盘",
      },
      autoInner: {
        label: "内边缘位于ISCO",
      },
      rin: {
        label: "内半径",
        unit: "M",
      },
      rout: {
        label: "外半径",
        unit: "M",
      },
      discSpeed: {
        label: "吸积盘转速",
        hint: "每秒经过的引力时间单位；内侧轨道转得更快（开普勒运动）",
        unit: "M/s",
      },
      temperature: {
        label: "峰值温度",
        unit: "K",
      },
      doppler: {
        label: "多普勒与引力频移",
        hint: "1 = 真实物理强度，0 = 无多普勒效应（《星际穿越》的艺术选择）",
      },
      colorMode: {
        label: "颜色模型",
        hint: "黑体模式：远离的一侧会变红，高自旋时可能暗至全黑。调高温度可让它保持可见。",
        options: {
          cinematic: "电影风格（固定色调，含集束）",
          physical: "黑体（完整多普勒色彩）",
        },
      },
      discGain: {
        label: "吸积盘亮度",
      },
      opacity: {
        label: "吸积盘不透明度",
      },
      clouds: {
        label: "气体结构",
        hint: "0 = 简单的细条纹，1 = 同心环带，气体条纹沿环带滑动",
      },
      clumpSize: {
        label: "条纹大小",
        hint: "环带和条纹的宽度",
      },
      coverage: {
        label: "条纹密度",
        hint: "气体条纹的多少；数值低时会留下可以看穿的空隙",
      },
      concentration: {
        label: "向内聚集度",
        hint: "气体越靠近黑洞变得越密、越亮的程度；外侧气体会变成淡淡的丝缕",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "银河系（NASA）",
          grid: "透镜网格",
          none: "无",
        },
      },
      skyGain: {
        label: "星空亮度",
      },
      skyYaw: {
        label: "星空旋转",
        unit: "°",
      },
      skyTilt: {
        label: "星空倾斜",
        hint: "银河系与吸积盘平面的夹角",
        unit: "°",
      },
      quality: {
        label: "积分精度",
        options: {
          draft: "草稿（快）",
          standard: "标准",
          high: "高（慢）",
        },
      },
    },
  },
  infall: {
    controlsHelp: "拖动：环顾四周 · 滚轮或双指缩放：靠近或远离（会停止下落）",
    params: {
      observer: {
        label: "观察者",
        hint: "悬停的观察者必须点燃火箭才能停在原地；在视界上或视界内，任何东西都无法悬停。",
        options: {
          fall: "自由下落",
          hover: "靠火箭悬停",
        },
      },
      motion: {
        label: "运动",
        options: {
          fall: "坠入（循环）",
          manual: "手动",
        },
      },
      radius: {
        label: "半径（手动）/ 起始半径",
        hint: "视界位于2 M，光子球位于3 M",
        unit: "M",
      },
      pacing: {
        label: "节奏",
        hint: "真实时间：从视界到奇点的最后一段，按你自己的时间只需4/3 M。",
        options: {
          even: "在黑洞附近放慢",
          proper: "真实时间（下落者的时钟）",
        },
      },
      fallSpeed: {
        label: "下落速度",
        unit: "×",
      },
      mass: {
        label: "黑洞质量",
        hint: "只改变读数中的真实时间和力；无论质量多大，看到的景象都一样。",
        options: {
          stellar: "10个太阳（恒星级）",
          sgra: "430万个太阳（人马座 A*）",
          gargantua: "1亿个太阳（卡冈图雅）",
          m87: "65亿个太阳（M87*）",
        },
      },
      interior: {
        label: "视界内部",
        hint: "理想化的永恒黑洞连接着另一个宇宙，进入视界后，你能在下方瞥见它。",
        options: {
          real: "真实黑洞（由恒星坍缩形成）",
          eternal: "永恒黑洞（可见另一个宇宙）",
        },
      },
      autoLook: {
        label: "保持边缘在视野中",
        hint: "随着黑色区域扩大，视线从正对黑洞逐渐转向天空",
      },
      fov: {
        label: "视野",
        unit: "°",
      },
      pitch: {
        label: "抬头 / 低头",
        hint: "叠加在自动角度之上；关闭自动时，0° = 正对下方的黑洞",
        unit: "°",
      },
      azimuth: {
        label: "转身",
        unit: "°",
      },
      dopplerColor: {
        label: "多普勒变色",
      },
      beaming: {
        label: "亮度变化",
        hint: "蓝移的光更亮，红移的光更暗",
      },
      autoExposure: {
        label: "悬停时自动调节曝光",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "银河系（NASA）",
          grid: "透镜网格",
        },
      },
      skyGain: {
        label: "星空亮度",
      },
      otherGain: {
        label: "另一宇宙亮度",
      },
      skyYaw: {
        label: "星空旋转",
        unit: "°",
      },
      skyTilt: {
        label: "星空倾斜",
        unit: "°",
      },
    },
  },
  wormhole: {
    controlsHelp: "拖动：环顾四周 · 滚轮或双指缩放：沿虫洞移动（手动模式）",
    params: {
      throat: {
        label: "喉部长度 a",
        hint: "圆柱形内部长度的一半，以喉部半径ρ为单位",
        unit: "ρ",
      },
      lensing: {
        label: "透镜参数 M",
        hint: "M越大，洞口越平滑，引力透镜的范围越宽",
        unit: "ρ",
      },
      travel: {
        label: "相机运动",
        options: {
          manual: "手动",
          oscillate: "来回穿越",
          fly: "穿越飞行（循环）",
        },
      },
      position: {
        label: "距离 l（手动）/ 范围",
        unit: "ρ",
      },
      travelSpeed: {
        label: "移动速度",
        unit: "ρ/s",
      },
      autoTurn: {
        label: "相机自动转向",
        hint: "在虫洞内转向喉部内壁，到达另一侧后再回望虫洞",
      },
      turnStart: {
        label: "转向距离",
        hint: "相机在离洞口多远处开始转向；进入时正对喉部内壁。虫洞始终保持在视野中。",
        unit: "ρ",
      },
      fov: {
        label: "视野",
        unit: "°",
      },
      yaw: {
        label: "视线偏航",
        unit: "°",
      },
      pitch: {
        label: "视线俯仰",
        unit: "°",
      },
      skyA: {
        label: "本侧星空",
        options: {
          milkyway: "银河系（NASA）",
          alien: "星云星系",
          grid: "透镜网格",
        },
      },
      skyB: {
        label: "对侧星空",
        options: {
          alien: "星云星系",
          milkyway: "银河系（NASA）",
          grid: "透镜网格",
        },
      },
      gainA: {
        label: "本侧星空亮度",
      },
      gainB: {
        label: "对侧星空亮度",
      },
      skyYawA: {
        label: "本侧星空旋转",
        unit: "°",
      },
      skyYawB: {
        label: "对侧星空旋转",
        unit: "°",
      },
    },
  },
  lightspeed: {
    controlsHelp: "拖动：环顾四周 · 滚轮或双指缩放：改变速度",
    params: {
      speed: {
        label: "速度",
        hint: "快度η：β = tanh η，γ = cosh η。每移动相同的一步，都相当于引擎给出一次同样的推力。",
      },
      drive: {
        label: "驱动",
        options: {
          cruise: "以设定速度巡航",
          accel: "以1 g加速至设定速度",
        },
      },
      yearsPerSecond: {
        label: "每秒飞船时间",
        unit: "年/秒",
      },
      fov: {
        label: "视野",
        unit: "°",
      },
      yaw: {
        label: "视线偏航",
        hint: "0° = 正前方，180° = 向后看",
        unit: "°",
      },
      pitch: {
        label: "视线俯仰",
        unit: "°",
      },
      aberration: {
        label: "光行差",
      },
      dopplerColor: {
        label: "多普勒变色",
      },
      beaming: {
        label: "相对论性集束",
        hint: "探照灯效应：亮度随多普勒因子变化",
      },
      autoExposure: {
        label: "随速度自动调节曝光",
        hint: "就像眼睛适应前方越来越亮的景象",
      },
      cmb: {
        label: "宇宙微波背景",
        hint: "在极高速度下出现在前方（D > ~300）",
      },
      cmbLog: {
        label: "CMB亮度（log₁₀）",
      },
      nearStars: {
        label: "近处的3D恒星",
      },
      density: {
        label: "恒星密度",
      },
      cellSize: {
        label: "恒星间距",
        unit: "光年",
      },
      starGain: {
        label: "近处恒星亮度",
      },
      maxCells: {
        label: "恒星绘制距离",
        unit: "格",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "银河系（NASA）",
          grid: "光行差网格",
          none: "无",
        },
      },
      skyGain: {
        label: "星空亮度",
      },
    },
  },
  output: {
    params: {
      resolution: {
        label: "渲染分辨率",
        hint: "内部渲染尺寸，截图也按此分辨率保存。手机和平板最多按屏幕尺寸渲染，上限约为1080p。",
        options: {
          "2160p": "4K超高清（3840×2160）",
          "1440p": "QHD（2560×1440）",
          "1080p": "全高清（1920×1080）",
          "720p": "高清（1280×720）",
          window: "匹配窗口",
        },
      },
      skyTier: {
        label: "星图精细度",
        hint: "NASA SVS的Deep Star Maps 2020，已预处理为HDR立方体贴图。手机和平板最高只能选“高”。",
        options: {
          "1024": "中：每面1024²（2 MB）",
          "2048": "高：每面2048²（11 MB）",
          "4096": "超高：每面4096²（45 MB）",
        },
      },
      exposure: {
        label: "曝光",
        unit: "EV",
      },
      bloom: {
        label: "泛光",
      },
      bloomRadius: {
        label: "泛光半径",
      },
      tonemap: {
        label: "色调映射",
        options: {
          "0": "ACES 胶片",
          "1": "Reinhard",
          "2": "线性（截断）",
        },
      },
      timeScale: {
        label: "时间流速",
        unit: "×",
      },
    },
  },
};
