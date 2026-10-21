import type { CategoryId, DrugCard } from "@/lib/types";
import { CATEGORIES, getCategoryName } from "@/lib/data/categories";
import { buildSearchIndex, searchCardIndex, type CardSearchIndex } from "@/lib/search";
import { cardiovascularCards } from "@/lib/data/cards/cardiovascular";
import { antibacterialCards } from "@/lib/data/cards/antibacterial";
import { antineoplasticCards } from "@/lib/data/cards/antineoplastic";
import { nervousCards } from "@/lib/data/cards/nervous";
import { endocrineCards } from "@/lib/data/cards/endocrine";
import { digestiveCards } from "@/lib/data/cards/digestive";
import { analgesicCards } from "@/lib/data/cards/analgesic";
import { respiratoryCards } from "@/lib/data/cards/respiratory";
import { antiallergicCards } from "@/lib/data/cards/antiallergic";
import { antiviralCards } from "@/lib/data/cards/antiviral";
import { antifungalCards } from "@/lib/data/cards/antifungal";

/**
 * 卡片数据访问层。
 *
 * 为什么接口是异步的：MVP 阶段数据来自本地 TS 种子文件（同步可得），
 * 但未来迁移到 PostgreSQL / CMS 时必然是异步的。这里提前把接口定成 Promise，
 * 页面与组件只依赖接口，迁移时无需改动任何调用方。
 */

/**
 * 列表页需要的摘要。
 *
 * 搜索增强后，摘要里带上了**全部可检索字段**（机制步骤、不良反应、记忆要点等）。
 * 原因：搜索命中可能发生在任何字段上，列表项要能展示「命中的是哪一段」，
 * 就必须拿到那些字段的原文。
 *
 * 123 张卡片全量摘要在客户端保留可搜索文本，
 * 换来的是零延迟的本地搜索与命中定位。卡片量级再上一个数量级时应改为
 * URL 参数 + 服务端搜索。
 */
export interface DrugCardSummary {
  id: string;
  genericName: string;
  englishName: string;
  brandNames: string[];
  category: CategoryId;
  /** 分类中文名，避免客户端再查一次分类表 */
  categoryName: string;
  target: string;
  /** 首条适应症，用于列表快速预览 */
  primaryIndication: string;
  indications: string[];
  mechanismSteps: { title: string; detail: string }[];
  adverseReactions: string[];
  memoryTip: string;
}

export interface CardQuery {
  /** 关键词，匹配药名、英文名、商品名、靶点、适应症、机制步骤、不良反应与记忆要点 */
  keyword?: string;
  /** 分类筛选，省略表示全部 */
  category?: CategoryId;
}

export interface CardRepository {
  getAll(): Promise<DrugCard[]>;
  getById(id: string): Promise<DrugCard | null>;
  query(query: CardQuery): Promise<DrugCard[]>;
  getSummaries(query: CardQuery): Promise<DrugCardSummary[]>;
  /** 每个分类下的卡片数量，用于首页与筛选条角标 */
  getCategoryCounts(): Promise<Record<CategoryId, number>>;
  /** 首页推荐：每个分类取第一张，保证机制链条典型且覆盖全部分类 */
  getFeatured(limit: number): Promise<DrugCard[]>;
}

/** 全部种子卡片，顺序按分类顺序 + 分类内定义顺序 */
const ALL_CARDS: readonly DrugCard[] = [
  ...cardiovascularCards,
  ...antibacterialCards,
  ...antineoplasticCards,
  ...nervousCards,
  ...endocrineCards,
  ...digestiveCards,
  ...analgesicCards,
  ...respiratoryCards,
  ...antiallergicCards,
  ...antiviralCards,
  ...antifungalCards,
];

/** 把卡片压成列表摘要 */
function toSummary(card: DrugCard): DrugCardSummary {
  return {
    id: card.id,
    genericName: card.genericName,
    englishName: card.englishName,
    brandNames: [...card.brandNames],
    category: card.category,
    categoryName: getCategoryName(card.category),
    target: card.target,
    primaryIndication: card.indications[0] ?? "",
    indications: [...card.indications],
    mechanismSteps: card.mechanismSteps.map((step) => ({
      title: step.title,
      detail: step.detail,
    })),
    adverseReactions: [...card.adverseReactions],
    memoryTip: card.memoryTip,
  };
}

/** 摘要缓存：全部卡片的摘要只需构建一次 */
const SUMMARIES: readonly DrugCardSummary[] = ALL_CARDS.map(toSummary);

/** 搜索索引缓存：与摘要同源，同样只构建一次 */
const SEARCH_INDEX: readonly CardSearchIndex[] = buildSearchIndex(SUMMARIES);

/** 关键词 → 命中的卡片 id 集合，按相关度排序 */
function searchCardIds(keyword: string): string[] {
  return searchCardIndex(SEARCH_INDEX, keyword).map((hit) => hit.id);
}

function applyQuery(cards: readonly DrugCard[], query: CardQuery): DrugCard[] {
  const keyword = query.keyword?.trim() ?? "";

  const categoryFiltered = query.category
    ? cards.filter((card) => card.category === query.category)
    : cards;

  if (keyword.length === 0) return [...categoryFiltered];

  // 关键词搜索走统一的相关度排序，而不是保持原始顺序
  const rankedIds = searchCardIds(keyword);
  const rank = new Map(rankedIds.map((id, position) => [id, position]));

  return categoryFiltered
    .filter((card) => rank.has(card.id))
    .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
}

/**
 * 基于本地种子数据的实现。
 * 未来新增 PostgresCardRepository 时，只需实现同一个 CardRepository 接口，
 * 并在 lib/data/index.ts 中切换导出即可。
 */
class LocalSeedCardRepository implements CardRepository {
  async getAll(): Promise<DrugCard[]> {
    return [...ALL_CARDS];
  }

  async getById(id: string): Promise<DrugCard | null> {
    return ALL_CARDS.find((card) => card.id === id) ?? null;
  }

  async query(query: CardQuery): Promise<DrugCard[]> {
    return applyQuery(ALL_CARDS, query);
  }

  async getSummaries(query: CardQuery): Promise<DrugCardSummary[]> {
    const keyword = query.keyword?.trim() ?? "";

    const categoryFiltered = query.category
      ? SUMMARIES.filter((summary) => summary.category === query.category)
      : SUMMARIES;

    if (keyword.length === 0) return [...categoryFiltered];

    const rankedIds = searchCardIds(keyword);
    const rank = new Map(rankedIds.map((id, position) => [id, position]));

    return categoryFiltered
      .filter((summary) => rank.has(summary.id))
      .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
  }

  async getCategoryCounts(): Promise<Record<CategoryId, number>> {
    // 先给每个分类初始化为 0，保证「某分类暂无卡片」时也能正确展示
    const counts = Object.fromEntries(
      CATEGORIES.map((category) => [category.id, 0]),
    ) as Record<CategoryId, number>;

    for (const card of ALL_CARDS) {
      counts[card.category] += 1;
    }
    return counts;
  }

  async getFeatured(limit: number): Promise<DrugCard[]> {
    const featured: DrugCard[] = [];
    for (const category of CATEGORIES) {
      const first = ALL_CARDS.find((card) => card.category === category.id);
      if (first) featured.push(first);
      if (featured.length >= limit) break;
    }
    return featured.slice(0, limit);
  }
}

export const cardRepository: CardRepository = new LocalSeedCardRepository();
