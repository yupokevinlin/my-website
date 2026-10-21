import type { HomeTranslation } from "./en";

// Japanese. Text only: everything else comes from the English (see en.ts).
export const HOME_JA: HomeTranslation = {
  profile: {
    title: "シニアフルスタック＋AIエンジニア",
    pitch: (years) =>
      `Best Buy Canadaのテックリード、そしてヘルスケアAIスタートアップForteCareの共同創業者兼CTOを務めています。${years}年以上にわたりソフトウェア開発に携わり、現在は実際のプロダクトやチームの現場でAIを活かすことに注力しています。`,
    city: "バンクーバー",
    region: "BC州",
  },
  seo: {
    title: "Kevin Lin | シニアフルスタック＆AIエンジニア（バンクーバー）",
    description: "Kevin Linはバンクーバー（BC州）を拠点に、React、Next.js、TypeScriptでプロダクトを開発するシニアフルスタック＆AIエンジニアです。プロジェクト、職務経歴、レジュメをご覧いただけます。",
    imageAlt: "Kevin Lin、バンクーバー（BC州）のシニアフルスタック＋AIエンジニア",
  },
  about: {
    paragraphs: [
      "バンクーバーを拠点とするシニアフルスタック＆AIエンジニアです。Best Buy CanadaではMobile Activationチームのテックリードを務めています。同社で最初期となるAI活用型の顧客体験を開発して社内ハッカソンで優勝したほか、チームのAI駆動開発への移行と、Best Buy Canadaのデザインシステム開発を主導しました。",
      "また、ForteCareの共同創業者兼CTOとして、受付から診療記録の完成まで、専門医紹介の一連のプロセスにAIを取り入れる医療プラットフォームを設計しています。",
      (years) => `ソフトウェアエンジニアへの道は、ブリティッシュコロンビア大学（UBC）での化学専攻と、商社でスプレッドシートの自動化に取り組んだ経験から始まりました。ソフトウェア開発に携わって${years}年になる今も、フルスタックなプロダクトの開発・リリースから、プロダクトやチームの働き方へのAIの導入まで、より良く、より速いやり方を見つけることを心から楽しんでいます。`,
    ],
    location: "カナダ・バンクーバー（BC州）",
    languages: [
      {
        name: "英語",
        level: "流暢",
      },
      {
        name: "中国語（標準語）",
        level: "流暢",
      },
      {
        name: "フランス語",
        level: "DELF A1",
      },
    ],
    education: {
      degree: "理学士（化学）",
      school: "ブリティッシュコロンビア大学",
      award: "学長入学奨学金",
    },
    now: "Best Buy Canadaのテックリード、ForteCareのCTO",
  },
  experience: [
    {
      about: "店舗とオンラインで展開する家電量販店",
      roles: [
        {
          title: "シニアソフトウェアエンジニア",
          location: "バンクーバー（BC州）",
          highlights: [
            "Best Buyのハッカソンで優勝。携帯電話の購入手続きを効率化し、店舗での成約率と顧客満足度を高める、同社最初期のAI活用型顧客体験のひとつを開発。",
            "倉庫業務向けAndroidアプリを開発し、1,800万ドルのベンダー資金の回収・確保に貢献。",
            "Best Buy Canadaのデザインシステム開発を主導。スケーラブルなコンポーネントライブラリを構築し、デザインと開発の共通基準を整備。",
            "Mobile ActivationチームのAI駆動開発への移行を先導し、チームに定着したツールの標準とプラクティスを策定。",
          ],
          more: [
            "Mobile Activationチームのテックリードとして、複数のバックエンドエンジニアをメンタリングし、フルスタックエンジニアへと育成。",
            "組織全体で数百時間の工数を削減。JIRA Cloudへの移行に伴うJIRAリンクの移行を自動化するブラウザ拡張機能を、AI支援開発によりわずか1日で開発・リリース。",
          ],
        },
        {
          title: "ソフトウェアエンジニア",
          location: "バンクーバー（BC州）",
          highlights: [
            "開発リードとして、全店舗向け返品管理アプリケーション「Enterprise Returns Application」をNx、TypeScript、Next.js、NextAuth.js、Reactで4か月で納品し、Best Buyの新トランザクションシステムの展開をスケジュールどおりに推進。",
            "ビルド、リリース、リリース承認の各プロセスを自動化し、Mobile Activationチームの工数を週3時間以上削減。",
            "販売時に誤ったモバイル端末がスキャンされたことを検知する、LLMを活用したチェック機能でBest Buyのハッカソン決勝に進出。",
          ],
        },
      ],
    },
    {
      about: "専門医への紹介プロセスを自動化するヘルスケアAIスタートアップ",
      roles: [
        {
          title: "共同創業者兼最高技術責任者（CTO）",
          location: "ロサンゼルス（リモート）",
          highlights: [
            "患者記録の匿名化にかかるコストを100分の1、処理時間を10分の1に削減しつつ、精度を97.3%から99.5%に向上。",
            "プラットフォーム全体のAI統合を主導し、LLM向けの医療用MCPサーバーとスキルを開発。",
            "プラットフォームのアーキテクチャを設計。NxモノレポのNext.jsアプリと15のNestJSマイクロサービスをAzure Container Apps上に構築し、FHIRとHL7でEpicおよびCernerの電子カルテ（EHR）と連携。",
          ],
        },
      ],
    },
    {
      about: "北米有数の大手公益事業者向けワークフォース管理ソフトウェア",
      roles: [
        {
          title: "ソフトウェアエンジニア",
          location: "バンクーバー（BC州）",
          highlights: [
            "React、Microsoft Fluent UI、TypeScript、Redux、Redux Sagaで新しいクライアントUIのアーキテクチャを設計。",
            "クライアントアプリケーションをjQueryからモジュール化されたReactコンポーネントへ移行し、UI開発のスピードを大幅に向上。",
            "Jenkinsパイプラインでビルドとリリースノート作成のプロセスを刷新・自動化し、リリースごとに数時間を削減。",
          ],
          more: [
            "従来の地図コンポーネントをEsriに置き換え、新規顧客の獲得に貢献。",
            "Microsoft Azure Active Directoryを統合し、クライアントアプリケーションのサインインを簡素化。",
          ],
        },
        {
          title: "ソフトウェアサポートエンジニア",
          location: "バンクーバー（BC州）",
          highlights: [
            "Nginxでアプリケーションのセキュリティを強化し、HCL（IBM）AppScanの検査に合格。",
            "集中型ワークフローをGitflowに置き換え、リリース品質を向上。",
            "Apache PDFBoxで動的なPDFレポート生成機能を構築。",
          ],
          more: [
            "ScriptRunnerプラグインでJIRAのワークフローをカスタマイズ。",
          ],
        },
      ],
    },
  ],
  earlyExperience: [
    {
      about: "工業用原材料の貿易・物流を手がける商社",
      roles: [
        {
          title: "ソフトウェア開発者（業務委託）",
          location: "バンクーバー（BC州）",
          highlights: [
            "VBAで拡張された既存のExcelスプレッドシートを刷新し、処理時間を3分の1に短縮。",
            "数千件のExcelスプレッドシートからデータを解析・整理するアプリケーションをElectron、React、Expressで開発。",
          ],
        },
        {
          title: "VBA開発者（業務委託）",
          location: "トロント（オンタリオ州）",
          highlights: [
            "VBAを活用した顧客関係管理（CRM）用のExcelスプレッドシートを構築。",
            "グラフ付きレポートを生成する、VBAを活用したExcelスプレッドシートを作成。",
          ],
        },
        {
          title: "スペシャルアシスタント",
          location: "台北（台湾）",
          highlights: [
            "価格改定メールの作成をVBAで自動化し、作業時間を80%削減。",
            "販売データをグラフ付きレポートに変換する、VBAマクロ搭載のExcelスプレッドシートを作成。",
            "営業スタッフへの石油化学品サプライチェーン研修、展示会ポスターやマーケティングコンテンツのデザイン、四半期ごとの拠点間会議の調整を担当。",
          ],
        },
      ],
    },
  ],
  featuredProjects: [
    {
      name: "ForteCare",
      kicker: "共同創業者兼CTO",
      description: "受付から診療記録の完成まで、専門医紹介の一連のプロセスを自動化するプラットフォーム。匿名化した記録に基づくAIのトリアージと要約により、患者はより早く適切な専門医のもとへ、医師は準備を整えて診察へ。",
      image: {
        alt: "ForteCare：適切な専門医に、適切なタイミングで",
      },
      links: [
        {
          label: "fortecare.aiを見る",
        },
      ],
    },
    {
      name: "相対論的レイトレーシング",
      kicker: "WebGL 2 · 物理",
      description: "ブラックホール、事象の地平面への落下、ワームホール、光速に近い移動を4Kでリアルタイムにシミュレーション。それぞれの背後にある物理を図解したガイド付き。",
      image: {
        alt: "レイトレーシングで描画したブラックホール。光る降着円盤が、影の上側と下側に回り込むように曲がって見える",
      },
      links: [
        {
          label: "デモを試す",
        },
        {
          label: "ガイドを読む",
        },
        {
          label: "コード",
        },
      ],
    },
  ],
  earlierProjects: [
    {
      name: "個人サイト（初代）",
      description: "このサイトの最初のデザイン。雪や鳥、ホタルが彩る全画面の季節の風景を描いた、現在のデザインの原点。",
    },
    {
      name: "COVID-19 Tracker",
      description: "パンデミックの推移を追跡できるインタラクティブな世界地図とチャート。",
    },
    {
      name: "Write My MP",
      description: "カナダの人々が地元選出の連邦下院議員を探し、連絡を取れるよう支援するツール。",
    },
    {
      name: "React Electron Template",
      description: "ホットリロードに対応したElectron、React、TypeScriptのスターターテンプレート。",
    },
  ],
  skillGroups: [
    {
      name: "リーダーシップ＆アーキテクチャ",
      rows: [
        {
          skills: [
            {
              name: "技術リーダーシップ",
            },
            {
              name: "システム設計",
            },
            {
              name: "マイクロサービス",
            },
            {
              name: "分散システム",
            },
            {
              name: "0→1のプロダクト開発",
            },
            {
              name: "メンタリング",
            },
            {
              name: "採用",
            },
            {
              name: "面接",
            },
            {
              name: "開発標準の策定",
            },
            {
              name: "コードレビュー",
            },
            {
              name: "設計ドキュメント",
            },
            {
              name: "部門横断の連携",
            },
            {
              name: "ステークホルダーマネジメント",
            },
            {
              name: "アジャイル開発",
            },
          ],
        },
      ],
    },
    {
      name: "フロントエンド",
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
          label: "状態管理・データ",
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
          label: "スタイリング・UI",
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
          label: "UI品質",
          skills: [
            {
              name: "デザインシステム",
            },
            {
              name: "アクセシビリティ（WCAG）",
            },
            {
              name: "Webパフォーマンス",
            },
            {
              name: "国際化（i18n）",
            },
          ],
        },
      ],
    },
    {
      name: "デザイン",
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
      name: "バックエンド",
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
              name: "REST API設計",
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
              name: "SSO",
            },
            {
              name: "Auth.js",
            },
          ],
        },
      ],
    },
    {
      name: "データ",
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
      name: "AIエンジニアリング",
      rows: [
        {
          skills: [
            {
              name: "LLM統合",
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
              name: "AIエージェント",
            },
            {
              name: "MCP",
            },
            {
              name: "エージェントスキル",
            },
            {
              name: "評価（Evals）",
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
          label: "AI支援開発",
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
          label: "機械学習",
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
      name: "クラウド・DevOps",
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
      name: "品質保証",
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
              name: "ビジュアルリグレッションテスト",
            },
          ],
        },
      ],
    },
    {
      name: "開発ツール",
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
