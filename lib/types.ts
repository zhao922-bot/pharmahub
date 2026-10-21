/**
 * 领域模型定义。
 *
 * 设计原则：
 * 1. 卡片内容（DrugCard）是纯数据，与渲染、存储解耦，未来可直接迁移到 PostgreSQL 或 CMS。
 * 2. 学习记录（ReviewLog）与卡片通过 cardId 关联，不侵入卡片本体。
 * 3. DiagramSpec 只描述「图的语义结构」，具体绘制交给 components/diagram 下的渲染器，
 *    因此阶段一可以先放占位区块，阶段二替换渲染器即可，无需改动数据。
 */

/**
 * 系统分类。顺序即导航展示顺序。
 *
 * 最初是 7 个，后续按「补齐治疗类别」的思路扩到 11 个：
 * 新增呼吸系统、抗过敏药、抗病毒药、抗真菌药——
 * 这几类在执业药师考试中都是独立章节，而原体系里完全没有覆盖。
 */
export const CATEGORY_IDS = [
  "cardiovascular",
  "antibacterial",
  "antineoplastic",
  "nervous",
  "endocrine",
  "digestive",
  "analgesic",
  "respiratory",
  "antiallergic",
  "antiviral",
  "antifungal",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  /** 分类中文名，如「心血管系统」 */
  name: string;
  /** 一句话说明该系统的学习重点 */
  summary: string;
  /** 排序权重，小的在前 */
  order: number;
}

/** 机制图节点：区分药物、作用靶点、作用过程及效应。 */
export type DiagramNodeRole = "target" | "signal" | "effect" | "drug";

export interface DiagramNode {
  id: string;
  /** 节点标签，尽量 4~8 个汉字，保证移动端可读 */
  label: string;
  role: DiagramNodeRole;
}

export interface DiagramEdge {
  from: string;
  to: string;
  /** 连线上的动作说明，如「抑制」「激活」；省略则只画箭头 */
  label?: string;
  /** 直接抑制、直接激活或主线过程联系；flow 不表示直接激动靶点。 */
  kind: "activate" | "inhibit" | "flow";
}

/**
 * 机制图描述。阶段一仅做类型定义与占位，阶段二由 components/diagram 渲染为 SVG。
 */
export interface DiagramSpec {
  /** 图的标题，如「β1 受体阻断 → 心率下降」 */
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface MechanismStep {
  /** 步骤标题，如「阻断 β1 受体」 */
  title: string;
  /** 该步骤的详细说明：在哪里、作用于谁、发生什么变化 */
  detail: string;
}

export interface DrugCard {
  /** 稳定的英文 id，如 "metoprolol"，用于路由与复习记录关联 */
  id: string;
  /** 通用名，如「美托洛尔」 */
  genericName: string;
  /** 商品名，只保留最常用的 1~2 个 */
  brandNames: string[];
  /** 英文名，如 "Metoprolol" */
  englishName: string;
  category: CategoryId;
  /** 作用靶点 / 作用位点，一句话 */
  target: string;
  /** 经内容核对的靶点干扰项，仅按本卡的有向候选集合出题；缺少时不随机回退。 */
  targetQuizDistractorIds?: string[];
  /** 作用机制分步讲解，3~6 步 */
  mechanismSteps: MechanismStep[];
  /** 经单独核对的四个上下游环节；讲解段落不自动等同于因果或时间顺序。 */
  mechanismQuiz?: { steps: [string, string, string, string]; explanation: string };
  /** 临床主要适应症 */
  indications: string[];
  /** 人工核对、与本药用途不重叠的干扰药物；出题只取这些卡片的首条适应症。 */
  indicationQuizDistractorIds?: string[];
  /** 主要不良反应，只列机制相关的 3~5 条 */
  adverseReactions: string[];
  /** 记忆要点：一句话口诀或联想 */
  memoryTip: string;
  /** 机制示意图描述 */
  diagram: DiagramSpec;
  /** 本卡已核对的公开说明书或资料，不代表其他卡片已核对。 */
  sources?: { title: string; url: string; sections: string }[];
  sourcesCheckedOn?: string;
  /**
   * 已知待确认事项。缺省不表示经过专业医学审定；
   * 为 true 时界面显示具体待核实范围，来源及核对日期另列。
   */
  needsVerification?: boolean;
  /** 待核实的具体说明，仅当 needsVerification 为 true 时展示 */
  verificationNote?: string;
}

/** 用户对一张卡片的掌握自评：0 没记住 / 1 模糊 / 2 记住了 */
export type ReviewQuality = 0 | 1 | 2;

/**
 * 同类药对比。
 *
 * 设计意图：把散落在各张卡片里的「横向差异」显式呈现出来。
 *
 * 例如丙硫氧嘧啶与甲巯咪唑的差别（是否抑制外周 T4→T3）现在写在两张卡片
 * 各自的机制步骤里，用户要读两遍才能对比。对比视图把它变成一行。
 *
 * 数据组织原则：
 * 1. **对比维度由本组自定义**，不用全局固定维度。抗组胺药关心「是否进脑」，
 *    抗真菌药关心「抑菌还是杀菌」，强行统一维度会导致大量空白。
 * 2. **每个维度都必须对组内所有药物有值**。留空会让对比表出现空洞，
 *    这时应该换个维度或删掉该维度——由 check-compares.mjs 强制校验。
 * 3. 差异点单独列出，用一句话点破「最该记住的区别」，而不是让用户自己找。
 */
export interface CompareRow {
  /** 可出单选题的差异维度。稳定英文 id，发布后不要改名；共同点和易混淆维度不设置。 */
  quizId?: string;
  /** 该维度的辨析理由，答题与错题重练共用；不能只重复选项。 */
  quizExplanation?: string;
  /** 维度名，如「是否透过血脑屏障」 */
  label: string;
  /** 与 drugs 顺序一一对应的取值，长度必须等于 drugs.length */
  values: string[];
}

export interface CompareGroup {
  /** 稳定的英文 id，用于路由 */
  id: string;
  /** 组标题，如「第一代 vs 第二代抗组胺药」 */
  title: string;
  /** 一句话说明这组对比的核心问题 */
  summary: string;
  /** 参与对比的卡片 id，2~4 个。顺序决定表格列顺序 */
  drugIds: string[];
  /** 对比维度，至少 2 行 */
  rows: CompareRow[];
  /**
   * 关键差异点：1~3 条，每条一句话点破最重要的区别。
   * 这是本视图的核心价值，不是可选项。
   */
  takeaways: string[];
  /** 选药场景：什么情况下选哪个，可选 */
  scenarios?: string[];
  /** 本组内容核对所用的公开说明书或指南，不代表其他组已核对。 */
  sources?: { title: string; url: string; sections: string }[];
  sourcesCheckedOn?: string;
}

/**
 * 复习记录（SM-2）。
 * 阶段一仅定义类型并提供空实现，阶段三接入 SQLite 持久化。
 */
export interface ReviewLog {
  cardId: string;
  quality: ReviewQuality;
  /** 连续答对次数，答错归零 */
  repetitions: number;
  /** 难度因子，SM-2 中初始 2.5，下限 1.3 */
  easiness: number;
  /** 当前间隔天数 */
  intervalDays: number;
  /** 下次复习时间，ISO 日期字符串 */
  nextReviewAt: string;
  /** 最近一次复习时间，ISO 日期字符串 */
  lastReviewedAt: string;
}
