import type { Category, CategoryId } from "@/lib/types";

/**
 * 分类体系（最初 7 个，现扩到 11 个）。
 * order 决定首页与筛选条的展示顺序，与教材章节顺序一致。
 */
export const CATEGORIES: readonly Category[] = [
  {
    id: "cardiovascular",
    name: "心血管系统",
    summary: "从受体、离子通道到凝血与脂质，理解降压、调律和抗栓的机制。",
    order: 1,
  },
  {
    id: "antibacterial",
    name: "抗菌药物",
    summary: "细胞壁、核糖体、DNA 复制与叶酸代谢，四条经典打击路径。",
    order: 2,
  },
  {
    id: "antineoplastic",
    name: "抗肿瘤药物",
    summary: "烷化、抗代谢、靶向激酶与单抗，看清选择性从哪来。",
    order: 3,
  },
  {
    id: "nervous",
    name: "神经系统",
    summary: "从递质、离子通道到胆碱酯酶，理解镇静、抗癫痫、镇痛与认知症状治疗。",
    order: 4,
  },
  {
    id: "endocrine",
    name: "内分泌系统",
    summary: "从糖代谢、甲状腺轴到骨吸收，理解代谢调节、激素替代与骨量保护。",
    order: 5,
  },
  {
    id: "digestive",
    name: "消化系统",
    summary: "从胃酸、黏膜、肠道内容物到胆汁成分，理解消化系统药物的作用与用途。",
    order: 6,
  },
  {
    id: "analgesic",
    name: "解热镇痛抗炎",
    summary: "从环氧合酶、微管到尿酸生成，区分解热镇痛、急性抗炎与长期降尿酸。",
    order: 7,
  },
  {
    id: "respiratory",
    name: "呼吸系统",
    summary: "从受体、炎症通路到黏液结构，区分支气管舒张、炎症控制与祛痰。",
    order: 8,
  },
  {
    id: "antiallergic",
    name: "抗过敏药",
    summary: "从 H1 阻断到肾上腺素能受体激动，区分日常症状缓解与严重过敏急救。",
    order: 9,
  },
  {
    id: "antiviral",
    name: "抗病毒药",
    summary: "病毒自己编码的酶是最好的靶点，理解选择性从哪来。",
    order: 10,
  },
  {
    id: "antifungal",
    name: "抗真菌药",
    summary: "沿麦角固醇通路理解抗真菌作用，并区分局部制剂与系统治疗。",
    order: 11,
  },
];

const CATEGORY_MAP: ReadonlyMap<CategoryId, Category> = new Map(
  CATEGORIES.map((category) => [category.id, category]),
);

/** 按 id 取分类，找不到时抛错——分类 id 是受控枚举，找不到说明数据有误 */
export function getCategory(id: CategoryId): Category {
  const found = CATEGORY_MAP.get(id);
  if (!found) {
    throw new Error(`未知的分类 id: ${id}`);
  }
  return found;
}

/** 按 id 取分类名称，供列表项快速展示 */
export function getCategoryName(id: CategoryId): string {
  return getCategory(id).name;
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_MAP.has(value as CategoryId);
}
