import type { CardAttemptStat } from "@/lib/data/quiz";
import type { Category, CategoryId } from "@/lib/types";

export interface CategoryMasteryInput {
  categories: readonly Category[];
  cards: ReadonlyArray<{ id: string; category: CategoryId }>;
  learnedCardIds: readonly string[];
  dueCardIds: readonly string[];
  attemptStats: readonly CardAttemptStat[];
}

interface CategoryMasteryRow {
  category: Category;
  totalCards: number;
  learnedCount: number;
  dueCount: number;
  accuracy: number | null;
  weakScore: number;
}

function recommendedAction(row: CategoryMasteryRow) {
  const id = row.category.id;
  const untested = row.accuracy === null ? "，尚未测验" : "";
  if (row.dueCount > 0) {
    return {
      reason: `有 ${row.dueCount} 张卡片到期${untested}`,
      label: `复习这 ${row.dueCount} 张`,
      href: `/review?mode=due&category=${id}`,
    };
  }
  if (row.accuracy !== null && row.accuracy < 80) {
    return {
      reason: `测验正确率 ${row.accuracy}%`,
      label: "练这个系统",
      href: `/quiz?category=${id}`,
    };
  }
  const unlearned = row.totalCards - row.learnedCount;
  if (unlearned > 0) {
    return {
      reason: `还有 ${unlearned} 张卡片未学${untested}`,
      label: "学习新卡",
      href: `/review?mode=unlearned&category=${id}`,
    };
  }
  if (row.totalCards > 0 && row.accuracy === null) {
    return { reason: "已学完卡片，尚未测验", label: "开始测验", href: `/quiz?category=${id}` };
  }
  return null;
}

export function getCategoryMastery({
  categories, cards, learnedCardIds, dueCardIds, attemptStats,
}: CategoryMasteryInput) {
  const learnedSet = new Set(learnedCardIds);
  const dueSet = new Set(dueCardIds);
  const attemptByCard = new Map(attemptStats.map((stat) => [stat.cardId, stat]));

  const rows: CategoryMasteryRow[] = categories.map((category) => {
    const categoryCards = cards.filter((card) => card.category === category.id);
    const totalCards = categoryCards.length;
    let learnedCount = 0;
    let dueCount = 0;
    let answered = 0;
    let correct = 0;
    for (const card of categoryCards) {
      if (learnedSet.has(card.id)) learnedCount += 1;
      if (dueSet.has(card.id)) dueCount += 1;
      const attempt = attemptByCard.get(card.id);
      if (attempt) {
        answered += attempt.answered;
        correct += attempt.correct;
      }
    }
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
    const learnedRatio = totalCards > 0 ? learnedCount / totalCards : 1;
    const weakScore =
      (dueCount > 0 ? 35 + dueCount * 6 : 0) +
      (accuracy !== null ? (100 - accuracy) * 0.6 : 10) +
      (1 - learnedRatio) * 30;
    return { category, totalCards, learnedCount, dueCount, accuracy, weakScore };
  });

  const recommendations = rows.flatMap((row) => {
    const action = recommendedAction(row);
    return action ? [{ ...row, action }] : [];
  }).sort((a, b) => b.weakScore - a.weakScore || a.category.order - b.category.order).slice(0, 3);

  return { rows, recommendations };
}
