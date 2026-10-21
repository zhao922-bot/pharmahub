"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, RotateCcw, Trash2 } from "lucide-react";

import { clearWrongBookAction, removeWrongQuestionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quiz as quizCopy, wrongBook } from "@/lib/copy";
import type { QuestionKind } from "@/lib/quiz/generator";
import { cn } from "@/lib/utils";

interface WrongBookItem {
  questionId: string;
  cardId: string;
  genericName: string;
  englishName: string;
  kind: QuestionKind;
  wrongCount: number;
  mastered: boolean;
  comparison?: { id: string; title: string; dimension: string };
}

/**
 * 错题本列表。
 *
 * 设计考虑：
 * - 「已答对过」用绿色勾标出，但**不自动移除**。错题的价值在于反复巩固，
 *   答对一次就消失反而会让人失去复盘的线索。
 * - 移除是单题的、显式的，清空则需要二次确认。
 */
export function WrongBookList({ items }: { items: WrongBookItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const visible = items.filter((item) => !removed.has(item.questionId));

  function handleRemove(questionId: string) {
    if (isPending) return;
    setError(null);
    setRemoved((prev) => new Set(prev).add(questionId));
    startTransition(async () => {
      try {
        const result = await removeWrongQuestionAction(questionId);
        if (!result.ok) throw new Error("remove failed");
      } catch {
        setRemoved((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
        setError(wrongBook.removeFailed);
      }
    });
  }

  function handleClear() {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await clearWrongBookAction();
        if (!result.ok) throw new Error("clear failed");
        setRemoved(new Set(items.map((item) => item.questionId)));
        setConfirmingClear(false);
      } catch {
        setError(wrongBook.removeFailed);
      }
    });
  }

  return (
    <div className="space-y-3">
      {/* 重练入口：错题本的核心动作，放在最显眼的位置 */}
      <Card className="border-primary/15">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{quizCopy.reviewPageTitle}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {quizCopy.reviewCount(visible.length)}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/quiz/review">
              {quizCopy.reviewRetry}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {wrongBook.wrongCountLabel(visible.length)}
        </p>
        {confirmingClear ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setConfirmingClear(false)}
              disabled={isPending}
            >
              {wrongBook.clearCancel}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleClear}
              disabled={isPending}
            >
              {wrongBook.clearConfirmYes}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={() => setConfirmingClear(true)}
            disabled={isPending || visible.length === 0}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {wrongBook.clearAll}
          </Button>
        )}
      </div>

      {confirmingClear ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          {wrongBook.clearConfirm}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
          {error}
        </p>
      ) : null}

      <ul className="space-y-2">
        {visible.map((item) => (
          <li key={item.questionId}>
            <Card>
              <CardContent className="flex items-start justify-between gap-3 p-3.5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      href={`/cards/${item.cardId}`}
                      className="text-[15px] font-medium hover:text-primary hover:underline"
                    >
                      {item.genericName}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {item.englishName}
                    </span>
                  </div>

                  {item.comparison ? (
                    <Link
                      href={`/compare/${item.comparison.id}`}
                      className="mt-1.5 block text-xs leading-5 text-primary hover:underline"
                    >
                      {item.comparison.title} · {item.comparison.dimension}
                    </Link>
                  ) : null}

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      {wrongBook.kindLabel[item.kind]}
                    </span>
                    <span className="tabular-nums text-red-700 dark:text-red-300">
                      {wrongBook.wrongCountLabel(item.wrongCount)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5",
                        item.mastered ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
                      )}
                    >
                      {item.mastered ? (
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Circle className="h-3 w-3" aria-hidden="true" />
                      )}
                      {item.mastered ? wrongBook.masteredLabel : wrongBook.notMasteredLabel}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Link
                    href={`/cards/${item.cardId}`}
                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                  >
                    {wrongBook.viewCard}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.questionId)}
                    disabled={isPending}
                    className="rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    {wrongBook.remove}
                  </button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
