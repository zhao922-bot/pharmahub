import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MechanismDiagram } from "@/components/diagram/mechanism-diagram";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ReviewSession,
  type ReviewMode,
  type ReviewQueueCard,
} from "@/components/review/review-session";
import { reviewSessionCopy } from "@/lib/copy-features";
import {
  CATEGORIES,
  cardRepository,
  getCategoryName,
  isCategoryId,
} from "@/lib/data";
import { studyRepository } from "@/lib/data/study";
import type { CategoryId, DrugCard } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: reviewSessionCopy.pageTitle,
  description: reviewSessionCopy.pageBody,
};

export const dynamic = "force-dynamic";

interface ReviewPageProps {
  searchParams: Promise<{ mode?: string; category?: string }>;
}

const VALID_MODES: readonly ReviewMode[] = ["due", "favorites", "unlearned"];

function parseMode(raw?: string): ReviewMode {
  return VALID_MODES.includes(raw as ReviewMode)
    ? (raw as ReviewMode)
    : "due";
}

function buildReviewHref(mode: ReviewMode, category: CategoryId | null): string {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (category) params.set("category", category);
  return `/review?${params.toString()}`;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const mode = parseMode(params.mode);
  const activeCategory: CategoryId | null =
    params.category && isCategoryId(params.category) ? params.category : null;

  const today = new Date();
  const [allCards, dueIds, favoriteIds, allLogs] = await Promise.all([
    cardRepository.getAll(),
    studyRepository.getDueCardIds(today),
    studyRepository.getFavoriteCardIds(),
    studyRepository.getAllReviewLogs(),
  ]);

  const scopedCards = activeCategory
    ? allCards.filter((card) => card.category === activeCategory)
    : allCards;
  const cardById = new Map(scopedCards.map((card) => [card.id, card]));
  const logById = new Map(allLogs.map((log) => [log.cardId, log]));

  const dueCards = dueIds
    .map((id) => cardById.get(id))
    .filter((card): card is DrugCard => Boolean(card));
  const favoriteCards = favoriteIds
    .map((id) => cardById.get(id))
    .filter((card): card is DrugCard => Boolean(card));
  const unlearnedCards = scopedCards.filter((card) => !logById.has(card.id));

  const queueCards: DrugCard[] =
    mode === "due"
      ? dueCards
      : mode === "favorites"
        ? favoriteCards
        : unlearnedCards;

  const modeCounts: Record<ReviewMode, number> = {
    due: dueCards.length,
    favorites: favoriteCards.length,
    unlearned: unlearnedCards.length,
  };

  const sessionCards: ReviewQueueCard[] = queueCards.map((card) => ({
    id: card.id,
    genericName: card.genericName,
    englishName: card.englishName,
    brandNames: [...card.brandNames],
    category: card.category,
    categoryName: getCategoryName(card.category),
    target: card.target,
    mechanismSteps: card.mechanismSteps.map((step) => ({
      title: step.title,
      detail: step.detail,
    })),
    memoryTip: card.memoryTip,
    repetitions: logById.get(card.id)?.repetitions ?? 0,
  }));

  // 服务端预渲染机制图 SVG，避免将图解布局引擎打包进客户端
  const diagrams: Record<string, React.ReactNode> = {};
  for (const card of queueCards) {
    diagrams[card.id] = <MechanismDiagram spec={card.diagram} />;
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-6">
        <div className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {reviewSessionCopy.backHome}
            </Link>
            <Link
              href="/cards"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {reviewSessionCopy.backCards}
            </Link>
          </div>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {reviewSessionCopy.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {reviewSessionCopy.pageBody}
          </p>
        </div>

        {/* 队列模式切换 */}
        <div
          role="group"
          aria-label={reviewSessionCopy.modeGroupLabel}
          className="mt-4 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-2">
            {VALID_MODES.map((itemMode) => {
              const active = mode === itemMode;
              return (
                <Link
                  key={itemMode}
                  href={buildReviewHref(itemMode, activeCategory)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <span>{reviewSessionCopy.modes[itemMode]}</span>
                  <span
                    className={cn(
                      "text-[11px] tabular-nums",
                      active
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground",
                    )}
                  >
                    {modeCounts[itemMode]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 分类筛选 */}
        <div
          role="group"
          aria-label={reviewSessionCopy.categoryGroupLabel}
          className="mt-2 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-1.5">
            <Link
              href={buildReviewHref(mode, null)}
              aria-current={activeCategory === null ? "true" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
                activeCategory === null
                  ? "border-primary/40 bg-accent font-medium text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {reviewSessionCopy.allCategories}
            </Link>
            {CATEGORIES.map((category) => {
              const active = activeCategory === category.id;
              return (
                <Link
                  key={category.id}
                  href={buildReviewHref(mode, category.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
                    active
                      ? "border-primary/40 bg-accent font-medium text-accent-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        <ReviewSession
          key={`${mode}-${activeCategory ?? "all"}`}
          cards={sessionCards}
          diagrams={diagrams}
          mode={mode}
          categoryId={activeCategory}
        />
      </main>
      <SiteFooter />
    </>
  );
}
