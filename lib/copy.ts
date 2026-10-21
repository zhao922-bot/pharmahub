/**
 * 全站面向用户的文案。
 *
 * 规范（第 10 节）：所有界面文案集中在此文件，组件里不出现硬编码中文，
 * 方便后续统一做繁体自查（见 scripts/check-traditional.mjs）。
 * 药物卡片正文属于内容数据，放在 data/cards/ 下，同样纳入自查范围。
 */

export const site = {
  name: "药枢",
  nameEn: "PharmaHub",
  fullName: "药枢 PharmaHub",
  tagline: "把每一个药物的作用机制讲透、画出来、并帮你记住。",
  description:
    "面向中文药学学习者与从业者的药物作用机制学习工具：机制卡片 + 机制图解 + 间隔重复。",
  stageBadge: "阶段四 · 测验与打磨",
} as const;

export const nav = {
  home: "首页",
  cards: "卡片库",
  quiz: "测验",
  compare: "对比",
  backToCards: "返回卡片库",
  skipToContent: "跳到主要内容",
} as const;

export const home = {
  heroEyebrow: "今日学习",
  heroTitle: "从机制开始，而不是从背诵开始",
  heroBody:
    "先看懂药物在分子层面做了什么，再用间隔重复把它留住。每天 2~3 张新卡片，比一次性背完更可靠。",
  primaryCta: "浏览全部卡片",
  secondaryCta: "了解学习方法",

  reviewCardTitle: "今日待复习",
  reviewCardPlaceholder: "0 张",
  reviewCardBody: "间隔重复将在阶段三上线，届时这里会显示真正到期的卡片数量。",
  reviewCardCta: "去卡片库看看",
  reviewCardBadge: "即将上线",
  reviewUnit: "张",
  reviewDoneBadge: "已清空",
  reviewEmptyBody: "还没有复习记录。先挑几张卡片读懂机制，自评后就会进入复习计划。",
  reviewAllDoneBody: "今天的复习任务已完成，明天再来。",
  reviewDueBody: "这些卡片已到复习时间，凭记忆回想机制后再看答案。",
  reviewMore: (n: number) => `还有 ${n} 张待复习`,

  progressTitle: "学习进度",
  progressLearned: "已学卡片",
  progressToday: "今日复习",
  progressStreak: "连续天数",
  progressUnit: "张",
  progressStreakUnit: "天",
  progressCoverage: (learned: number, total: number) =>
    `已覆盖 ${learned} / ${total} 张卡片`,
  progressPlaceholderNote: "阶段一尚未记录学习数据，以上数值均为占位。",

  categoriesTitle: "按系统学习",
  categoriesBody: "按教材的章节顺序组织，从一个系统开始，逐层建立知识网络。",
  categoriesCardCount: (n: number) => `${n} 张卡片`,
  totalCountLabel: (n: number) => `${n} 张`,

  featuredTitle: "先看这几张",
  featuredBody: "机制链条最典型、最容易建立直觉的几张卡片。",
  viewAll: "查看全部",

  quizEntryTitle: "测验一下",
  quizEntryBody: (answeredToday: number, wrongCount: number) =>
    wrongCount > 0
      ? `今日已答 ${answeredToday} 题，错题本 ${wrongCount} 道`
      : `今日已答 ${answeredToday} 题，题目由卡片自动生成`,
  quizEntryCta: "开始测验",

  methodTitle: "怎么用",
  methodSteps: [
    {
      title: "读懂机制链",
      body: "每张卡片把机制拆成 3~6 步，每一步都回答「在哪里、作用于谁、发生什么变化」。",
    },
    {
      title: "看图建立直觉",
      body: "机制图用固定的三种颜色区分靶点、信号与效应，把文字链条变成一张能记住的图。",
    },
    {
      title: "按节奏复习",
      body: "看完后自评掌握程度，系统按 SM-2 算法安排下一次复习时间。",
    },
  ],
} as const;

