"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  Lightbulb,
  RotateCcw,
  Target,
  X,
} from "lucide-react";

import { recordReviewAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { reviewSessionCopy } from "@/lib/copy-features";
import type { CategoryId, MechanismStep, ReviewQuality } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ReviewMode = "due" | "favorites" | "unlearned";

export interface ReviewQueueCard {
  id: string;
  genericName: string;
  englishName: string;
  brandNames: string[];
  category: CategoryId;
  categoryName: string;
  target: string;
  mechanismSteps: MechanismStep[];
  memoryTip: string;
  repetitions: number;
}

interface ReviewSessionProps {
  cards: ReviewQueueCard[];
  diagrams: Record<string, React.ReactNode>;
  mode: ReviewMode;
  categoryId: CategoryId | null;
}

interface SessionResultItem {
  cardId: string;
  genericName: string;
  quality: ReviewQuality;
  intervalDays: number;
  nextReviewAt: string;
}

const QUALITY_STYLES: Record<
  ReviewQuality,
  { icon: typeof Check; className: string }
> = {
  0: {
    icon: X,
    className:
      "border-red-200 bg-red-50/70 text-red-900 hover:bg-red-100/80 hover:border-red-300 dark:border-red-800 dark:bg-red-950/70 dark:text-red-100 dark:hover:bg-red-900/80",
  },
  1: {
    icon: RotateCcw,
    className:
      "border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 hover:border-amber-300 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-100 dark:hover:bg-amber-900/80",
  },
  2: {
    icon: Check,
    className:
      "border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/80 hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-100 dark:hover:bg-emerald-900/80",
  },
};

function buildModeHref(mode: ReviewMode, categoryId: CategoryId | null): string {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (categoryId) params.set("category", categoryId);
  return `/review?${params.toString()}`;
}

export function ReviewSession({
  cards,
  diagrams,
  mode,
  categoryId,
}: ReviewSessionProps) {
  const router = useRouter();
  // 在当前复习会话内冻结队列快照，防止服务端动作 revalidatePath 后列表缩水导致跳过下一张卡片
  const [queueCards, setQueueCards] = useState(cards);
  const [queueDiagrams, setQueueDiagrams] = useState(diagrams);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showTargetHint, setShowTargetHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedQuality, setLastFailedQuality] =
    useState<ReviewQuality | null>(null);
  const [results, setResults] = useState<SessionResultItem[]>([]);
  const submittingRef = useRef(false);

  const total = queueCards.length;
  const isCompleted = total > 0 && currentIndex >= total;
  const currentCard = !isCompleted ? queueCards[currentIndex] : undefined;

  const submitRating = useCallback(
    async (quality: ReviewQuality) => {
      if (submittingRef.current || !currentCard) return;
      submittingRef.current = true;
      setIsSubmitting(true);
      setError(null);
      setLastFailedQuality(null);

      try {
        const response = await recordReviewAction(currentCard.id, quality);
        if (!response.ok) {
          setError(response.message ?? reviewSessionCopy.saveFailed);
          setLastFailedQuality(quality);
          return;
        }

        setResults((prev) => [
          ...prev,
          {
            cardId: currentCard.id,
            genericName: currentCard.genericName,
            quality,
            intervalDays: response.intervalDays ?? 1,
            nextReviewAt: response.nextReviewAt ?? "",
          },
        ]);
        setFlipped(false);
        setShowTargetHint(false);
        setCurrentIndex((prev) => prev + 1);
      } catch {
        setError(reviewSessionCopy.saveFailed);
        setLastFailedQuality(quality);
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [currentCard],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!currentCard || isCompleted || submittingRef.current) return;

      if (!flipped && (event.code === "Space" || event.key === " ")) {
        event.preventDefault();
        setFlipped(true);
        return;
      }

      if (flipped) {
        if (event.key === "1") {
          event.preventDefault();
          void submitRating(0);
        } else if (event.key === "2") {
          event.preventDefault();
          void submitRating(1);
        } else if (event.key === "3") {
          event.preventDefault();
          void submitRating(2);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCard, flipped, isCompleted, submitRating]);

  if (total === 0) {
    const emptyCopy = reviewSessionCopy.empty[mode];
    return (
      <Card className="mt-5">
        <CardContent className="px-4 py-10 text-center">
          <CheckCircle2
            className="mx-auto h-9 w-9 text-primary/60"
            aria-hidden="true"
          />
          <h2 className="mt-3 text-base font-semibold">{emptyCopy.title}</h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-muted-foreground">
            {emptyCopy.body}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            {mode !== "unlearned" ? (
              <Button asChild size="sm">
                <Link href={buildModeHref("unlearned", categoryId)}>
                  {reviewSessionCopy.switchUnlearned}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
            {mode !== "favorites" ? (
              <Button asChild size="sm" variant="outline">
                <Link href={buildModeHref("favorites", categoryId)}>
                  {reviewSessionCopy.switchFavorites}
                </Link>
              </Button>
            ) : null}
            <Button asChild size="sm" variant="ghost">
              <Link href="/cards">{reviewSessionCopy.goCards}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    const rememberedCount = results.filter((r) => r.quality === 2).length;
    const fuzzyCount = results.filter((r) => r.quality === 1).length;
    const forgotCount = results.filter((r) => r.quality === 0).length;

    return (
      <Card className="mt-5 border-primary/20">
        <CardContent className="p-5">
          <div className="text-center">
            <CheckCircle2
              className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-xl font-semibold">
              {reviewSessionCopy.completedTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {reviewSessionCopy.completedSubtitle(results.length)}
            </p>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-3 text-center">
            <div>
              <dt className="text-[11px] text-muted-foreground">
                {reviewSessionCopy.completedRemembered}
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                {rememberedCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">
                {reviewSessionCopy.completedFuzzy}
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-amber-700 dark:text-amber-300">
                {fuzzyCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">
                {reviewSessionCopy.completedForgot}
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-red-700 dark:text-red-300">
                {forgotCount}
              </dd>
            </div>
          </dl>

          <ul className="mt-4 divide-y rounded-lg border bg-card">
            {results.map((item) => (
              <li
                key={item.cardId}
                className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
              >
                <Link
                  href={`/cards/${item.cardId}`}
                  className="truncate font-medium hover:text-primary hover:underline"
                >
                  {item.genericName}
                </Link>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {reviewSessionCopy.intervalLabel(item.intervalDays)} ·{" "}
                  {reviewSessionCopy.nextReviewLabel(item.nextReviewAt)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setQueueCards(cards);
                setQueueDiagrams(diagrams);
                setCurrentIndex(0);
                setFlipped(false);
                setShowTargetHint(false);
                setResults([]);
                setError(null);
                setLastFailedQuality(null);
                router.refresh();
              }}
            >
              {mode === "due"
                ? reviewSessionCopy.continueDue
                : reviewSessionCopy.restartQueue}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
            {mode !== "favorites" ? (
              <Button asChild size="sm" variant="outline">
                <Link href={buildModeHref("favorites", categoryId)}>
                  {reviewSessionCopy.switchFavorites}
                </Link>
              </Button>
            ) : null}
            {mode !== "unlearned" ? (
              <Button asChild size="sm" variant="outline">
                <Link href={buildModeHref("unlearned", categoryId)}>
                  {reviewSessionCopy.switchUnlearned}
                </Link>
              </Button>
            ) : null}
            <Button asChild size="sm" variant="ghost">
              <Link href="/">{reviewSessionCopy.goHome}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCard) return null;

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="mt-5 space-y-4">
      {/* 进度条 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums font-medium text-foreground">
            {reviewSessionCopy.progress(currentIndex + 1, total)}
          </span>
          <span>
            {currentCard.repetitions > 0
              ? reviewSessionCopy.cardStatusReviewed(currentCard.repetitions)
              : reviewSessionCopy.cardStatusNew}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 记忆卡片 */}
      <Card className="overflow-hidden border-primary/15">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary">{currentCard.categoryName}</Badge>
            <Link
              href={`/cards/${currentCard.id}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {reviewSessionCopy.viewDetail}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <h2 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
            {currentCard.genericName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentCard.englishName}
            {currentCard.brandNames.length > 0
              ? ` · ${currentCard.brandNames.join("、")}`
              : ""}
          </p>

          {!flipped ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-dashed border-border bg-muted/25 p-4">
                <p className="text-sm leading-6 text-foreground/80">
                  {reviewSessionCopy.frontHint}
                </p>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTargetHint((prev) => !prev)}
                  className="gap-1.5 text-xs"
                >
                  {showTargetHint ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      {reviewSessionCopy.targetHintHide}
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {reviewSessionCopy.targetHintShow}
                    </>
                  )}
                </Button>

                {showTargetHint ? (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.04] p-3.5">
                    <p className="text-[11px] font-medium text-primary">
                      {reviewSessionCopy.targetHintTitle}
                    </p>
                    <p className="mt-1 text-sm leading-6">{currentCard.target}</p>
                  </div>
                ) : null}
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => setFlipped(true)}
              >
                {reviewSessionCopy.flipButton}
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              {/* 作用靶点 */}
              <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-3.5">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-primary">
                    {reviewSessionCopy.targetTitle}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-6">
                  {currentCard.target}
                </p>
              </div>

              {/* 作用机制步骤 */}
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  {reviewSessionCopy.mechanismTitle}
                </h3>
                <ol className="mt-3 space-y-0">
                  {currentCard.mechanismSteps.map((step, index) => {
                    const isLast = index === currentCard.mechanismSteps.length - 1;
                    return (
                      <li
                        key={step.title}
                        className="relative flex gap-3 pb-4 last:pb-0"
                      >
                        {!isLast ? (
                          <span
                            aria-hidden="true"
                            className="absolute left-[11px] top-6 h-[calc(100%-1rem)] w-px bg-border"
                          />
                        ) : null}
                        <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-semibold tabular-nums text-primary">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-sm font-semibold leading-5">
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-foreground/80 sm:text-sm sm:leading-6">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* 机制示意图（服务端预渲染） */}
              {queueDiagrams[currentCard.id] ? (
                <div className="min-w-0">
                  <h3 className="mb-2 text-sm font-semibold tracking-tight">
                    {reviewSessionCopy.diagramTitle}
                  </h3>
                  {queueDiagrams[currentCard.id]}
                </div>
              ) : null}

              {/* 记忆要点 */}
              <div className="rounded-lg border border-primary/15 bg-gradient-to-br from-accent/70 to-background p-3.5">
                <div className="flex items-center gap-1.5">
                  <Lightbulb
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold">
                    {reviewSessionCopy.memoryTipTitle}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium leading-6">
                  {currentCard.memoryTip}
                </p>
              </div>

              {/* 自评操作区 */}
              <div className="border-t border-border/70 pt-4">
                <p className="text-xs text-muted-foreground">
                  {reviewSessionCopy.ratePrompt}
                </p>
                <div
                  className="mt-3 grid grid-cols-3 gap-2"
                  role="group"
                  aria-label={reviewSessionCopy.ratePrompt}
                >
                  {reviewSessionCopy.qualityOptions.map((option) => {
                    const style = QUALITY_STYLES[option.value];
                    const Icon = style.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => void submitRating(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
                          style.className,
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        <span className="text-[10px] leading-tight opacity-75">
                          {option.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div aria-live="polite" className="mt-2.5">
                  {isSubmitting ? (
                    <p className="text-xs text-muted-foreground">
                      {reviewSessionCopy.saving}
                    </p>
                  ) : null}

                  {!isSubmitting && error ? (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                      <span>{error}</span>
                      {lastFailedQuality !== null ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => void submitRating(lastFailedQuality)}
                        >
                          {reviewSessionCopy.retry}
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <p className="mt-2 hidden text-center text-[11px] text-muted-foreground sm:block">
                  {reviewSessionCopy.shortcutHint}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
