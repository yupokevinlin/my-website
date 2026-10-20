import type { SimulationsTranslation } from "./en";

// Japanese. Text only: everything else comes from the English (see en.ts).
export const SIMULATIONS_JA: SimulationsTranslation = {
  blackhole: {
    controlsHelp: "ドラッグ：周回（横＝方位角、縦＝傾き）・ホイール／ピンチ：距離",
    params: {
      spin: {
        label: "スピンa/M（回転）",
        hint: "0＝シュワルツシルト（回転なし）、0.998＝ソーンの限界",
      },
      discDir: {
        label: "円盤の公転方向",
        options: {
          pro: "順行（スピンと同じ向き）",
          retro: "逆行（スピンと逆向き）",
        },
      },
      distance: {
        label: "距離",
        unit: "M",
      },
      inclination: {
        label: "傾き",
        hint: "円盤面からの高さ",
        unit: "°",
      },
      fov: {
        label: "視野角",
        unit: "°",
      },
      azimuth: {
        label: "方位角",
        hint: "軸対称なので、光線を追跡し直さずに自由に変えられます",
        unit: "°",
      },
      orbitSpeed: {
        label: "自動周回",
        unit: "°/s",
      },
      showDisc: {
        label: "降着円盤",
      },
      autoInner: {
        label: "内縁をISCOに合わせる",
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
        label: "円盤の回転速度",
        hint: "1秒あたりに進む重力時間単位。内側の軌道ほど速く回ります（ケプラー回転）",
        unit: "M/s",
      },
      temperature: {
        label: "最高温度",
        unit: "K",
      },
      doppler: {
        label: "ドップラー・重力偏移",
        hint: "1＝物理的に正しい強さ、0＝ドップラーなし（『インターステラー』の芸術的な選択）",
      },
      colorMode: {
        label: "色のモデル",
        hint: "物理：遠ざかる側は赤くなり、高スピンでは真っ暗に消えることがあります。見えるようにするには温度を上げてください。",
        options: {
          cinematic: "シネマティック（色合い固定、ビーミングあり）",
          physical: "黒体（ドップラーによる色の変化をすべて再現）",
        },
      },
      discGain: {
        label: "円盤の明るさ",
      },
      opacity: {
        label: "円盤の不透明度",
      },
      clouds: {
        label: "ガスの構造",
        hint: "0＝単純な細い筋、1＝同心円状のレーンに沿って、ガスの筋が滑るように流れる",
      },
      clumpSize: {
        label: "筋の大きさ",
        hint: "レーンと筋の幅",
      },
      coverage: {
        label: "筋の密度",
        hint: "ガスの筋の量。値が小さいと、向こうが透けて見えるすき間ができます",
      },
      concentration: {
        label: "内側への集中",
        hint: "ブラックホールに近づくほど、ガスがどれだけ濃く明るくなるか。外側のガスはかすかなもやになります",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "天の川銀河（NASA）",
          grid: "重力レンズ格子",
          none: "なし",
        },
      },
      skyGain: {
        label: "空の明るさ",
      },
      skyYaw: {
        label: "空の回転",
        unit: "°",
      },
      skyTilt: {
        label: "空の傾き",
        hint: "天の川銀河の面と円盤面のなす角",
        unit: "°",
      },
      quality: {
        label: "積分の精度",
        options: {
          draft: "ドラフト（高速）",
          standard: "標準",
          high: "高精度（低速）",
        },
      },
    },
  },
  infall: {
    controlsHelp: "ドラッグ：見回す・ホイール／ピンチ：近づく・遠ざかる（落下は止まります）",
    params: {
      observer: {
        label: "観測者",
        hint: "ホバリングする観測者は、その場にとどまるためにロケットを噴射し続ける必要があります。地平面上やその内側では、何ものもホバリングできません。",
        options: {
          fall: "自由落下",
          hover: "ロケットでホバリング",
        },
      },
      motion: {
        label: "動き",
        options: {
          fall: "落下（くり返し）",
          manual: "手動",
        },
      },
      radius: {
        label: "半径（手動）／開始半径",
        hint: "地平面は2 M、光子球は3 Mの位置にあります",
        unit: "M",
      },
      pacing: {
        label: "進むペース",
        hint: "実時間：最後の区間、地平面から特異点までは、あなた自身の時間でわずか4/3 Mしかかかりません。",
        options: {
          even: "ブラックホールの近くで減速",
          proper: "実時間（落下する時計）",
        },
      },
      fallSpeed: {
        label: "落下速度",
        unit: "×",
      },
      mass: {
        label: "ブラックホールの質量",
        hint: "変わるのは、表示される現実の時間と力だけです。見た目はどの質量でも同じです。",
        options: {
          stellar: "太陽の10倍（恒星ブラックホール）",
          sgra: "太陽の430万倍（いて座A*）",
          gargantua: "太陽の1億倍（ガルガンチュア）",
          m87: "太陽の65億倍（M87*）",
        },
      },
      interior: {
        label: "地平面の内側",
        hint: "理想化された永遠のブラックホールはもう1つの宇宙とつながっていて、内側に入ると、下にその宇宙がちらりと見えます。",
        options: {
          real: "現実のブラックホール（星の崩壊でできたもの）",
          eternal: "永遠のブラックホール（もう1つの宇宙が見える）",
        },
      },
      autoLook: {
        label: "縁を視野に収める",
        hint: "黒い領域が広がるにつれて、ブラックホールの方向から空の方向へと向きを変えます",
      },
      fov: {
        label: "視野角",
        unit: "°",
      },
      pitch: {
        label: "見上げる／見下ろす",
        hint: "自動の角度に加算されます。自動がオフのときは、0°でブラックホールを真下に見ます",
        unit: "°",
      },
      azimuth: {
        label: "振り向く",
        unit: "°",
      },
      dopplerColor: {
        label: "ドップラーによる色ずれ",
      },
      beaming: {
        label: "明るさの変化",
        hint: "青方偏移した光は明るく、赤方偏移した光は暗くなります",
      },
      autoExposure: {
        label: "ホバリング中は露出を自動調整",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "天の川銀河（NASA）",
          grid: "重力レンズ格子",
        },
      },
      skyGain: {
        label: "空の明るさ",
      },
      otherGain: {
        label: "もう1つの宇宙の明るさ",
      },
      skyYaw: {
        label: "空の回転",
        unit: "°",
      },
      skyTilt: {
        label: "空の傾き",
        unit: "°",
      },
    },
  },
  wormhole: {
    controlsHelp: "ドラッグ：見回す・ホイール／ピンチ：ワームホールに沿って移動（手動モード）",
    params: {
      throat: {
        label: "スロートの長さa",
        hint: "円筒形の内部の長さの半分。スロートの半径ρを単位とします",
        unit: "ρ",
      },
      lensing: {
        label: "レンズパラメータM",
        hint: "Mが大きいほど入り口はなめらかになり、重力レンズの範囲が広がります",
        unit: "ρ",
      },
      travel: {
        label: "カメラの動き",
        options: {
          manual: "手動",
          oscillate: "往復しながら通り抜ける",
          fly: "通り抜ける（くり返し）",
        },
      },
      position: {
        label: "距離l（手動）／範囲",
        unit: "ρ",
      },
      travelSpeed: {
        label: "移動速度",
        unit: "ρ/s",
      },
      autoTurn: {
        label: "カメラの自動回転",
        hint: "ワームホールの内部ではスロートの壁のほうを向き、向こう側に出たら振り返ってワームホールを見ます",
      },
      turnStart: {
        label: "回転を始める距離",
        hint: "入り口からどれだけ手前で、カメラが向きを変え始めるか。入るときにはスロートの壁のほうを向きます。ワームホールはつねに視野に収まります。",
        unit: "ρ",
      },
      fov: {
        label: "視野角",
        unit: "°",
      },
      yaw: {
        label: "視線の方位",
        unit: "°",
      },
      pitch: {
        label: "視線の仰角",
        unit: "°",
      },
      skyA: {
        label: "こちら側の空",
        options: {
          milkyway: "天の川銀河（NASA）",
          alien: "星雲の銀河",
          grid: "重力レンズ格子",
        },
      },
      skyB: {
        label: "向こう側の空",
        options: {
          alien: "星雲の銀河",
          milkyway: "天の川銀河（NASA）",
          grid: "重力レンズ格子",
        },
      },
      gainA: {
        label: "こちら側の空の明るさ",
      },
      gainB: {
        label: "向こう側の空の明るさ",
      },
      skyYawA: {
        label: "こちら側の空の回転",
        unit: "°",
      },
      skyYawB: {
        label: "向こう側の空の回転",
        unit: "°",
      },
    },
  },
  lightspeed: {
    controlsHelp: "ドラッグ：見回す・ホイール／ピンチ：速さを変える",
    params: {
      speed: {
        label: "速さ",
        hint: "ラピディティη：β = tanh η、γ = cosh η。同じ幅だけ動かすと、エンジンで同じだけ押されたように感じます。",
      },
      drive: {
        label: "推進",
        options: {
          cruise: "設定速度で巡航",
          accel: "1 gで設定速度まで加速",
        },
      },
      yearsPerSecond: {
        label: "1秒あたりの船内時間",
        unit: "年/秒",
      },
      fov: {
        label: "視野角",
        unit: "°",
      },
      yaw: {
        label: "視線の方位",
        hint: "0°＝真正面、180°＝真後ろ",
        unit: "°",
      },
      pitch: {
        label: "視線の仰角",
        unit: "°",
      },
      aberration: {
        label: "光行差",
      },
      dopplerColor: {
        label: "ドップラーによる色ずれ",
      },
      beaming: {
        label: "相対論的ビーミング",
        hint: "サーチライト効果：明るさがドップラー因子に応じて変わります",
      },
      autoExposure: {
        label: "速さに合わせて露出を調整",
        hint: "前方が明るくなっていくのに、目が慣れていくように",
      },
      cmb: {
        label: "宇宙マイクロ波背景放射",
        hint: "極端な速さ（D > 約300）で前方に見えてきます",
      },
      cmbLog: {
        label: "CMBの明るさ（log₁₀）",
      },
      nearStars: {
        label: "近くの星（3D）",
      },
      density: {
        label: "星の密度",
      },
      cellSize: {
        label: "星の間隔",
        unit: "光年",
      },
      starGain: {
        label: "近くの星の明るさ",
      },
      maxCells: {
        label: "星の描画距離",
        unit: "マス",
      },
      skyMode: {
        label: "背景",
        options: {
          milkyway: "天の川銀河（NASA）",
          grid: "光行差の格子",
          none: "なし",
        },
      },
      skyGain: {
        label: "空の明るさ",
      },
    },
  },
  output: {
    params: {
      resolution: {
        label: "描画解像度",
        hint: "内部で描画するサイズ。スナップショットはこの解像度で保存されます。スマートフォンとタブレットでは、画面サイズまで（最大で約1080p）で描画します。",
        options: {
          "2160p": "4K UHD（3840×2160）",
          "1440p": "QHD（2560×1440）",
          "1080p": "フルHD（1920×1080）",
          "720p": "HD（1280×720）",
          window: "ウィンドウに合わせる",
        },
      },
      skyTier: {
        label: "星図の精細さ",
        hint: "NASA SVSのDeep Star Maps 2020を、HDRキューブマップに前処理したもの。スマートフォンとタブレットでは「高」までに制限されます。",
        options: {
          "1024": "中：各面1024²（2 MB）",
          "2048": "高：各面2048²（11 MB）",
          "4096": "最高：各面4096²（45 MB）",
        },
      },
      exposure: {
        label: "露出",
        unit: "EV",
      },
      bloom: {
        label: "ブルーム",
      },
      bloomRadius: {
        label: "ブルームの半径",
      },
      tonemap: {
        label: "トーンマッピング",
        options: {
          "0": "ACESフィルミック",
          "1": "Reinhard",
          "2": "リニア（クリップ）",
        },
      },
      timeScale: {
        label: "時間の速さ",
        unit: "×",
      },
    },
  },
};