export const cards = {
  pageTitle: "卡片库",
  pageBody: "按系统筛选，或搜索药名、靶点、机制步骤、不良反应。",
  searchPlaceholder: "搜索药名、靶点、机制或不良反应",
  searchLabel: "搜索卡片",
  clearSearch: "清空搜索",
  allCategories: "全部",
  resultCount: (n: number) => `共 ${n} 张卡片`,
  resultCountFiltered: (n: number, total: number) => `找到 ${n} 张卡片（共 ${total} 张）`,
  emptyTitle: "没有匹配的卡片",
  emptyBody: "换一个关键词，或者切换到「全部」分类看看。",
  resetFilters: "重置筛选",

  targetLabel: "作用靶点",
  indicationsLabel: "主要适应症",
  detailCta: "查看机制",

  /** 搜索命中信息 */
  matchIn: {
    genericName: "药名",
    englishName: "英文名",
    brandName: "商品名 / 别名",
    categoryName: "分类",
    target: "作用靶点",
    indication: "适应症",
    mechanismStep: "机制",
    adverseReaction: "不良反应",
    memoryTip: "记忆要点",
  },
  matchStepLabel: (n: number) => `第 ${n} 步`,
  matchItemLabel: (n: number) => `第 ${n} 条`,
  /** 其他命中处数，例如「另有 3 处命中」 */
  otherMatches: (n: number) => `另有 ${n} 处命中`,
  /** 搜索提示，展示可搜索的字段范围 */
  searchHintTitle: "可以搜什么",
  searchHintBody:
    "药名、英文名、商品名、分类、作用靶点、适应症、机制步骤正文、不良反应、记忆要点。支持繁体输入与 beta / β 互搜。",
  /** 搜索命中摘要的无障碍描述 */
  matchAria: (field: string, snippet: string) => `在${field}中命中：${snippet}`,
} as const;

export const detail = {
  genericNameLabel: "通用名",
  brandNamesLabel: "常见商品名 / 别名（不同剂型不可直接互换）",
  englishNameLabel: "英文名",
  categoryLabel: "所属分类",
  targetTitle: "作用靶点",
  mechanismTitle: "作用机制",
  mechanismHint: "按作用主线分段讲解；并行作用、药代过程和风险提示不代表严格的时间先后。",
  stepCounter: (total: number) => `共 ${total} 步`,
  diagramTitle: "机制示意图",
  diagramHint: "自上而下阅读：药物 → 靶点 → 信号变化 → 生理效应。",
  indicationsTitle: "代表性用途与适用范围",
  adverseTitle: "主要不良反应",
  adverseHint: "列举重要或有代表性的风险，并非完整的不良反应、禁忌或相互作用清单。",
  memoryTitle: "记忆要点",
  sourcesTitle: "参考资料",
  sourcesHint: "本卡参考以下资料整理，机制图为简化示意。制剂、年龄和批准用途可能因地区而异；来源核对不等同于专业医学审定，具体范围见条目说明。",
  sourcesCheckedOn: (date: string) => `资料核对日期：${date}`,
  reviewTitle: "掌握程度自评",
  reviewBody: "看完机制后，如实评价自己的掌握程度，系统会据此安排下次复习时间。",
  reviewQuality0: "没记住",
  reviewQuality1: "模糊",
  reviewQuality2: "记住了",
  reviewQuality0Hint: "完全想不起来",
  reviewQuality1Hint: "想起一部分",
  reviewQuality2Hint: "能讲清机制",
  reviewSaving: "正在记录…",
  reviewFailed: "记录失败，请重试",
  reviewSaved: (days: number) =>
    days <= 1 ? "已记录，明天再复习这张" : `已记录，${days} 天后再复习这张`,
  reviewNextDate: (date: string) => `下次复习：${date}`,
  reviewCountLabel: (n: number) => (n === 0 ? "尚未复习" : `已复习 ${n} 轮`),
  reviewDueBody: "这张卡片已到复习时间，凭记忆回想一遍机制，再如实自评。",
  reviewNotDueBody: (date: string) => `这张卡片尚未到期，下次复习时间：${date}。也可以提前复习。`,
  favoriteAdd: "收藏",
  favoriteRemove: "已收藏",
  favoriteFailed: "收藏操作失败，请重试",
  notFoundTitle: "没有找到这张卡片",
  notFoundBody: "卡片可能已被重命名或尚未收录。",
  backToList: "回到卡片库",
  verificationBadge: "待核实",
  verificationLabel: "内容核实说明",
  prevCard: "上一张",
  nextCard: "下一张",
  cardPosition: (current: number, total: number) => `第 ${current} / ${total} 张`,
} as const;

