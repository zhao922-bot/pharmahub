import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { homeFeaturesCopy } from "@/lib/copy-features";
import { getCategoryMastery, type CategoryMasteryInput } from "@/lib/review/category-mastery";
import { cn } from "@/lib/utils";

export function CategoryMasteryPanel(props: CategoryMasteryInput) {
  const { rows, recommendations } = getCategoryMastery(props);
  const recommendedIds = new Set(recommendations.map((row) => row.category.id));

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
        {recommendations.length > 0 ? (
          <div>
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <AlertCircle
                className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              {homeFeaturesCopy.weakestSummaryPrefix}
            </span>
            <ol className="mt-2 space-y-2">
              {recommendations.map(({ category, action }) => (
                <li key={category.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">{action.reason}</span>
                  <Link
                    href={action.href}
                    aria-label={`${category.name}：${action.label}`}
                    className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                  >
                    {action.label}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-muted-foreground">{homeFeaturesCopy.allBalancedHint}</p>
        )}
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {rows.map((row) => {
          const isWeak = recommendedIds.has(row.category.id);
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
                        row.accuracy < 80 &&
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
