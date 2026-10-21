"use client";

import { useState, useTransition } from "react";
import { Check, RotateCcw, X } from "lucide-react";

import { recordReviewAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { detail } from "@/lib/copy";
import type { ReviewQuality } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReviewPanelProps {
  cardId: string;
  /** 该卡片已有的复习记录，null 表示从未复习过 */
  existing: {
    repetitions: number;
    intervalDays: number;
    nextReviewAt: string;
  } | null;
  /** 今日是否到期 */
  isDue: boolean;
}

const QUALITY_OPTIONS: Array<{
  value: ReviewQuality;
  label: string;
  hint: string;
  icon: typeof Check;
  className: string;
}> = [
  {
    value: 0,
    label: detail.reviewQuality0,
    hint: detail.reviewQuality0Hint,
    icon: X,
    className:
      "border-red-200 bg-red-50/60 text-red-900 hover:bg-red-100/70 hover:border-red-300 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900 dark:hover:border-red-600",
  },
  {
    value: 1,
    label: detail.reviewQuality1,
    hint: detail.reviewQuality1Hint,
    icon: RotateCcw,
    className:
      "border-amber-200 bg-amber-50/60 text-amber-900 hover:bg-amber-100/70 hover:border-amber-300 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100 dark:hover:bg-amber-900 dark:hover:border-amber-600",
  },
  {
    value: 2,
    label: detail.reviewQuality2,
    hint: detail.reviewQuality2Hint,
    icon: Check,
    className:
      "border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100/70 hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900 dark:hover:border-emerald-600",
  },
];

/**
 * 掌握程度自评面板。
 *
 * 点击后立即调用服务端 action 写入 云端数据库，并用返回的下次复习时间
 * 就地给出反馈（不整页刷新），这样连续复习多张卡片时节奏不被打断。
 */
export function ReviewPanel({ cardId, existing, isDue }: ReviewPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    intervalDays: number;
    nextReviewAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleReview(quality: ReviewQuality) {
    if (isPending) return;
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await recordReviewAction(cardId, quality);
        if (!response.ok) {
          setError(response.message ?? detail.reviewFailed);
          return;
        }
        setResult({ intervalDays: response.intervalDays ?? 1, nextReviewAt: response.nextReviewAt ?? "" });
      } catch {
        setError(detail.reviewFailed);
      }
    });
  }

  return (
    <section className="mt-8" aria-labelledby="review-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="review-heading" className="text-lg font-semibold tracking-tight">
          {detail.reviewTitle}
        </h2>
        {existing ? (
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {detail.reviewCountLabel(existing.repetitions)}
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {existing
          ? isDue
            ? detail.reviewDueBody
            : detail.reviewNotDueBody(existing.nextReviewAt)
          : detail.reviewBody}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={detail.reviewTitle}>
        {QUALITY_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              onClick={() => handleReview(option.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border px-2 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
                option.className,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-[10px] leading-tight opacity-70">{option.hint}</span>
            </button>
          );
        })}
      </div>

      {/* 结果反馈 */}
      <div aria-live="polite" className="mt-3">
        {isPending ? (
          <p className="text-xs text-muted-foreground">{detail.reviewSaving}</p>
        ) : null}

        {!isPending && result ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 dark:border-emerald-800 dark:bg-emerald-950">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              {detail.reviewSaved(result.intervalDays)}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-800/80 dark:text-emerald-200">
              {detail.reviewNextDate(result.nextReviewAt)}
            </p>
          </div>
        ) : null}

        {!isPending && error ? (
          <p className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2.5 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