export const quiz = {
  pageTitle: "测验",
  pageBody: "从卡片内容自动出题，检验你是否真的理解了机制，而不只是记住药名。",
  start: "开始测验",
  restart: "再来一组",
  questionOf: (current: number, total: number) => `第 ${current} / ${total} 题`,
  progressLabel: "答题进度",
  correct: "回答正确",
  incorrect: "回答错误",
  correctAnswerIs: "正确答案",
  explanationTitle: "解析",
  nextQuestion: "下一题",
  finish: "查看结果",
  submitting: "正在提交…",
  submitFailed: "提交失败，请重试",

  resultTitle: "本组测验完成",
  resultScore: (correct: number, total: number) => `${correct} / ${total}`,
  resultAccuracy: (percent: number) => `正确率 ${percent}%`,
  resultWrongHint: (n: number) => (n > 0 ? `${n} 道题已加入错题本` : "全部答对，没有新增错题"),
  resultAgain: "再来一组",
  resultToWrongBook: "去错题本",
  resultToCards: "回到卡片库",

  emptyTitle: "暂无可用题目",
  emptyBody: "卡片数据不足，无法生成测验题。请先补充卡片。",

  scopeAll: "全部卡片",
  scopeWrong: "错题重练",
  questionCountLabel: "题目数量",

  /** 分类筛选 */
  filterLabel: "按系统筛选题目",
  filterAll: "全部",
  filterActive: (name: string) => `当前只考「${name}」`,
  filterEmptyTitle: "该分类暂无可用题目",
  filterEmptyBody: "换一个分类，或回到「全部」继续测验。",
  filterClear: "回到全部",
  filterCountHint: (count: number) => `本分类共 ${count} 张卡片参与出题`,
  compareFilterLabel: "按对比组练习",
  answerInvalid: "题目已变更或参数无效，请刷新后重试",
  compareSelectLabel: "快速选择对比组",
  compareSelectPlaceholder: (count: number) => `选择要练习的对比组（共 ${count} 组）`,
  compareScope: "同类药对比",
  compareCountHint: (drugs: number, questions: number) =>
    `${drugs} 种药 · 本轮 ${questions} 道差异题`,
  compareBack: "回看本组对比",
  comparePrompt: (title: string, dimension: string, value: string) =>
    `根据「${title}」，哪种药物在「${dimension}」这一维度的描述是「${value}」？`,
  compareInstructions: "题目取自本组已选定的差异维度，选项只包含本组药物。每个维度本轮只考一次，共同点不出单选题。答题后可查看各药的对应描述，答错会进入错题本。",
  compareEmptyTitle: "本组暂时没有可用的差异题",
  compareEmptyBody: "可以先回到对比页学习，再选择其他组练习。",
  kindLabel: {
    target: "作用靶点",
    category: "所属分类",
    indication: "适应症",
    "mechanism-order": "机制顺序",
    compare: "同类药对比",
  },

  statsTitle: "答题统计",
  statsToday: "今日答题",
  statsAccuracy: "累计正确率",
  statsWrong: "错题本",
  statsUnitQuestion: "题",
  statsUnitItem: "道",

  /** 错题重练 */
  reviewPageTitle: "错题重练",
  reviewPageBody: "只考错题本里的题目。做对后错题仍会保留，但会标记为已答对。",
  reviewEmptyTitle: "错题本是空的",
  reviewEmptyBody: "先去测验里做几道题，答错的会自动收进错题本，这里就能重练了。",
  reviewEmptyCta: "去做测验",
  reviewCount: (n: number) => `本次重练 ${n} 道题`,
  reviewStartHint: "按错误次数从多到少排列，最该练的排在最前面。",
  reviewAllDone: "错题重练完成",
  reviewBackToWrongBook: "回到错题本",
  reviewRetry: "再练一遍",
  reviewNoQuestions: "暂无可重练的题目",
  reviewNoQuestionsBody: "错题本里的题目对应的卡片可能已更新，无法重新生成。",
  reviewSummaryTitle: "本轮重练结果",
  reviewCleared: (n: number) => `其中 ${n} 道这次答对了`,
  reviewStillWrong: (n: number) => `${n} 道仍答错，已累加错误次数`,
} as const;

