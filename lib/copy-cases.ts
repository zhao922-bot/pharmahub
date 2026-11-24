/**
 * 临床机制情景题模式的独立界面文案。
 * 全部使用简体中文，保持纯学习向情景题定位，不构成个体化处方建议。
 */
export const caseQuizCopy = {
  modeTitle: "临床情景",
  modeSubtitle: "围绕作用靶点、代谢酶相互作用、耐药与用药边界，从药理学机制出发完成情景判断。",
  scopeAll: "全部情景题",
  scopeCategoryHint: (categoryName: string, count: number) =>
    `当前聚焦「${categoryName}」机制情景，共收录 ${count} 道核对题。`,
  scopeAllHint: (count: number, categoryCount: number) =>
    `覆盖 ${categoryCount} 个系统分类，共 ${count} 道核对机制情景题。`,
  disclaimerNote:
    "说明：本题库仅用于药理学机制与用药原则学习辨析，题干情景与解析均不构成针对具体患者的个体化诊断或处方建议。",
  sourceCheckedLabel: (date: string) => `资料核对日期：${date}`,
  emptyTitle: "暂无可用的临床情景题",
  emptyBody: "当前筛选分类下还没有收录临床机制情景题，请切换到全部分类或选择其他系统。",
  emptyResetCta: "查看全部情景题",
  questionCountHint: (count: number) => `本轮共 ${count} 道机制情景题`,
} as const;
