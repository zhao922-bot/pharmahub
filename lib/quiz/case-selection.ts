import type { CaseQuestionSpec, CategoryId } from "@/lib/types";

/** 分类角标保留学习范围，范围角标保留分类；两者交集进入本轮抽题。 */
export function getCaseSelection(
  cases: readonly CaseQuestionSpec[],
  category: CategoryId | null,
  scope: "all" | "favorites" | "due",
  favorites: ReadonlySet<string>,
  due: ReadonlySet<string>,
) {
  const categoryCases = category ? cases.filter((item) => item.category === category) : cases;
  const scopeCounts = {
    all: categoryCases.length,
    favorites: categoryCases.filter((item) => favorites.has(item.cardId)).length,
    due: categoryCases.filter((item) => due.has(item.cardId)).length,
  };
  const cardIds = { all: null, favorites, due }[scope];
  const scopeCases = cardIds ? cases.filter((item) => cardIds.has(item.cardId)) : cases;
  const categoryCounts = new Map<CategoryId, number>();
  for (const item of scopeCases) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
  }
  return {
    questions: category ? scopeCases.filter((item) => item.category === category) : scopeCases,
    allCategoriesCount: scopeCases.length,
    categoryCounts,
    scopeCounts,
  };
}