export const wrongBook = {
  pageTitle: "错题本",
  pageBody: "答错的题目会自动收进这里。重新做对后仍保留，方便反复巩固。",
  emptyTitle: "错题本是空的",
  emptyBody: "去测验里做几道题，答错的会自动出现在这里。",
  goQuiz: "去做测验",
  wrongCountLabel: (n: number) => `错 ${n} 次`,
  masteredLabel: "已答对过",
  notMasteredLabel: "尚未答对",
  practice: "重练",
  remove: "移除",
  removeFailed: "移除失败，请重试",
  clearAll: "清空错题本",
  clearConfirm: "确定要清空全部错题吗？此操作不可撤销。",
  clearCancel: "取消",
  clearConfirmYes: "确定清空",
  cleared: "错题本已清空",
  kindLabel: {
    target: "作用靶点",
    category: "所属分类",
    indication: "适应症",
    "mechanism-order": "机制顺序",
    compare: "同类药对比",
  },
  viewCard: "查看卡片",
} as const;

export const theme = {
  toggleLabel: "切换深色模式",
  light: "浅色",
  dark: "深色",
  system: "跟随系统",
} as const;

export const legend = {
  title: "图例",
  target: "靶点 / 受体 / 酶",
  signal: "作用过程 / 信号变化",
  effect: "生理效应",
  drug: "药物",
  activate: "直接促进 / 激活",
  flow: "过程 / 变化",
  inhibit: "抑制 / 减少",
} as const;

export const compare = {
  pageTitle: "同类药对比",
  pageBody:
    "把散在各张卡片里的横向差异摆到一张表上。选药时的关键判断，往往就是某一行的不同。",

  // 列表页
  listTitle: "全部对比",
  groupCount: (n: number) => `${n} 组对比`,
  drugCountLabel: (n: number) => `${n} 种药`,
  viewDetail: "查看对比",
  startQuiz: "练习本组差异",
  quizHint: "看完对比，用几道题检验能否分清。",

  // 详情页
  backToList: "返回对比列表",
  dimensionHeader: "对比维度",
  takeawaysTitle: "关键差异",
  takeawaysHint: "这几条是这组药最该记住的区别。",
  scenariosTitle: "选药场景",
  scenariosHint: "什么情况下选哪个。",
  cardsTitle: "涉及的卡片",
  cardsHint: "点进去看作用主线、适用范围与参考资料。",
  sourcesTitle: "参考资料",
  sourcesHint: "本组依据以下说明书与指南整理。复方资料仅引用所标明成分的药理内容。",
  sourcesCheckedOn: (date: string) => `资料核对日期：${date}`,

  // 卡片详情页入口
  entryTitle: "这味药还在这些对比里",
  entryLink: "查看对比",

  // 空状态
  emptyTitle: "暂无对比",
  emptyBody: "对比内容正在整理中。",
} as const;

