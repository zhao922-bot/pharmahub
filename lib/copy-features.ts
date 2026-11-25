import { clinicalTagLabels } from "./copy-enrichment";

export const reviewSessionCopy = {
  pageTitle: "连续复习",
  pageBody: "先凭记忆回想作用机制，再翻看答案并自评掌握程度。",
  backHome: "回到首页",
  backCards: "回到卡片库",

  modeGroupLabel: "选择复习队列",
  modes: {
    due: "到期复习",
    favorites: "收藏卡片",
    unlearned: "未学新卡",
  },
  categoryGroupLabel: "按系统筛选复习队列",
  allCategories: "全部系统",

  progress: (current: number, total: number) => `第 ${current} / ${total} 张`,
  cardStatusNew: "未学新卡",
  cardStatusReviewed: (repetitions: number) => `已复习 ${repetitions} 轮`,
  frontHint: "试着先回答：作用靶点是什么？主要经过哪些信号变化？产生什么效应？",
  targetHintShow: "查看靶点提示",
  targetHintHide: "收起靶点提示",
  targetHintTitle: "靶点提示",
  flipButton: "查看机制与答案（Space）",

  targetTitle: "作用靶点",
  mechanismTitle: "作用机制",
  diagramTitle: "机制示意图",
  memoryTipTitle: "记忆要点",
  viewDetail: "查看完整卡片",

  ratePrompt: "自评掌握程度，系统会自动安排下次复习时间",
  saving: "正在记录…",
  saveFailed: "记录失败，请检查连接后重试",
  retry: "重试",
  shortcutHint: "快捷键：Space 翻面 · 1 没记住 · 2 模糊 · 3 记住了",

  qualityOptions: [
    {
      value: 0 as const,
      keyHint: "1",
      label: "没记住",
      hint: "完全想不起来",
    },
    {
      value: 1 as const,
      keyHint: "2",
      label: "模糊",
      hint: "想起一部分",
    },
    {
      value: 2 as const,
      keyHint: "3",
      label: "记住了",
      hint: "能讲清机制",
    },
  ],

  completedTitle: "本轮复习完成",
  completedSubtitle: (count: number) => `已完成 ${count} 张卡片的复习自评。`,
  completedRemembered: "记住了",
  completedFuzzy: "模糊",
  completedForgot: "没记住",
  nextReviewLabel: (date: string) => `下次 ${date}`,
  intervalLabel: (days: number) => (days <= 1 ? "明天" : `${days} 天后`),
  continueDue: "继续复习到期卡片",
  switchFavorites: "复习收藏卡片",
  switchUnlearned: "学习未学新卡",
  restartQueue: "再刷一轮",
  goCards: "回到卡片库",
  goHome: "回到首页",

  empty: {
    due: {
      title: "当前没有到期的复习卡片",
      body: "今日到期任务已清空，可以切换到「未学新卡」或「收藏卡片」继续巩固。",
    },
    favorites: {
      title: "还没有收藏的卡片",
      body: "在卡片详情页点击「收藏」后，这里会自动整理成你的重点复习队列。",
    },
    unlearned: {
      title: "当前范围的卡片都已开始学习",
      body: "可以切换到「到期复习」巩固已学内容，或放开系统筛选。",
    },
  },
} as const;

export const cardFilterCopy = {
  reviewQueueCta: "开始连续复习",
  reviewQueueDueHint: (dueCount: number) => `${dueCount} 张待复习`,
  statusGroupLabel: "按学习状态筛选",
  statuses: {
    all: "全部状态",
    favorites: "已收藏",
    due: "待复习",
    unlearned: "未学习",
    mastered: "已掌握",
  },
  tagGroupLabel: "按用药特征筛选",
  allTags: "全部特征",
  clinicalTags: clinicalTagLabels,
  badges: {
    favorited: "已收藏",
    due: "待复习",
    mastered: "已掌握",
  },
} as const;

export const homeFeaturesCopy = {
  startReviewQueue: "开始连续复习",
  masteryTitle: "各系统掌握诊断",
  masteryBody: "结合卡片学习进度、待复习数与测验正确率，快速定位最需要巩固的系统。",
  weakestBadge: "推荐练习",
  weakestSummaryPrefix: "建议下一步",
  allBalancedHint: "各系统掌握整体均衡，按节奏完成每日到期复习即可。",
  learnedMetric: (learned: number, total: number) => `已学 ${learned}/${total}`,
  dueMetric: (due: number) => `待复习 ${due}`,
  accuracyMetric: (percent: number | null) =>
    percent === null ? "尚未测验" : `测验 ${percent}%`,
  goCards: "看卡片",
  goQuiz: "去测验",
  goReview: "去复习",
} as const;

export const importCopy = {
  sectionTitle: "导入并合并学习数据",
  sectionBody:
    "支持导入之前导出的 JSON 文件（复习记录、测验记录、错题本、收藏），将与本地数据安全合并并自动去重。",
  selectFile: "选择 JSON 文件",
  noFileSelected: "未选择文件（仅支持 .json，最大 2 MB）",
  selectedFile: (name: string, sizeKb: string) => `已选文件：${name}（${sizeKb} KB）`,
  importButton: "导入并合并",
  importing: "正在导入…",
  kindLabels: {
    reviews: "复习记录",
    quiz: "测验记录",
    "wrong-book": "错题本",
    favorites: "收藏",
  },
  successSummary: (
    kindLabel: string,
    total: number,
    inserted: number,
    updated: number,
    skipped: number,
  ) =>
    `${kindLabel}导入完成：共 ${total} 条，新增 ${inserted} 条，更新 ${updated} 条，跳过重复 ${skipped} 条。`,
  errorTooLarge: "文件超过 2 MB 上限，请确认导入的是学习数据 JSON 文件。",
  errorInvalidJson: "文件内容不是合法的 JSON 格式，请检查后重试。",
  errorNetwork: "导入请求失败，请检查服务是否正常运行后重试。",
} as const;

export const quizFeaturesCopy = {
  shortcutHint: "快捷键：1–4 选择选项 · Enter / Space 下一题",
  viewCardLink: "查看关联药物卡片",
  scopeLabel: "按学习范围筛选",
  scopes: {
    all: "全部范围",
    favorites: "仅收藏卡片",
    due: "仅待复习",
  },
  countLabel: "选择本组题量",
  countOption: (count: number) => `${count} 题`,
  scopeActive: (scopeName: string, cardCount: number) =>
    `出题范围：${scopeName}（${cardCount} 张）`,
  scopeEmptyTitle: {
    favorites: "当前分类下还没有收藏的卡片",
    due: "当前分类下暂时没有待复习卡片",
  },
  scopeEmptyBody: {
    favorites: "先在卡片详情页收藏需要重点记忆的药物，或切回「全部范围」继续测验。",
    due: "今日到期复习已清空，可切回「全部范围」继续测验。",
  },
} as const;
