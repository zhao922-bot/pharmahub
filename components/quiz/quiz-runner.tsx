"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, X, XCircle } from "lucide-react";

import { submitQuizAnswerAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quiz as quizCopy } from "@/lib/copy";
import type { QuizQuestion } from "@/lib/quiz/generator";
import { cn } from "@/lib/utils";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  /** 错题重练模式下，完成后不显示「再来一组」 */
  mode?: "normal" | "review";
  retryHref?: string;
  compareId?: string;
}

/**
 * 测验答题器。
 *
 * 交互设计上的几个取舍：
 * 1. **答完立即判定**，而不是全部做完再统一批改——即时反馈的记忆效果更好，
 *    而且用户能马上看到解析，趁热理解为什么错。
 * 2. **判定后锁定选项**，避免用户点着玩反复改答案。
 * 3. 每题提交后立刻写库，这样中途关掉页面也不会丢进度。
 */
export function QuizRunner({ questions, mode = "normal", retryHref = "/quiz", compareId }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{ questionId: string; isCorrect: boolean }>>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answered = selectedId !== null;

  const correctCount = useMemo(
    () => answers.filter((answer) => answer.isCorrect).length,
    [answers],
  );

  const handleSelect = useCallback(
    async (optionId: string) => {
      if (!currentQuestion || answered || isSubmitting) return;

      setSelectedId(optionId);
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await submitQuizAnswerAction({
          questionId: currentQuestion.id,
          cardId: currentQuestion.cardId,
          kind: currentQuestion.kind,
          selectedId: optionId,
          correctId: currentQuestion.correctOptionId,
        });
        if (!result.ok) {
          setSubmitError(result.message ?? quizCopy.submitFailed);
          setSelectedId(null);
          return;
        }
        setAnswers((prev) => [
          ...prev,
          { questionId: currentQuestion.id, isCorrect: result.isCorrect },
        ]);
      } catch {
        setSubmitError(quizCopy.submitFailed);
        setSelectedId(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentQuestion, answered, isSubmitting],
  );

  function handleNext() {
    if (isSubmitting || !answered) return;
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedId(null);
    setSubmitError(null);
  }

  function restartReview() {
    setCurrentIndex(0);
    setSelectedId(null);
    setSubmitError(null);
    setAnswers([]);
    setFinished(false);
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium">
            {mode === "review" ? quizCopy.reviewNoQuestions : quizCopy.emptyTitle}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "review" ? quizCopy.reviewNoQuestionsBody : quizCopy.emptyBody}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 结果页
  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    const wrongCount = questions.length - correctCount;

    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {mode === "review" ? quizCopy.reviewAllDone : quizCopy.resultTitle}
          </p>
          <p className="mt-2 text-4xl font-semibold tabular-nums">
            {quizCopy.resultScore(correctCount, questions.length)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {quizCopy.resultAccuracy(percent)}
          </p>

          {/* 错题重练给更具体的反馈：这次攻克了几道、还剩几道 */}
          {mode === "review" ? (
            <div className="mt-3 space-y-0.5">
              {correctCount > 0 ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{quizCopy.reviewCleared(correctCount)}</p>
              ) : null}
              {wrongCount > 0 ? (
                <p className="text-xs text-amber-700 dark:text-amber-300">{quizCopy.reviewStillWrong(wrongCount)}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              {quizCopy.resultWrongHint(wrongCount)}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            {mode === "review" ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/wrong-book">
                    {quizCopy.reviewBackToWrongBook}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={restartReview}>
                  {quizCopy.reviewRetry}
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href={retryHref}>
                    {quizCopy.resultAgain}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                {compareId ? (
                  <Button asChild variant="outline">
                    <Link href={`/compare/${compareId}`}>{quizCopy.compareBack}</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/wrong-book">{quizCopy.resultToWrongBook}</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/cards">{quizCopy.resultToCards}</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      {/* 进度 */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="tabular-nums">
            {quizCopy.questionOf(currentIndex + 1, questions.length)}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
            {quizCopy.kindLabel[currentQuestion.kind]}
          </span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={quizCopy.progressLabel}
          aria-valuenow={currentIndex + (answered ? 1 : 0)}
          aria-valuemin={0}
          aria-valuemax={questions.length}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 题干 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-[15px] font-medium leading-7">{currentQuestion.prompt}</p>

          <ul className="mt-4 space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedId === option.id;
              const isCorrect = option.id === currentQuestion.correctOptionId;
              const showCorrect = answered && !isSubmitting && isCorrect;
              const showWrong = answered && !isSubmitting && isSelected && !isCorrect;

              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    disabled={answered || isSubmitting}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      !answered &&
                        "border-border bg-background hover:border-primary/40 hover:bg-accent/50",
                      showCorrect && "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100",
                      showWrong && "border-red-400 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950 dark:text-red-100",
                      answered && !showCorrect && !showWrong && "border-border bg-background opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                        showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                        showWrong && "border-red-500 bg-red-500 text-white",
                        !showCorrect && !showWrong && "border-border text-muted-foreground",
                      )}
                      aria-hidden="true"
                    >
                      {showCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : showWrong ? (
                        <X className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="min-w-0 flex-1">{option.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {submitError ? (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
              {submitError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* 判定与解析 */}
      {answered && !isSubmitting ? (
        <div
          aria-live="polite"
          className={cn(
            "rounded-lg border p-4",
            answers[answers.length - 1]?.isCorrect
              ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950"
              : "border-red-200 bg-red-50/70 dark:border-red-800 dark:bg-red-950",
          )}
        >
          <div className="flex items-center gap-1.5">
            {answers[answers.length - 1]?.isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  {quizCopy.correct}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-red-900 dark:text-red-200">
                  {quizCopy.incorrect}
                </span>
              </>
            )}
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {quizCopy.explanationTitle}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground/85">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.comparison ? (
              <Link
                href={`/compare/${currentQuestion.comparison.id}`}
                className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
              >
                {quizCopy.compareBack}
              </Link>
            ) : null}
          </div>

          <Button onClick={handleNext} className="mt-4 w-full">
            {currentIndex + 1 >= questions.length ? quizCopy.finish : quizCopy.nextQuestion}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {isSubmitting ? (
        <p className="text-center text-xs text-muted-foreground">{quizCopy.submitting}</p>
      ) : null}
    </div>
  );
}