export const offline = {
  title: "当前离线",
  body: "网络断开后，复习记录、错题本这些需要保存到服务端的功能暂时用不了。",
  detailTitle: "现在还能做什么",
  details: [
    "已经打开过的页面可以继续浏览，机制讲解与对比内容都在本地缓存里。",
    "复习记录、测验结果、错题本、收藏这些需要写入的操作，要等联网后再做。",
    "如果你是在手机上使用，请确认手机与运行药枢的电脑连在同一个 Wi-Fi 下。",
  ],
  retry: "重新连接",
} as const;

export const install = {
  title: "装到主屏幕",
  body: "把它当作一个 App 使用，不用每次开浏览器输网址。",
  iosTitle: "iPhone / iPad",
  iosSteps: [
    "用 Safari 打开本页（Chrome 在 iOS 上装不了）",
    "点底部中间的「分享」按钮",
    "向下找到「添加到主屏幕」",
  ],
  androidTitle: "Android",
  androidSteps: [
    "用 Chrome 打开本页",
    "点右上角三个点",
    "选「添加到主屏幕」或「安装应用」",
  ],
  desktopTitle: "电脑浏览器",
  desktopSteps: [
    "Chrome / Edge 地址栏右侧会出现安装图标",
    "点它即可装成独立窗口的应用",
  ],
  dismiss: "知道了",
} as const;

export const heatmap = {
  title: "学习热力图",
  subtitle: (weeks: number) => `近 ${weeks} 周`,
  totalReviews: "复习次数",
  activeDays: "学习天数",
  longestStreak: "最长连续",
  legendLess: "少",
  legendMore: "多",
  emptyHint: "还没有复习记录。去卡片库挑几张读一读，自评后就会出现在这里。",
  dayEmpty: (date: string) => `${date} 没有复习`,
  dayCount: (date: string, count: number) => `${date} 复习 ${count} 次`,
} as const;

export const exportCopy = {
  pageTitle: "导出学习数据",
  pageBody: "把复习记录、测验记录导出为 CSV，可以用 Excel 打开自己分析。",
  backToHome: "返回首页",

  reviewsTitle: "复习记录",
  reviewsBody: "每一次自评的时间、评分，以及当前 SM-2 状态（间隔、难度因子、下次复习日期）。",
  quizTitle: "测验记录",
  quizBody: "每一次答题的题目、题型与是否正确。",
  wrongBookTitle: "错题本",
  wrongBookBody: "当前错题本内容，含错误次数与是否已答对过。",
  favoritesTitle: "收藏",
  favoritesBody: "已收藏的卡片清单。",

  download: "下载 CSV",
  downloadCsv: "CSV",
  downloadJson: "JSON",
  empty: "暂无数据",
  rowCount: (n: number) => `${n} 条记录`,
  unit: "条",

  formatTitle: "两种格式怎么选",
  formatCsvName: "CSV：",
  formatCsvHint: "适合 Excel / Numbers 直接打开，做透视表和图表。",
  formatJsonName: "JSON：",
  formatJsonHint: "适合脚本处理，字段名是稳定的英文标识，附带中文列名对照。",

  noteTitle: "关于导出的说明",
  noteBody:
    "CSV 带 UTF-8 BOM，Excel 直接双击打开不会乱码。JSON 为 2 空格缩进、字段名保持英文。所有数据只保存在你自己的设备上，导出不会上传到任何服务器。",
  emptyAllTitle: "还没有可导出的数据",
  emptyAllBody: "先复习几张卡片或做几组测验，这里就会有内容了。",
  goCards: "去卡片库",
  goQuiz: "去做测验",
} as const;

export const footer = {
  note: "内容参考条目所列说明书与指南整理，机制为教学简化，仅用于学习参考，不构成用药建议。",
  builtWith: "阶段四 · 测验与打磨",
  exportLink: "导出学习数据",
} as const;

export const common = {
  loading: "加载中",
  error: "出了点问题",
  retry: "重试",
} as const;
