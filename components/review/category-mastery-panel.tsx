import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { homeFeaturesCopy } from "@/lib/copy-features";
import type { CardAttemptStat } from "@/lib/data/quiz";
import type { Category, CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryMasteryPanelProps {
  categories: readonly Category[];
  cards: ReadonlyArray<{ id: string; category: CategoryId }>;
  learnedCardIds: ReadonlyArray<string>;
  dueCardIds: ReadonlyArray<string>;
  attemptStats: ReadonlyArray<CardAttemptStat>;
}

interface CategoryMasteryRow {
  category: Category;
  totalCards: number;
  learnedCount: number;
  dueCount: number;
  quizAnswered: number;
  quizCorrect: number;
  accuracy: number | null;
  weakScore: number;
}

export function CategoryMasteryPanel({
  categories,
  cards,
  learnedCardIds,
  dueCardIds,
  attemptStats,
}: CategoryMasteryPanelProps) {
  const learnedSet = new Set(learnedCardIds);
  const dueSet = new Set(dueCardIds);
  const attemptByCard = new Map(
    attemptStats.map((stat) => [stat.cardId, stat]),
  );

  const rows: CategoryMasteryRow[] = categories.map((category) => {
    const categoryCards = cards.filter((c) => c.category === category.id);
    const totalCards = categoryCards.length;

    let learnedCount = 0;
    let dueCount = 0;
    let quizAnswered = 0;
    let quizCorrect = 0;

    for (const card of categoryCards) {
      if (learnedSet.has(card.id)) learnedCount += 1;
      if (dueSet.has(card.id)) dueCount += 1;
      const attempt = attemptByCard.get(card.id);
      if (attempt) {
        quizAnswered += attempt.answered;
        quizCorrect += attempt.correct;
      }
    }

    const accuracy =
      quizAnswered > 0 ? Math.round((quizCorrect / quizAnswered) * 100) : null;
    const learnedRatio = totalCards > 0 ? learnedCount / totalCards : 1;

    // 综合待复习、测验错率与未学比例排序，定位最需优先巩固的系统
    const weakScore =
      (dueCount > 0 ? 35 + dueCount * 6 : 0) +
      (accuracy !== null ? Math.max(0, 100 - accuracy) * 0.6 : 10) +
      (1 - learnedRatio) * 30;

    return {
      category,
      totalCards,
      learnedCount,
      dueCount,
      quizAnswered,
      quizCorrect,
      accuracy,
      weakScore,
    };
  });

  const weakestIds = new Set(
    rows
      .filter(
        (row) =>
          row.dueCount > 0 ||
          (row.accuracy !== null && row.accuracy < 80) ||
          row.learnedCount < row.totalCards,
      )
      .sort((a, b) => b.weakScore - a.weakScore)
      .slice(0, 3)
      .map((row) => row.category.id),
  );

  const weakestRows = rows.filter((row) => weakestIds.has(row.category.id));

  return (
    <section className="mt-10" aria-labelledby="mastery-heading">
      <div>
        <h2 id="mastery-heading" className="text-lg font-semibold tracking-tight">
          {homeFeaturesCopy.masteryTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {homeFeaturesCopy.masteryBody}
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/25 px-3.5 py-2.5 text-xs">
        {weakestRows.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <AlertCircle
                className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              {homeFeaturesCopy.weakestSummaryPrefix}
            </span>
            {weakestRows.map((row) => (
              <Link
                key={row.category.id}
                href={`/cards?category=${row.category.id}`}
                className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
              >
                {row.category.name}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{homeFeaturesCopy.allBalancedHint}</p>
        )}
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {rows.map((row) => {
          const isWeak = weakestIds.has(row.category.id);
          const coveragePct =
            row.totalCards > 0
              ? Math.min(100, Math.round((row.learnedCount / row.totalCards) * 100))
              : 0;

          return (
            <Card
              key={row.category.id}
              className={cn(
                "min-w-0",
                isWeak && "border-amber-300/60 dark:border-amber-800/70",
              )}
            >
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {row.category.name}
                  </span>
                  {isWeak ? (
                    <Badge variant="warning" className="shrink-0 px-2 py-0 text-[10px]">
                      {homeFeaturesCopy.weakestBadge}
                    </Badge>
                  ) : null}
                </div>

                {/* 学习覆盖进度条 */}
                <div
                  className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={row.learnedCount}
                  aria-valuemin={0}
                  aria-valuemax={row.totalCards}
                  aria-label={row.category.name}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${coveragePct}%` }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tabular-nums text-muted-foreground">
                  <span>
                    {homeFeaturesCopy.learnedMetric(row.learnedCount, row.totalCards)}
                  </span>
                  <span
                    className={cn(
                      row.dueCount > 0 &&
                        "font-medium text-amber-700 dark:text-amber-300",
                    )}
                  >
                    {homeFeaturesCopy.dueMetric(row.dueCount)}
                  </span>
                  <span
                    className={cn(
                      row.accuracy !== null &&
                        row.accuracy < 75 &&
                        "font-medium text-red-700 dark:text-red-300",
                    )}
                  >
                    {homeFeaturesCopy.accuracyMetric(row.accuracy)}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-medium">
                  <Link
                    href={`/cards?category=${row.category.id}`}
                    className="text-primary hover:underline"
                  >
                    {homeFeaturesCopy.goCards}
                  </Link>
                  <Link
                    href={`/quiz?category=${row.category.id}`}
                    className="text-primary hover:underline"
                  >
                    {homeFeaturesCopy.goQuiz}
                  </Link>
                  {row.dueCount > 0 ? (
                    <Link
                      href={`/review?mode=due&category=${row.category.id}`}
                      className="text-amber-700 hover:underline dark:text-amber-300"
                    >
                      {homeFeaturesCopy.goReview}
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
