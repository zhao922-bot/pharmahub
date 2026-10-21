/**
 * 数据层统一出口。
 *
 * 页面与组件只从 "@/lib/data" 引入，不直接 import 具体实现文件，
 * 这样未来从本地种子数据迁移到 PostgreSQL / D1 时，改动被限制在本目录内。
 */
export { cardRepository } from "@/lib/data/cards";
export type {
  CardQuery,
  CardRepository,
  DrugCardSummary,
} from "@/lib/data/cards";

export { studyRepository } from "@/lib/data/study";
export type { StudyProgress, StudyProgressRepository } from "@/lib/data/study";

export {
  CATEGORIES,
  getCategory,
  getCategoryName,
  isCategoryId,
} from "@/lib/data/categories";
