import type { ClinicalTagId } from "./types";

/**
 * 药代动力学特征与代表性药物相互作用的界面文案。
 * 统一使用简体中文，保持与 lib/copy.ts 相同的集中管理方式。
 */
export const clinicalTagLabels: Record<ClinicalTagId, string> = {
  prodrug: "前药活化",
  "narrow-therapeutic-index": "窄治疗窗 / 需监测",
  "cyp-inhibitor": "CYP 抑制相关",
  "cyp-inducer": "CYP 诱导相关",
  "renal-adjustment": "肾功能需调量",
  "hepatic-caution": "肝功能需关注",
  "pregnancy-caution": "妊娠禁忌 / 警示",
  "qt-prolongation": "QT 延长风险",
};

export const enrichmentCopy = {
  tagsAriaLabel: "药代与用药风险特征标签",
  interactionsTitle: "代表性药物相互作用",
  interactionsHint:
    "仅列学习向代表性相互作用，不构成完整配伍禁忌清单；实际联合用药请核对当地说明书。",
  interactionCount: (total: number) => `共 ${total} 条`,
  mechanismLabel: "机制",
  consequenceLabel: "风险与提示",
  jumpCardCta: "查看该药卡片",
} as const;
